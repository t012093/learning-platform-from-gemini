/**
 * 魔法の書 - 魔法の詠唱パターンと情報を表示するUI
 */
export class SpellBook {
  constructor() {
    this.isVisible = false;
    this.container = null;
    this.currentStage = 1;
    this.stageCategories = {
      1: ['basic_actions'], // 基本アクション
      2: ['basic_actions'], // 基本アクション
      3: ['basic_actions', 'incantation', 'magic'], // 基本 + 詠唱 + 魔法
      4: ['basic_actions', 'incantation', 'magic'], // 基本 + 詠唱 + 魔法
      5: ['basic_actions', 'incantation', 'magic'], // 基本 + 詠唱 + 魔法
      6: ['basic_actions', 'incantation', 'magic', 'alchemy', 'strategy'], // 基本 + 詠唱 + 魔法 + 薬学 + 戦略
      7: ['basic_actions', 'incantation', 'magic', 'strategy'], // 基本 + 詠唱 + 魔法 + 戦略
      8: ['basic_actions', 'incantation', 'magic', 'control', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 戦略
      9: ['basic_actions', 'incantation', 'magic', 'control', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 戦略
      10: ['basic_actions', 'incantation', 'magic', 'control', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 戦略
      11: ['basic_actions', 'incantation', 'magic', 'variables', 'special_actions', 'strategy'], // 基本 + 詠唱 + 魔法 + 変数 + 特殊 + 戦略
      12: ['basic_actions', 'incantation', 'magic', 'variables', 'hp_management', 'strategy'], // 基本 + 詠唱 + 魔法 + 変数 + HP管理 + 戦略
      13: ['basic_actions', 'incantation', 'magic', 'control', 'special_actions', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 特殊 + 戦略
      14: ['basic_actions', 'incantation', 'magic', 'control', 'special_actions', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 特殊 + 戦略
      15: ['basic_actions', 'incantation', 'magic', 'control', 'variables', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 変数 + 戦略
      16: ['basic_actions', 'incantation', 'magic', 'control', 'special_actions', 'strategy'], // 基本 + 詠唱 + 魔法 + 制御 + 特殊 + 戦略
      17: ['basic_actions', 'incantation', 'magic', 'functions', 'strategy'], // 基本 + 詠唱 + 魔法 + 関数 + 戦略
      18: ['basic_actions', 'incantation', 'magic', 'alchemy', 'strategy'], // 基本 + 詠唱 + 魔法 + 薬学 + 戦略
      19: ['basic_actions', 'incantation', 'magic', 'weapons', 'strategy'], // 基本 + 詠唱 + 魔法 + 武器 + 戦略
      20: ['basic_actions', 'incantation', 'magic', 'control', 'variables', 'functions', 'advanced_commands', 'strategy'] // 全て
    };
    this.createSpellBookUI();
  }

  /**
   * 現在のステージを取得
   */
  getCurrentStage() {
    try {
      // ゲーム内のステージ情報から取得
      if (window.gameEngine && window.gameEngine.currentStage) {
        return parseInt(window.gameEngine.currentStage);
      }
      
      // グローバル変数から取得
      if (window.currentStage) {
        return parseInt(window.currentStage);
      }
      
      // ローカルストレージから取得
      const savedStage = localStorage.getItem('currentStage');
      if (savedStage) {
        return parseInt(savedStage);
      }
      
      // デフォルト値
      return 1;
    } catch (error) {
      console.warn('現在のステージ取得に失敗:', error);
      return 1;
    }
  }

  /**
   * ステージの表示可能カテゴリを取得
   */
  getAllowedCategories(stage = null) {
    const currentStage = stage || this.getCurrentStage();
    return this.stageCategories[currentStage] || this.stageCategories[1];
  }

  /**
   * アイテムがステージで表示可能かチェック
   */
  isItemAllowedInStage(item, stage = null) {
    const allowedCategories = this.getAllowedCategories(stage);
    
    // アイテムにカテゴリが設定されていない場合は表示
    if (!item.category) {
      return true;
    }
    
    // カテゴリが配列の場合（複数カテゴリ対応）
    if (Array.isArray(item.category)) {
      return item.category.some(cat => allowedCategories.includes(cat));
    }
    
    // 単一カテゴリの場合
    return allowedCategories.includes(item.category);
  }

  createSpellBookUI() {
    // 魔法の書のコンテナを作成
    this.container = document.createElement('div');
    this.container.id = 'spellbook';
    this.container.className = 'spellbook-container';
    this.container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-height: 80vh;
      background: linear-gradient(135deg, #2a1810, #4a3020);
      border: 3px solid #8b6914;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: none;
      overflow-y: auto;
      font-family: 'Georgia', serif;
    `;

    // ヘッダー
    const header = document.createElement('div');
    header.className = 'spellbook-header';
    header.style.cssText = `
      background: linear-gradient(90deg, #8b6914, #b8860b);
      padding: 15px;
      text-align: center;
      border-radius: 12px 12px 0 0;
      position: relative;
    `;

    const title = document.createElement('h2');
    title.textContent = '📖 魔法の書';
    title.style.cssText = `
      margin: 0;
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      font-size: 24px;
    `;

    // 閉じるボタン
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 5px;
      border-radius: 3px;
      display: block;
    `;
    closeBtn.onclick = () => this.hide();

    header.appendChild(title);
    header.appendChild(closeBtn);

    // コンテンツエリア
    const content = document.createElement('div');
    content.className = 'spellbook-content';
    content.style.cssText = `
      padding: 20px;
      color: #f4e4bc;
      line-height: 1.6;
    `;

    this.container.appendChild(header);
    this.container.appendChild(content);
    document.body.appendChild(this.container);

    this.populateSpellBook(content);
  }
  populateSpellBook(content) {
    const currentStage = this.getCurrentStage();
    
    // ステージ情報ヘッダーを追加
    const stageInfo = document.createElement('div');
    stageInfo.style.cssText = `
      background: linear-gradient(90deg, #1e3c72, #2a5298);
      color: #fff;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
    `;
    stageInfo.innerHTML = `
      <h3 style="margin: 0; color: #ffd700;">🎯 現在のステージ: ${currentStage}</h3>
      <p style="margin: 5px 0 0 0; color: #e6f3ff; font-size: 14px;">
        このステージで使用できるコマンドのみを表示しています
      </p>
    `;
    content.appendChild(stageInfo);

    // 基本コマンド
    const basicCommands = [
      {
        name: '⚔️ 攻撃',
        stage: 1,
        category: 'basic_actions',
        description: '基本的な攻撃コマンド',
        usage: '「攻撃する」ブロックを使用',
        effect: '敵に通常ダメージを与える',
        notes: [
          '最も基本的な戦闘コマンド',
          'HPを消費しない',
          '確実に命中する'
        ],
        difficulty: '初級'
      },
      {
        name: '⌛ 待機',
        stage: 1,
        category: 'basic_actions',
        description: '次のターンまで待機する',
        usage: '「待機する」ブロックを使用',
        effect: 'ターンを消費する',
        notes: [
          'HPを消費しない',
          'ターン経過による回復や状態変化を待つ時に有効',
          '敵の行動パターンを観察するのに便利'
        ],
        difficulty: '初級'
      }
    ];

    // パターンベース魔法システム
    const magicSpells = [
      {
        name: '🔥 炎の魔法 (FIRE)',
        stage: 3,
        category: ['incantation', 'magic'],
        pattern: '左手 → 右手',
        description: '敵に炎のダメージを与える基本的な攻撃魔法',
        damage: '中程度 (25)',
        notes: [
          '最もシンプルな攻撃魔法',
          '2回の手振りで詠唱完了',
          '氷系の敵に効果的',
          '初心者におすすめの魔法'
        ],
        difficulty: '初級'
      },
      {
        name: '❄️ 氷の魔法 (ICE)',
        stage: 4,
        category: ['incantation', 'magic'],
        pattern: '左手 → 左手',
        description: '敵を氷で攻撃し、動きを鈍らせる魔法',
        damage: '中程度 (20)',
        notes: [
          '同じ手を2回振る魔法',
          '炎系の敵に効果的',
          '敵の動きを遅くする効果',
          '詠唱パターンが覚えやすい'
        ],
        difficulty: '初級'
      },
      {
        name: '⚡ 雷の魔法 (THUNDER)',
        stage: 5,
        category: ['incantation', 'magic'],
        pattern: '右手 → 左手',
        description: '強力な雷撃で敵を攻撃する魔法',
        damage: '高威力 (30)',
        notes: [
          '右から左への雷撃',
          '金属系の敵に絶大な効果',
          '装甲を貫通する力',
          '水系の敵にも有効'
        ],
        difficulty: '初級'
      },
      {
        name: '💧 水の魔法 (WATER)',
        stage: 6,
        category: ['incantation', 'magic'],
        pattern: '右手 → 右手',
        description: '水流で敵を攻撃する魔法',
        damage: '中程度 (22)',
        notes: [
          '右手を2回振る水系魔法',
          '炎系の敵に特効',
          '土系の敵にも効果的',
          '浄化効果もある'
        ],
        difficulty: '初級'
      },
      {
        name: '💚 回復の魔法 (HEALING)',
        stage: 7,
        category: ['incantation', 'magic'],
        pattern: '左手 → 右手 → 左手',
        description: 'HPを回復する生命魔法',
        effect: 'HP回復 (30)',
        notes: [
          '3回の手振りで回復',
          '戦闘中の回復に重要',
          '正確な詠唱が必要',
          '失敗すると回復できない',
          'ボス戦では回復なしでは勝てない'
        ],
        difficulty: '中級'
      },
      {
        name: '😵‍💫 麻痺の魔法 (PARALYZE)',
        stage: 8,
        category: ['incantation', 'magic', 'control'],
        pattern: '左手 → 右手 → 左手 → 右手 → 左手 → 右手 → 左手 → 右手',
        description: '敵を麻痺状態にして行動を封じる制御魔法',
        effect: '敵を2ターン麻痺状態にする',
        notes: [
          '8回の手振りが必要な高度な魔法',
          '左右交互のパターンを正確に詠唱',
          '敵の行動を完全に止められる',
          'チャージ攻撃や特殊技を阻止できる',
          'ダークナイトの破滅の剣を止めるのに必須',
          'ボス戦での重要な戦略要素'
        ],
        difficulty: '上級',
        strategic: true
      },
      {
        name: '⚡ 閃光の魔法 (FLASH)',
        stage: 9,
        category: ['incantation', 'magic', 'control'],
        pattern: '左手 → 右手 → 右手 → 左手 → 左手 → 左手 → 右手 → 左手 → 右手 → 右手 → 左手 → 左手 → 左手 → 右手 → 左手 → 右手 → 右手 → 左手 → 左手 → 左手 → 右手',
        description: '回避不可の強力な光魔法',
        effect: '高ダメージ + 回避無効 + シールド貫通',
        damage: '高威力 (40)',
        notes: [
          '21回の手振りが必要な最高位魔法',
          '複雑なパターンを正確に詠唱する必要',
          'すべての回避や防御を無視する',
          '魔法シールドを破壊できる唯一の手段',
          'ダークナイトのシールドはこれでしか破れない',
          '影の獣の完全回避も無効化',
          'ボス戦攻略の切り札'
        ],
        difficulty: '最上級',
        strategic: true
      },
      {
        name: '⚡💧 ライデン (RAIDEN)',
        stage: 5,
        category: ['incantation', 'magic'],
        pattern: '右手 → 右手 → 右手 → 左手',
        description: '水と雷の力を融合させた複合魔法',
        damage: '高威力 (25)',
        notes: [
          '水の魔法（右→右）+ 雷の魔法（右→左）の複合',
          '4回の手振りが必要な上級魔法',
          '水と雷の属性を併せ持つ',
          '複合魔法の基本形として重要'
        ],
        difficulty: '上級'
      }
    ];

    // ボス戦略情報
    const bossStrategies = [
      {
        name: '🏰 ダークナイト攻略法 (ステージ10)',
        stage: 10,
        category: 'strategy',
        type: 'boss',
        description: '初級ボス・ダークナイトとの戦闘における必勝法',
        strategies: [
          {
            phase: 'シールド破壊フェーズ',
            requirement: '閃光魔法',
            description: 'ダークナイトの魔法シールドは閃光魔法でしか破壊できない',
            importance: '最重要',
            details: [
              '通常攻撃は完全に無効化される',
              '他の魔法も80%軽減される',
              '閃光魔法による破壊が戦闘開始の必須条件'
            ]
          },
          {
            phase: 'チャージ攻撃阻止',
            requirement: '麻痺魔法',
            description: '破滅の剣（即死攻撃）は麻痺魔法でしか阻止できない',
            importance: '最重要',
            details: [
              'フェーズ2以降でチャージ攻撃を開始',
              '2ターン後に即死攻撃が発動',
              '麻痺魔法でチャージをキャンセル可能'
            ]
          },
          {
            phase: 'HP管理',
            requirement: '回復魔法',
            description: '高ダメージ攻撃に対抗するため回復が必須',
            importance: '重要',
            details: [
              'フェーズ1: 25ダメージ',
              'フェーズ2: 35ダメージ',
              'フェーズ3: 45ダメージ',
              '回復なしでは耐えられない'
            ]
          }
        ],
        difficulty: '上級',
        victory_condition: '閃光魔法 + 麻痺魔法 + 回復魔法の完璧な組み合わせ'
      }
    ];

    // 敵別攻略情報
    const enemyGuides = [
      {
        name: '👹 影の獣攻略法 (ステージ9)',
        stage: 9,
        category: 'strategy',
        type: 'special_enemy',
        description: '完全回避能力を持つ影の獣との戦闘法',
        abilities: [
          '通常攻撃完全回避',
          '炎・氷・雷・水魔法完全回避',
          'ライデン完全回避',
          '高威力攻撃 (50ダメージ)'
        ],
        weakness: [
          '閃光魔法のみ有効',
          '麻痺魔法は効果あり'
        ],
        strategy: [
          '閃光魔法以外の攻撃は無意味',
          '高ダメージに対して回復魔法で対抗',
          '麻痺魔法で敵の行動を制限'
        ],
        difficulty: '上級'
      },
      {
        name: '🐸 ポイズンコング攻略法 (ステージ6)',
        stage: 6,
        category: 'strategy',
        type: 'special_enemy',
        description: '毒攻撃を使用するポイズンコングとの戦闘法',
        abilities: [
          '毒攻撃による継続ダメージ',
          '高い体力',
          '物理攻撃耐性'
        ],
        weakness: [
          '魔法攻撃に弱い',
          '解毒薬で毒を治療可能'
        ],
        strategy: [
          '事前に解毒薬を調合しておく',
          '毒状態になったら即座に解毒薬使用',
          '魔法攻撃を中心に戦う'
        ],
        difficulty: '中級'
      },
      {
        name: '🔮 ミラージュウィザード攻略法 (ステージ11)',
        stage: 11,
        category: 'strategy',
        type: 'special_enemy',
        description: '変数と攻撃反射システムを使用したミラージュウィザードとの戦闘法',
        abilities: [
          '3種類の魔法攻撃（幻影の矢、魔力の奔流、神秘の衝撃）',
          '攻撃名を記録して反射できる',
          '変数システムによる高度な戦闘'
        ],
        weakness: [
          '自身の攻撃を反射されると大ダメージ',
          '変数を使った攻撃に弱い'
        ],
        strategy: [
          '敵の攻撃名をログから確認',
          '攻撃名を変数に記憶する',
          '変換→強化の順で反射攻撃を実行',
          '⚠️ 重要：変数ブロックを使用すると経験値が大幅増加',
          '⚠️ 注意：手入力では経験値が激減（30%）'
        ],
        difficulty: '中級',
        important_notes: [
          '変数を使って敵の攻撃を吸収・反射しましょう！',
          '⚠️ 手入力は経験値激減！変数ブロックを活用しよう！',
          '変数使用時の経験値ボーナス：記憶×2倍、変換×2倍、強化×2倍',
          '完璧（全て変数使用）：最大8倍の経験値！'
        ]
      },
      {
        name: '🐾 ビーストマスター攻略法 (ステージ12)',
        stage: 12,
        category: 'strategy',
        type: 'special_enemy',
        description: 'カスタム変数とリストシステムを駆使したビーストマスターとの戦闘法',
        abilities: [
          '3種類の野生攻撃（獣の咆哮、ペット連携攻撃、野生の本能）',
          '同じ攻撃を連続使用すると威力が上昇',
          '攻撃パターンをリストに記録可能'
        ],
        weakness: [
          '攻撃パターンを予測されると弱い',
          '条件分岐による適切な対応に弱い'
        ],
        strategy: [
          'システム変数「敵の技名」を使って攻撃を確認',
          'カスタムリストに攻撃履歴を記録',
          '条件分岐で攻撃名に応じた対応を実行',
          '獣の咆哮（18ダメージ）→ 回復または通常攻撃',
          'ペット連携攻撃（12ダメージ）→ 通常攻撃で対処',
          '🚨 野生の本能（80ダメージ）→ 必ず氷の盾で防御！',
          '⚠️ 重要：カスタム変数/リストを活用すると経験値大幅増加'
        ],
        difficulty: '中級',
        important_notes: [
          'システム変数「敵の技名」で最新の攻撃名を取得！',
          'カスタムリストで攻撃履歴を管理しよう！',
          '条件分岐ブロックで攻撃名をチェック',
          '🚨 野生の本能は80ダメージ！必ず氷の盾を唱えること！',
          '連続同一攻撃はダメージが増加するので注意',
          'カスタム変数/リストの使用で経験値ボーナス獲得'
        ]
      }
    ];

    // 薬学
    const alchemy = [
      {
        name: '💊 解毒薬作成',
        stage: 6,
        category: 'alchemy',
        usage: '「解毒薬を作る」ブロックを使用',
        description: '解毒薬を調合する',
        effect: '毒状態を治療できる薬を作成',
        notes: [
          '作成には1ターン必要',
          '作成した解毒薬は任意のタイミングで使用可能',
          'ポイズンコングの毒攻撃に備えて作成しておくと良い',
          '一度に複数個持つことはできない'
        ],
        difficulty: '中級'
      },
      {
        name: '🧪 ポーション使用',
        stage: 6,
        category: 'alchemy',
        usage: '「薬を使用する」ブロックを使用',
        description: '調合した薬を使用する',
        effect: '対応する状態異常を治療',
        notes: [
          '解毒薬を使用すると毒状態が治療される',
          '使用するには事前に調合が必要',
          '使用しても新しい毒には再度かかる可能性がある',
          'タイミングを見極めて使用することが重要'
        ],
        difficulty: '中級'
      }
    ];

    // 制御構造
    const controlStructures = [
      {
        name: '🔄 2回繰り返し',
        stage: 8,
        category: 'control',
        usage: '「2回繰り返す」ブロックを使用',
        description: '指定したコマンドを2回連続で実行',
        effect: 'ブロック内の処理を2回繰り返す',
        notes: [
          'ブロック内に複数のコマンドを配置可能',
          '攻撃や魔法を連続で放つのに便利',
          'HPの残量に注意して使用する',
          'ゴブリン部隊への全体攻撃と組み合わせると効果的',
          '繰り返しの途中でHPが0になると中断される'
        ],
        difficulty: '中級'
      }
    ];

    // 変数システム
    const variableSystems = [
      {
        name: '📊 システム変数「敵の技名」',
        stage: 12,
        category: 'variables',
        usage: 'システム変数カテゴリから「敵の技名を取得」ブロックを使用',
        description: '敵が直前に使用した技の名前を自動的に記録するシステム変数',
        effect: '敵の攻撃名を取得し、条件分岐に活用',
        notes: [
          '敵が攻撃するたびに自動的に更新される',
          '条件分岐ブロックと組み合わせて使用',
          '攻撃名に応じた戦略を実行可能',
          '例：「獣の咆哮」なら防御、「野生の本能」なら回復',
          'プレイヤーが設定・変更することはできない'
        ],
        difficulty: '中級'
      },
      {
        name: '📝 カスタム変数',
        stage: 12,
        category: 'variables',
        usage: '変数エディタで作成、カスタム変数カテゴリからブロックを使用',
        description: 'プレイヤーが自由に作成・使用できる変数システム',
        effect: '任意の値を保存し、後で取得・使用可能',
        notes: [
          '変数エディタで新しい変数を作成',
          '変数名は自由に設定可能',
          '文字列、数値など任意の値を保存',
          '「○○を取得」で値を読み取り',
          '「○○を△△と設定」で値を保存',
          '条件分岐や攻撃パターンの記録に活用'
        ],
        difficulty: '中級'
      },
      {
        name: '📋 カスタムリスト',
        stage: 12,
        category: 'variables',
        usage: 'リストエディタで作成、カスタムリストカテゴリからブロックを使用',
        description: '複数の値を順番に保存できるリストシステム',
        effect: '攻撃履歴やパターンを記録・管理',
        notes: [
          'リストエディタで新しいリストを作成',
          'リスト名は自由に設定可能',
          '「○○に△△を追加」で値を追加',
          '「○○の□番目を取得」で値を読み取り',
          '「○○の長さを取得」でリストのサイズを確認',
          '敵の攻撃パターンの記録に最適',
          'インデックスは0から始まる'
        ],
        difficulty: '中級'
      },
      {
        name: '🔀 条件分岐',
        stage: 12,
        category: 'variables',
        usage: '制御カテゴリから「もし～なら」ブロックを使用',
        description: '条件によって処理を分岐させる制御構造',
        effect: '変数の値に応じて異なる行動を実行',
        notes: [
          '「もし～なら」ブロックで条件を設定',
          '「文字列が等しい」で変数の値を比較',
          'システム変数「敵の技名」と組み合わせて使用',
          '敵の攻撃に応じた最適な対応が可能',
          '複数の条件を組み合わせることも可能'
        ],
        difficulty: '中級'
      }
    ];

    // カテゴリごとにコンテンツを作成
    const allCategories = [
      { title: '⚔️ 基本コマンド', items: basicCommands, categoryKey: 'basic_actions' },
      { title: '🔥 パターンベース魔法', items: magicSpells, categoryKey: 'magic' },
      { title: '🧪 薬学', items: alchemy, categoryKey: 'alchemy' },
      { title: '🔄 制御構造', items: controlStructures, categoryKey: 'control' },
      { title: '📊 変数システム', items: variableSystems, categoryKey: 'variables' },
      { title: '🛡️ ボス攻略法', items: bossStrategies, categoryKey: 'strategy' },
      { title: '👹 敵別攻略情報', items: enemyGuides, categoryKey: 'strategy' }
    ];

    // 現在のステージで表示可能なカテゴリをフィルタリング
    const allowedCategories = this.getAllowedCategories(currentStage);
    
    allCategories.forEach(category => {
      // カテゴリが現在のステージで表示可能かチェック
      if (!allowedCategories.includes(category.categoryKey) && category.categoryKey !== 'basic_actions') {
        return; // basic_actionsは常に表示、それ以外は許可されたもののみ
      }

      // カテゴリ内のアイテムをフィルタリング
      const filteredItems = category.items.filter(item => this.isItemAllowedInStage(item, currentStage));
      
      // 表示可能なアイテムがない場合はカテゴリをスキップ
      if (filteredItems.length === 0) {
        return;
      }

      // カテゴリヘッダー
      const categoryHeader = document.createElement('h2');
      categoryHeader.textContent = category.title;
      categoryHeader.style.cssText = `
        color: #ffd700;
        margin: 30px 0 15px 0;
        font-size: 24px;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        border-bottom: 2px solid #8b6914;
        padding-bottom: 10px;
      `;
      content.appendChild(categoryHeader);

      // カテゴリ内の各アイテム
      filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'spell-entry';
        itemDiv.style.cssText = `
          margin-bottom: 25px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #8b6914;
          border-radius: 8px;
        `;

        const itemName = document.createElement('h3');
        itemName.textContent = `${item.name} ${item.stage ? `(ステージ${item.stage}〜)` : ''}`;
        itemName.style.cssText = `
          margin: 0 0 10px 0;
          color: #ffd700;
          font-size: 18px;
        `;

        const description = document.createElement('p');
        description.textContent = item.description;
        description.style.cssText = `
          margin: 10px 0;
          font-style: italic;
          color: #e6d3a3;
        `;

        // パターンまたは使用方法
        if (item.pattern || item.usage) {
          const patternDiv = document.createElement('div');
          patternDiv.style.cssText = `
            background: rgba(255, 215, 0, 0.1);
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            border: 1px solid #8b6914;
          `;
          
          const patternLabel = document.createElement('strong');
          patternLabel.textContent = item.pattern ? '詠唱パターン: ' : '使用方法: ';
          patternLabel.style.color = '#ffd700';
          
          const patternText = document.createElement('span');
          patternText.textContent = item.pattern || item.usage;
          patternText.style.cssText = `
            font-family: 'Courier New', monospace;
            color: #fff;
            font-weight: bold;
          `;
          
          patternDiv.appendChild(patternLabel);
          patternDiv.appendChild(patternText);
          itemDiv.appendChild(patternDiv);
        }

        // 効果情報
        const effectInfo = document.createElement('div');
        effectInfo.style.cssText = `
          margin: 10px 0;
          font-size: 14px;
        `;
        
        if (item.damage) {
          const damageSpan = document.createElement('span');
          damageSpan.innerHTML = `<strong>威力:</strong> ${item.damage}`;
          damageSpan.style.color = '#ff6b6b';
          effectInfo.appendChild(damageSpan);
        }
        
        if (item.effect) {
          const effectSpan = document.createElement('span');
          effectSpan.innerHTML = `<strong>効果:</strong> ${item.effect}`;
          effectSpan.style.color = '#51cf66';
          effectInfo.appendChild(effectSpan);
        }

        // 難易度
        if (item.difficulty) {
          const difficulty = document.createElement('div');
          difficulty.innerHTML = `<strong>難易度:</strong> ${item.difficulty}`;
          difficulty.style.cssText = `
            margin: 5px 0;
            font-size: 14px;
            color: ${item.difficulty === '初級' ? '#51cf66' : '#ffd43b'};
          `;
          itemDiv.appendChild(difficulty);
        }

        // 注意事項
        if (item.notes && item.notes.length > 0) {
          const notesTitle = document.createElement('h4');
          notesTitle.textContent = '📝 注意事項';
          notesTitle.style.cssText = `
            margin: 15px 0 5px 0;
            color: #ffd700;
            font-size: 14px;
          `;
          itemDiv.appendChild(notesTitle);

          const notesList = document.createElement('ul');
          notesList.style.cssText = `
            margin: 10px 0;
            padding-left: 20px;
            color: #c9b037;
          `;
          
          item.notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            li.style.cssText = `
              margin: 5px 0;
              color: #d4c77a;
            `;
            notesList.appendChild(li);
          });
          
          itemDiv.appendChild(notesList);
        }

        // 戦略情報（ボス攻略法用）
        if (item.strategies && item.strategies.length > 0) {
          const strategiesTitle = document.createElement('h4');
          strategiesTitle.textContent = '⚔️ 攻略戦略';
          strategiesTitle.style.cssText = `
            margin: 15px 0 5px 0;
            color: #ff6b6b;
            font-size: 16px;
          `;
          itemDiv.appendChild(strategiesTitle);

          item.strategies.forEach(strategy => {
            const strategyDiv = document.createElement('div');
            strategyDiv.style.cssText = `
              margin: 10px 0;
              padding: 12px;
              background: rgba(255, 107, 107, 0.1);
              border-left: 3px solid #ff6b6b;
              border-radius: 5px;
            `;

            const phaseTitle = document.createElement('strong');
            phaseTitle.textContent = `${strategy.phase} - ${strategy.requirement}`;
            phaseTitle.style.cssText = `
              color: #ff6b6b;
              display: block;
              margin-bottom: 5px;
            `;

            const importance = document.createElement('span');
            importance.textContent = `[${strategy.importance}]`;
            importance.style.cssText = `
              color: ${strategy.importance === '最重要' ? '#ff4757' : '#ffa502'};
              font-weight: bold;
              font-size: 12px;
              margin-left: 10px;
            `;

            const strategyDesc = document.createElement('p');
            strategyDesc.textContent = strategy.description;
            strategyDesc.style.cssText = `
              margin: 8px 0;
              color: #f1c40f;
              font-style: italic;
            `;

            if (strategy.details && strategy.details.length > 0) {
              const detailsList = document.createElement('ul');
              detailsList.style.cssText = `
                margin: 5px 0;
                padding-left: 20px;
                color: #e17055;
              `;

              strategy.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                li.style.cssText = `
                  margin: 3px 0;
                  color: #fdcb6e;
                  font-size: 13px;
                `;
                detailsList.appendChild(li);
              });
              
              strategyDiv.appendChild(phaseTitle);
              phaseTitle.appendChild(importance);
              strategyDiv.appendChild(strategyDesc);
              strategyDiv.appendChild(detailsList);
            } else {
              strategyDiv.appendChild(phaseTitle);
              phaseTitle.appendChild(importance);
              strategyDiv.appendChild(strategyDesc);
            }

            itemDiv.appendChild(strategyDiv);
          });

          if (item.victory_condition) {
            const victoryDiv = document.createElement('div');
            victoryDiv.style.cssText = `
              margin: 15px 0;
              padding: 12px;
              background: rgba(116, 185, 255, 0.2);
              border: 2px solid #74b9ff;
              border-radius: 8px;
            `;

            const victoryTitle = document.createElement('strong');
            victoryTitle.textContent = '🏆 勝利条件';
            victoryTitle.style.cssText = `
              color: #74b9ff;
              display: block;
              margin-bottom: 8px;
              font-size: 14px;
            `;

            const victoryText = document.createElement('p');
            victoryText.textContent = item.victory_condition;
            victoryText.style.cssText = `
              margin: 0;
              color: #ddd;
              font-weight: bold;
            `;

            victoryDiv.appendChild(victoryTitle);
            victoryDiv.appendChild(victoryText);
            itemDiv.appendChild(victoryDiv);
          }
        }

        // 敵攻略情報用の表示
        if (item.abilities || item.weakness || item.strategy) {
          const enemyInfoDiv = document.createElement('div');
          enemyInfoDiv.style.cssText = `
            margin: 15px 0;
            padding: 12px;
            background: rgba(255, 63, 52, 0.1);
            border-radius: 8px;
            border: 2px solid #ff3f34;
          `;

          if (item.abilities) {
            const abilitiesTitle = document.createElement('h5');
            abilitiesTitle.textContent = '💀 敵の能力';
            abilitiesTitle.style.cssText = `
              margin: 0 0 8px 0;
              color: #ff3f34;
              font-size: 14px;
            `;
            enemyInfoDiv.appendChild(abilitiesTitle);

            const abilitiesList = document.createElement('ul');
            abilitiesList.style.cssText = `
              margin: 5px 0 15px 0;
              padding-left: 20px;
            `;

            item.abilities.forEach(ability => {
              const li = document.createElement('li');
              li.textContent = ability;
              li.style.cssText = `
                margin: 3px 0;
                color: #ff7675;
              `;
              abilitiesList.appendChild(li);
            });

            enemyInfoDiv.appendChild(abilitiesList);
          }

          if (item.weakness) {
            const weaknessTitle = document.createElement('h5');
            weaknessTitle.textContent = '🎯 弱点';
            weaknessTitle.style.cssText = `
              margin: 0 0 8px 0;
              color: #00b894;
              font-size: 14px;
            `;
            enemyInfoDiv.appendChild(weaknessTitle);

            const weaknessList = document.createElement('ul');
            weaknessList.style.cssText = `
              margin: 5px 0 15px 0;
              padding-left: 20px;
            `;

            item.weakness.forEach(weak => {
              const li = document.createElement('li');
              li.textContent = weak;
              li.style.cssText = `
                margin: 3px 0;
                color: #55efc4;
              `;
              weaknessList.appendChild(li);
            });

            enemyInfoDiv.appendChild(weaknessList);
          }

          if (item.strategy) {
            const strategyTitle = document.createElement('h5');
            strategyTitle.textContent = '🛡️ 攻略法';
            strategyTitle.style.cssText = `
              margin: 0 0 8px 0;
              color: #fdcb6e;
              font-size: 14px;
            `;
            enemyInfoDiv.appendChild(strategyTitle);

            const strategyList = document.createElement('ul');
            strategyList.style.cssText = `
              margin: 5px 0;
              padding-left: 20px;
            `;

            item.strategy.forEach(strat => {
              const li = document.createElement('li');
              li.textContent = strat;
              li.style.cssText = `
                margin: 3px 0;
                color: #f39c12;
              `;
              strategyList.appendChild(li);
            });

            enemyInfoDiv.appendChild(strategyList);
          }

          itemDiv.appendChild(enemyInfoDiv);
        }

        itemDiv.appendChild(itemName);
        itemDiv.appendChild(description);
        if (effectInfo.hasChildNodes()) {
          itemDiv.appendChild(effectInfo);
        }
        
        content.appendChild(itemDiv);
      });
    });
  }

  show() {
    this.updateContentForCurrentStage(); // 表示時に最新のステージ情報で更新
    this.isVisible = true;
    this.container.style.display = 'block';
    
    // フェードイン効果
    this.container.style.opacity = '0';
    this.container.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
      this.container.style.transition = 'all 0.3s ease';
      this.container.style.opacity = '1';
      this.container.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
  }

  /**
   * 現在のステージに応じてコンテンツを更新
   */
  updateContentForCurrentStage() {
    const content = this.container.querySelector('.spellbook-content');
    if (content) {
      // コンテンツをクリアして再作成
      content.innerHTML = '';
      this.populateSpellBook(content);
    }
  }

  /**
   * 外部からステージ更新を通知
   */
  updateForStage(newStage) {
    this.currentStage = newStage;
    if (this.isVisible) {
      this.updateContentForCurrentStage();
    }
  }

  hide() {
    this.container.style.transition = 'all 0.3s ease';
    this.container.style.opacity = '0';
    this.container.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
      this.container.style.display = 'none';
      this.isVisible = false;
    }, 300);
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * デバッグ用：現在のステージと表示可能カテゴリを確認
   */
  debugStageInfo() {
    const currentStage = this.getCurrentStage();
    const allowedCategories = this.getAllowedCategories(currentStage);
    
    console.log('=== SpellBook Debug Info ===');
    console.log('現在のステージ:', currentStage);
    console.log('表示可能カテゴリ:', allowedCategories);
    console.log('魔法の書表示状態:', this.isVisible);
    
    return {
      currentStage,
      allowedCategories,
      isVisible: this.isVisible
    };
  }
}
