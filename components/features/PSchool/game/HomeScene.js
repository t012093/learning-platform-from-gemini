// HomeScene.js - ホーム画面
import { supabase } from '../lib/supabase.js';

export class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScene' });
    this.gameTitle = 'The Legacy of Technology';
    this.playerData = {
      username: 'プレイヤー',
      level: 1,
      xp: 0,
      gold: 100,
      trophies: [],
      currentStage: 1
    };
  }

  init(data) {
    // 認証シーンからのデータを受け取る
    if (data && data.playerData) {
      this.playerData = {
        ...this.playerData, // デフォルト値を保持
        ...data.playerData, // 認証データで上書き
        userId: data.playerData.userId,
        email: data.playerData.email,
        username: data.playerData.username || 'プレイヤー',
        isGuest: data.playerData.isGuest || false
      };
      console.log('ユーザーデータを受信:', this.playerData);
    }
  }

  preload() {
    // 背景画像やアセットの読み込み
    // Note: Public folder assets are served from root
    this.load.image('home_bg', '/p_school/assets/home-background.jpg');
    
    // UIエフェクト用の基本図形
    this.load.image('button_bg', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    console.log('HomeScene initialized');
    
    // 実行ボタンを非表示にする
    this.hideRunButton();
    
    // 背景設定
    this.createBackground();
    
    // タイトル表示
    this.createTitle();
    
    // プレイヤー情報表示
    this.createPlayerInfo();
    
    // メインメニューボタン
    this.createMainMenu();
    
    // サイドメニュー
    this.createSideMenu();
    
    // エフェクト
    this.createVisualEffects();
    
    // データ初期化
    this.initializePlayerData();
    
    console.log('HomeScene setup complete');
  }
  createBackground() {
    // グラデーション背景
    this.createGradientBackground();
    
    // 背景画像（存在する場合）
    if (this.textures.exists('home_bg')) {
      const bgImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'home_bg');
      bgImage.setDisplaySize(this.scale.width, this.scale.height);
      bgImage.setAlpha(0.8);
    }
    
    // 動的背景要素
    this.createDynamicBackground();
    
    // 装飾的な要素
    this.createDecorations();
  }
  createGradientBackground() {
    // 美しいグラデーション背景を作成（Phaserのグラデーション機能を使用）
    const graphics = this.add.graphics();
    
    // Phaserのグラデーション機能を使って縦のグラデーションを作成
    graphics.fillGradientStyle(
      0x0f0f23,  // 深い紫（上）
      0x0f0f23,  // 深い紫（上右）
      0x0f3460,  // 深い青（下右）
      0x0f3460,  // 深い青（下左）
      0.3       // アルファ値を下げて背景画像を目立たせる
    );
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);
    
    // 中間色のレイヤーを追加してより滑らかなグラデーションを作成
    const midLayer = this.add.graphics();
    midLayer.fillGradientStyle(
      0x1a1a2e,  // 濃い青紫（上）
      0x1a1a2e,  // 濃い青紫（上右）
      0x16213e,  // 青（下右）
      0x16213e,  // 青（下左）
      0.2        // アルファ値をさらに下げる
    );
    midLayer.fillRect(0, this.scale.height * 0.25, this.scale.width, this.scale.height * 0.5);
  }
  createDynamicBackground() {
    // 動く雲のような背景要素
    this.createFloatingClouds();
    
    // 回転する幾何学模様
    this.createRotatingPatterns();
    
    // 光の粒子
    this.createLightParticles();
    
    // スマホゲーム風の追加エフェクト
    this.createStarField();
    this.createFloatingIcons();
    this.createEnergyOrbs();
  }

  createFloatingClouds() {
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0x4a90e2, 0.05); // 不透明度を大幅に下げる
      
      // 雲の形を作成
      cloud.fillEllipse(0, 0, 150 + Math.random() * 100, 80 + Math.random() * 50);
      cloud.fillEllipse(30, 0, 120 + Math.random() * 80, 60 + Math.random() * 40);
      cloud.fillEllipse(-30, 0, 100 + Math.random() * 60, 50 + Math.random() * 30);
      
      cloud.x = Math.random() * this.scale.width;
      cloud.y = Math.random() * this.scale.height;
      
      // ゆっくりと移動するアニメーション
      this.tweens.add({
        targets: cloud,
        x: cloud.x + this.scale.width * 0.25,
        duration: 20000 + Math.random() * 10000,
        repeat: -1,
        ease: 'Linear'
      });
      
      // 上下の浮遊アニメーション
      this.tweens.add({
        targets: cloud,
        y: cloud.y + 20,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createRotatingPatterns() {
    // 背景の回転する装飾パターン
    const pattern = this.add.graphics();
    pattern.lineStyle(2, 0x4a90e2, 0.1); // 不透明度を下げる
    
    // 六角形パターン
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const x = Math.cos(angle) * 100;
      const y = Math.sin(angle) * 100;
      
      if (i === 0) {
        pattern.moveTo(x, y);
      } else {
        pattern.lineTo(x, y);
      }
    }
    pattern.closePath();
    pattern.strokePath();
    
    pattern.x = this.scale.width * 0.88;
    pattern.y = this.scale.height * 0.17;
    pattern.setAlpha(0.1); // 全体のアルファも下げる
    
    // 回転アニメーション
    this.tweens.add({
      targets: pattern,
      rotation: Math.PI * 2,
      duration: 20000,
      repeat: -1,
      ease: 'Linear'
    });
  }

  createLightParticles() {
    // 光の粒子エフェクト
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const particle = this.add.graphics();
        particle.fillStyle(0xffffff, 0.3); // 不透明度を大幅に下げる
        particle.fillCircle(0, 0, 1 + Math.random() * 2);
        
        particle.x = Math.random() * this.scale.width;
        particle.y = this.scale.height + Math.random() * 100;
        
        // 上昇と消失
        this.tweens.add({
          targets: particle,
          y: -100,
          alpha: 0,
          duration: 8000 + Math.random() * 4000,
          ease: 'Power2',
          onComplete: () => particle.destroy()
        });
          // 左右の揺れ
        this.tweens.add({
          targets: particle,
          x: particle.x + (Math.random() - 0.5) * 100,
          duration: 4000 + Math.random() * 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      },
      loop: true
    });
  }

  createStarField() {
    // 背景の星々
    for (let i = 0; i < 30; i++) {
      const star = this.add.graphics();
      const starSize = 0.5 + Math.random() * 1.5;
      const brightness = 0.1 + Math.random() * 0.2; // 星の輝度を大幅に下げる
      
      star.fillStyle(0xffffff, brightness);
      star.fillCircle(0, 0, starSize);
      
      star.x = Math.random() * 800;
      star.y = Math.random() * 600;
      
      // 星の点滅
      this.tweens.add({
        targets: star,
        alpha: { from: brightness, to: 0.05 }, // 最低輝度も下げる
        duration: 2000 + Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // ゆっくりと横移動
      this.tweens.add({
        targets: star,
        x: star.x + 50,
        duration: 30000 + Math.random() * 20000,
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  createFloatingIcons() {
    // フローティングアイコン（コード要素）
    const codeIcons = ['⚡', '🔮', '⚔️', '🛡️', '💎', '🌟', '🔥', '❄️'];
    
    for (let i = 0; i < 8; i++) {
      const icon = this.add.text(
        Math.random() * 800,
        Math.random() * 600,
        codeIcons[i],
        {
          fontSize: '20px',
          fill: '#00ff88',
          alpha: 0.15 // 初期アルファを下げる
        }
      );
      
      // 浮遊アニメーション
      this.tweens.add({
        targets: icon,
        y: icon.y - 30,
        duration: 4000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // 回転
      this.tweens.add({
        targets: icon,
        rotation: Math.PI * 2,
        duration: 8000 + Math.random() * 4000,
        repeat: -1,
        ease: 'Linear'
      });
      
      // フェードイン・アウト
      this.tweens.add({
        targets: icon,
        alpha: { from: 0.15, to: 0.05 }, // アルファ範囲を下げる
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createEnergyOrbs() {
    // エネルギーオーブ
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        const orb = this.add.graphics();
        const orbSize = 5 + Math.random() * 10;
        const orbColor = [0x00ff88, 0xff6b6b, 0x4ecdc4, 0xffd93d][Math.floor(Math.random() * 4)];
        
        orb.fillStyle(orbColor, 0.2); // オーブの不透明度を下げる
        orb.fillCircle(0, 0, orbSize);
        
        // グローエフェクト
        const glow = this.add.graphics();
        glow.fillStyle(orbColor, 0.05); // グローの不透明度を大幅に下げる
        glow.fillCircle(0, 0, orbSize * 2);
        
        const container = this.add.container(
          -50 + Math.random() * 900,
          -50 + Math.random() * 700,
          [glow, orb]
        );
        
        // 曲線移動
        const curve = new Phaser.Curves.Spline([
          container.x,
          container.y,
          container.x + (Math.random() - 0.5) * 400,
          container.y + (Math.random() - 0.5) * 300,
          container.x + (Math.random() - 0.5) * 600,
          container.y + (Math.random() - 0.5) * 400
        ]);
        
        this.tweens.add({
          targets: container,
          duration: 8000 + Math.random() * 4000,
          ease: 'Sine.easeInOut',
          motionPath: {
            path: curve,
            autoRotate: true
          },
          alpha: { from: 0.3, to: 0 }, // 初期アルファを下げる
          onComplete: () => container.destroy()
        });
      },
      loop: true
    });
  }

  createGridPattern() {
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x16213e, 0.5);
    
    // 縦線
    for (let x = 0; x <= 800; x += 50) {
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, 600);
    }
    
    // 横線
    for (let y = 0; y <= 600; y += 50) {
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(800, y);
    }
    
    gridGraphics.strokePath();
  }

  createDecorations() {
    // 装飾的なコードブロック
    const codeElements = ['{ }', 'if', 'for', 'while', 'function', '=', '++', '--'];
    
    for (let i = 0; i < 12; i++) {
      const element = codeElements[Math.floor(Math.random() * codeElements.length)];
      const x = 50 + Math.random() * 700;
      const y = 50 + Math.random() * 500;
      
      const codeText = this.add.text(x, y, element, {
        fontSize: '16px',
        fontFamily: 'monospace',
        fill: '#0f3460',
        alpha: 0.3
      });
      
      // 浮遊アニメーション
      this.tweens.add({
        targets: codeText,
        y: y - 20,
        alpha: { from: 0.3, to: 0.1 },
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createTitle() {
    // メインタイトル
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.15, this.gameTitle, {
      fontSize: '56px',
      fontFamily: 'Arial Black, sans-serif',
      fill: '#e94560',
      stroke: '#0f3460',
      strokeThickness: 4,
      resolution: 2, // 解像度を2倍に設定
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 7,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // サブタイトル
    this.subtitleText = this.add.text(this.scale.width / 2, this.scale.height * 0.25, '失われたテクノロジーの謎', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#f5f5f5',
      stroke: '#0f3460',
      strokeThickness: 2
    }).setOrigin(0.5);

    // タイトルのアニメーション
    this.tweens.add({
      targets: this.titleText,
      scaleX: { from: 1, to: 1.05 },
      scaleY: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  async createPlayerInfo() {
    // プレイヤー情報パネル（画面サイズに応じて調整）
    const panelX = this.scale.width * 0.15;
    const panelY = this.scale.height * 0.33;
    const panelWidth = Math.min(220, this.scale.width * 0.25);
    const panelHeight = Math.min(140, this.scale.height * 0.2);
    const infoPanel = this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x0f3460, 0.8);
    infoPanel.setStrokeStyle(2, 0xe94560);

    // フォントサイズを画面サイズに応じて調整
    const baseFontSize = Math.min(16, this.scale.width * 0.02);
    const titleFontSize = Math.max(baseFontSize * 1.25, 18);
    const normalFontSize = Math.max(baseFontSize, 14);
    const smallFontSize = Math.max(baseFontSize * 0.8, 12);

    // プレイヤー名（パネル内に収まるように調整）
    this.playerNameText = this.add.text(panelX, panelY - panelHeight * 0.35, this.playerData.username, {
      fontSize: `${titleFontSize}px`,
      fontFamily: 'Arial',
      fill: '#f5f5f5',
      stroke: '#000000',
      strokeThickness: 1,
      wordWrap: { width: panelWidth - 20 }
    }).setOrigin(0.5);

    // 経験値データをSupabaseから取得
    await this.loadPlayerExperience();

    // レベル情報
    this.levelText = this.add.text(panelX, panelY - panelHeight * 0.1, `レベル ${this.playerData.level}`, {
      fontSize: `${normalFontSize}px`,
      fontFamily: 'Arial',
      fill: '#00ff88',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // 経験値バー
    this.createXPBar(panelX, panelY, panelWidth, panelHeight, smallFontSize);

    // 通貨情報（パネル下部に配置）
    this.goldText = this.add.text(panelX, panelY + panelHeight * 0.35, `ゴールド: ${this.playerData.gold}`, {
      fontSize: `${smallFontSize}px`,
      fontFamily: 'Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // デバッグ用のデータベース状態確認ボタン
    if (!this.playerData.isGuest && this.playerData.userId) {
      const dbCheckButton = this.add.text(panelX, panelY + panelHeight * 0.55, 'DB状態確認', {
        fontSize: `${smallFontSize}px`,
        fontFamily: 'Arial',
        fill: '#ff6b6b',
        backgroundColor: '#333333',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      dbCheckButton.on('pointerdown', async () => {
        await this.checkDatabaseStatus();
      });

      dbCheckButton.on('pointerover', () => {
        dbCheckButton.setStyle({ fill: '#ffffff' });
      });

      dbCheckButton.on('pointerout', () => {
        dbCheckButton.setStyle({ fill: '#ff6b6b' });
      });
    }
  }

  async checkDatabaseStatus() {
    try {
      console.log('=== ホーム画面からデータベース状態確認 ===');
      const { checkDatabaseSetup } = await import('../supabase/databaseCheck.js');
      const result = await checkDatabaseSetup();
      
      if (result.success) {
        console.log('データベース状態: 正常');
        console.log('プロフィール:', result.profile);
        alert(`データベース状態: 正常\nレベル: ${result.profile.level || 'N/A'}\n経験値: ${result.profile.xp || 'N/A'}`);
      } else {
        console.error('データベース状態: エラー');
        console.error(result);
        alert(`データベースエラー:\n${result.error}\n\n詳細をコンソールで確認してください。`);
      }
    } catch (error) {
      console.error('データベース確認中にエラー:', error);
      alert(`データベース確認エラー:\n${error.message}`);
    }
  }

  async loadPlayerExperience() {
    try {
      // 経験値システムからプレイヤー情報を取得
      const { getPlayerStats } = await import('../supabase/experienceSystem.js');
      
      if (this.playerData.userId && !this.playerData.isGuest) {
        const statsResult = await getPlayerStats(this.playerData.userId);
        
        if (statsResult.success) {
          // プレイヤーデータを更新
          this.playerData.level = statsResult.level;
          this.playerData.xp = statsResult.currentExp;
          this.playerData.totalExp = statsResult.experience;
          this.playerData.expNeeded = statsResult.expNeeded;
          
          console.log('プレイヤー経験値情報を取得:', statsResult);
        } else {
          console.warn('経験値情報の取得に失敗:', statsResult.error);
        }
      } else {
        console.log('ゲストユーザーまたは認証されていないユーザー');
      }
    } catch (error) {
      console.error('経験値情報取得エラー:', error);
    }
  }

  createXPBar(panelX, panelY, panelWidth, panelHeight, fontSize) {
    const barWidth = Math.min(150, panelWidth - 30);
    const barHeight = Math.min(10, panelHeight * 0.08);
    
    // 現在のレベルでの経験値進捗を計算
    const currentLevelExp = this.playerData.xp || 0;
    const expNeeded = this.playerData.expNeeded || 100;
    const xpProgress = Math.min(currentLevelExp / expNeeded, 1);

    // XPバーの背景
    const xpBarBg = this.add.rectangle(panelX, panelY + panelHeight * 0.1, barWidth, barHeight, 0x333333);
    xpBarBg.setStrokeStyle(1, 0x666666);
    
    // XPバーの進捗
    const xpBarFill = this.add.rectangle(
      panelX - (barWidth / 2) + (barWidth * xpProgress / 2),
      panelY + panelHeight * 0.1,
      barWidth * xpProgress,
      barHeight,
      0x00ff88
    );

    // XPテキスト
    this.xpText = this.add.text(panelX, panelY + panelHeight * 0.25, `${currentLevelExp}/${expNeeded} XP`, {
      fontSize: `${fontSize}px`,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
  }
  createAdventureButton() {
    // 中央の大きな冒険ボタン
    const buttonWidth = 320;
    const buttonHeight = 60;
    const x = this.scale.width / 2;
    const y = this.scale.height * 0.53;

    // ボタンの背景（シンプルなグラデーション）
    const buttonBg = this.add.graphics();
    buttonBg.fillGradientStyle(0x4a90e2, 0x4a90e2, 0x357abd, 0x357abd);
    buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
    buttonBg.lineStyle(2, 0xffffff, 0.8);
    buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);

    // ボタンのテキスト
    const buttonText = this.add.text(0, -3, '🗺️ 冒険を続ける', {
      fontSize: '24px',
      fontFamily: 'Arial Bold, sans-serif',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 2,
      resolution: 2
    }).setOrigin(0.5);

    // サブテキスト
    const subText = this.add.text(0, 18, 'マップを開いてステージを選択', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fill: '#e8f4f8',
      stroke: '#2c3e50',
      strokeThickness: 1,
      alpha: 0.9,
      resolution: 2
    }).setOrigin(0.5);

    // ボタンコンテナ
    const adventureContainer = this.add.container(x, y, [buttonBg, buttonText, subText]);

    // インタラクティブエリア
    const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0);
    hitArea.setInteractive();

    // ホバーエフェクト（控えめ）
    hitArea.on('pointerover', () => {
      this.tweens.add({
        targets: adventureContainer,
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 200,
        ease: 'Power2'
      });

      // 色を少し明るく
      buttonBg.clear();
      buttonBg.fillGradientStyle(0x5ba0f2, 0x5ba0f2, 0x4a90e2, 0x4a90e2);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
      buttonBg.lineStyle(2, 0xffffff, 1);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
    });

    hitArea.on('pointerout', () => {
      this.tweens.add({
        targets: adventureContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });

      // 元の色に戻す
      buttonBg.clear();
      buttonBg.fillGradientStyle(0x4a90e2, 0x4a90e2, 0x357abd, 0x357abd);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
      buttonBg.lineStyle(2, 0xffffff, 0.8);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
    });

    // クリックイベント
    hitArea.on('pointerdown', () => {
      // 軽いクリックエフェクト
      this.tweens.add({
        targets: adventureContainer,
        scaleX: 0.97,
        scaleY: 0.97,
        duration: 80,
        yoyo: true,
        ease: 'Power2',
        onComplete: () => {
          // マップ選択画面へ遷移
          this.time.delayedCall(100, () => this.goToMapSelection());
        }
      });
    });

    // ボタンの登場アニメーション
    adventureContainer.setAlpha(0);
    adventureContainer.setScale(0.9);
    this.tweens.add({
      targets: adventureContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      delay: 300,
      ease: 'Back.easeOut'
    });
  }
  createMainMenu() {
    // 中央の大きな冒険ボタンを先に作成
    this.createAdventureButton();
    
    const buttonData = [
      { 
        text: '📚 コマンド図鑑', 
        y: this.scale.height * 0.65, 
        action: () => this.goToLibrary(),
        color: 0x3498db,
        description: 'ブロックの使い方を学ぶ'
      },
      { 
        text: '🏪 ショップ', 
        y: this.scale.height * 0.75, 
        action: () => this.goToShop(),
        color: 0x27ae60,
        description: 'アイテムを購入'
      },
      { 
        text: '⚙️ 設定', 
        y: this.scale.height * 0.85, 
        action: () => this.goToSettings(),
        color: 0x95a5a6,
        description: 'ゲーム設定'
      }
    ];

    this.menuButtons = [];

    buttonData.forEach((button, index) => {
      const menuButton = this.createMenuButton(
        this.scale.width / 2, 
        button.y, 
        button.text, 
        button.action,
        button.color,
        button.description
      );
      this.menuButtons.push(menuButton);

      // ボタンの登場アニメーション
      menuButton.setAlpha(0);
      menuButton.setY(button.y + 20);
      this.tweens.add({
        targets: menuButton,
        alpha: 1,
        y: button.y,
        duration: 400,
        delay: index * 80,
        ease: 'Power2'
      });
    });
  }

  createMenuButton(x, y, text, action, color = '#3498db', description = '') {
    const buttonWidth = 260;
    const buttonHeight = 40;

    // ボタンの背景（シンプルな角丸）
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(color, 0.9);
    buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
    buttonBg.lineStyle(1, 0xffffff, 0.6);
    buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);

    // ボタンのテキスト
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 1,
      resolution: 2
    }).setOrigin(0.5);

    // ボタンコンテナ
    const buttonContainer = this.add.container(x, y, [buttonBg, buttonText]);

    // インタラクティブ設定
    const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0);
    hitArea.setInteractive();

    // ホバーエフェクト（控えめ）
    hitArea.on('pointerover', () => {
      // 色を少し明るく
      const lighterColor = this.adjustColor(color, 0.2);
      buttonBg.clear();
      buttonBg.fillStyle(lighterColor, 0.9);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
      buttonBg.lineStyle(2, 0xffffff, 0.8);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
      
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 150,
        ease: 'Power2'
      });

      // 説明テキスト表示
      if (description) {
        this.showButtonDescription(description, x, y + 30);
      }
    });

    hitArea.on('pointerout', () => {
      // 元の色に戻す
      buttonBg.clear();
      buttonBg.fillStyle(color, 0.9);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
      buttonBg.lineStyle(1, 0xffffff, 0.6);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
      
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });

      // 説明テキスト非表示
      this.hideButtonDescription();
    });

    // クリックイベント
    hitArea.on('pointerdown', () => {
      // 軽いクリックエフェクト
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.98,
        scaleY: 0.98,
        duration: 80,
        yoyo: true,
        ease: 'Power2'
      });
      
      // ボタンアクション実行
      if (action) {
        this.time.delayedCall(100, action);
      }
    });

    return buttonContainer;
  }

  createSideMenu() {
    // 右側のクイックメニュー
    const sideMenuData = [
      { 
        text: '📊 ステータス', 
        y: this.scale.height * 0.33, 
        action: () => this.showStatusWindow(),
        size: 'small'
      },
      { 
        text: '🏆 実績', 
        y: this.scale.height * 0.42, 
        action: () => this.showAchievements(),
        size: 'small'
      },
      { 
        text: '🔧 ツール', 
        y: this.scale.height * 0.5, 
        action: () => this.showTools(),
        size: 'small'
      },
      { 
        text: '❓ ヘルプ', 
        y: this.scale.height * 0.58, 
        action: () => this.showHelp(),
        size: 'small'
      },
      { 
        text: '💬 Discord', 
        y: this.scale.height * 0.66, 
        action: () => this.connectDiscord(),
        size: 'small'
      }
    ];

    // 認証済みユーザーの場合はログアウトボタンを追加
    if (this.playerData.userId && !this.playerData.isGuest) {
      sideMenuData.push({
        text: '🚪 ログアウト',
        y: this.scale.height * 0.74,
        action: () => this.logout(),
        size: 'small'
      });
    }

    sideMenuData.forEach(item => {
      this.createSideButton(this.scale.width * 0.85, item.y, item.text, item.action);
    });
  }

  createSideButton(x, y, text, action) {
    // 画面サイズに応じてボタンサイズを調整
    const buttonSize = Math.min(40, this.scale.width * 0.05);
    const fontSize = Math.min(13, this.scale.width * 0.016);
    
    // ボタンの背景（シンプルな円形）
    const button = this.add.graphics();
    button.fillStyle(0x34495e, 0.9);
    button.fillCircle(0, 0, buttonSize / 2);
    button.lineStyle(1, 0xecf0f1, 0.7);
    button.strokeCircle(0, 0, buttonSize / 2);

    const buttonText = this.add.text(0, 0, text, {
      fontSize: `${fontSize}px`,
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      resolution: 2
    }).setOrigin(0.5);

    // ボタンコンテナ
    const sideContainer = this.add.container(x, y, [button, buttonText]);

    // インタラクティブエリア
    const hitArea = this.add.circle(x, y, buttonSize / 2, 0x000000, 0);
    hitArea.setInteractive();

    hitArea.on('pointerover', () => {
      button.clear();
      button.fillStyle(0x5d6d7e, 0.9);
      button.fillCircle(0, 0, buttonSize / 2);
      button.lineStyle(2, 0xecf0f1, 0.9);
      button.strokeCircle(0, 0, buttonSize / 2);
      
      this.tweens.add({
        targets: sideContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 120
      });
    });

    hitArea.on('pointerout', () => {
      button.clear();
      button.fillStyle(0x34495e, 0.9);
      button.fillCircle(0, 0, buttonSize / 2);
      button.lineStyle(1, 0xecf0f1, 0.7);
      button.strokeCircle(0, 0, buttonSize / 2);
      
      this.tweens.add({
        targets: sideContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 120
      });
    });

    hitArea.on('pointerdown', () => {
      this.tweens.add({
        targets: sideContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 60,
        yoyo: true,
        ease: 'Power2'
      });
      
      if (action) {
        this.time.delayedCall(80, action);
      }
    });
  }

  createVisualEffects() {
    // パーティクルエフェクト
    this.createParticleEffect();
    
    // 周期的なエフェクト
    this.createAmbientEffects();
  }

  createParticleEffect() {
    // 簡単なパーティクルエフェクト（星やきらめき）
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        
        const sparkle = this.add.graphics();
        sparkle.fillStyle(0xffffff, 0.8);
        sparkle.fillCircle(x, y, 2);
        
        this.tweens.add({
          targets: sparkle,
          alpha: 0,
          scaleX: 3,
          scaleY: 3,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => sparkle.destroy()
        });
      },
      loop: true
    });
  }

  createAmbientEffects() {
    // 背景の微妙な色変化
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        const colors = [0x1a1a2e, 0x16213e, 0x0f3460];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 背景色の微妙な変化（実装は簡略化）
      },
      loop: true
    });
  }

  showButtonDescription(text, x, y) {
    this.hideButtonDescription(); // 既存の説明を非表示

    this.descriptionText = this.add.text(x, y, text, {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ecf0f1',
      backgroundColor: '#2c3e50',
      padding: { x: 6, y: 3 },
      resolution: 2
    }).setOrigin(0.5);

    this.descriptionText.setAlpha(0);
    this.tweens.add({
      targets: this.descriptionText,
      alpha: 1,
      duration: 150
    });
  }

  hideButtonDescription() {
    if (this.descriptionText) {
      this.descriptionText.destroy();
      this.descriptionText = null;
    }
  }
  createClickEffect(x, y) {
    const effect = this.add.graphics();
    effect.fillStyle(0xffffff, 0.6);
    effect.fillCircle(x, y, 3);

    this.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => effect.destroy()
    });
  }

  // アドベンチャーボタン用のエフェクト関数
  createHoverParticles(x, y, width, height) {
    for (let i = 0; i < 5; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0xffd700, 0.8);
      particle.fillCircle(0, 0, 2 + Math.random() * 3);
      
      particle.x = x + (Math.random() - 0.5) * width;
      particle.y = y + (Math.random() - 0.5) * height;
      
      this.tweens.add({
        targets: particle,
        y: particle.y - 30,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  createButtonClickExplosion(x, y) {
    for (let i = 0; i < 8; i++) {
      const spark = this.add.graphics();
      spark.fillStyle(0xffffff, 0.9);
      spark.fillCircle(0, 0, 3);
      
      spark.x = x;
      spark.y = y;
      
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 500,
        ease: 'Power2',
        onComplete: () => spark.destroy()
      });
    }
  }

  createButtonSparkle(x, y, width, height) {
    const sparkleCount = 3 + Math.random() * 3;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = this.add.graphics();
      sparkle.fillStyle(0xffffff, 0.8 + Math.random() * 0.2);
      sparkle.fillCircle(0, 0, 2 + Math.random() * 2);
      
      sparkle.x = x + (Math.random() - 0.5) * width * 0.8;
      sparkle.y = y + (Math.random() - 0.5) * height * 0.8;
      
      this.tweens.add({
        targets: sparkle,
        alpha: 0,
        scaleX: 3,
        scaleY: 3,
        duration: 800 + Math.random() * 400,
        ease: 'Power2',
        onComplete: () => sparkle.destroy()
      });
    }
  }

  createEnergyWave(x, y) {
    const wave = this.add.graphics();
    wave.lineStyle(3, 0x00ff88, 0.6);
    wave.strokeCircle(x, y, 10);
    
    this.tweens.add({
      targets: wave,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => wave.destroy()
    });
  }

  // 初期化とデータ管理
  async initializePlayerData() {
    // Supabaseからユーザーデータを読み込み（認証済みの場合）
    if (this.playerData.userId && !this.playerData.isGuest) {
      await this.loadPlayerDataFromSupabase();
    } else {
      // ゲストまたは認証なしの場合はローカルストレージから読み込み
      const savedData = localStorage.getItem('codeOfRuinsPlayerData');
      if (savedData) {
        this.playerData = { ...this.playerData, ...JSON.parse(savedData) };
      }
    }
    this.updatePlayerInfo();
  }

  async loadPlayerDataFromSupabase() {
    try {
      console.log('Supabaseからユーザーデータを読み込み中...');
      
      // プロフィールテーブルからゲームデータを取得
      const { data, error } = await supabase
        .from('profiles')
        .select('username, level, xp, gold, current_stage, unlocked_stages, trophies')
        .eq('id', this.playerData.userId)
        .single();

      if (error) {
        console.error('Supabaseからのデータ読み込みエラー:', error);
        // エラーの場合はローカルのデフォルト値を使用
        return;
      }

      if (data) {
        // Supabaseからのデータでプレイヤーデータを更新
        this.playerData = {
          ...this.playerData,
          username: data.username || this.playerData.username,
          level: data.level || 1,
          xp: data.xp || 0,
          gold: data.gold || 100,
          currentStage: data.current_stage || 1,
          unlockedStages: data.unlocked_stages || 1,
          trophies: data.trophies || []
        };
        console.log('Supabaseからのデータ読み込み成功:', this.playerData);
      }
    } catch (error) {
      console.error('予期しないエラー:', error);
    }
  }

  updatePlayerInfo() {
    if (this.playerNameText) {
      this.playerNameText.setText(this.playerData.username);
    }
    if (this.levelText) {
      this.levelText.setText(`レベル ${this.playerData.level}`);
    }
    if (this.goldText) {
      this.goldText.setText(`ゴールド: ${this.playerData.gold}`);
    }
    // XPバーの更新も必要
  }

  async savePlayerData() {
    // ローカルストレージに保存
    localStorage.setItem('codeOfRuinsPlayerData', JSON.stringify(this.playerData));
    
    // 認証済みユーザーの場合はSupabaseにも保存
    if (this.playerData.userId && !this.playerData.isGuest) {
      await this.savePlayerDataToSupabase();
    }
  }

  async savePlayerDataToSupabase() {
    try {
      console.log('Supabaseにユーザーデータを保存中...');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: this.playerData.username,
          level: this.playerData.level,
          xp: this.playerData.xp,
          gold: this.playerData.gold,
          current_stage: this.playerData.currentStage,
          unlocked_stages: this.playerData.unlockedStages,
          trophies: this.playerData.trophies,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.playerData.userId);

      if (error) {
        console.error('Supabaseへのデータ保存エラー:', error);
        return false;
      }

      console.log('Supabaseへのデータ保存成功');
      return true;
    } catch (error) {
      console.error('予期しないエラー:', error);
      return false;
    }
  }

  // ナビゲーション関数
  goToMapSelection() {
    console.log('Navigating to Map Selection');
    // 実装予定: マップ選択画面への遷移
    this.scene.start('MapSelectionScene');
  }

  goToLibrary() {
    console.log('Navigating to Code Library');
    // 実装予定: コード図書館画面への遷移
    this.scene.start('LibraryScene');
  }

  goToShop() {
    console.log('Navigating to Shop');
    // 実装予定: ショップ画面への遷移
    this.scene.start('ShopScene');
  }

  goToSettings() {
    console.log('Opening Settings');
    // 設定ウィンドウを開く
    this.showSettingsWindow();
  }

  // モーダルウィンドウ系
  showStatusWindow() {
    // プレイヤーの詳細ステータスを表示
    console.log('Showing status window');
    this.createModalWindow('ステータス', this.getStatusContent());
  }

  showAchievements() {
    // 実績一覧を表示
    console.log('Showing achievements');
    this.createModalWindow('実績', this.getAchievementsContent());
  }

  showTools() {
    // 開発ツールやユーティリティを表示
    console.log('Showing tools');
    this.createModalWindow('ツール', this.getToolsContent());
  }

  showHelp() {
    // ヘルプ情報を表示
    console.log('Showing help');
    this.createModalWindow('ヘルプ', this.getHelpContent());
  }

  showSettingsWindow() {
    // 設定画面を表示
    console.log('Showing settings');
    this.createModalWindow('設定', this.getSettingsContent());
  }

  createModalWindow(title, content) {
    // モーダルの背景
    const modalBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    modalBg.setInteractive();

    // モーダルウィンドウ
    const modal = this.add.rectangle(400, 300, 500, 400, 0x0f3460, 0.95);
    modal.setStrokeStyle(3, 0xe94560);

    // タイトル
    const modalTitle = this.add.text(400, 150, title, {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // 閉じるボタン
    const closeButton = this.add.text(500, 120, '✕', {
      fontSize: '20px',
      fontFamily: 'Arial',
      fill: '#ff6b6b'
    }).setOrigin(0.5);

    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
      modalBg.destroy();
      modal.destroy();
      modalTitle.destroy();
      closeButton.destroy();
      if (content.destroy) content.destroy();
    });

    // コンテンツ表示
    // （各コンテンツは個別に実装）
  }

  getStatusContent() {
    return `
      レベル: ${this.playerData.level}
      経験値: ${this.playerData.xp}
      ゴールド: ${this.playerData.gold}
      現在ステージ: ${this.playerData.currentStage}
      実績数: ${this.playerData.trophies.length}
    `;
  }

  getAchievementsContent() {
    return '実績システム（実装予定）';
  }

  getToolsContent() {
    return 'デバッグツール（実装予定）';
  }

  getHelpContent() {
    return `
      『Code of Ruins』へようこそ！

      ゲームの遊び方:
      1. ステージ選択で冒険を始める
      2. Scratchブロックで戦闘プログラムを作成
      3. 効率的なコードでより多くの経験値を獲得
      4. アイテムを集めて強化
      
      詳細なヘルプは開発中です...
    `;
  }

  getSettingsContent() {
    return 'ゲーム設定（実装予定）';
  }

  connectDiscord() {
    console.log('Discord連携機能');
    
    // Discord連携の説明を表示
    const overlay = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.7);
    overlay.setInteractive();

    const panelWidth = Math.min(400, this.scale.width * 0.8);
    const panelHeight = Math.min(300, this.scale.height * 0.6);
    const panel = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, panelWidth, panelHeight, 0x0f3460, 0.95);
    panel.setStrokeStyle(3, 0xe94560);

    // タイトル
    const title = this.add.text(this.scale.width / 2, this.scale.height / 2 - panelHeight * 0.35, '💬 Discord連携', {
      fontSize: `${Math.min(24, this.scale.width * 0.03)}px`,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // 説明文
    const description = this.add.text(this.scale.width / 2, this.scale.height / 2 - panelHeight * 0.1, 
      'Discordサーバーで他のプレイヤーと\n情報交換やヒントの共有ができます！\n\nゲームの攻略情報や新機能の\nお知らせも配信予定です。', {
      fontSize: `${Math.min(16, this.scale.width * 0.02)}px`,
      fontFamily: 'Arial',
      fill: '#f5f5f5',
      align: 'center',
      lineSpacing: 5,
      wordWrap: { width: panelWidth - 40 }
    }).setOrigin(0.5);

    // Discord招待リンクボタン
    const inviteButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + panelHeight * 0.15, '🔗 Discordに参加', {
      fontSize: `${Math.min(18, this.scale.width * 0.025)}px`,
      fontFamily: 'Arial',
      fill: '#ffffff',
      backgroundColor: '#5865f2',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    inviteButton.setInteractive();
    inviteButton.on('pointerover', () => {
      inviteButton.setScale(1.05);
    });
    inviteButton.on('pointerout', () => {
      inviteButton.setScale(1);
    });
    inviteButton.on('pointerdown', () => {
      // 実際のDiscord招待リンクを開く（デモ用にアラート表示）
      alert('Discord招待リンクが開かれます。\n（実装時には実際のリンクを使用）');
    });

    // 閉じるボタン
    const closeButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + panelHeight * 0.35, '閉じる', {
      fontSize: `${Math.min(16, this.scale.width * 0.022)}px`,
      fontFamily: 'Arial',
      fill: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);

    closeButton.setInteractive();
    closeButton.on('pointerover', () => {
      closeButton.setBackgroundColor('#888888');
    });
    closeButton.on('pointerout', () => {
      closeButton.setBackgroundColor('#666666');
    });
    closeButton.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      description.destroy();
      inviteButton.destroy();
      closeButton.destroy();
    });

    // ESCキーでも閉じられるように
    const escKey = this.input.keyboard.addKey('ESC');
    escKey.once('down', () => {
      if (overlay.active) {
        overlay.destroy();
        panel.destroy();
        title.destroy();
        description.destroy();
        inviteButton.destroy();
        closeButton.destroy();
      }
    });
  }

  // データの更新と同期
  updateGameData(newData) {
    this.playerData = { ...this.playerData, ...newData };
    this.updatePlayerInfo();
    this.savePlayerData();
  }

  // シーン終了時の処理
  shutdown() {
    this.savePlayerData();
  }

  // ログアウト処理
  async logout() {
    try {
      if (!this.playerData.isGuest) {
        // Supabaseからログアウト
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('ログアウトエラー:', error);
          return;
        }
        console.log('ログアウト成功');
      }
      
      // ローカルデータをクリア
      localStorage.removeItem('playerData');
      
      // 認証画面に戻る
      this.scene.stop('HomeScene');
      this.scene.start('AuthenticationScene');
      
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }

  // ヘルパー関数：色を明るくする
  adjustColor(color, amount) {
    // 16進数の色を明るくする簡単な処理
    if (typeof color === 'string') {
      color = parseInt(color.replace('#', ''), 16);
    }
    
    const r = Math.min(255, Math.floor((color >> 16) & 0xFF) + (amount * 255));
    const g = Math.min(255, Math.floor((color >> 8) & 0xFF) + (amount * 255));
    const b = Math.min(255, Math.floor(color & 0xFF) + (amount * 255));
    
    return (r << 16) | (g << 8) | b;
  }

  // 実行ボタンを非表示にするヘルパーメソッド
  hideRunButton() {
    const runButton = document.getElementById('runButton');
    if (runButton) {
      runButton.style.display = 'none';
    }
  }
}
