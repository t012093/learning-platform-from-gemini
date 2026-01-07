import { BattleScene } from './battle';

// Stage 14 "Resonant Arguments" battle scene
export class BattleScene14 extends BattleScene {
  constructor() {
    super({ key: 'Stage14Battle' });
    this.settings = {
      background: 'crystal_cave',
      enemy: 'crystalgolem',
      stageNumber: 14
    };

    this.elementCycle = [
      { key: 'fire', label: '炎', color: '#ff7043' },
      { key: 'water', label: '水', color: '#4fc3f7' },
      { key: 'thunder', label: '雷', color: '#fdd835' }
    ];
    this.currentWeakness = null;
    this.nextWeakness = null;
    this.pendingElement = null;
    this.prismShieldBroken = false;
    this.functionResolved = false;
    this.executingFunctionName = null;
    this.functionUsed = false;
  }

  create() {
    super.create();

    this.setupStageCommon({
      backgroundColor: 0x140c2b,
      enemyTint: 0xffffff,
      enemyHp: 160,
      startMessage: 'Stage 14 "Resonant Arguments" begins! The Prism Wisp shifts its weakness every turn.',
      availableBlocks: ['custom_function_placeholder', 'attack_basic', 'heal_magic', 'wait'],
      delayedMessage: {
        delay: 3500,
        text: 'Save a function with an element parameter. Call it with "fire" / "water" / "thunder" to break the shield.'
      }
    });

    if (this.enemy) {
      this.enemy.setName('Prism Wisp');
    }

    this.weaknessText = this.add.text(10, 150, '', {
      fontSize: '16px',
      fill: '#ffd54f'
    });
    this.nextWeaknessText = this.add.text(10, 172, '', {
      fontSize: '14px',
      fill: '#bbbbbb'
    });
    this.statusText = this.add.text(10, 196, '属性を引数で指定した関数だけが護りを崩せます。', {
      fontSize: '13px',
      fill: '#f0f0f0'
    });

    this.addLog('プリズムウィスプは毎ターン弱点属性を変化させます。関数ブロックの引数で狙いを定めましょう。');
    this.rollWeaknesses();
  }

  rollWeaknesses() {
    this.currentWeakness = this.currentWeakness || this.randomElement();
    this.nextWeakness = this.randomElement(this.currentWeakness);
    this.updateWeaknessDisplay();
  }

  randomElement(exclude) {
    const candidates = this.elementCycle.filter(el => !exclude || el.key !== exclude.key);
    return candidates[Math.floor(Math.random() * candidates.length)] || this.elementCycle[0];
  }

  updateWeaknessDisplay() {
    const currentLabel = this.currentWeakness ? this.currentWeakness.label : '???';
    const nextLabel = this.nextWeakness ? this.nextWeakness.label : '???';
    if (this.weaknessText) {
      this.weaknessText.setText(`現在の弱点: ${currentLabel}`);
      this.weaknessText.setColor(this.currentWeakness ? this.currentWeakness.color : '#ffd54f');
    }
    if (this.nextWeaknessText) {
      this.nextWeaknessText.setText(`次の予兆: ${nextLabel}`);
    }
  }

  normalizeElementArg(raw) {
    if (!raw && raw !== 0) {
      return null;
    }
    const value = String(raw).trim().toLowerCase();
    if (!value) {
      return null;
    }
    if (['fire', '炎', 'ひ', 'ほのお'].includes(value)) {
      return 'fire';
    }
    if (['water', '水', 'みず', 'みず'].includes(value)) {
      return 'water';
    }
    if (['thunder', '雷', 'かみなり', 'electric'].includes(value)) {
      return 'thunder';
    }
    return null;
  }

  getElementLabel(key) {
    const found = this.elementCycle.find(el => el.key === key);
    return found ? found.label : '???';
  }

  onExecuteSavedFunctionStart(name, args = [], namedArgs = {}) {
    // 基底クラスの実装を呼び出し
    super.onExecuteSavedFunctionStart(name);
    
    // ステージ14固有の処理：引数から属性を取得
    this.functionUsed = true;
    this.executingFunctionName = name;
    this.functionResolved = false;
    this.prismShieldBroken = false;
    
    // 引数から属性を抽出（位置引数または名前付き引数）
    const firstArg = Array.isArray(args) && args.length > 0 ? args[0] : null;
    const namedKeys = namedArgs && typeof namedArgs === 'object' ? Object.keys(namedArgs) : [];
    const namedFirst = namedKeys.length > 0 ? namedArgs[namedKeys[0]] : null;
    this.pendingElement = this.normalizeElementArg(firstArg || namedFirst);
    
    const display = this.pendingElement ? this.getElementLabel(this.pendingElement) : '未設定';
    this.addLog(`関数「${name}」を呼び出し。指定属性: ${display}`);
    if (!this.pendingElement) {
      this.addLog('属性引数が設定されていないため、護りを崩せません。');
    }
  }

  onExecuteSavedFunctionEnd(name) {
    // 基底クラスの実装を呼び出し
    super.onExecuteSavedFunctionEnd(name);
    
    // ステージ14固有の処理
    if (this.executingFunctionName === name && !this.functionResolved) {
      this.addLog('属性共鳴が起きないまま関数が終了しました。');
    }
    this.executingFunctionName = null;
    this.pendingElement = null;
    this.prismShieldBroken = false;
    this.functionResolved = false;
  }

  onExecuteSavedFunctionAction() {
    // 基底クラスの実装を呼び出し
    super.onExecuteSavedFunctionAction();
    
    // ステージ14固有の処理
    this.functionUsed = true;
  }

  async handlePlayerAction(actionType) {
    if (actionType === 'Attack') {
      await this.performPrismStrike();
      return true;
    }
    return false;
  }

  async performPrismStrike() {
    if (this.battleEnded) {
      return;
    }

    if (typeof this.playAnimation === 'function') {
      await this.playAnimation('playerAttack');
    }

    if (!this.executingFunctionName) {
      this.addLog('プリズムは単発攻撃を反射します。引数付きの関数で属性を指定しましょう。');
      this.queueEnemyTurn();
      return;
    }

    if (!this.functionResolved) {
      const matched = this.pendingElement && this.currentWeakness && this.pendingElement === this.currentWeakness.key;
      if (matched) {
        this.functionResolved = true;
        this.prismShieldBroken = true;
        this.addLog(`弱点の${this.currentWeakness.label}と共鳴！護りが砕け散った。`);
        const burstDamage = 32;
        const stillFighting = this.dealDamageToEnemy(burstDamage, 'critical');
        if (stillFighting === false) {
          return;
        }
      } else {
        this.functionResolved = true;
        const backlash = 14;
        this.addLog('属性が一致せず、エネルギーが逆流しました！');
        const newHP = Math.max(0, this.player.getHP() - backlash);
        this.player.setHP(newHP);
        this.updateHP(this.player.getHP(), this.enemy.getHP());
        if (newHP <= 0) {
          this.gameOver(false);
          return;
        }
      }
    } else if (this.prismShieldBroken) {
      const comboDamage = 12;
      this.addLog(`開いた隙を突いて ${comboDamage} ダメージ！`);
      const stillAlive = this.dealDamageToEnemy(comboDamage, 'normal');
      if (stillAlive === false) {
        return;
      }
    } else {
      this.addLog('護りはまだ硬いままです。属性引数を見直してください。');
    }

    this.queueEnemyTurn();
  }

  queueEnemyTurn() {
    if (!this.battleEnded) {
      this.time.delayedCall(900, () => this.enemyAction());
    }
  }

  enemyAction() {
    if (this.battleEnded) {
      return;
    }

    const patterns = [
      { name: 'Prism Ray', damage: 18 },
      { name: 'Shifting Pulse', damage: 16 },
      { name: 'Reflect Burst', damage: 20 }
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    if (this.enemy && typeof this.enemy.performAttack === 'function') {
      this.enemy.performAttack(pattern.name, pattern.damage);
    } else {
      const hp = Math.max(0, this.player.getHP() - pattern.damage);
      this.player.setHP(hp);
      this.updateHP(this.player.getHP(), this.enemy.getHP());
      if (hp <= 0) {
        this.gameOver(false);
        return;
      }
    }

    this.rotateWeakness();
  }

  rotateWeakness() {
    this.currentWeakness = this.nextWeakness || this.randomElement(this.currentWeakness);
    this.nextWeakness = this.randomElement(this.currentWeakness);
    this.prismShieldBroken = false;
    this.functionResolved = false;
    this.pendingElement = null;
    this.addLog(`プリズムが姿を変え、次の弱点は${this.currentWeakness.label}に移りました。`);
    this.updateWeaknessDisplay();
  }
}


