// MapSelectionScene.js - マップ選択画面
export class MapSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapSelectionScene' });
    this.selectedStage = 1;
    this.unlockedStages = 20; // デモ用に20ステージ解放
    this.isZoomedIn = false; // ズーム状態を追跡
    this.originalCameraX = 0;
    this.originalCameraY = 0;
    this.originalZoom = 1;
    this.currentZoomBg = null;
    
    // 開発モードフラグ（本番では false に設定）
    this.isDevelopmentMode = true; // TODO: 本番リリース時は false に変更
    this.playerLevel = 1; // プレイヤーレベル（実際にはSupabaseから取得）
  }

  preload() {
    // マップ背景画像の読み込み
    this.load.image('map_bg', 'assets/map3.jpg');
  }

  async create() {
    console.log('MapSelectionScene initialized');
    
    // 実行ボタンを非表示にする
    this.hideRunButton();
    
    // プレイヤーレベルを取得してアンロック可能ステージを決定
    await this.loadPlayerProgress();
    
    // 背景設定
    this.createBackground();
    
    // タイトル
    this.createTitle();
    
    // ステージマップ
    this.createStageMap();
    
    // ステージ情報パネル（通常時は作成しない）
    // this.createStageInfoPanel();
    
    // 開発モード切り替え用キーボードショートカット
    this.setupDevelopmentModeToggle();
    
    console.log('MapSelectionScene setup complete');
  }

  async loadPlayerProgress() {
    try {
      // 開発モードの場合はすべてのステージをアンロック
      if (this.isDevelopmentMode) {
        console.log('🔧 開発モード: 全ステージアンロック');
        this.unlockedStages = 20;
        this.playerLevel = 20; // 開発用に最大レベル設定
        return;
      }
      
      // Supabaseからプレイヤー情報を取得
      const { supabase } = await import('../lib/supabase.js');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('level, xp')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('プレイヤー情報取得エラー:', error);
          this.playerLevel = 1;
        } else {
          this.playerLevel = profile?.level || 1;
          console.log(`📊 プレイヤーレベル: ${this.playerLevel}`);
        }
      } else {
        console.log('👤 ゲストユーザー: レベル1');
        this.playerLevel = 1;
      }
      
      // レベルに基づいてアンロック可能ステージを計算
      this.unlockedStages = this.calculateUnlockedStages(this.playerLevel);
      console.log(`🔓 アンロック済みステージ: ${this.unlockedStages}`);
      
    } catch (error) {
      console.error('プレイヤー進捗読み込みエラー:', error);
      this.playerLevel = 1;
      this.unlockedStages = 1;
    }
  }

  // 開発モード切り替え用のキーボードショートカット設定
  setupDevelopmentModeToggle() {
    // Ctrl+Shift+Dで開発モードを切り替え
    this.input.keyboard.on('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyD') {
        this.toggleDevelopmentMode();
      }
    });
    
    // 開発モード状態を画面に表示
    this.createDevelopmentModeIndicator();
  }

  // 開発モードの切り替え
  toggleDevelopmentMode() {
    this.isDevelopmentMode = !this.isDevelopmentMode;
    
    console.log(`🔧 開発モード: ${this.isDevelopmentMode ? 'ON' : 'OFF'}`);
    
    // インジケーターを更新
    this.updateDevelopmentModeIndicator();
    
    // プレイヤー進捗を再読み込み
    this.loadPlayerProgress().then(() => {
      // マップを再作成
      this.children.removeAll();
      this.createBackground();
      this.createTitle();
      this.createStageMap();
      this.setupDevelopmentModeToggle();
    });
  }

  // 開発モードインジケーターを作成
  createDevelopmentModeIndicator() {
    this.devModeText = this.add.text(10, 10, '', {
      fontSize: '16px',
      fill: '#ff6b6b',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setDepth(1000);
    
    this.updateDevelopmentModeIndicator();
  }

  // 開発モードインジケーターを更新
  updateDevelopmentModeIndicator() {
    if (this.devModeText) {
      if (this.isDevelopmentMode) {
        this.devModeText.setText('🔧 開発モード (Ctrl+Shift+D で切り替え)');
        this.devModeText.setVisible(true);
      } else {
        this.devModeText.setText('Ctrl+Shift+D: 開発モード');
        this.devModeText.setStyle({ fill: '#666666' });
        this.devModeText.setVisible(false);
      }
    }
  }

  calculateUnlockedStages(playerLevel) {
    // レベルに基づくステージアンロック条件
    const stageUnlockTable = {
      1: 1,   // レベル1: ステージ1のみ
      2: 2,   // レベル2: ステージ2まで
      3: 3,   // レベル3: ステージ3まで
      4: 4,   // レベル4: ステージ4まで
      5: 6,   // レベル5: ステージ6まで（ボーナス）
      6: 7,   // レベル6: ステージ7まで
      7: 8,   // レベル7: ステージ8まで
      8: 9,   // レベル8: ステージ9まで
      9: 10,  // レベル9: ステージ10まで
      10: 12, // レベル10: ステージ12まで（ボーナス）
      11: 13, // レベル11: ステージ13まで
      12: 14, // レベル12: ステージ14まで
      13: 15, // レベル13: ステージ15まで
      14: 16, // レベル14: ステージ16まで
      15: 18, // レベル15: ステージ18まで（ボーナス）
      16: 19, // レベル16: ステージ19まで
      17: 19, // レベル17: ステージ19まで
      18: 19, // レベル18: ステージ19まで
      19: 20, // レベル19: ステージ20まで
      20: 20  // レベル20: 全ステージ
    };
    
    // プレイヤーレベルに対応するアンロック可能ステージ数を返す
    // レベルが20を超える場合は20ステージすべてアンロック
    return stageUnlockTable[Math.min(playerLevel, 20)] || 1;
  }

  createBackground() {
    // 画面サイズを取得
    const { width, height } = this.scale;
    
    // map3.jpgを背景画像として設定（全画面対応）
    const mapBg = this.add.image(width/2, height/2, 'map_bg');
    mapBg.setDisplaySize(width, height);
    mapBg.setAlpha(1.0); // 背景画像を完全に表示
    
    // 背景画像の上にオーバーレイを追加（マップの見た目を向上）
    const overlay = this.add.rectangle(width/2, height/2, width, height, 0x0f1419, 0.15);
    
    // マップUIの装飾要素を追加
    this.createMapUIDecorations();
  }

  createMapUIDecorations() {
    // 画面サイズを取得
    const { width, height } = this.scale;
    
    // マップの境界線とフレーム（画面サイズに対応）
    const mapFrame = this.add.graphics();
    mapFrame.lineStyle(4, 0x8b4513, 0.8); // 茶色の枠線
    mapFrame.strokeRoundedRect(20, 20, width - 40, height - 40, 10);
    
    // 内側の装飾フレーム
    mapFrame.lineStyle(2, 0xd4af37, 0.6); // 金色の内枠
    mapFrame.strokeRoundedRect(30, 30, width - 60, height - 60, 8);
    
    // マップの角に装飾
    this.createCornerDecorations();
    
    // 古地図風のエフェクト
    this.createAncientMapEffects();
  }

  createCornerDecorations() {
    // 画面サイズを取得
    const { width, height } = this.scale;
    
    // 四隅に装飾的な要素を追加（画面サイズに対応）
    const cornerSize = 40;
    const corners = [
      { x: 40, y: 40 },                    // 左上
      { x: width - 40, y: 40 },            // 右上
      { x: 40, y: height - 40 },           // 左下
      { x: width - 40, y: height - 40 }    // 右下
    ];
    
    corners.forEach((corner, index) => {
      const decoration = this.add.graphics();
      decoration.fillStyle(0xd4af37, 0.7);
      
      // 装飾的な図形を描画
      if (index === 0 || index === 3) { // 左側
        decoration.fillTriangle(
          corner.x, corner.y - cornerSize/2,
          corner.x + cornerSize/2, corner.y,
          corner.x, corner.y + cornerSize/2
        );
      } else { // 右側
        decoration.fillTriangle(
          corner.x, corner.y - cornerSize/2,
          corner.x - cornerSize/2, corner.y,
          corner.x, corner.y + cornerSize/2
        );
      }
    });
  }

  createAncientMapEffects() {
    // 画面サイズを取得
    const { width, height } = this.scale;
    
    // 古地図風のテクスチャエフェクト（画面サイズに対応）
    for (let i = 0; i < 30; i++) {
      const spot = this.add.graphics();
      spot.fillStyle(0x8b4513, 0.1 + Math.random() * 0.2);
      const size = 10 + Math.random() * 30;
      spot.fillCircle(
        50 + Math.random() * (width - 100),
        50 + Math.random() * (height - 100),
        size
      );
    }
    
    // 地図の境界に影効果（画面サイズに対応）
    const shadow = this.add.graphics();
    shadow.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0, 0, 0.3);
    shadow.fillRect(0, 0, width, 50); // 上の影
    shadow.fillRect(0, height - 50, width, 50); // 下の影
    shadow.fillRect(0, 0, 50, height); // 左の影
    shadow.fillRect(width - 50, 0, 50, height); // 右の影
  }

  createTitle() {
    // 画面サイズを取得
    const { width } = this.scale;
    
    // タイトル背景（画面幅に対応）
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x000000, 0.6);
    titleBg.fillRoundedRect(width/2 - 200, 20, 400, 60, 10);
    titleBg.lineStyle(2, 0xd4af37, 0.8);
    titleBg.strokeRoundedRect(width/2 - 200, 20, 400, 60, 10);
    
    // メインタイトル
    this.add.text(width/2, 50, '🗺️ 冒険マップ', {
      fontSize: '36px',
      fontFamily: 'Arial Black, sans-serif',
      fill: '#ffd700',
      stroke: '#2c3e50',
      strokeThickness: 4,
      resolution: 2, // 解像度を2倍に設定
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 6,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // 戻るボタン
    const backButtonBg = this.add.graphics();
    backButtonBg.fillStyle(0x8b4513, 0.8);
    backButtonBg.fillRoundedRect(20, 20, 120, 40, 8);
    backButtonBg.lineStyle(2, 0xd4af37, 0.8);
    backButtonBg.strokeRoundedRect(20, 20, 120, 40, 8);
    
    const backButton = this.add.text(80, 40, '🏠 ホームへ', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      resolution: 2 // 解像度を2倍に設定
    }).setOrigin(0.5);

    backButton.setInteractive();
    backButton.on('pointerdown', () => {
      this.createTransitionEffect();
      this.time.delayedCall(300, () => {
        this.scene.start('HomeScene');
      });
    });

    // ホバーエフェクト
    backButton.on('pointerover', () => {
      backButton.setStyle({ fill: '#ffd700' });
      this.tweens.add({
        targets: backButtonBg,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    backButton.on('pointerout', () => {
      backButton.setStyle({ fill: '#ffffff' });
      this.tweens.add({
        targets: backButtonBg,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
    });
  }

  createTransitionEffect() {
    // 画面遷移エフェクト
    const transition = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0);
    this.tweens.add({
      targets: transition,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
  }

  createStageMap() {
    this.stageButtons = [];
    
    // 背景画像に合わせたステージの配置座標
    const stagePositions = this.generateMapBasedStagePositions();
    
    for (let i = 1; i <= 20; i++) {
      const pos = stagePositions[i - 1];
      const isUnlocked = i <= this.unlockedStages;
      
      this.createEnhancedStageButton(pos.x, pos.y, i, isUnlocked);
    }
  }

  generateMapBasedStagePositions() {
    // 画面サイズを取得
    const { width, height } = this.scale;
    
    // 固定位置の定義（画面サイズに対応した比率で配置）
    const fixedPositions = [
      // ステージ1-5（草原エリア）- 左下から始まる
      { x: width * 0.15, y: height * 0.8 },   // ステージ1 - スタート地点
      { x: width * 0.25, y: height * 0.75 },  // ステージ2
      { x: width * 0.35, y: height * 0.7 },   // ステージ3
      { x: width * 0.45, y: height * 0.65 },  // ステージ4
      { x: width * 0.55, y: height * 0.6 },   // ステージ5 - 草原終点
      
      // ステージ6-10（森林エリア）- 中央を通る
      { x: width * 0.65, y: height * 0.55 },  // ステージ6 - 森林入口
      { x: width * 0.7, y: height * 0.45 },   // ステージ7
      { x: width * 0.6, y: height * 0.4 },    // ステージ8
      { x: width * 0.5, y: height * 0.35 },   // ステージ9
      { x: width * 0.4, y: height * 0.3 },    // ステージ10 - 森林終点
      
      // ステージ11-15（山岳エリア）- 右上への道
      { x: width * 0.35, y: height * 0.25 },  // ステージ11 - 山麓
      { x: width * 0.45, y: height * 0.2 },   // ステージ12
      { x: width * 0.55, y: height * 0.15 },  // ステージ13
      { x: width * 0.65, y: height * 0.12 },  // ステージ14
      { x: width * 0.75, y: height * 0.1 },   // ステージ15 - 山頂
      
      // ステージ16-19（廃墟エリア）- 右側を下る
      { x: width * 0.85, y: height * 0.15 },  // ステージ16 - 古代遺跡
      { x: width * 0.9, y: height * 0.25 },   // ステージ17 - 呪われた廃墟
      { x: width * 0.85, y: height * 0.35 },  // ステージ18 - 闇の神殿
      { x: width * 0.8, y: height * 0.45 },   // ステージ19 - 魔王の塔
      
      // ステージ20（最終ボス）- 中央上部
      { x: width * 0.5, y: height * 0.05 }    // ステージ20 - コードの王座
    ];
    
    return fixedPositions;
  }

  createEnhancedStageButton(x, y, stageNum, isUnlocked) {
    const container = this.add.container(x, y);
    
    // ピンの設定
    const pinHeight = 50;
    const pinWidth = 30;
    
    // ピンの影
    const shadow = this.add.ellipse(2, pinHeight - 5, pinWidth * 0.8, 12, 0x000000, 0.3);
    container.add(shadow);
    
    // ピンの棒（ポール）
    const pole = this.add.rectangle(0, 15, 4, pinHeight - 20, isUnlocked ? 0x8b4513 : 0x666666);
    container.add(pole);
    
    // ピンの旗部分
    const flagColor = this.getStageAreaColor(stageNum);
    const flag = this.add.graphics();
    
    if (isUnlocked) {
      // アンロック状態の旗
      flag.fillStyle(flagColor, 0.9);
      flag.fillTriangle(-2, -15, 25, -10, -2, 5);
      
      // 旗の縁取り
      flag.lineStyle(2, 0xffd700, 0.8);
      flag.strokeTriangle(-2, -15, 25, -10, -2, 5);
      
      // 旗の装飾パターン
      flag.fillStyle(0xffffff, 0.3);
      flag.fillCircle(8, -5, 3);
      
    } else {
      // ロック状態の旗（灰色で破れた感じ）
      flag.fillStyle(0x666666, 0.6);
      flag.fillTriangle(-2, -15, 20, -12, -2, 2);
      
      // 破れた部分
      flag.lineStyle(1, 0x444444, 0.8);
      flag.strokeTriangle(-2, -15, 20, -12, -2, 2);
      
      // ロック状態のアイコン
      const lockIcon = this.add.text(8, -5, '🔒', {
        fontSize: '16px',
        alpha: 0.8
      }).setOrigin(0.5);
      container.add(lockIcon);
      
      // レベル不足の表示
      const requiredLevel = this.getRequiredLevelForStage(stageNum);
      if (requiredLevel > this.playerLevel) {
        const levelReqText = this.add.text(8, 25, `Lv.${requiredLevel}`, {
          fontSize: '10px',
          fontFamily: 'Arial Bold, sans-serif',
          fill: '#ff6b6b',
          stroke: '#000000',
          strokeThickness: 1,
          backgroundColor: '#000000',
          padding: { x: 3, y: 1 }
        }).setOrigin(0.5);
        container.add(levelReqText);
      }
    }
    
    container.add(flag);
    
    // アンロック状態のエフェクト
    if (isUnlocked) {
      // 輝きエフェクト
      const sparkles = this.add.graphics();
      sparkles.fillStyle(0xffd700, 0.8);
      sparkles.fillCircle(-5, -18, 2);
      sparkles.fillCircle(15, -8, 1.5);
      sparkles.fillCircle(20, -18, 1);
      container.add(sparkles);
      
      // 波打つエフェクト（同心円）
      const wave1 = this.add.graphics();
      wave1.lineStyle(2, 0xffd700, 0.6);
      wave1.strokeCircle(0, 0, 30);
      container.add(wave1);
      
      const wave2 = this.add.graphics();
      wave2.lineStyle(2, 0xffd700, 0.4);
      wave2.strokeCircle(0, 0, 40);
      container.add(wave2);
      
      const wave3 = this.add.graphics();
      wave3.lineStyle(2, 0xffd700, 0.2);
      wave3.strokeCircle(0, 0, 50);
      container.add(wave3);
      
      // 旗の揺れアニメーション
      this.tweens.add({
        targets: flag,
        scaleX: { from: 1, to: 1.1 },
        duration: 1500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // キラキラエフェクト
      this.tweens.add({
        targets: sparkles,
        alpha: { from: 0.8, to: 0.3 },
        rotation: Math.PI * 2,
        duration: 3000,
        repeat: -1,
        ease: 'Linear'
      });
      
      // 波のアニメーション（段階的に拡散）
      this.tweens.add({
        targets: wave1,
        scaleX: { from: 0.5, to: 1.2 },
        scaleY: { from: 0.5, to: 1.2 },
        alpha: { from: 0.6, to: 0 },
        duration: 2000,
        repeat: -1,
        ease: 'Power2'
      });
      
      this.tweens.add({
        targets: wave2,
        scaleX: { from: 0.3, to: 1.4 },
        scaleY: { from: 0.3, to: 1.4 },
        alpha: { from: 0.4, to: 0 },
        duration: 2500,
        delay: 500,
        repeat: -1,
        ease: 'Power2'
      });
      
      this.tweens.add({
        targets: wave3,
        scaleX: { from: 0.2, to: 1.6 },
        scaleY: { from: 0.2, to: 1.6 },
        alpha: { from: 0.2, to: 0 },
        duration: 3000,
        delay: 1000,
        repeat: -1,
        ease: 'Power2'
      });
    } else {
      // ロック状態のアイコン
      const lockIcon = this.add.text(8, -5, '🔒', {
        fontSize: '12px'
      }).setOrigin(0.5);
      container.add(lockIcon);
    }
    
    // 特別なステージの装飾
    if (stageNum === 5 || stageNum === 10 || stageNum === 15) {
      // ボーナスステージの星
      const star = this.add.text(-8, -25, '⭐', {
        fontSize: '16px'
      }).setOrigin(0.5);
      container.add(star);
    }
    
    // ボス戦ステージの特別な表示
    if (stageNum === 20) {
      const crownIcon = this.add.text(0, -35, '👑', {
        fontSize: '20px'
      }).setOrigin(0.5);
      container.add(crownIcon);
      
      // ボス戦用の特別なオーラ
      if (isUnlocked) {
        const bossAura = this.add.graphics();
        bossAura.lineStyle(3, 0x9400d3, 0.6);
        bossAura.strokeCircle(0, 0, 35);
        container.add(bossAura);
        
        this.tweens.add({
          targets: bossAura,
          rotation: Math.PI * 2,
          duration: 4000,
          repeat: -1,
          ease: 'Linear'
        });
      }
    }
    
    // インタラクティブ設定
    if (isUnlocked) {
      container.setSize(35, 55);
      container.setInteractive();
      
      container.on('pointerover', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1.15,
          scaleY: 1.15,
          duration: 200,
          ease: 'Back.easeOut'
        });
        
        // ホバー時のピン全体の輝き
        const hoverGlow = this.add.graphics();
        hoverGlow.fillStyle(0xffd700, 0.3);
        hoverGlow.fillCircle(0, 0, 40);
        container.add(hoverGlow);
        container.hoverGlow = hoverGlow;
        
        // ホバー時にはツールチップ的な表示のみ（通常のステージ情報パネルは使わない）
        this.showHoverTooltip(stageNum, x, y);
      });
      
      container.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Back.easeIn'
        });
        
        // ホバーグローを削除
        if (container.hoverGlow) {
          container.hoverGlow.destroy();
          container.hoverGlow = null;
        }
        
        // ホバーツールチップを削除
        this.hideHoverTooltip();
      });
      
      container.on('pointerdown', () => {
        // クリック時のピンズームエフェクト
        this.createPinZoomEffect(container, x, y, stageNum);
        
        // ステージを選択
        this.selectedStage = stageNum;
        this.selectStage(stageNum);
      });
    } else {
      // ロックされたステージのインタラクティブ設定
      container.setSize(35, 55);
      container.setInteractive();
      
      container.on('pointerover', () => {
        // ロック状態のホバーエフェクト
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          ease: 'Power2'
        });
        
        // ロック理由のツールチップ
        this.showLockTooltip(stageNum, x, y);
      });
      
      container.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2'
        });
        
        this.hideLockTooltip();
      });
      
      container.on('pointerdown', () => {
        // ロック状態のクリック時エフェクト
        this.createLockedStageEffect(container);
      });
    }
    
    this.stageButtons.push(container);
  }

  getStageAreaColor(stageNum) {
    if (stageNum <= 5) return 0x32cd32;      // 草原 - 明るい緑
    if (stageNum <= 10) return 0x8fbc8f;     // 森林 - 暗い海緑
    if (stageNum <= 15) return 0x4682b4;     // 山岳 - 鋼青
    if (stageNum <= 19) return 0xcd5c5c;     // 廃墟 - インディアンレッド
    return 0x8a2be2;                         // ボス - ブルーバイオレット
  }



  createBattleTransition() {
    // 戦闘遷移エフェクト
    const flash = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0xffffff, 0);
    this.tweens.add({
      targets: flash,
      alpha: 0.8,
      duration: 100,
      yoyo: true,
      repeat: 2,
      ease: 'Power2'
    });
    
    // 戦闘準備テキスト
    const battleText = this.add.text(this.scale.width / 2, this.scale.height / 2, '⚔️ 戦闘準備中...', {
      fontSize: '24px',
      fontFamily: 'Arial Black',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 3,
      alpha: 0
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: battleText,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
  }

  // ヘルパー関数
  getCompletedStages() {
    // デモ用: ランダムに5-10ステージクリア済みとする
    return Math.floor(5 + Math.random() * 6);
  }

  showHoverTooltip(stageNum, x, y) {
    // 既存のツールチップを削除
    this.hideHoverTooltip();
    
    const stageData = this.getStageData(stageNum);
    
    // ツールチップの背景
    this.hoverTooltipBg = this.add.graphics();
    this.hoverTooltipBg.fillStyle(0x000000, 0.9);
    this.hoverTooltipBg.lineStyle(2, 0xffd700, 0.8);
    
    // ツールチップの位置を計算（ピンの上に表示）
    const tooltipX = x - 120;
    const tooltipY = y - 80;
    const tooltipWidth = 240;
    const tooltipHeight = 60;
    
    this.hoverTooltipBg.fillRoundedRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    this.hoverTooltipBg.strokeRoundedRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    
    // ツールチップのテキスト
    this.hoverTooltipText = this.add.text(tooltipX + tooltipWidth/2, tooltipY + 20, stageData.name, {
      fontSize: '16px',
      fontFamily: 'Arial Bold',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    this.hoverTooltipSubText = this.add.text(tooltipX + tooltipWidth/2, tooltipY + 40, 'クリックでズーム', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // ツールチップをカメラに固定
    this.hoverTooltipBg.setScrollFactor(0);
    this.hoverTooltipText.setScrollFactor(0);
    this.hoverTooltipSubText.setScrollFactor(0);
    
    // フェードイン
    [this.hoverTooltipBg, this.hoverTooltipText, this.hoverTooltipSubText].forEach(element => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        duration: 200,
        ease: 'Power2'
      });
    });
  }

  hideHoverTooltip() {
    if (this.hoverTooltipBg) {
      this.hoverTooltipBg.destroy();
      this.hoverTooltipBg = null;
    }
    if (this.hoverTooltipText) {
      this.hoverTooltipText.destroy();
      this.hoverTooltipText = null;
    }
    if (this.hoverTooltipSubText) {
      this.hoverTooltipSubText.destroy();
      this.hoverTooltipSubText = null;
    }
  }

  createZoomedStageInfoPanel(stageNum) {
    // ズーム時のステージ情報パネル（ズーム視野内の右下に配置）
    const panelWidth = 160;
    const panelHeight = 100;
  
    // カメラの現在状態を取得
    const camera = this.cameras.main;
    const cameraX = camera.scrollX;
    const cameraY = camera.scrollY;
    const zoom = camera.zoom;
    
    // ズーム時の視野サイズを計算
    const viewWidth = camera.width / zoom;
    const viewHeight = camera.height / zoom;
    
    // パネルをズーム視野内の右下に配置
    const margin = -50;
    const panelX = cameraX + viewWidth - panelWidth - margin;
    const panelY = cameraY + viewHeight - panelHeight - margin + 10;
    
    // デバッグ用ログ
    console.log(`Creating panel at position: ${panelX}, ${panelY}`);
    console.log(`Camera: ${cameraX}, ${cameraY}, zoom: ${zoom}`);
    console.log(`View size: ${viewWidth}x${viewHeight}`);
    
    // パネル背景（赤枠と同じサイズに拡張）
    this.zoomedPanelBg = this.add.graphics();
    this.zoomedPanelBg.fillStyle(0x000000, 0.9);
    this.zoomedPanelBg.fillRoundedRect(panelX - 10, panelY - 10, panelWidth + 20, panelHeight + 20, 15);
    
    // 黄色の枠線（赤枠と同じサイズに拡張）
    this.zoomedPanelBg.lineStyle(3, 0xffd700, 0.9);
    this.zoomedPanelBg.strokeRoundedRect(panelX - 10, panelY - 10, panelWidth + 20, panelHeight + 20, 15);
    
    // テスト用: パネルの境界を赤で表示（より大きく、目立つように）
    this.zoomedPanelBg.lineStyle(5, 0xff0000, 1);
    this.zoomedPanelBg.strokeRoundedRect(panelX - 10, panelY - 10, panelWidth + 20, panelHeight + 20, 15);
    
    // さらに大きな緑の境界でテスト
    this.zoomedPanelBg.lineStyle(3, 0x00ff00, 1);
    this.zoomedPanelBg.strokeRoundedRect(panelX - 15, panelY - 15, panelWidth + 30, panelHeight + 30, 15);
    
    // 装飾的な内枠（赤枠に合わせてサイズ調整）
    this.zoomedPanelBg.lineStyle(1, 0x8b4513, 0.7);
    this.zoomedPanelBg.strokeRoundedRect(panelX - 10, panelY - 10, panelWidth + 20, panelHeight + 20, 10);
    
    // ステージデータを取得
    const stageData = this.getStageData(stageNum);
    
    // ステージナンバー（上部に大きく表示）
    this.zoomedStageNumberText = this.add.text(panelX + panelWidth/2, panelY + 5, `Stage ${stageNum}`, {
      fontSize: '14px',
      fontFamily: 'Arial Bold, sans-serif',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 2,
      resolution: 2 // 解像度を2倍に設定
    }).setOrigin(0.5);
    
    // ステージ名（ステージナンバーの下に配置）
    this.zoomedStageNameText = this.add.text(panelX + panelWidth/2, panelY + 18, stageData.name, {
      fontSize: '10px',
      fontFamily: 'Arial Bold, sans-serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
      resolution: 2 // 解像度を2倍に設定
    }).setOrigin(0.5);
    
  
    // ステージ詳細（小さなパネルに合わせて調整）
    this.zoomedStageDetailText = this.add.text(panelX + panelWidth/2, panelY + 35, stageData.description, {
      fontSize: '8px',
      fontFamily: 'Arial, sans-serif',
      fill: '#e8e8e8',
      stroke: '#000000',
      strokeThickness: 1,
      resolution: 2, // 解像度を2倍に設定
      wordWrap: { width: panelWidth - 8 },
      align: 'center'
    }).setOrigin(0.5);

    // 報酬情報の背景（小さく調整）
    const rewardBgX = panelX + 3;
    const rewardBgY = panelY + 55;
    const rewardBgWidth = panelWidth - 6;
    const rewardBgHeight = 12;
    this.zoomedPanelBg.fillStyle(0x8b4513, 0.7);
    this.zoomedPanelBg.fillRoundedRect(rewardBgX, rewardBgY, rewardBgWidth, rewardBgHeight, 2);
    
    // 報酬情報（小さなフォントに調整）
    this.zoomedRewardText = this.add.text(panelX + panelWidth/2, rewardBgY + 6, `💎 ${stageData.reward}`, {
      fontSize: '9px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 1,
      resolution: 2 // 解像度を2倍に設定
    }).setOrigin(0.5);

    // 開始ボタン（小さく調整）
    const startBtnX = panelX + 3;
    const startBtnY = panelY + 70;
    const startBtnWidth = panelWidth - 6;
    const startBtnHeight = 18;
    const startBtnCenterX = panelX + panelWidth/2;
    const startBtnCenterY = startBtnY + startBtnHeight/2;
    
    this.zoomedStartButtonBg = this.add.graphics();
    this.zoomedStartButtonBg.fillStyle(0xe74c3c, 0.9);
    this.zoomedStartButtonBg.fillRoundedRect(-startBtnWidth/2, -startBtnHeight/2, startBtnWidth, startBtnHeight, 2);
    this.zoomedStartButtonBg.lineStyle(1, 0xffd700, 0.8);
    this.zoomedStartButtonBg.strokeRoundedRect(-startBtnWidth/2, -startBtnHeight/2, startBtnWidth, startBtnHeight, 2);
    
    this.zoomedStartButton = this.add.text(0, 0, '⚔️ START', {
      fontSize: '12px',
      fontFamily: 'Arial Bold, sans-serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      resolution: 2 // 解像度を2倍に設定
    }).setOrigin(0.5);

    // ボタンコンテナ
    this.zoomedStartButtonContainer = this.add.container(startBtnCenterX, startBtnCenterY, [this.zoomedStartButtonBg, this.zoomedStartButton]);

    // インタラクティブエリア
    const zoomedHitArea = this.add.rectangle(startBtnCenterX, startBtnCenterY, startBtnWidth, startBtnHeight, 0x000000, 0);
    zoomedHitArea.setInteractive();
    
    // ボタンのインタラクティブ設定
    zoomedHitArea.on('pointerdown', () => {
      this.createBattleTransition();
      this.time.delayedCall(500, () => {
        this.startStage(stageNum);
      });
    });

    // ホバーエフェクト
    zoomedHitArea.on('pointerover', () => {
      if (this.zoomedStartButtonBg && this.zoomedStartButtonBg.clear) {
        this.zoomedStartButtonBg.clear();
        this.zoomedStartButtonBg.fillStyle(0xc0392b, 0.9);
        this.zoomedStartButtonBg.fillRoundedRect(-startBtnWidth/2, -startBtnHeight/2, startBtnWidth, startBtnHeight, 2);
        this.zoomedStartButtonBg.lineStyle(2, 0xffd700, 1);
        this.zoomedStartButtonBg.strokeRoundedRect(-startBtnWidth/2, -startBtnHeight/2, startBtnWidth, startBtnHeight, 2);
      }
      
      if (this.zoomedStartButtonContainer) {
        this.tweens.add({
          targets: this.zoomedStartButtonContainer,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          ease: 'Power2'
        });
      }
    });
    
    zoomedHitArea.on('pointerout', () => {
      if (this.zoomedStartButtonBg && this.zoomedStartButtonBg.clear) {
        this.zoomedStartButtonBg.clear();
        this.zoomedStartButtonBg.fillStyle(0xe74c3c, 0.9);
        this.zoomedStartButtonBg.fillRoundedRect(-startBtnWidth/2, -startBtnHeight/2, startBtnWidth, startBtnHeight, 2);
        this.zoomedStartButtonBg.lineStyle(1, 0xffd700, 0.8);
        this.zoomedStartButtonBg.strokeRoundedRect(-startBtnWidth/2, -startBtnHeight/2, startBtnWidth, startBtnHeight, 2);
      }
      
      if (this.zoomedStartButtonContainer) {
        this.tweens.add({
          targets: this.zoomedStartButtonContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2'
        });
      }
    });

    // ズームHitAreaの参照を保存
    this.zoomedStartButtonHitArea = zoomedHitArea;
    
    // パネル全体をワールド座標に配置（カメラと一緒に動く）
    // setScrollFactor(1)でカメラの動きに追従
    this.zoomedPanelBg.setScrollFactor(1);
    this.zoomedStageNameText.setScrollFactor(1);
    this.zoomedStageDetailText.setScrollFactor(1);
    this.zoomedRewardText.setScrollFactor(1);
    this.zoomedStartButtonContainer.setScrollFactor(1);
    this.zoomedStartButtonHitArea.setScrollFactor(1);
 
    
    console.log('Panel elements created and scroll factors set to 1 (world coordinates)');
      // パネルのフェードイン
    const panelElements = [
      this.zoomedPanelBg,
      this.zoomedStageNumberText,
      this.zoomedStageNameText, 
      this.zoomedStageDetailText, 
      this.zoomedRewardText,
      this.zoomedStartButtonContainer,
      this.zoomedStartButtonHitArea,
   
    ];
    
    panelElements.forEach(element => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        duration: 600,
        delay: 200,
        ease: 'Power2'
      });
    });
  }

  destroyZoomedStageInfoPanel() {
    // ズーム時のステージ情報パネルを削除
    console.log('Destroying zoomed stage info panel');
    
    // 全てのTweenを停止
    if (this.tweens) {
      this.tweens.killAll();
    }
    
    // 各オブジェクトを安全に破棄
    const objectsToDestroy = [
      'zoomedPanelBg',
      'zoomedStageNumberText',
      'zoomedStageNameText', 
      'zoomedStageDetailText',
      'zoomedRewardText',
      'zoomedStartButton',
      'zoomedStartButtonBg',
      'zoomedStartButtonContainer'
    ];
    
    objectsToDestroy.forEach(objName => {
      if (this[objName]) {
        try {
          // イベントリスナーを削除
          if (this[objName].removeAllListeners) {
            this[objName].removeAllListeners();
          }
          // オブジェクトを破棄
          this[objName].destroy();
          this[objName] = null;
        } catch (error) {
          console.warn(`Error destroying ${objName}:`, error);
          this[objName] = null;
        }
      }
    });
  }

  selectStage(stageNum) {
    this.selectedStage = stageNum;
    
    // 選択エフェクト
    const selectedEffect = this.add.graphics();
    selectedEffect.lineStyle(4, 0xffd700, 0.8);
    selectedEffect.strokeCircle(0, 0, 30);
    
    const stagePos = this.generateMapBasedStagePositions()[stageNum - 1];
    selectedEffect.x = stagePos.x;
    selectedEffect.y = stagePos.y;
    
    this.tweens.add({
      targets: selectedEffect,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => selectedEffect.destroy()
    });
  }

  getStageData(stageNum) {
    const stageTypes = {
      1: { name: '🌱 草原の始まり', description: 'プログラミングの基礎を学ぶ初心者向けステージ', reward: 'ゴールド×50, 経験値×100' },
      2: { name: '🌾 風の草原', description: '条件分岐の使い方をマスターしよう', reward: 'ゴールド×75, 経験値×150' },
      3: { name: '🦋 花畑の迷路', description: 'ループ処理で効率的な戦闘を', reward: 'ゴールド×100, 経験値×200' },
      4: { name: '🌸 桜の丘', description: '関数の基本を理解する', reward: 'ゴールド×125, 経験値×250' },
      5: { name: '🍃 緑陰の道', description: '変数を使いこなそう', reward: 'ゴールド×150, 経験値×300' },
      6: { name: '🌲 森の入口', description: '複雑な条件を組み合わせる', reward: 'ゴールド×200, 経験値×400' },
      7: { name: '🦌 野生の森', description: '配列データの活用', reward: 'ゴールド×250, 経験値×500' },
      8: { name: '🍄 キノコの森', description: 'ネストしたループの挑戦', reward: 'ゴールド×300, 経験値×600' },
      9: { name: '🌙 月光の森', description: '高度な関数を使いこなす', reward: 'ゴールド×400, 経験値×700' },
      10: { name: '🏔️ 森の奥', description: 'オブジェクト指向の導入', reward: 'ゴールド×500, 経験値×800' },
      11: { name: '⛰️ 山麓の村', description: 'アルゴリズムの最適化', reward: 'ゴールド×600, 経験値×1000' },
      12: { name: '🏔️ 雪山の試練', description: '再帰処理の理解', reward: 'ゴールド×750, 経験値×1200' },
      13: { name: '❄️ 氷の洞窟', description: 'データ構造の活用', reward: 'ゴールド×900, 経験値×1400' },
      14: { name: '🌨️ 吹雪の峠', description: '並列処理の基礎', reward: 'ゴールド×1100, 経験値×1600' },
      15: { name: '🗻 山頂の神殿', description: '最適化アルゴリズム', reward: 'ゴールド×1300, 経験値×1800' },
      16: { name: '🏛️ 古代遺跡', description: 'デザインパターンの応用', reward: 'ゴールド×1500, 経験値×2000' },
      17: { name: '💀 呪われた廃墟', description: 'エラーハンドリング', reward: 'ゴールド×1800, 経験値×2300' },
      18: { name: '🌑 闇の神殿', description: '高度なプログラミング技法', reward: 'ゴールド×2100, 経験値×2600' },
      19: { name: '⚡ 魔王の塔', description: '全技術の統合', reward: 'ゴールド×2500, 経験値×3000' },
      20: { name: '👑 コードの王座', description: '最終試練 - 真のプログラマーへ', reward: '伝説の装備, マスタープログラマー称号' }
    };

    return stageTypes[stageNum] || { 
      name: `ステージ ${stageNum}`, 
      description: '謎に満ちた冒険が待っている...', 
      reward: 'ゴールド×100, 経験値×200' 
    };
  }

  startStage(stageNumber) {
    console.log(`Starting stage ${stageNumber}`);
    console.log('About to start StoryScene with data:', { 
      stage: stageNumber, 
      isDevelopmentMode: this.isDevelopmentMode 
    });
    
    // ステージ開始時にツールボックスを更新（非同期で安全に）
    if (window.updateToolboxForStage) {
      setTimeout(() => {
        window.updateToolboxForStage(stageNumber);
        console.log(`🎯 MapSelectionScene: ステージ ${stageNumber} のツールボックス更新を実行`);
      }, 100);
    } else {
      console.warn('⚠️ MapSelectionScene: ツールボックス更新機能が利用できません');
    }
    
    // ストーリーシーンに遷移してから戦闘シーンへ
    this.scene.start('StoryScene', { 
      stage: stageNumber,
      isDevelopmentMode: this.isDevelopmentMode 
    });
    
    // デバッグ用: 少し後にStorySceneが実際に開始されたかチェック
    setTimeout(() => {
      const storyScene = this.scene.get('StoryScene');
      console.log('StoryScene status after 100ms:', storyScene ? 'Found' : 'Not found');
      if (storyScene) {
        console.log('StoryScene is running:', storyScene.scene.isActive());
      }
    }, 100);
  }

  createPinZoomEffect(container, x, y, stageNum) {
    // すでにズームインしている場合は元に戻す
    if (this.isZoomedIn) {
      this.returnToOriginalView();
      return;
    }
    
    // カメラの初期位置を保存
    this.originalCameraX = this.cameras.main.scrollX;
    this.originalCameraY = this.cameras.main.scrollY;
    this.originalZoom = this.cameras.main.zoom;
    
    // ズーム時の背景エフェクト
    this.currentZoomBg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0);
    this.tweens.add({
      targets: this.currentZoomBg,
      alpha: 0.6,
      duration: 500,
      ease: 'Power2'
    });
    
    // カメラをピンの位置にズーム
    this.cameras.main.pan(x, y, 800, 'Power2');
    this.cameras.main.zoomTo(2.5, 800);
    this.isZoomedIn = true;
    
    // ズーム時の特別なエフェクト（ピンの位置に）
    const zoomEffect = this.add.graphics();
    zoomEffect.lineStyle(5, 0xffd700, 1);
    zoomEffect.strokeCircle(x, y, 60);
    
    this.tweens.add({
      targets: zoomEffect,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => zoomEffect.destroy()
    });
    
    // ズーム時のパーティクルエフェクト
    for (let i = 0; i < 12; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0xffd700, 0.8);
      particle.fillCircle(0, 0, 4);
      particle.x = x;
      particle.y = y;
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = 150;
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 800,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
    
    // ピンを少し光らせる
    this.tweens.add({
      targets: container,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 400,
      ease: 'Power2',
      yoyo: true
    });
    
    // ズーム完了後にステージ情報パネルを表示
    this.time.delayedCall(800, () => {
      console.log('About to create zoomed stage info panel for stage', stageNum);
      this.createZoomedStageInfoPanel(stageNum);
    });
  }

  returnToOriginalView() {
    // ズーム時のステージ情報パネルを削除
    this.destroyZoomedStageInfoPanel();
    
    // 元の視点に戻す
    this.cameras.main.pan(this.originalCameraX + this.scale.width / 2, this.originalCameraY + this.scale.height / 2, 600, 'Power2');
    this.cameras.main.zoomTo(this.originalZoom, 600);
    
    if (this.currentZoomBg) {
      this.tweens.add({
        targets: this.currentZoomBg,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => {
          this.currentZoomBg.destroy();
          this.currentZoomBg = null;
        }
      });
    }
    
    this.isZoomedIn = false;
  }

  isStageCompleted(stageNum) {
    // デモ用: ランダムに一部のステージをクリア済みとする
    return Math.random() < 0.3;
  }

  getRequiredLevelForStage(stageNum) {
    // ステージに必要なレベルを逆算する
    const levelRequirements = {
      1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 5,
      7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 10,
      13: 11, 14: 12, 15: 13, 16: 14, 17: 15, 18: 15,
      19: 16, 20: 19
    };
    return levelRequirements[stageNum] || stageNum;
  }

  showLockTooltip(stageNum, x, y) {
    this.hideLockTooltip();
    
    const requiredLevel = this.getRequiredLevelForStage(stageNum);
    const stageData = this.getStageData(stageNum);
    
    // ロック用ツールチップの背景
    this.lockTooltipBg = this.add.graphics();
    this.lockTooltipBg.fillStyle(0x2c3e50, 0.95);
    this.lockTooltipBg.lineStyle(2, 0xff6b6b, 0.8);
    
    const tooltipX = x - 120;
    const tooltipY = y - 100;
    const tooltipWidth = 240;
    const tooltipHeight = 80;
    
    this.lockTooltipBg.fillRoundedRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    this.lockTooltipBg.strokeRoundedRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    
    // ロック理由テキスト
    this.lockTooltipTitle = this.add.text(tooltipX + tooltipWidth/2, tooltipY + 20, '🔒 ' + stageData.name, {
      fontSize: '14px',
      fontFamily: 'Arial Bold',
      fill: '#ff6b6b',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    this.lockTooltipText = this.add.text(tooltipX + tooltipWidth/2, tooltipY + 40, `レベル ${requiredLevel} が必要です`, {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    this.lockTooltipSubText = this.add.text(tooltipX + tooltipWidth/2, tooltipY + 60, `現在: Lv.${this.playerLevel}`, {
      fontSize: '11px',
      fontFamily: 'Arial',
      fill: '#bdc3c7',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // ツールチップをカメラに固定
    [this.lockTooltipBg, this.lockTooltipTitle, this.lockTooltipText, this.lockTooltipSubText].forEach(element => {
      element.setScrollFactor(0);
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        duration: 200,
        ease: 'Power2'
      });
    });
  }

  hideLockTooltip() {
    [this.lockTooltipBg, this.lockTooltipTitle, this.lockTooltipText, this.lockTooltipSubText].forEach(element => {
      if (element) {
        element.destroy();
      }
    });
    this.lockTooltipBg = null;
    this.lockTooltipTitle = null;
    this.lockTooltipText = null;
    this.lockTooltipSubText = null;
  }

  createLockedStageEffect(container) {
    // ロック状態のクリック時エフェクト
    const shakeAnimation = this.tweens.add({
      targets: container,
      x: container.x + 5,
      duration: 100,
      yoyo: true,
      repeat: 3,
      ease: 'Power2'
    });
    
    // 警告エフェクト
    const warningFlash = this.add.graphics();
    warningFlash.fillStyle(0xff0000, 0.3);
    warningFlash.fillCircle(container.x, container.y, 50);
    
    this.tweens.add({
      targets: warningFlash,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 600,
      ease: 'Power2',
      onComplete: () => warningFlash.destroy()
    });
  }

  // 実行ボタンを非表示にするヘルパーメソッド
  hideRunButton() {
    const runButton = document.getElementById('runButton');
    if (runButton) {
      runButton.style.display = 'none';
    }
  }
}
