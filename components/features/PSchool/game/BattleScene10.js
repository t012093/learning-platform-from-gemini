import Phaser from "phaser";
import { BattleScene } from "./battle";

// ステージ10「初級ボス戦」用のバトルシーン
export class BattleScene10 extends BattleScene {
  constructor() {
    super({ key: "Stage10Battle" });
    this.settings = {
      background: 'dark_castle',
      enemy: 'darkknight',
      stageNumber: 10
    };

    // ダークナイトのフェーズ情報
    this.knightPhase = {
      current: 1,
      hp_thresholds: [100, 50],
      stance: 'defensive',
      shieldActive: true,
      magicShield: true, // 閃光魔法でしか破れないシールド
      weakElement: 'FIRE',
      consecutiveAttacks: 0,
      phase_change_triggered: [false, false],
      chargeAttackPreparing: false, // 麻痺魔法で止められる特殊攻撃の準備中
      chargeAttackTurns: 0
    };

    this.bossDefeated = false;
  }

  create() {
    super.create();
    
    // ステージ10の設定（強化版ダークナイト）
    this.setupStageCommon({
      backgroundColor: 0x1a0d1a, // ダークキャッスルの暗紫色背景
      enemyTint: 0x4a0e4e, // ダークナイトの暗い色
      enemyHp: 150, // 高いHP
      startMessage: `ステージ10「初級ボス戦」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'heal_magic', 'cast_fire', 'cast_ice', 'cast_thunder', 'repeat_3x', 'wave_left_hand', 'wave_right_hand', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: 'ダークナイトボス戦！魔法の組み合わせが勝利の鍵！'
      }
    });
    
    this.addLog('⚔️ 初級ボス「ダークナイト」が立ちはだかる！');
    this.addLog('🛡️ 魔法シールド展開中！閃光魔法(21連続手振り)で破壊せよ！');
    this.addLog('⚡ チャージ攻撃は麻痺魔法(8連続左右)で阻止せよ！');
    this.addLog('💚 回復魔法で体力を維持し、長期戦に備えよ！');
    this.addLog('🔥 弱点属性を見極めて攻撃しよう！');
    this.createDarkAura();
    this.setupBossSystem();
  }

  createDarkAura() {
    // ダークオーラエフェクト
    const aura = this.add.graphics();
    for (let i = 0; i < 8; i++) {
      const x = this.scale.width * 0.7 + Math.random() * 80;
      const y = this.scale.height * 0.4 + Math.random() * 120;
      aura.fillStyle(0x4a0e4e, 0.6);
      aura.fillCircle(x, y, 4);
      
      this.tweens.add({
        targets: aura,
        y: y - 150,
        alpha: 0,
        duration: 3000,
        repeat: -1,
        delay: i * 400
      });
    }
  }

  setupBossSystem() {
    // ボスシステムの初期化
    this.phaseText = this.add.text(10, 150, 'フェーズ: 1', {
      fontSize: '16px',
      fill: '#ff69b4'
    });
    this.weaknessText = this.add.text(10, 170, '弱点: 炎', {
      fontSize: '16px',
      fill: '#ff0000'
    });
    this.shieldText = this.add.text(10, 190, '魔法シールド: 有効', {
      fontSize: '16px',
      fill: '#0099ff'
    });
    this.chargeText = this.add.text(10, 210, '', {
      fontSize: '16px',
      fill: '#ff4500'
    });
  }

  checkPhaseChange() {
    const currentHP = this.enemy.getHP();
    
    // フェーズ2への変化（HP 100以下）
    if (currentHP <= 100 && !this.knightPhase.phase_change_triggered[0]) {
      this.triggerPhaseChange(2);
      this.knightPhase.phase_change_triggered[0] = true;
    }
    // フェーズ3への変化（HP 50以下）
    else if (currentHP <= 50 && !this.knightPhase.phase_change_triggered[1]) {
      this.triggerPhaseChange(3);
      this.knightPhase.phase_change_triggered[1] = true;
    }
  }

  triggerPhaseChange(newPhase) {
    this.knightPhase.current = newPhase;
    this.cameras.main.flash(500, 50, 0, 100);
    
    switch (newPhase) {
      case 2:
        this.addLog("⚔️ フェーズ2移行！魔法シールド強化！チャージ攻撃開始！");
        this.knightPhase.stance = 'offensive';
        this.knightPhase.weakElement = 'ICE';
        this.knightPhase.magicShield = true; // シールドはまだ有効
        this.phaseText.setText('フェーズ: 2');
        this.weaknessText.setText('弱点: 氷');
        this.addLog("⚠️ チャージ攻撃は麻痺魔法で阻止せよ！");
        break;
        
      case 3:
        this.addLog("🔥 フェーズ3移行！最終形態！連続チャージ攻撃！");
        this.knightPhase.stance = 'berserker';
        this.knightPhase.weakElement = 'THUNDER';
        this.knightPhase.magicShield = true; // 最後まで閃光魔法が必要
        this.phaseText.setText('フェーズ: 3');
        this.weaknessText.setText('弱点: 雷');
        this.addLog("⚠️ 最終形態！すべての魔法を駆使せよ！");
        this.createBerserkerEffect();
        break;
    }
  }

  createBerserkerEffect() {
    // バーサーカー状態の赤いエフェクト
    const berserker = this.add.graphics();
    berserker.fillStyle(0xff0000, 0.3);
    berserker.fillCircle(this.scale.width * 0.7, this.scale.height * 0.4, 80);
    
    this.tweens.add({
      targets: berserker,
      alpha: 0,
      duration: 1500,
      repeat: -1,
      yoyo: true
    });
  }

  // 通常攻撃（シールドに阻まれる）
  dealDamageToEnemy(attackType = 'basic', damage = 10) {
    if (this.battleEnded) return;

    if (this.knightPhase.magicShield) {
      this.addLog("🛡️ 魔法シールドに阻まれた！通常攻撃は無効！");
      this.addLog("💡 閃光魔法でシールドを破壊せよ！");
      return;
    }

    // シールドが破壊されていれば通常ダメージ
    this.enemy.hp -= damage;
    this.updateHP(this.player.hp, this.enemy.hp);
    this.addLog(`${damage}ダメージ！`);

    if (this.enemy.hp <= 0) {
      this.gameOver(true);
      return;
    }
  }

  playerCastSpell(spell) {
    if (this.battleEnded) return;

    let damage = spell === 'FIRE' ? 20 : spell === 'ICE' ? 15 : spell === 'THUNDER' ? 18 : 10;
    let effectiveness = 1.0;

    // 魔法シールド判定（閃光魔法以外は大幅軽減）
    if (this.knightPhase.magicShield) {
      effectiveness *= 0.2; // 80%軽減
      this.addLog("�️ 魔法シールドがダメージを大幅軽減！");
    }

    // 弱点判定
    if (spell === this.knightPhase.weakElement && !this.knightPhase.magicShield) {
      effectiveness = 1.5;
      this.addLog(`� 弱点を突いた！${spell}魔法が効果的だ！`);
    }

    const finalDamage = Math.floor(damage * effectiveness);
    const newHP = Math.max(0, this.enemy.getHP() - finalDamage);
    this.enemy.setHP(newHP);

    this.addLog(`${spell}の魔法！ダークナイトに ${finalDamage} のダメージ！`);
    this.checkPhaseChange();
    this.updateHP(this.player.getHP(), this.enemy.getHP());

    if (this.enemy.getHP() <= 0) {
      this.playerWin();
      return;
    }

    this.time.delayedCall(1000, () => this.enemyAction());
  }

  // 閃光魔法のオーバーライド（シールド破壊効果）
  async applyFlashEffect(damage) {
    if (this.battleEnded) return;

    this.addLog("⚡ 閃光魔法発動！");

    // シールド破壊効果
    if (this.knightPhase.magicShield) {
      this.addLog("💥 魔法シールドが破壊された！");
      this.knightPhase.magicShield = false;
      this.shieldText.setText('魔法シールド: 破壊');
      this.shieldText.setFill('#ff0000');
      
      // シールド破壊エフェクト
      this.cameras.main.flash(300, 255, 255, 255);
    }
    
    // 閃光エフェクト
    await this.playFlashAnimation();
    
    // ダメージ処理（回避無効、シールド無視）
    if (this.enemy) {
      this.enemy.hp -= damage;
      this.updateHP(this.player.hp, this.enemy.hp);
      
      this.addLog(`⚡ 敵に${damage}ダメージ！（シールド無視）`);
      
      // 敵のHPが0になったかチェック
      if (this.enemy.hp <= 0) {
        this.addLog("ダークナイトを倒した！閃光魔法をマスターした！");
        this.gameOver(true);
      }
    }
  }

  async enemyTurn() {
    if (this.battleEnded) return;

    // 麻痺状態チェック
    if (this.paralyzeTurns > 0) {
      this.addLog("ダークナイトは麻痺で動けない！");
      this.decreaseParalyzeEffect();
      
      // チャージ攻撃がキャンセルされた
      if (this.knightPhase.chargeAttackPreparing) {
        this.addLog("💡 チャージ攻撃が麻痺でキャンセルされた！");
        this.knightPhase.chargeAttackPreparing = false;
        this.knightPhase.chargeAttackTurns = 0;
        this.chargeText.setText('');
      }
      return;
    }

    // チャージ攻撃システム
    if (this.knightPhase.current >= 2) {
      if (!this.knightPhase.chargeAttackPreparing && Math.random() < 0.6) {
        // チャージ攻撃開始
        this.knightPhase.chargeAttackPreparing = true;
        this.knightPhase.chargeAttackTurns = 2;
        this.addLog("⚠️ ダークナイトが破滅の剣を構えた！");
        this.addLog("💀 2ターン後に即死攻撃発動！麻痺魔法で阻止せよ！");
        this.chargeText.setText(`破滅の剣チャージ: ${this.knightPhase.chargeAttackTurns}ターン`);
        return;
      }

      if (this.knightPhase.chargeAttackPreparing) {
        this.knightPhase.chargeAttackTurns--;
        
        if (this.knightPhase.chargeAttackTurns > 0) {
          this.addLog(`⚠️ 破滅の剣チャージ中...あと${this.knightPhase.chargeAttackTurns}ターン！`);
          this.chargeText.setText(`破滅の剣チャージ: ${this.knightPhase.chargeAttackTurns}ターン`);
          return;
        } else {
          // 即死攻撃発動
          this.addLog("💀 破滅の剣！即死攻撃！");
          this.addLog("プレイヤーは倒れた...麻痺魔法で阻止するべきだった！");
          this.knightPhase.chargeAttackPreparing = false;
          this.chargeText.setText('');
          this.gameOver(false);
          return;
        }
      }
    }

    // 通常攻撃
    const damage = this.knightPhase.current === 1 ? 25 : 
                   this.knightPhase.current === 2 ? 35 : 45;
    
    const attacks = this.knightPhase.current === 1 ? 
      ['闇の剣撃', '魔力放射'] : 
      this.knightPhase.current === 2 ? 
      ['連続斬撃', '闇の波動'] : 
      ['狂戦士の一撃', '絶望の咆哮'];
    
    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    this.addLog(`ダークナイトの${attack}！`);
    
    this.player.hp -= damage;
    this.updateHP(this.player.hp, this.enemy.hp);
    this.addLog(`プレイヤーは${damage}ダメージを受けた！`);

    if (this.player.hp <= 0) {
      this.addLog("プレイヤーは倒れた...回復魔法で体力を維持するべきだった！");
      this.gameOver(false);
    }
  }

  gameOver(victory) {
    this.battleEnded = true;
    
    if (victory) {
      this.addLog("🎉 ダークナイトボスを撃破！");
      this.addLog("✨ すべての魔法を駆使した見事な戦いだった！");
      this.addLog("🏆 麻痺魔法、閃光魔法、回復魔法をマスターした！");
      
      // 勝利エフェクト
      this.cameras.main.flash(1000, 255, 215, 0);
      
      // 次のステージへの遷移
      this.time.delayedCall(3000, () => {
        this.scene.start('MapSelectionScene');
      });
    } else {
      this.addLog("💀 ゲームオーバー...");
      this.addLog("💡 ヒント: 閃光魔法でシールド破壊、麻痺魔法でチャージ阻止、回復魔法で体力維持！");
      
      // 敗北エフェクト
      this.cameras.main.fade(2000, 139, 0, 0);
      
      // リトライ
      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }
}
