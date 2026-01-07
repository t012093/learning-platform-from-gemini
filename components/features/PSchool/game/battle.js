import Phaser from 'phaser';
import { Player } from "./player";
import { Enemy } from "./enemy";
import { UI } from "./ui";
import { SpellBook } from "./SpellBook";
import { filterBlocksByLevel, getAvailableBlocksByLevel, getNewlyUnlockedBlocks } from "./levelBlockRestrictions";

export class BattleScene extends Phaser.Scene {
  constructor(config) {
    // 継承クラスからconfigが渡された場合はそれを使用し、なければデフォルトのkeyを設定
    const sceneConfig = config || { key: 'BattleScene' };
    super(sceneConfig);
    
    // 設定の初期値
    this.settings = {
      background: 'forest',
      enemy: 'goblin',
      scratchMode: true, // デフォルトでtrueに変更
      stageNumber: 1,
      isDevelopmentMode: false // レベル制限を無効にする開発モードフラグ
    };
    
    // ゲーム変数の初期化
    this.player = null;
    this.enemy = null;
    this.ui = null;
    
    // 経験値トラッキング用変数
    this.battleStats = {
      executionCount: 0,
      blockCount: 0,
      battleStartTime: null,
      battleEndTime: null
    };
    
    // 魔法の書の初期化
    this.spellBook = new SpellBook();
    
    // グローバルアクセス用
    window.spellBook = this.spellBook;
    
    // デバッグ用関数をグローバルに追加
    window.debugSpellBook = () => {
      if (window.spellBook) {
        return window.spellBook.debugStageInfo();
      } else {
        console.warn('SpellBook not initialized');
        return null;
      }
    };

    // 魔法の書を開くボタンを作成するフラグ
    this.spellBookButton = null;

    // 敵の麻痺状態管理（グローバル）
    this.isEnemyParalyzed = false;
    this.paralyzeRemainingTurns = 0;
    this.paralyzeStatusText = null;
  }

  init(data) {
    // データがあれば設定を更新
    this.settings = { ...this.settings, ...data };
    // 確実にscratchModeを有効にする
    this.settings.scratchMode = true;
    
    // 現在のステージをクラス変数とグローバル変数に設定
    this.stage = this.settings.stageNumber || 1;
    window.currentStage = this.stage;
    
    console.log('Battle initialized with settings:', this.settings);
    console.log('Current stage set to:', this.stage);
  }

  preload() {
    // アセット読み込みエラーのハンドリング
    this.load.on('loaderror', (file) => {
      console.warn(`Failed to load asset: ${file.src}`);
    });

    // バトル用アセットをロード（エラー時のフォールバック付き）
    this.load.image('battleBg', '/p_school/assets/bg1.png');
    this.load.image('player', '/p_school/assets/player.png');
    this.load.image('enemy', '/p_school/assets/srime.png');
    
    // UI要素（オプショナル）
    try {
      this.load.image('buttonBg', '/p_school/assets/button.png');
    } catch (e) {
      console.warn('button.png not found, using fallback');
    }
    
    try {
      this.load.image('hpBarFrame', '/p_school/assets/hp-bar-frame.png');
    } catch (e) {
      console.warn('hp-bar-frame.png not found, using fallback');
    }
    
    try {
      this.load.image('panelBg', '/p_school/assets/panel-bg.png');
    } catch (e) {
      console.warn('panel-bg.png not found, using fallback');
    }
    
    // エフェクト用アセット（オプショナル）
    try {
      this.load.image('particle', '/p_school/assets/particle.png');
    } catch (e) {
      console.warn('particle.png not found, using fallback');
    }
    
    // 魔法の書の画像をロード（オプショナル）
    try {
      this.load.image('spellbook', '/p_school/assets/spellbook.png');
    } catch (e) {
      console.warn('spellbook.png not found, using fallback');
    }
    
    // モダンなWebフォントの読み込み (Google Fontsなど外部フォントがある場合)
    // 注意: Google Fontsを使う場合はindex.htmlにフォントのリンクを追加する必要があります
    // このコードは、フォントがすでにロードされている前提です
  }

  create() {
    // バトル統計の初期化
    this.battleStats = {
      executionCount: 0,
      blockCount: 0,
      battleStartTime: Date.now(),
      battleEndTime: null
    };
    
    // カスタム変数・リストの初期化
    this.customVariables = {};
    this.customLists = {};
    
    // システム変数の初期化
    this.customVariables['敵の技名'] = '';
    
    // ゲーム画面のレイアウトを設定
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.style.display = 'flex';
      gameContainer.style.flexDirection = 'row';
    }

    // ブロックエディタを表示（scratchModeが有効な場合のみ）
    if (this.settings.scratchMode) {
      console.log("scratchMode is enabled, setting up block editor");
      const blocklyDiv = document.getElementById('blocklyDiv');
      if (blocklyDiv) {
        console.log("Found blocklyDiv, applying styles");
        blocklyDiv.style.width = Math.min(this.scale.width * 0.6875, 550) + 'px'; // レスポンシブだが最大550px
        blocklyDiv.style.height = Math.min(this.scale.height, 600) + 'px'; // レスポンシブだが最大600px
        blocklyDiv.style.position = 'relative';
        blocklyDiv.style.display = 'block';
        blocklyDiv.style.visibility = 'visible';
        console.log("blocklyDiv after styling:", blocklyDiv.style.cssText);
      } else {
        console.error("blocklyDiv not found in create method!");
      }
      this.showBlockEditor();
    } else {
      console.log("scratchMode is disabled");
    }
    
    // 背景の設定（アセットの読み込み確認付き）
    if (this.textures.exists('battleBg')) {
      this.add.image(this.scale.width / 2, this.scale.height / 2, 'battleBg').setDisplaySize(this.scale.width, this.scale.height);
    } else {
      // フォールバック: 単色の背景を作成
      const bg = this.add.graphics();
      bg.fillStyle(0x1a1a2e);
      bg.fillRect(0, 0, this.scale.width, this.scale.height);
      console.warn('battleBg asset not found, using fallback background');
    }

    // プレイヤーと敵のスプライト（フォールバック付き）
    if (this.textures.exists('player')) {
      this.playerSprite = this.add.sprite(this.scale.width * 0.25, this.scale.height * 0.67, 'player');
      // プレイヤースプライトのサイズを120x120ピクセルに設定
      this.playerSprite.setDisplaySize(120, 120);
    } else {
      // フォールバック: 円形のプレイヤー
      const playerGraphics = this.add.graphics();
      playerGraphics.fillStyle(0x00ff00);
      playerGraphics.fillCircle(this.scale.width * 0.25, this.scale.height * 0.67, 60);
      this.playerSprite = playerGraphics;
      console.warn('player asset not found, using fallback graphics');
    }
    
    if (this.textures.exists('enemy')) {
      this.enemySprite = this.add.sprite(this.scale.width * 0.75, this.scale.height * 0.33, 'enemy');
      // 敵スプライトのサイズを100x100ピクセルに設定
      this.enemySprite.setDisplaySize(100, 100);
    } else {
      // フォールバック: 円形の敵
      const enemyGraphics = this.add.graphics();
      enemyGraphics.fillStyle(0xff0000);
      enemyGraphics.fillCircle(this.scale.width * 0.75, this.scale.height * 0.33, 50);
      this.enemySprite = enemyGraphics;
      console.warn('enemy asset not found, using fallback graphics');
    }
    
    // キャラクターに影をつける（スプライトの場合のみ）
    if (this.playerSprite.setAlpha) {
      this.playerSprite.setAlpha(0.9);
    }
    if (this.enemySprite.setAlpha) {
      this.enemySprite.setAlpha(0.9);
    }

    // 魔法の書ボタンを作成（左上に配置）
    const spellBookContainer = this.add.container(90, 50);
    
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x2a1810, 0.8);
    buttonBg.lineStyle(2, 0x8b6914);
    buttonBg.fillRoundedRect(-40, -20, 80, 40, 10);
    buttonBg.strokeRoundedRect(-40, -20, 80, 40, 10);
    
    const buttonText = this.add.text(0, 0, '📖', {
      fontSize: '24px',
      fill: '#ffd700'
    }).setOrigin(0.5);
    
    const buttonLabel = this.add.text(0, 22, '魔法の書', {
      fontSize: '12px',
      fill: '#ffd700',
      fontFamily: 'Georgia, serif'
    }).setOrigin(0.5);
    
    spellBookContainer.add([buttonBg, buttonText, buttonLabel]);
    spellBookContainer.setInteractive(new Phaser.Geom.Rectangle(-40, -20, 80, 40), Phaser.Geom.Rectangle.Contains);
    
    spellBookContainer.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x3a2820, 0.8);
      buttonBg.lineStyle(2, 0x8b6914);
      buttonBg.fillRoundedRect(-40, -20, 80, 40, 10);
      buttonBg.strokeRoundedRect(-40, -20, 80, 40, 10);
      this.tweens.add({
        targets: buttonText,
        y: -2,
        duration: 100,
        ease: 'Power1'
      });
    });
    
    spellBookContainer.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x2a1810, 0.8);
      buttonBg.lineStyle(2, 0x8b6914);
      buttonBg.fillRoundedRect(-40, -20, 80, 40, 10);
      buttonBg.strokeRoundedRect(-40, -20, 80, 40, 10);
      this.tweens.add({
        targets: buttonText,
        y: 0,
        duration: 100,
        ease: 'Power1'
      });
    });
    
    spellBookContainer.on('pointerdown', () => {
      this.spellBook.toggle();
    });
    
    this.spellBookButton = spellBookContainer;
    
    // HPバー表示用のスタイリッシュなコンテナを作成
    this.createHPBars();
    
    // コマンドログパネル（下部半透明、グラデーション効果付き）
    const logPanel = this.add.graphics();
    
    // ログエリアの位置とサイズを計算（テキストエリアに合わせる）
    const logX = this.scale.width * 0.15; // テキストより少し左から開始
    const logY = this.scale.height * 0.82; // テキストより少し上から開始
    const logWidth = this.scale.width * 0.75; // テキストのwordWrapより少し広く
    const logHeight = this.scale.height * 0.16; // 画面下部の16%を使用
    
    // グラデーション背景
    logPanel.fillStyle(0x000000, 0.7);
    logPanel.fillRect(logX, logY, logWidth, logHeight);
    
    // パネル上部の装飾ライン
    logPanel.lineStyle(2, 0x4a6fff, 1);
    logPanel.lineBetween(logX, logY, logX + logWidth, logY);
    
    // UIとゲーム状態を初期化
    this.ui = new UI();
    
    // このテキストオブジェクトを UI のログエリアとして割り当てる
    this.ui.logArea = this.add.text(this.scale.width * 0.16, this.scale.height * 0.84, '', { 
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '16px', 
      fill: '#ffffff',
      wordWrap: { width: this.scale.width * 0.73 },
      lineSpacing: 6,
      shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 3, fill: true }
    });
    
    // プレイヤーと敵を初期化
    this.player = new Player(this, this.ui);
    this.player.sprite = this.playerSprite;
    
    this.enemy = new Enemy(this, this.ui);
    this.enemy.sprite = this.enemySprite;
    
    // バトル開始のログメッセージ
    this.addLog(`バトルが始まりました！${this.settings.enemy}と対決します！`);
    
    // バトル開始演出
    this.cameras.main.flash(500, 255, 255, 255, true);
  }
  
  // HPバーを作成する新しいメソッド
  createHPBars() {
    // プレイヤーのHPバーコンテナ
    const playerHPContainer = this.add.graphics();
    playerHPContainer.fillStyle(0x000000, 0.7); // 背景
    playerHPContainer.fillRoundedRect(this.scale.width * 0.05, this.scale.height * 0.73, this.scale.width * 0.275, 30, 5);
    playerHPContainer.lineStyle(2, 0xffffff, 1);
    playerHPContainer.strokeRoundedRect(this.scale.width * 0.05, this.scale.height * 0.73, this.scale.width * 0.275, 30, 5);
    
    // プレイヤーHP表示
    this.playerHPText = this.add.text(this.scale.width * 0.0625, this.scale.height * 0.747, 'HP: 100/100', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '16px',
      fill: '#ffffff',
      shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 1, fill: true }
    });
    
    // プレイヤーのHPバー（グラデーション効果）
    this.playerHPBar = this.add.graphics();
    this.drawPlayerHP(100); // 初期値100で描画
    
    // 敵のHPバーコンテナ
    const enemyHPContainer = this.add.graphics();
    enemyHPContainer.fillStyle(0x000000, 0.7); // 背景
    enemyHPContainer.fillRoundedRect(this.scale.width * 0.6125, this.scale.height * 0.167, this.scale.width * 0.275, 30, 5);
    enemyHPContainer.lineStyle(2, 0xffffff, 1);
    enemyHPContainer.strokeRoundedRect(this.scale.width * 0.6125, this.scale.height * 0.167, this.scale.width * 0.275, 30, 5);
    
    // 敵HP表示
    this.enemyHPText = this.add.text(this.scale.width * 0.625, this.scale.height * 0.18, 'HP: 50/50', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '16px',
      fill: '#ffffff',
      shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 1, fill: true }
    });
    
    // 敵のHPバー（グラデーション効果）
    this.enemyHPBar = this.add.graphics();
    this.drawEnemyHP(50); // 初期値50で描画
  }

  // プレイヤーのHPバーを描画（グラデーション効果付き）
  drawPlayerHP(hp) {
    const maxHP = 100;
    const percentage = Math.max(0, Math.min(1, hp / maxHP));
    const width = (this.scale.width * 0.25) * percentage;
    
    this.playerHPBar.clear();
    
    // グラデーションの色を決定（HPによって色が変化）
    let color1, color2;
    if (percentage > 0.6) {  // HP高
      color1 = 0x00ff00;  // 緑
      color2 = 0x99ff66;  // 薄い緑
    } else if (percentage > 0.3) {  // HP中
      color1 = 0xffcc00;  // オレンジ
      color2 = 0xffff66;  // 黄色
    } else {  // HP低
      color1 = 0xff0000;  // 赤
      color2 = 0xff6666;  // 薄い赤
    }
    
    // グラデーション風のHPバーを描画
    if (width > 0) {
      // メインのHPバー
      this.playerHPBar.fillStyle(color1, 1);
      this.playerHPBar.fillRoundedRect(this.scale.width * 0.0625, this.scale.height * 0.7417, width, 20, 3);
      
      // 上部の光沢エフェクト
      this.playerHPBar.fillStyle(color2, 0.7);
      this.playerHPBar.fillRoundedRect(this.scale.width * 0.0625, this.scale.height * 0.7417, width, 10, 3);
    }
  }
  
  // 敵のHPバーを描画（グラデーション効果付き）
  drawEnemyHP(hp) {
    const maxHP = 50;
    const percentage = Math.max(0, Math.min(1, hp / maxHP));
    const width = (this.scale.width * 0.25) * percentage;
    
    this.enemyHPBar.clear();
    
    // グラデーションの色を決定（HPによって色が変化）
    let color1, color2;
    if (percentage > 0.6) {  // HP高
      color1 = 0xff0000;  // 敵は赤をベースに
      color2 = 0xff6666;  // 薄い赤
    } else if (percentage > 0.3) {  // HP中
      color1 = 0xcc3300;  // 暗い赤
      color2 = 0xff9966;  // 薄いオレンジ
    } else {  // HP低
      color1 = 0x990000;  // 暗い赤
      color2 = 0xcc6666;  // くすんだ赤
    }
    
    // グラデーション風のHPバーを描画
    if (width > 0) {
      // メインのHPバー
      this.enemyHPBar.fillStyle(color1, 1);
      this.enemyHPBar.fillRoundedRect(this.scale.width * 0.625, this.scale.height * 0.175, width, 20, 3);
      
      // 上部の光沢エフェクト
      this.enemyHPBar.fillStyle(color2, 0.7);
      this.enemyHPBar.fillRoundedRect(this.scale.width * 0.625, this.scale.height * 0.175, width, 10, 3);
    }
  }
  
  // HPバー更新
  updateHP(playerHP, enemyHP) {
    // テキスト更新
    this.playerHPText.setText(`HP: ${playerHP}/100`);
    this.enemyHPText.setText(`HP: ${enemyHP}/50`);
    
    // HPバー更新
    this.drawPlayerHP(playerHP);
    this.drawEnemyHP(enemyHP);
    
    // HTML要素も更新
    const playerHPElement = document.getElementById('playerHP');
    const enemyHPElement = document.getElementById('enemyHP');
    
    if (playerHPElement) playerHPElement.textContent = `Player: ${playerHP}`;
    if (enemyHPElement) playerHPElement.textContent = `Enemy: ${enemyHP}`;
    
    // HPが低くなったら点滅エフェクト
    if (playerHP < 30) {
      this.playerHPText.setTint(0xff0000);
      this.tweens.add({
        targets: this.playerHPText,
        alpha: { from: 1, to: 0.5 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else {
      this.playerHPText.clearTint();
      this.playerHPText.alpha = 1;
      this.tweens.killTweensOf(this.playerHPText);
    }
    
    if (enemyHP < 15) {
      this.enemyHPText.setTint(0xff0000);
      this.tweens.add({
        targets: this.enemyHPText,
        alpha: { from: 1, to: 0.5 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else {
      this.enemyHPText.clearTint();
      this.enemyHPText.alpha = 1;
      this.tweens.killTweensOf(this.enemyHPText);
    }
  }

  
  // 魔法詠唱のポップアップを表示（Stage1のベース実装）
  showSpellPopup() {
    // すでにポップアップがある場合は削除
    if (this.spellPopup) {
      this.hideSpellPopup();
      return;
    }
    
    // カメラをフラッシュさせる演出
    this.cameras.main.flash(200, 255, 240, 180, true);
    
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    
    // コンテナ作成
    const container = this.add.container(centerX, centerY);
    container.setScale(0);
    
    // ポップアップの背景
    const popupBg = this.add.graphics();
    popupBg.fillStyle(0x111122, 0.85);
    popupBg.fillRoundedRect(-220, -170, 440, 340, 15);
    
    // 装飾的な枠線
    popupBg.lineStyle(3, 0x4a6fff, 1);
    popupBg.strokeRoundedRect(-220, -170, 440, 340, 15);
    
    // 内側の光る装飾
    popupBg.lineStyle(1, 0x7a9fff, 0.5);
    popupBg.strokeRoundedRect(-210, -160, 420, 320, 12);
    
    // タイトル背景
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x4a6fff, 0.6);
    titleBg.fillRoundedRect(-180, -155, 360, 50, 10);
    
    // タイトル (基本コマンドのみ表示)
    const title = this.add.text(0, -130, '基本コマンド', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 3, fill: true }
    }).setOrigin(0.5);
    
    // ステージ1のコンテンツを作成
    // 攻撃アイコン
    const attackIcon = this.add.graphics();
    attackIcon.fillStyle(0xff3300, 0.8);
    attackIcon.fillCircle(-150, -30, 15);
    
    // 攻撃コマンドの説明
    const attackText = this.add.text(-120, -30, '「攻撃」: 敵に基本攻撃を行います', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '18px',
      fill: '#ff9966',
      shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 1, fill: true }
    }).setOrigin(0, 0.5);
    
    // 解説
    const stageInfo = this.add.text(0, 50, '敵を倒すにはまず攻撃を覚えましょう。\n適切なタイミングでの攻撃が勝利への鍵です！', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '16px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 380 }
    }).setOrigin(0.5);
    
    // ボタン背景
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x880000, 1);
    buttonBg.fillRoundedRect(-60, 130, 120, 40, 10);
    buttonBg.lineStyle(2, 0xff0000, 1);
    buttonBg.strokeRoundedRect(-60, 130, 120, 40, 10);
    
    // 閉じるボタン
    const closeButton = this.add.text(0, 150, '閉じる', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      fill: '#ffffff'
    }).setOrigin(0.5).setInteractive();
    
    // 基本要素をコンテナに追加
    container.add([popupBg, titleBg, title, buttonBg, closeButton, 
                  attackIcon, attackText, stageInfo]);
    
    // ポップアップを表示するアニメーション
    this.tweens.add({
      targets: container,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
    
    // ボタンのイベント
    closeButton.on('pointerdown', () => {
      this.hideSpellPopup();
    });
    
    // ホバーエフェクト
    closeButton.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0xaa0000, 1);
      buttonBg.fillRoundedRect(-60, 130, 120, 40, 10);
      buttonBg.lineStyle(2, 0xff3333, 1);
      buttonBg.strokeRoundedRect(-60, 130, 120, 40, 10);
      closeButton.setScale(1.05);
    });
    
    closeButton.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x880000, 1);
      buttonBg.fillRoundedRect(-60, 130, 120, 40, 10);
      buttonBg.lineStyle(2, 0xff0000, 1);
      buttonBg.strokeRoundedRect(-60, 130, 120, 40, 10);
      closeButton.setScale(1);
    });
    
    // 参照を保存
    this.spellPopup = {
      container: container,
      bg: popupBg,
      title: title,
      button: closeButton
    };
  }
  
  // ポップアップを閉じる
  hideSpellPopup() {
    if (this.spellPopup) {
      const container = this.spellPopup.container;
      
      // 閉じるアニメーション
      this.tweens.add({
        targets: container,
        scale: 0,
        duration: 200,
        ease: 'Back.easeIn',
        onComplete: () => {
          container.destroy();
          this.spellPopup = null;
        }
      });
    }
  }

  // バトルログ追加
  addLog(message) {
    // UIのログに追加 - UIクラスのlogAreaを使用
    if (this.ui && this.ui.logArea) {
      this.ui.log(message);
    }
  }

  // アニメーション再生
  async playAnimation(animationType) {
    console.log(`Playing animation: ${animationType}`);
    
    // アニメーションタイプに応じた処理
    switch(animationType) {
      case 'playerAttack':
        // プレイヤーの攻撃アニメーション - より現代的なアニメーション
        const originalX = this.playerSprite.x;
        
        // プレイヤーが素早く動く
        this.tweens.add({
          targets: this.playerSprite,
          x: originalX + 80,
          angle: 5, // 少し傾く
          duration: 150,
          ease: 'Power2',
          yoyo: true,
          repeat: 0,
          onComplete: () => {
            // 斬撃エフェクト
            const slash = this.add.graphics();
            slash.lineStyle(4, 0xffffff, 1);
            
            // 斬撃線を描画
            for (let i = 0; i < 3; i++) {
              const offset = i * 10;
              slash.beginPath();
              slash.moveTo(this.enemySprite.x - 40 + offset, this.enemySprite.y - 30 + offset);
              slash.lineTo(this.enemySprite.x + 30 + offset, this.enemySprite.y + 20 + offset);
              slash.strokePath();
            }
            
            // 斬撃のフェードアウト
            this.tweens.add({
              targets: slash,
              alpha: 0,
              duration: 200,
              onComplete: () => slash.destroy()
            });
            
            // 敵のダメージ演出
            if (this.enemySprite && typeof this.enemySprite.setTint === 'function') {
                this.enemySprite.setTint(0xff0000);
                this.tweens.add({
                targets: this.enemySprite,
                x: this.enemySprite.x + 10,
                duration: 50,
                yoyo: true,
                repeat: 1,
                onComplete: () => this.enemySprite.clearTint()
                });
            } else {
                 // Graphicsオブジェクト用の簡易ダメージ演出（揺れのみ）
                 this.tweens.add({
                    targets: this.enemySprite,
                    x: this.enemySprite.x + 10,
                    duration: 50,
                    yoyo: true,
                    repeat: 1
                 });
            }
          }
        });
        
        // アニメーションの完了を待機
        await new Promise(resolve => setTimeout(resolve, 500));
        break;
        
      case 'magic_fire':
        // 火の魔法エフェクト - 爆発的な炎の演出
        
        // カメラシェイク効果
        this.cameras.main.shake(150, 0.005);
        
        // 魔法の詠唱エフェクト（プレイヤー周り）
        const castFx = this.add.graphics();
        castFx.fillStyle(0xff3300, 0.4);
        castFx.fillCircle(this.playerSprite.x, this.playerSprite.y, 40);
        
        // 詠唱エフェクトのアニメーション
        this.tweens.add({
          targets: castFx,
          alpha: 0,
          scale: 1.5,
          duration: 300,
          onComplete: () => castFx.destroy()
        });

        // 敵に向かって飛んでいく火の弾
        const fireball = this.add.graphics();
        fireball.fillStyle(0xff3300, 0.8);
        fireball.fillCircle(0, 0, 15);
        
        // 内側の明るい部分
        fireball.fillStyle(0xffff00, 0.9);
        fireball.fillCircle(0, 0, 8);
        
        // 火の粒子を追加
        const particles = [];
        for (let i = 0; i < 5; i++) {
          const particle = this.add.graphics();
          particle.fillStyle(0xff5500, 0.6);
          particle.fillCircle(0, 0, 5);
          particles.push(particle);
        }

        // 火の弾の軌道アニメーション
        const path = new Phaser.Curves.Path(this.playerSprite.x, this.playerSprite.y);
        path.cubicBezierTo(
          this.enemySprite.x, this.enemySprite.y, 
          this.playerSprite.x, this.playerSprite.y - 150,
          (this.playerSprite.x + this.enemySprite.x) / 2, this.playerSprite.y - 100
        );
        
        // 火の弾を移動
        this.tweens.add({
          targets: fireball,
          x: this.enemySprite.x,
          y: this.enemySprite.y,
          duration: 600,
          onUpdate: (tween, target) => {
            const position = path.getPoint(tween.progress);
            fireball.x = position.x;
            fireball.y = position.y;
            
            // 粒子もランダムに動かす
            particles.forEach((p, i) => {
              p.x = position.x + Math.sin(tween.progress * 10 + i) * 10;
              p.y = position.y + Math.cos(tween.progress * 10 + i) * 10;
            });
          },
          onComplete: () => {
            // 爆発エフェクト
            fireball.destroy();
            particles.forEach(p => p.destroy());
            
            // 大きな爆発を描画
            const explosion = this.add.graphics();
            explosion.fillStyle(0xff3300, 0.8);
            explosion.fillCircle(this.enemySprite.x, this.enemySprite.y, 60);
            
            // 内側の白熱部分
            explosion.fillStyle(0xffcc00, 0.9);
            explosion.fillCircle(this.enemySprite.x, this.enemySprite.y, 40);
            
            explosion.fillStyle(0xffff00, 1);
            explosion.fillCircle(this.enemySprite.x, this.enemySprite.y, 20);
            
            // 爆発によるカメラシェイク
            this.cameras.main.shake(300, 0.01);
            
            // 爆発のフェードアウト
            this.tweens.add({
              targets: explosion,
              alpha: 0,
              scale: 1.5,
              duration: 500,
              onComplete: () => explosion.destroy()
            });
            
            // 敵のダメージ演出
            this.enemySprite.setTint(0xff3300);
            setTimeout(() => this.enemySprite.clearTint(), 400);
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 1100));
        break;
        
      case 'magic_ice':
        // 氷の魔法エフェクト - より結晶的なアイスエフェクト
        
        // 魔法の詠唱エフェクト（プレイヤー周り）
        const iceCastFx = this.add.graphics();
        iceCastFx.fillStyle(0x00ffff, 0.4);
        iceCastFx.fillCircle(this.playerSprite.x, this.playerSprite.y, 40);
        
        this.tweens.add({
          targets: iceCastFx,
          alpha: 0,
          scale: 1.5,
          duration: 300,
          onComplete: () => iceCastFx.destroy()
        });

        // 氷の結晶を複数作成
        const iceShards = [];
        for (let i = 0; i < 6; i++) {
          const shard = this.add.graphics();
          
          // 六角形の結晶を描く
          shard.fillStyle(0x00ffff, 0.8);
          shard.fillCircle(0, 0, 10);
          
          // 内側の明るい部分
          shard.fillStyle(0xaaffff, 0.9);
          shard.fillCircle(0, 0, 5);
          
          // 初期位置設定
          shard.x = this.playerSprite.x;
          shard.y = this.playerSprite.y;
          
          // 飛んでいく先の位置をランダムに少しずらす
          const targetX = this.enemySprite.x + (Math.random() * 60 - 30);
          const targetY = this.enemySprite.y + (Math.random() * 60 - 30);
          
          // アニメーション
          this.tweens.add({
            targets: shard,
            x: targetX,
            y: targetY,
            scale: 1.5,
            duration: 400 + i * 50,
            ease: 'Cubic.easeOut',
            onComplete: function() {
              // 結晶が消える
              this.tweens.add({
                targets: shard,
                alpha: 0,
                scale: 0.5,
                duration: 200,
                onComplete: () => shard.destroy()
              });
            }.bind(this)
          });
          
          iceShards.push(shard);
        }
        
        // 氷結エフェクト
        setTimeout(() => {
          const freezeEffect = this.add.graphics();
          
          // 氷の結晶のパターン
          freezeEffect.fillStyle(0x00ffff, 0.6);
          freezeEffect.fillRect(this.enemySprite.x - 40, this.enemySprite.y - 40, 80, 80);
          
          freezeEffect.lineStyle(2, 0xaaffff, 0.8);
          
          // 結晶パターンを描く
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const length = 50;
            freezeEffect.lineBetween(
              this.enemySprite.x, 
              this.enemySprite.y, 
              this.enemySprite.x + Math.cos(angle) * length,
              this.enemySprite.y + Math.sin(angle) * length
            );
          }
          
          // 敵を青く染める
          this.enemySprite.setTint(0x00ffff);
          
          // 氷結エフェクトのアニメーション
          this.tweens.add({
            targets: freezeEffect,
            alpha: { from: 0.8, to: 0 },
            duration: 800,
            onComplete: () => {
              freezeEffect.destroy();
              this.enemySprite.clearTint();
            }
          });
        }, 400);
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        break;
        
      case 'magic_thunder':
        // 雷の魔法エフェクト - よりダイナミックな稲妻
        
        // 魔法の詠唱エフェクト（プレイヤー周り）
        const thunderCastFx = this.add.graphics();
        thunderCastFx.fillStyle(0xffff00, 0.4);
        thunderCastFx.fillCircle(this.playerSprite.x, this.playerSprite.y, 40);
        
        this.tweens.add({
          targets: thunderCastFx,
          alpha: 0,
          scale: 1.5,
          duration: 300,
          onComplete: () => thunderCastFx.destroy()
        });
        
        // 天候を暗く
        const darkOverlay = this.add.graphics();
        darkOverlay.fillStyle(0x000033, 0.5);
        darkOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // 雲が集まる演出
        const cloud = this.add.graphics();
        cloud.fillStyle(0x444466, 0.7);
        cloud.fillRect(this.enemySprite.x - this.scale.width * 0.125, 0, this.scale.width * 0.25, this.scale.height * 0.167);
        
        // 雲のアニメーション
        this.tweens.add({
          targets: cloud,
          y: 60,
          alpha: 0.9,
          duration: 400
        });
        
        // 複数の稲妻を描画
        setTimeout(() => {
          // 閃光
          this.cameras.main.flash(100, 255, 255, 180);
          
          // 大きな稲妻
          const mainLightning = this.add.graphics();
          mainLightning.lineStyle(8, 0xffffff, 1);
          mainLightning.beginPath();
          
          // ジグザグの稲妻を描画 - より複雑なパターン
          let x = this.enemySprite.x;
          let y = 100;
          const segments = 6;
          mainLightning.moveTo(x, y);
          
          for (let i = 1; i <= segments; i++) {
            const progress = i / segments;
            const xOffset = (Math.random() * 60 - 30) * (1 - progress); // 下に行くほど収束
            x = this.enemySprite.x + xOffset;
            y = 100 + (this.enemySprite.y - 100) * progress;
            mainLightning.lineTo(x, y);
          }
          
          mainLightning.strokePath();
          
          // 中心の輝く部分
          const coreLightning = this.add.graphics();
          coreLightning.lineStyle(4, 0xffff99, 0.8);
          coreLightning.lineBetween(
            this.enemySprite.x, 100,
            this.enemySprite.x, this.enemySprite.y
          );
          
          // 分岐する小さな稲妻
          const branches = [];
          for (let i = 0; i < 4; i++) {
            const branch = this.add.graphics();
            branch.lineStyle(3, 0xffffff, 0.7);
            
            const startY = 100 + Math.random() * (this.enemySprite.y - 150);
            const length = 30 + Math.random() * 60;
            const angle = (Math.random() * Math.PI / 2) + Math.PI / 4;
            
            branch.beginPath();
            branch.moveTo(this.enemySprite.x, startY);
            branch.lineTo(
              this.enemySprite.x + Math.cos(angle) * length,
              startY + Math.sin(angle) * length
            );
            branch.strokePath();
            
            branches.push(branch);
          }
          
          // 衝撃波エフェクト
          const shockwave = this.add.graphics();
          shockwave.lineStyle(2, 0xffff99, 0.8);
          shockwave.strokeCircle(this.enemySprite.x, this.enemySprite.y, 30);
          
          // 衝撃波を拡大
          this.tweens.add({
            targets: shockwave,
            scale: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => shockwave.destroy()
          });
          
          // カメラシェイク
          this.cameras.main.shake(300, 0.02);
          
          // 敵のダメージ演出
          this.enemySprite.setTint(0xffff00);
          
          // 稲妻のフェードアウト
          setTimeout(() => {
            this.tweens.add({
              targets: [mainLightning, coreLightning, ...branches],
              alpha: 0,
              duration: 200,
              onComplete: () => {
                mainLightning.destroy();
                coreLightning.destroy();
                branches.forEach(b => b.destroy());
              }
            });
            
            this.enemySprite.clearTint();
          }, 200);
          
          // 暗さのフェードアウト
          this.tweens.add({
            targets: [darkOverlay, cloud],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              darkOverlay.destroy();
              cloud.destroy();
            }
          });
        }, 500);
        
        await new Promise(resolve => setTimeout(resolve, 1300));
        break;
        
      default:
        console.log(`未知のアニメーションタイプ: ${animationType}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return true;
  }
  
  // 敵へのダメージ処理
  dealDamageToEnemy(damage, attackType = 'normal') {
    if (this.enemy) {
      this.enemy.hp = Math.max(0, this.enemy.hp - damage);
      this.updateHP(this.player.hp, this.enemy.hp);
      
      // 敵のHPが0になったら戦闘終了
      if (this.enemy.hp <= 0) {
        this.addLog("敵を倒した！プレイヤーの勝利！");
        this.gameOver(true); // true = プレイヤー勝利
        return false;
      }
      return true;
    }
    return false;
  }
  
  // バトル中のプレイヤーのHPを回復するメソッド
  async healPlayer(amount) {
    console.log("BattleScene healPlayer called with amount:", amount);
    // 現在のHPを取得し、回復量を加算（最大HPを超えないように）
    const currentHP = this.player.getHP();
    const maxHP = 100; // プレイヤーの最大HP
    
    // 回復量に基づいた新しいHP値を計算（最大HPを超えないように）
    const newHP = Math.min(currentHP + amount, maxHP);
    this.player.setHP(newHP);
    
    // HPバーを更新
    this.updateHP(newHP, this.enemy.getHP());
    
    // 回復エフェクトを表示
    this.showHealEffect();
    
    // ログに回復メッセージを追加
    this.addLog(`プレイヤーのHPが ${amount} 回復した！`);
    
    return true;
  }

  // 回復エフェクトを表示する
  showHealEffect() {
    // プレイヤースプライトの位置を取得
    const x = this.playerSprite.x;
    const y = this.playerSprite.y;
    
    // パーティクルの画像がない場合は、シェイプを代用
    if (!this.textures.exists('healParticle')) {
      this.make.graphics({ x: 0, y: 0, add: false })
        .fillStyle(0x00ff00, 1)  // 緑色
        .fillCircle(8, 8, 8)     // 半径8のサークル
        .generateTexture('healParticle', 16, 16);
    }
    
    // Phaser 3.60 新API使用 - 回復エフェクト用のパーティクルエミッター作成
    const particles = this.add.particles(x, y, {
      key: 'healParticle',
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: [0x00ff00, 0x99ff66, 0x66ff99], // 緑色のバリエーション
      lifespan: 1000,
      blendMode: 'ADD',
      frequency: 50,
      rotate: { min: 0, max: 360 },
      angle: { min: 0, max: 360 },
      radial: true,
      gravityY: -50,
      emitting: true,
      duration: 2000
    });
    
    // 光のオーラエフェクト
    const glowCircle = this.add.graphics();
    glowCircle.fillStyle(0x00ff00, 0.3);
    glowCircle.fillCircle(x, y, 50);
    
    // プレイヤーを一時的に緑色に着色
    this.playerSprite.setTint(0x99ff99);
    
    // キラキラ効果アニメーション
    this.tweens.add({
      targets: glowCircle,
      alpha: { from: 0.3, to: 0 },
      scale: { from: 1, to: 2 },
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => {
        glowCircle.destroy();
      }
    });
    
    // 回復テキストの表示
    const healText = this.add.text(x, y - 50, 'Heal!', {
      fontFamily: 'Verdana, "メイリオ", sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      fill: '#00ff00',
      stroke: '#004400',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2, fill: true }
    }).setOrigin(0.5);
    
    // テキストアニメーション
    this.tweens.add({
      targets: healText,
      y: y - 100,
      alpha: { from: 1, to: 0 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        healText.destroy();
      }
    });
    
    // 一定時間後にエフェクトを停止して色を元に戻す
    this.time.delayedCall(1000, () => {
      emitter.stop();
      this.playerSprite.clearTint();
      
      // 少し遅れてパーティクルを破棄（残りのパーティクルが消えるのを待つ）
      this.time.delayedCall(500, () => {
        particles.destroy();
      });
    });
  }

  // ゲームオーバー処理
  gameOver(isVictory) {
    // 勝利か敗北かに応じて結果を表示
    if (isVictory) {
      // 勝利時の処理
      this.handleVictory();
    } else {
      // 敗北時の処理
      this.handleDefeat();
    }
  }

  // 勝利時の処理
  async handleVictory() {
    // バトル終了時刻を記録
    this.battleStats.battleEndTime = Date.now();
    
    const resultText = "勝利！";
    
    // 大きな結果テキストを画面中央に表示
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    
    const resultDisplay = this.add.text(centerX, centerY, resultText, {
      fontSize: '64px',
      fill: '#00ff00',
      stroke: '#000',
      strokeThickness: 6,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // テキストに拡大縮小アニメーションを適用
    this.tweens.add({
      targets: resultDisplay,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Bounce.Out'
    });

    // 勝利メッセージを表示
    const victoryMessage = this.add.text(centerX, centerY + 60, 'ステージクリア！', {
      fontSize: '32px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // 経験値計算と表示
    await this.calculateAndDisplayExperience(centerX, centerY);

    // 入力を無効化
    const runButton = document.getElementById("runButton");
    if (runButton) {
      runButton.disabled = true;
    }

    // 5秒後にストーリーシーンへ遷移（経験値表示時間を考慮）
    this.time.delayedCall(5000, () => {
      // 現在のステージ番号を取得
      const currentStage = this.settings.stageNumber || 1;
      
      // ストーリーシーンへ遷移（勝利後のストーリー）
      this.scene.start('StoryScene', { 
        stage: currentStage,
        context: 'victory', // 勝利後のストーリーであることを示す
        returnTo: 'HomeScene' // ストーリー後の遷移先
      });
    });
  }

  // 経験値計算と表示
  async calculateAndDisplayExperience(centerX, centerY) {
    try {
      console.log('=== 経験値計算開始 ===');
      
      // データベース状態確認
      console.log('データベース状態を確認中...');
      const { checkDatabaseSetup, initializeProfileColumns } = await import('../supabase/databaseCheck.js');
      const dbStatus = await checkDatabaseSetup();
      
      if (!dbStatus.success) {
        console.error('データベース状態確認エラー:', dbStatus);
        this.addLog(`データベースエラー: ${dbStatus.error}`);
        
        if (dbStatus.needsProfile) {
          this.addLog('プロフィールが作成されていません');
          return;
        }
        
        if (dbStatus.needsUpdate && dbStatus.missingColumns) {
          this.addLog('データベースの更新が必要です');
          console.log('不足しているカラム:', dbStatus.missingColumns);
          return;
        }
        
        return;
      }
      
      console.log('データベース状態確認完了');
      
      // 経験値システムをインポート
      console.log('経験値システムをインポート中...');
      const { calculateExperience, updatePlayerExperience } = await import('../supabase/experienceSystem.js');
      console.log('経験値システムのインポート完了');
      
      // 現在のユーザーIDを取得
      console.log('ユーザー情報を取得中...');
      const { supabase } = await import('../lib/supabase.js');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('認証エラー:', authError);
        this.addLog(`認証エラー: ${authError.message}`);
        return;
      }
      
      if (!user) {
        console.warn('ユーザーが認証されていないため、経験値を保存できません');
        this.addLog('ゲストモードのため経験値は保存されません');
        return;
      }
      
      console.log('認証済みユーザー:', user.id);

      // 基準経験値（ステージ1）
      const baseExperience = 100;
      
      // 最終的なブロック数を取得
      const finalBlockCount = this.getCurrentBlockCount();
      if (finalBlockCount > 0) {
        this.battleStats.blockCount = finalBlockCount;
      }
      
      console.log('バトル統計:', this.battleStats);
      
      // 経験値計算（目標: 3ブロック、1回実行）
      console.log('経験値を計算中...');
      const expResult = calculateExperience(
        baseExperience, 
        this.battleStats.blockCount, 
        this.battleStats.executionCount,
        3, // 目標ブロック数
        1  // 目標実行回数
      );
      console.log('経験値計算結果:', expResult);

      // 経験値をデータベースに保存
      console.log('データベースに経験値を保存中...');
      const updateResult = await updatePlayerExperience(
        user.id,
        expResult.experience,
        this.settings.stageNumber || 1,
        {
          blockCount: this.battleStats.blockCount,
          executionCount: this.battleStats.executionCount,
          efficiencyMultiplier: expResult.efficiencyMultiplier
        }
      );
      
      console.log('データベース更新結果:', updateResult);

      if (updateResult.success) {
        console.log('経験値保存成功');
        // 経験値表示
        const expText = this.add.text(centerX, centerY + 120, 
          `経験値 +${expResult.experience}`, {
          fontSize: '28px',
          fill: '#ffff00',
          stroke: '#000',
          strokeThickness: 2
        }).setOrigin(0.5);

        // 効率ボーナス表示
        const efficiencyText = this.add.text(centerX, centerY + 150, 
          `効率ボーナス: x${expResult.efficiencyMultiplier.toFixed(2)}`, {
          fontSize: '20px',
          fill: '#00ffff',
          stroke: '#000',
          strokeThickness: 2
        }).setOrigin(0.5);

        // 統計表示
        const statsText = this.add.text(centerX, centerY + 180, 
          `ブロック数: ${this.battleStats.blockCount} | 実行回数: ${this.battleStats.executionCount}`, {
          fontSize: '16px',
          fill: '#ffffff',
          stroke: '#000',
          strokeThickness: 1
        }).setOrigin(0.5);

        // レベルアップチェック
        if (updateResult.level.levelUp) {
          const levelUpText = this.add.text(centerX, centerY + 210, 
            `🎉 レベルアップ！ Lv.${updateResult.level.current}`, {
            fontSize: '24px',
            fill: '#ff69b4',
            stroke: '#000',
            strokeThickness: 2
          }).setOrigin(0.5);

          // レベルアップアニメーション
          this.tweens.add({
            targets: levelUpText,
            scale: { from: 0.8, to: 1.2, to: 1 },
            duration: 1000,
            ease: 'Bounce.Out'
          });
        }

        // ログにも記録
        this.addLog(`経験値 +${expResult.experience} を獲得！`);
        if (updateResult.level.levelUp) {
          this.addLog(`レベルアップ！現在のレベル: ${updateResult.level.current}`);
        }

      } else {
        console.error('経験値更新エラーの詳細:', {
          error: updateResult.error,
          details: updateResult.details
        });
        this.addLog(`経験値保存エラー: ${updateResult.error}`);
        
        // デバッグ用の詳細情報表示
        if (updateResult.details) {
          console.error('エラーの詳細:', updateResult.details);
          this.addLog(`詳細: ${JSON.stringify(updateResult.details, null, 2)}`);
        }
      }

    } catch (error) {
      console.error('=== 経験値処理で予期しないエラー ===');
      console.error('エラーオブジェクト:', error);
      console.error('エラーメッセージ:', error.message);
      console.error('エラースタック:', error.stack);
      this.addLog(`経験値処理エラー: ${error.message}`);
    }
  }

  // 敗北時の処理
  handleDefeat() {
    const resultText = "敗北...";
    
    // 大きな結果テキストを画面中央に表示
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    
    const resultDisplay = this.add.text(centerX, centerY, resultText, {
      fontSize: '64px',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 6,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // テキストに拡大縮小アニメーションを適用
    this.tweens.add({
      targets: resultDisplay,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Bounce.Out'
    });
    
    // リスタートボタンを表示
    const restartButton = this.add.text(centerX, centerY + 80, 'もう一度戦う', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // ホームに戻るボタンを表示
    const homeButton = this.add.text(centerX, centerY + 140, 'ホーム画面に戻る', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    // リスタートボタンのイベントリスナー
    restartButton.on('pointerdown', () => {
      this.scene.restart();
    });

    // ホームボタンのイベントリスナー
    homeButton.on('pointerdown', () => {
      this.scene.start('HomeScene');
    });
    
    // ホバー効果
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ fill: '#ffff00' });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ fill: '#ffffff' });
    });

    homeButton.on('pointerover', () => {
      homeButton.setStyle({ fill: '#ffff00' });
    });
    
    homeButton.on('pointerout', () => {
      homeButton.setStyle({ fill: '#ffffff' });
    });
    
    // 入力を無効化して戦闘終了状態にする
    const runButton = document.getElementById("runButton");
    if (runButton) {
      runButton.disabled = true;
      
      // 2秒後に入力を再度有効化
      setTimeout(() => {
        runButton.disabled = false;
      }, 2000);
    }
  }

  // ブロックエディタを表示
  showBlockEditor() {
    console.log("Showing block editor and UI elements");
    
    // ブロックエディタを表示
    const blocklyDiv = document.getElementById('blocklyDiv');
    if (blocklyDiv) {
      console.log("Setting blocklyDiv display to block");
      blocklyDiv.style.display = 'block';
      blocklyDiv.style.visibility = 'visible';
      console.log("blocklyDiv display:", blocklyDiv.style.display);
    } else {
      console.error("blocklyDiv not found!");
    }
    
    // 実行ボタンを表示
    const runButton = document.getElementById('runButton');
    if (runButton) {
      console.log("Setting runButton display to block");
      runButton.style.display = 'block';
      runButton.disabled = false; // 確実にボタンを有効化
      console.log("runButton display:", runButton.style.display);
    } else {
      console.error("runButton not found!");
    }
    
    // HPバーを表示
    const playerHP = document.getElementById('playerHP');
    const enemyHP = document.getElementById('enemyHP');
    if (playerHP) {
      console.log("Setting playerHP display to block");
      playerHP.style.display = 'block';
    } else {
      console.error("playerHP not found!");
    }
    if (enemyHP) {
      console.log("Setting enemyHP display to block");
      enemyHP.style.display = 'block';
    } else {
      console.error("enemyHP not found!");
    }
  }
  
  shutdown() {
    // シーン破棄時の処理
    if (this.spellBook) {
      this.spellBook.hide();  // 魔法の書を非表示に
    }
  }
  
  // 共通のステージセットアップメソッド
  async setupStageCommon(stageConfig) {
    // 背景色設定
    if (stageConfig.backgroundColor) {
      this.cameras.main.setBackgroundColor(stageConfig.backgroundColor);
    }
    
    // 敵のティント設定
    if (stageConfig.enemyTint && this.enemySprite && typeof this.enemySprite.setTint === 'function') {
      this.enemySprite.setTint(stageConfig.enemyTint);
    } else if (stageConfig.enemyTint && this.enemySprite) {
        // Graphicsオブジェクトの場合のフォールバック（色は変えられないがエラーは防ぐ）
        console.warn('enemySprite does not support setTint (likely a Graphics object)');
    }
    
    // 敵のHP設定
    if (stageConfig.enemyHp && this.enemy) {
      this.enemy.maxHp = stageConfig.enemyHp;
      this.enemy.hp = stageConfig.enemyHp;
      if (this.enemyHPText) {
        this.enemyHPText.setText(`HP: ${stageConfig.enemyHp}/${stageConfig.enemyHp}`);
      }
    }
    
    // ステージ開始メッセージ
    if (stageConfig.startMessage) {
      this.addLog(stageConfig.startMessage);
    }
    
    // 利用可能ブロック設定（レベル制限を適用）
    if (stageConfig.availableBlocks) {
      try {
        // プレイヤーレベルを取得
        const playerLevel = await this.getPlayerLevel();
        
        // 開発モードの確認
        const isDevelopmentMode = this.settings.isDevelopmentMode || false;
        
        // レベル制限を適用してブロックをフィルタリング
        const filteredBlocks = filterBlocksByLevel(
          stageConfig.availableBlocks, 
          playerLevel, 
          isDevelopmentMode
        );
        
        this.availableBlocks = filteredBlocks;
        
        // デバッグ情報をログに出力
        console.log(`=== ブロック制限システム ===`);
        console.log(`プレイヤーレベル: ${playerLevel}`);
        console.log(`開発モード: ${isDevelopmentMode}`);
        console.log(`ステージのブロック数: ${stageConfig.availableBlocks.length}`);
        console.log(`利用可能ブロック数: ${filteredBlocks.length}`);
        console.log(`ステージのブロック:`, stageConfig.availableBlocks);
        console.log(`利用可能ブロック:`, filteredBlocks);
        
        if (!isDevelopmentMode && filteredBlocks.length < stageConfig.availableBlocks.length) {
          const restrictedBlocks = stageConfig.availableBlocks.filter(
            block => !filteredBlocks.includes(block)
          );
          console.log(`制限されたブロック:`, restrictedBlocks);
          this.addLog(`現在のレベル(${playerLevel})では一部のブロックが制限されています`);
        } else if (!isDevelopmentMode) {
          console.log('すべてのブロックが利用可能です');
        } else {
          console.log('開発モードのため制限なし');
        }
        
        // ツールボックスを更新
        console.log('=== ツールボックス更新開始 ===');
        this.updateBlocklyToolbox(filteredBlocks);
        console.log('=== ツールボックス更新完了 ===');
        
        // SpellBookのステージ更新
        if (this.spellBook && this.stage) {
          console.log(`=== 魔法の書をステージ ${this.stage} に更新 ===`);
          this.spellBook.updateForStage(this.stage);
        }
        
        // ステージ別ツールボックス更新も実行
        if (window.updateToolboxForStage && this.settings.stageNumber) {
          // ワークスペースの準備ができるまで確実に待機
          const waitForWorkspace = () => {
            return new Promise((resolve) => {
              const checkWorkspace = () => {
                // 両方の参照をチェック
                const workspace = window.blocklyWorkspace || window.workspace;
                if (workspace) {
                  console.log('✅ Blocklyワークスペースが見つかりました');
                  resolve(workspace);
                } else {
                  console.log('⏳ Blocklyワークスペースを待機中...');
                  setTimeout(checkWorkspace, 100);
                }
              };
              checkWorkspace();
            });
          };
          
          // 非同期でワークスペース準備を待機
          waitForWorkspace().then((workspace) => {
            // ワークスペース参照を統一
            if (!window.workspace && workspace) {
              window.workspace = workspace;
            }
            
            // ツールボックス更新を実行
            window.updateToolboxForStage(this.settings.stageNumber);
            
            // デバッグ情報を出力
            console.log(`✅ ステージ ${this.settings.stageNumber} のツールボックス設定を適用しました`);
            console.log(`📊 現在のワークスペース状態:`, {
              workspace: !!window.workspace,
              blocklyWorkspace: !!window.blocklyWorkspace,
              stageNumber: this.settings.stageNumber,
              toolboxFunction: typeof window.updateToolboxForStage
            });
          }).catch((error) => {
            console.error('❌ ツールボックス更新でエラー:', error);
          });
          
        } else {
          console.warn('⚠️ ツールボックス更新機能またはステージ番号が利用できません', {
            updateFunction: !!window.updateToolboxForStage,
            stageNumber: this.settings.stageNumber
          });
        }
        
      } catch (error) {
        console.warn('プレイヤーレベルの取得に失敗:', error);
        // エラー時はレベル制限なしでブロックを設定
        this.availableBlocks = stageConfig.availableBlocks;
        // ツールボックスも更新
        console.log('=== エラー時ツールボックス更新 ===');
        this.updateBlocklyToolbox(stageConfig.availableBlocks);
      }
    }
    
    // 遅延メッセージ
    if (stageConfig.delayedMessage) {
      this.time.delayedCall(stageConfig.delayedMessage.delay || 2000, () => {
        this.addLog(stageConfig.delayedMessage.text);
      });
    }
  }

  // プレイヤーレベルを取得するメソッド
  async getPlayerLevel() {
    try {
      // Supabaseからプレイヤーレベルを取得
      const { supabase } = await import('../lib/supabase.js');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.warn('認証されていないため、デフォルトレベル1を使用');
        return 1;
      }
      
      // プロフィールからレベルを取得
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('level')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile) {
        console.warn('プロフィール取得エラー、デフォルトレベル1を使用:', profileError);
        return 1;
      }
      
      return profile.level || 1;
      
    } catch (error) {
      console.warn('プレイヤーレベル取得エラー:', error);
      return 1; // デフォルト値
    }
  }

  // Blocklyツールボックスの動的更新（一時的に無効化）
  updateBlocklyToolbox(availableBlocks) {
    if (!window.blocklyWorkspace) {
      console.warn('Blocklyワークスペースが利用できません');
      return;
    }

    // 動的ツールボックス更新は一時的に無効化
    // 代わりに、実行時にブロック制限をチェックする方式を使用
    console.log('利用可能ブロック:', availableBlocks);
    console.log('ツールボックス動的更新は無効化されています（実行時制限を使用）');
    
    // 利用可能ブロックをグローバルに保存（実行時チェック用）
    window.currentAvailableBlocks = availableBlocks;
  }

  // プレイヤーのコード実行時に呼ばれる統計更新関数
  updateBattleStats(blockCount) {
    this.battleStats.executionCount++;
    this.battleStats.blockCount = blockCount;
    console.log('バトル統計更新:', this.battleStats);
  }

  // ブロックの数を取得する関数（外部から呼び出し可能）
  getCurrentBlockCount() {
    // この関数は外部のBlocklyから呼び出される予定
    if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        const blocks = workspace.getAllBlocks();
        return blocks.length;
      }
    }
    return 0;
  }

  // 敵に麻痺効果を適用（グローバルメソッド）
  applyParalyzeEffect() {
    console.log('Applying paralyze effect to enemy (global)');
    console.log('Before paralysis application:', {
      isEnemyParalyzed: this.isEnemyParalyzed,
      paralyzeRemainingTurns: this.paralyzeRemainingTurns
    });
    
    // インスタンス変数とグローバル変数の両方に設定
    this.isEnemyParalyzed = true;
    this.paralyzeRemainingTurns = 3;
    
    // グローバル変数にも保存（バックアップとして）
    window.globalParalysisState = {
      isEnemyParalyzed: true,
      paralyzeRemainingTurns: 3,
      appliedAt: Date.now()
    };
    
    console.log('After paralysis application:', {
      isEnemyParalyzed: this.isEnemyParalyzed,
      paralyzeRemainingTurns: this.paralyzeRemainingTurns,
      global: window.globalParalysisState
    });
    
    // 麻痺状態のテキスト表示
    if (this.paralyzeStatusText) {
      this.paralyzeStatusText.destroy();
    }
    
    this.paralyzeStatusText = this.add.text(this.scale.width * 0.75, this.scale.height * 0.3, 
      `🔒 麻痺状態: あと${this.paralyzeRemainingTurns}ターン`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#9B59B6',
      backgroundColor: '#FFFFFF',
      padding: { x: 10, y: 5 }
    });
    
    this.addLog('🔮 麻痺魔法成功！敵が3ターン行動不能になりました！');
    console.log('Enemy paralyzed for', this.paralyzeRemainingTurns, 'turns');
    
    // 敵スプライトに麻痺エフェクト
    if (this.enemySprite) {
      this.tweens.add({
        targets: this.enemySprite,
        alpha: { from: 1, to: 0.3 },
        duration: 300,
        yoyo: true,
        repeat: 2
      });
    }

    // 少し後に状態を再確認
    setTimeout(() => {
      console.log('Paralysis state after 100ms:', {
        isEnemyParalyzed: this.isEnemyParalyzed,
        paralyzeRemainingTurns: this.paralyzeRemainingTurns
      });
    }, 100);
  }

  // 麻痺状態を1ターン減らす（グローバルメソッド）
  decreaseParalyzeEffect() {
    if (this.isEnemyParalyzed && this.paralyzeRemainingTurns > 0) {
      this.paralyzeRemainingTurns--;
      
      // グローバル状態も更新
      if (window.globalParalysisState) {
        window.globalParalysisState.paralyzeRemainingTurns = this.paralyzeRemainingTurns;
      }
      
      if (this.paralyzeRemainingTurns <= 0) {
        this.isEnemyParalyzed = false;
        
        // グローバル状態をクリア
        if (window.globalParalysisState) {
          window.globalParalysisState.isEnemyParalyzed = false;
        }
        
        if (this.paralyzeStatusText) {
          this.paralyzeStatusText.destroy();
          this.paralyzeStatusText = null;
        }
        this.addLog('🔓 敵の麻痺状態が解除されました');
      } else {
        if (this.paralyzeStatusText) {
          this.paralyzeStatusText.setText(`🔒 麻痺状態: あと${this.paralyzeRemainingTurns}ターン`);
        }
      }
    }
  }

  // 敵のターン処理（グローバル）
  async enemyTurn() {
    console.log('BattleScene.enemyTurn() called (global)');
    console.log('Scene instance info:', {
      sceneKey: this.scene?.key,
      constructor: this.constructor.name,
      instanceId: this.scene?.scene?.key
    });
    console.log('Paralysis state:', {
      isEnemyParalyzed: this.isEnemyParalyzed,
      paralyzeRemainingTurns: this.paralyzeRemainingTurns,
      globalState: window.globalParalysisState
    });
    
    // グローバル状態から復元（インスタンス状態が失われた場合）
    if (window.globalParalysisState && window.globalParalysisState.isEnemyParalyzed && 
        (!this.isEnemyParalyzed || this.paralyzeRemainingTurns === 0)) {
      console.log('Restoring paralysis state from global backup');
      this.isEnemyParalyzed = window.globalParalysisState.isEnemyParalyzed;
      this.paralyzeRemainingTurns = window.globalParalysisState.paralyzeRemainingTurns;
    }
    
    // 麻痺状態チェック
    if (this.isEnemyParalyzed && this.paralyzeRemainingTurns > 0) {
      this.addLog('⚡ 敵は麻痺状態で行動できません');
      this.decreaseParalyzeEffect();
      console.log('Enemy paralyzed, skipping turn');
      return; // 麻痺中は敵の行動を完全にスキップ
    }
    
    console.log('Enemy not paralyzed, executing normal turn');
    
    // ステージ11以降でenemyActionメソッドが存在する場合はそれを呼び出す
    if (typeof this.enemyAction === 'function') {
      console.log('Calling this.enemyAction() (stage 11+)');
      this.enemyAction();
    } else if (this.enemy && this.enemy.takeTurn) {
      // enemyActionが存在しない場合（ステージ1-10）はenemy.takeTurn()を呼び出す
      console.log('Calling enemy.takeTurn()');
      await this.enemy.takeTurn();
    } else {
      console.log('No enemy.takeTurn method available');
    }
  }

  // 閃光魔法効果を適用（グローバルメソッド）
  async applyFlashEffect() {
    console.log('Applying flash effect (global)');
    
    const damage = 25; // 回避不可の高威力ダメージ
    
    this.addLog('✨ 閃光魔法発動！回避不可の大ダメージ攻撃！');
    
    // 閃光エフェクト
    await this.playFlashAnimation();
    
    // ダメージ処理
    if (this.enemy) {
      this.enemy.hp -= damage;
      this.updateHP(this.player.hp, this.enemy.hp);
      
      this.addLog(`⚡ 敵に${damage}ダメージ！（回避不可）`);
      
      // 敵のHPが0になったかチェック
      if (this.enemy.hp <= 0) {
        this.addLog("敵を倒した！プレイヤーの勝利！");
        this.gameOver(true);
      }
    }
  }

  // 閃光魔法のアニメーション
  async playFlashAnimation() {
    // 画面全体を白くフラッシュ
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 0.9);
    flash.fillRect(0, 0, this.scale.width, this.scale.height);
    
    // 眩しい光のエフェクト
    const lightRays = [];
    for (let i = 0; i < 8; i++) {
      const ray = this.add.graphics();
      ray.lineStyle(4, 0xffffff, 0.8);
      
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;
      const angle = (i / 8) * Math.PI * 2;
      const length = 300;
      
      ray.lineBetween(
        centerX,
        centerY,
        centerX + Math.cos(angle) * length,
        centerY + Math.sin(angle) * length
      );
      
      lightRays.push(ray);
    }
    
    // カメラの激しいフラッシュ
    this.cameras.main.flash(200, 255, 255, 255, true);
    
    // 敵の強烈な点滅エフェクト
    if (this.enemySprite) {
      this.enemySprite.setTint(0xffffff);
      
      this.tweens.add({
        targets: this.enemySprite,
        alpha: { from: 1, to: 0.1 },
        duration: 100,
        yoyo: true,
        repeat: 3
      });
    }
    
    // エフェクトのフェードアウト
    setTimeout(() => {
      this.tweens.add({
        targets: [flash, ...lightRays],
        alpha: 0,
        duration: 300,
        onComplete: () => {
          flash.destroy();
          lightRays.forEach(ray => ray.destroy());
        }
      });
      
      if (this.enemySprite) {
        this.enemySprite.clearTint();
        this.enemySprite.alpha = 1;
      }
    }, 400);
    
    // アニメーション完了まで待機
    await new Promise(resolve => setTimeout(resolve, 700));
  }
  
  destroy() {
    // シーン完全破棄時の処理
    if (this.spellBook) {
      this.spellBook.hide();  // 魔法の書を非表示に
    }
  }

  // ====================================================================================
  // 関数実行イベントハンドラ（デフォルト実装）
  // ====================================================================================
  // これらのメソッドは、カスタム関数が実行される際にengine.jsから呼び出されます。
  // 個別のBattleSceneサブクラス（BattleScene13, BattleScene14など）でオーバーライドして
  // ステージ固有のロジック（コンボカウント、パラメータ処理など）を実装できます。
  
  /**
   * 関数実行開始時のイベントハンドラ
   * @param {string} name - 実行される関数名
   */
  onExecuteSavedFunctionStart(name) {
    console.log(`[BattleScene] Function "${name}" execution started (default handler)`);
    // デフォルトでは何もしない
    // サブクラスでオーバーライドしてステージ固有の処理を実装
  }

  /**
   * 関数実行終了時のイベントハンドラ
   * @param {string} name - 実行された関数名
   */
  onExecuteSavedFunctionEnd(name) {
    console.log(`[BattleScene] Function "${name}" execution ended (default handler)`);
    // デフォルトでは何もしない
    // サブクラスでオーバーライドしてステージ固有の処理を実装
  }

  /**
   * 関数実行中のアクション時のイベントハンドラ
   * @param {string} name - 実行中の関数名
   */
  onExecuteSavedFunctionAction(name) {
    console.log(`[BattleScene] Action performed within function "${name}" (default handler)`);
    // デフォルトでは何もしない
    // サブクラスでオーバーライドしてステージ固有の処理を実装
  }
}