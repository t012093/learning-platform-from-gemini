// AuthenticationScene.js - Supabase認証専用ページ（ホーム画面より前に表示）
import { Scene } from 'phaser';
import { supabase } from '../lib/supabase.js';
import { createProfile, signUpWithProfile } from '../supabase/profileFunctions.js';

export class AuthenticationScene extends Scene {
    constructor() {
        console.log('🔧 AuthenticationScene constructor START');
        try {
            super({ key: 'AuthenticationScene' });
            console.log('✅ AuthenticationScene constructor - super() 呼び出し成功');
            this.currentUser = null;
            this.authMode = 'login'; // 'login' or 'signup'
            console.log('✅ AuthenticationScene constructor - 初期化完了');
        } catch (error) {
            console.error('❌ AuthenticationScene constructor エラー:', error);
            throw error;
        }
    }

    init() {
        console.log('🎯 AuthenticationScene.init() メソッドが呼び出されました');
    }

    preload() {
        console.log('📦 AuthenticationScene.preload() メソッドが呼び出されました');
    }

    async create() {
        console.log('🚀 AuthenticationScene.create() メソッドが呼び出されました');
        console.log('📊 画面サイズ:', this.scale.width, 'x', this.scale.height);
        
        // 実行ボタンを非表示にする
        this.hideRunButton();
        
        // Supabase接続テスト
        try {
            console.log('🔗 Supabase接続をテスト中...');
            await this.testSupabaseConnection();
        } catch (error) {
            console.error('⚠️ Supabase接続テストに失敗しましたが、続行します:', error);
        }
        
        // 背景作成
        console.log('🎨 背景を作成中...');
        this.createBackground();
        
        // UI作成
        console.log('🖼️ UIを作成中...');
        this.createAuthUI();
        
        // エフェクト作成
        console.log('✨ エフェクトを作成中...');
        this.createVisualEffects();
        
        console.log('✅ AuthenticationScene setup complete');
        
        // 既存ユーザーをチェック（UIを作成してから実行）
        console.log('🔍 既存ユーザーをチェック中...');
        await this.checkExistingUser();
    }

    async testSupabaseConnection() {
        try {
            // Supabaseクライアントが正しく初期化されているかテスト
            if (!supabase) {
                throw new Error('Supabaseクライアントが初期化されていません');
            }

            // 簡単な接続テスト - セッション取得を試行
            console.log('🧪 Supabaseセッション取得テスト...');
            const { data, error } = await Promise.race([
                supabase.auth.getSession(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                )
            ]);

            if (error) {
                console.warn('⚠️ セッション取得エラー（正常な場合もあります）:', error.message);
            } else {
                console.log('✅ Supabase接続テスト成功');
            }
        } catch (error) {
            console.error('❌ Supabase接続テスト失敗:', error.message);
            // 接続エラーでもアプリケーションを続行
            this.showMessage('サーバー接続に問題がありますが、ローカル機能は利用できます', 'error');
        }
    }

    async checkExistingUser() {
        try {
            console.log('🔐 Supabase認証状態をチェック中...');
            
            // Supabaseが利用できない場合のフォールバック
            if (!supabase) {
                console.warn('⚠️ Supabaseクライアントが利用できません - ローカルモードで続行');
                return;
            }
            
            // タイムアウト付きでセッション取得
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
            );
            
            const { data: { session }, error: sessionError } = await Promise.race([
                sessionPromise,
                timeoutPromise
            ]);
            
            if (sessionError) {
                console.error('❌ セッション取得エラー:', sessionError.message);
                // エラーでも続行し、ログインフォームを表示
                console.log('🆕 セッション取得に失敗 - ログインフォームを表示');
                return;
            }
            
            console.log('📝 現在のセッション:', session ? '✅ あり' : '❌ なし');
            
            if (session && session.user) {
                console.log('👤 既存ユーザーが見つかりました:', session.user.id);
                this.currentUser = session.user;
                
                // 少し遅延を入れてからHomeSceneに遷移
                this.time.delayedCall(100, () => {
                    console.log('🏠 HomeSceneに遷移します...');
                    this.cleanupInputs();
                    this.scene.stop('AuthenticationScene');
                    this.scene.start('HomeScene', { 
                        playerData: { 
                            userId: session.user.id,
                            email: session.user.email,
                            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Player'
                        }
                    });
                });
                return;
            }
            
            console.log('🆕 ログインしていないユーザー - ログインフォームを表示');
            
        } catch (error) {
            console.error('💥 認証チェックエラー:', error.message);
            
            // エラーが発生してもアプリケーションを続行
            if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                console.warn('⏱️ 認証チェックがタイムアウトしました - ログインフォームを表示');
                this.showMessage('サーバー応答が遅れています。手動でログインしてください。', 'error');
            } else if (error.message.includes('connection') || error.message.includes('Connection')) {
                console.warn('🌐 接続エラー - オフラインモードで続行');
                this.showMessage('インターネット接続を確認してください。ゲストモードは利用できます。', 'error');
            } else {
                console.warn('🔧 一般的なエラー - ログインフォームを表示');
                this.showMessage('認証システムに一時的な問題があります。', 'error');
            }
        }
    }

    createBackground() {
        // レスポンシブ対応の背景
        this.background = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x0f0f23
        );

        // グラデーション風の追加背景
        this.createGradientBackground();
    }

    createGradientBackground() {
        // 複数のレイヤーで疑似グラデーション効果
        const colors = [0x0f0f23, 0x1a1a2e, 0x16213e, 0x0f3460];
        const layers = 4;

        for (let i = 0; i < layers; i++) {
            const alpha = 0.8 - (i * 0.15);
            const height = this.scale.height / layers;
            
            this.add.rectangle(
                this.scale.width / 2,
                height * i + height / 2,
                this.scale.width,
                height + 20, // 少しオーバーラップ
                colors[i],
                alpha
            );
        }
    }

    createAuthUI() {
        // タイトル
        this.titleText = this.add.text(
            this.scale.width / 2,
            this.scale.height * 0.15,
            'Code of Ruins',
            {
                fontSize: Math.min(this.scale.width * 0.06, 48) + 'px',
                fill: '#f39c12',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#2c3e50',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // サブタイトル
        this.subtitleText = this.add.text(
            this.scale.width / 2,
            this.scale.height * 0.22,
            '魔法の世界へようこそ',
            {
                fontSize: Math.min(this.scale.width * 0.025, 20) + 'px',
                fill: '#ecf0f1',
                fontFamily: 'Arial',
                fontStyle: 'italic'
            }
        ).setOrigin(0.5);

        // HTMLフォームを直接作成 (Phaserのパネル描画はスキップ)
        this.createHTMLInputs();

        // デバッグ用：強制ログアウトボタン (右下に配置)
        this.createForceLogoutButton();
    }

    createAuthPanel() {
        const panelWidth = Math.min(400, this.scale.width * 0.8);
        const panelHeight = Math.min(350, this.scale.height * 0.6);
        const panelX = this.scale.width / 2;
        const panelY = this.scale.height * 0.5;

        // パネル背景
        this.authPanel = this.add.rectangle(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            0x2c3e50,
            0.9
        ).setStrokeStyle(3, 0x3498db);

        // パネルタイトル
        this.panelTitle = this.add.text(
            panelX,
            panelY - panelHeight * 0.35,
            this.authMode === 'login' ? 'ログイン' : 'アカウント作成',
            {
                fontSize: Math.min(this.scale.width * 0.03, 24) + 'px',
                fill: '#3498db',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 入力フィールドの説明（実際の入力フィールドはHTMLで作成）
        this.createInputFields(panelX, panelY, panelWidth, panelHeight);

        // 認証ボタン
        this.createAuthButton(panelX, panelY + panelHeight * 0.25, panelWidth);
    }

    createInputFields(panelX, panelY, panelWidth, panelHeight) {
        const fieldWidth = panelWidth * 0.8;
        const fieldHeight = 40;
        const fontSize = Math.min(this.scale.width * 0.02, 16);

        // メールアドレス欄
        this.emailLabel = this.add.text(
            panelX,
            panelY - panelHeight * 0.15,
            'メールアドレス',
            {
                fontSize: fontSize + 'px',
                fill: '#ecf0f1',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        this.emailField = this.add.rectangle(
            panelX,
            panelY - panelHeight * 0.05,
            fieldWidth,
            fieldHeight,
            0x34495e
        ).setStrokeStyle(2, 0x3498db)
        .setInteractive()
        .on('pointerdown', () => this.focusEmailInput());

        this.emailPlaceholder = this.add.text(
            panelX,
            panelY - panelHeight * 0.05,
            'example@email.com',
            {
                fontSize: (fontSize - 2) + 'px',
                fill: '#7f8c8d',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // パスワード欄
        this.passwordLabel = this.add.text(
            panelX,
            panelY + panelHeight * 0.05,
            'パスワード',
            {
                fontSize: fontSize + 'px',
                fill: '#ecf0f1',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        this.passwordField = this.add.rectangle(
            panelX,
            panelY + panelHeight * 0.15,
            fieldWidth,
            fieldHeight,
            0x34495e
        ).setStrokeStyle(2, 0x3498db)
        .setInteractive()
        .on('pointerdown', () => this.focusPasswordInput());

        this.passwordPlaceholder = this.add.text(
            panelX,
            panelY + panelHeight * 0.15,
            '••••••••',
            {
                fontSize: (fontSize - 2) + 'px',
                fill: '#7f8c8d',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // 実際のHTML入力フィールドを作成
        this.createHTMLInputs();
    }

    createHTMLInputs() {
        console.log('📝 HTML入力フィールドを作成中...');
        console.log('DEBUG: Context check - handleGuestPlay type:', typeof this.handleGuestPlay);
        
        // 既存の認証コンテナがあれば削除
        const existingContainer = document.getElementById('authContainer');
        if (existingContainer) {
            console.log('🗑️ 既存の認証コンテナを削除中...');
            existingContainer.remove();
        }
        
        // メインコンテナを作成
        const container = document.createElement('div');
        container.id = 'authContainer';
        container.className = 'auth-container';
        console.log('📦 認証コンテナを作成しました');
        
        // フォームを作成
        const form = document.createElement('div');
        form.className = 'auth-form';
        console.log('📋 認証フォームを作成しました');
        
        // タイトル
        const title = document.createElement('h2');
        title.id = 'auth-title'; // IDを追加
        title.textContent = this.authMode === 'login' ? 'ログイン' : 'アカウント作成';
        form.appendChild(title);
        
        // メール入力
        this.emailInput = document.createElement('input');
        this.emailInput.type = 'email';
        this.emailInput.id = 'auth-email-input';
        this.emailInput.placeholder = 'メールアドレス';
        this.emailInput.required = true;
        form.appendChild(this.emailInput);
        
        // パスワード入力
        this.passwordInput = document.createElement('input');
        this.passwordInput.type = 'password';
        this.passwordInput.id = 'auth-password-input';
        this.passwordInput.placeholder = 'パスワード';
        this.passwordInput.required = true;
        form.appendChild(this.passwordInput);
        
        // メッセージエリア
        this.messageDiv = document.createElement('div');
        this.messageDiv.id = 'authMessage';
        this.messageDiv.className = 'auth-message';
        this.messageDiv.style.display = 'none';
        form.appendChild(this.messageDiv);
        
        // 認証ボタン
        const authBtn = document.createElement('button');
        authBtn.id = 'auth-submit-btn'; // IDを追加
        authBtn.textContent = this.authMode === 'login' ? 'ログイン' : 'アカウント作成';
        authBtn.className = 'primary-btn';
        authBtn.addEventListener('click', this.handleAuth.bind(this));
        form.appendChild(authBtn);
        
        // モード切り替えボタン
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'auth-toggle-btn'; // IDを追加
        toggleBtn.textContent = this.authMode === 'login' ? 'アカウント作成に切り替え' : 'ログインに切り替え';
        toggleBtn.className = 'secondary-btn';
        toggleBtn.addEventListener('click', this.toggleAuthMode.bind(this));
        form.appendChild(toggleBtn);
        
        // ゲストボタン
        const guestBtn = document.createElement('button');
        guestBtn.textContent = 'ゲストとしてプレイ';
        guestBtn.className = 'guest-btn';
        // handleGuestPlayの存在チェック
        if (typeof this.handleGuestPlay === 'function') {
            guestBtn.addEventListener('click', this.handleGuestPlay.bind(this));
        } else {
            console.error('CRITICAL: handleGuestPlay method is missing!');
            guestBtn.onclick = () => alert('エラー: ゲストプレイ機能が見つかりません');
        }
        form.appendChild(guestBtn);
        
        // Enterキーでログイン実行
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAuth();
            }
        });
        
        // フォームをコンテナに追加
        container.appendChild(form);
        
        // ドキュメントに追加
        document.body.appendChild(container);
    }

    toggleAuthMode() {
        this.authMode = this.authMode === 'login' ? 'signup' : 'login';
        
        // DOM要素の更新
        const title = document.getElementById('auth-title');
        const authBtn = document.getElementById('auth-submit-btn');
        const toggleBtn = document.getElementById('auth-toggle-btn');
        
        if (title) title.textContent = this.authMode === 'login' ? 'ログイン' : 'アカウント作成';
        if (authBtn) authBtn.textContent = this.authMode === 'login' ? 'ログイン' : 'アカウント作成';
        if (toggleBtn) toggleBtn.textContent = this.authMode === 'login' ? 'アカウント作成に切り替え' : 'ログインに切り替え';

        // 入力フィールドクリア
        if (this.emailInput) this.emailInput.value = '';
        if (this.passwordInput) this.passwordInput.value = '';
        
        // メッセージクリア
        if (this.messageDiv) this.messageDiv.style.display = 'none';
    }

    handleGuestPlay() {
        console.log('👤 ゲストプレイが選択されました');
        this.cleanupInputs();
        this.scene.stop('AuthenticationScene'); // 認証シーンを停止
        console.log('🏠 ゲストプレイ - HomeSceneに遷移します');
        this.scene.start('HomeScene', {
            playerData: {
                userId: 'guest_' + Date.now(),
                email: null,
                username: 'ゲスト',
                isGuest: true
            }
        });
    }

    showMessage(text, type = 'info') {
        // HTMLメッセージエリアがある場合はそちらを使用
        if (this.messageDiv) {
            this.messageDiv.textContent = text;
            this.messageDiv.className = `auth-message ${type}`;
            this.messageDiv.style.display = 'block';
            
            // 3秒後に隠す
            setTimeout(() => {
                if (this.messageDiv) {
                    this.messageDiv.style.display = 'none';
                }
            }, 3000);
            return;
        }
        
        // フォールバック：Phaserテキスト
        if (this.messageText) {
            this.messageText.destroy();
        }

        const color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db';
        
        this.messageText = this.add.text(
            this.scale.width / 2,
            this.scale.height * 0.9,
            text,
            {
                fontSize: Math.min(this.scale.width * 0.018, 14) + 'px',
                fill: color,
                fontFamily: 'Arial',
                wordWrap: { width: this.scale.width * 0.8, useAdvancedWrap: true },
                align: 'center'
            }
        ).setOrigin(0.5);

        // 3秒後に消去
        this.time.delayedCall(3000, () => {
            if (this.messageText) {
                this.messageText.destroy();
                this.messageText = null;
            }
        });
    }

    showLoadingState(isLoading) {
        const authBtn = document.getElementById('auth-submit-btn');
        if (!authBtn) return;

        if (isLoading) {
            authBtn.textContent = '処理中...';
            authBtn.disabled = true;
            authBtn.style.opacity = '0.7';
            authBtn.style.cursor = 'not-allowed';
        } else {
            authBtn.textContent = this.authMode === 'login' ? 'ログイン' : 'アカウント作成';
            authBtn.disabled = false;
            authBtn.style.opacity = '1';
            authBtn.style.cursor = 'pointer';
        }
    }

    cleanupInputs() {
        console.log('🧹 HTML入力フィールドをクリーンアップ中...');
        
        // 認証コンテナを削除
        const authContainer = document.getElementById('authContainer');
        if (authContainer) {
            try {
                document.body.removeChild(authContainer);
                console.log('✅ 認証コンテナを削除しました');
            } catch (error) {
                console.error('❌ 認証コンテナ削除エラー:', error);
            }
        }
        
        // 個別の入力フィールドも確認して削除
        const emailInput = document.getElementById('auth-email-input');
        if (emailInput) {
            try {
                emailInput.remove();
                console.log('✅ メール入力フィールドを削除しました');
            } catch (error) {
                console.error('❌ メール入力フィールド削除エラー:', error);
            }
        }
        
        const passwordInput = document.getElementById('auth-password-input');
        if (passwordInput) {
            try {
                passwordInput.remove();
                console.log('✅ パスワード入力フィールドを削除しました');
            } catch (error) {
                console.error('❌ パスワード入力フィールド削除エラー:', error);
            }
        }
        
        // クラスで検索して削除
        const authElements = document.querySelectorAll('.auth-container, .auth-form');
        authElements.forEach(element => {
            try {
                element.remove();
                console.log('✅ 認証要素を削除しました');
            } catch (error) {
                console.error('❌ 認証要素削除エラー:', error);
            }
        });
        
        // プロパティをリセット
        this.emailInput = null;
        this.passwordInput = null;
        this.messageDiv = null;
        
        console.log('🎯 認証フォームのクリーンアップが完了しました');
    }

    shutdown() {
        this.cleanupInputs();
    }

    // リサイズ対応
    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        
        this.scale.resize(width, height);
        
        if (this.background) {
            this.background.setSize(width, height);
            this.background.setPosition(width / 2, height / 2);
        }

        // すべてのUI要素の位置を更新
        if (this.titleText) {
            this.titleText.setPosition(width / 2, height * 0.15);
        }
        
        if (this.subtitleText) {
            this.subtitleText.setPosition(width / 2, height * 0.22);
        }


    }

    createForceLogoutButton() {
        // デバッグ用の強制ログアウトボタン
        const logoutY = this.scale.height * 0.95;
        
        this.forceLogoutButton = this.add.rectangle(
            this.scale.width * 0.1,
            logoutY,
            120,
            30,
            0xe74c3c
        ).setStrokeStyle(1, 0xc0392b)
        .setInteractive()
        .on('pointerdown', () => this.forceLogout())
        .on('pointerover', () => {
            this.forceLogoutButton.setFillStyle(0xc0392b);
            this.forceLogoutButton.setScale(1.05);
        })
        .on('pointerout', () => {
            this.forceLogoutButton.setFillStyle(0xe74c3c);
            this.forceLogoutButton.setScale(1);
        });

        this.forceLogoutButtonText = this.add.text(
            this.scale.width * 0.1,
            logoutY,
            '強制ログアウト',
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
    }

    async forceLogout() {
        try {
            console.log('🚨 強制ログアウトを実行中...');
            
            // Supabaseが利用可能かチェック
            if (supabase) {
                // タイムアウト付きログアウト
                const logoutPromise = supabase.auth.signOut();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Logout timeout')), 5000)
                );
                
                try {
                    const { error } = await Promise.race([logoutPromise, timeoutPromise]);
                    if (error) {
                        console.error('❌ ログアウトエラー:', error);
                    } else {
                        console.log('✅ ログアウト成功');
                    }
                } catch (logoutError) {
                    console.warn('⚠️ ログアウト処理がタイムアウトしました:', logoutError.message);
                }
            } else {
                console.warn('⚠️ Supabaseクライアントが利用できません - ローカルクリーンアップのみ実行');
            }
            
            // ローカルストレージもクリア
            try {
                localStorage.clear();
                console.log('🧹 ローカルストレージをクリアしました');
            } catch (storageError) {
                console.error('❌ ローカルストレージクリアエラー:', storageError);
            }
            
            this.showMessage('ログアウトしました', 'success');
            
            // 画面をリフレッシュ
            setTimeout(() => {
                console.log('🔄 ページをリロードします...');
                try {
                    location.reload();
                } catch (reloadError) {
                    console.error('❌ ページリロードエラー:', reloadError);
                    // 手動でAuthenticationSceneを再作成
                    this.scene.restart();
                }
            }, 1000);
            
        } catch (error) {
            console.error('💥 強制ログアウトエラー:', error);
            
            let message = 'ログアウトに失敗しました';
            if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                message = 'ログアウト処理がタイムアウトしました。ページを再読み込みしてください。';
            } else if (error.message.includes('connection')) {
                message = 'ネットワークエラーでログアウトできませんでした。ページを再読み込みしてください。';
            }
            
            this.showMessage(message, 'error');
        }
    }

    // 実行ボタンを非表示にするヘルパーメソッド
    hideRunButton() {
        const runButton = document.getElementById('runButton');
        if (runButton) {
            runButton.style.display = 'none';
        }
    }
}
