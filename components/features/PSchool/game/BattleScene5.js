import Phaser from "phaser";
import { BattleScene } from "./battle";

// ステージ5「時間との勝負」用のバトルシーン
export class BattleScene5 extends BattleScene {
  constructor() {
    super({ key: "Stage5Battle" });
    this.settings = {
      background: 'clock_bg',
      enemy: 'timeeater',
      stageNumber: 5
    };
    
    // タイムイーターの強化までの時間
    this.powerUpTime = 20000; // 20秒後に強化
    this.powerUpTriggered = false;
  }

  create() {
    super.create();
    
    // ステージ5の設定
    this.setupStageCommon({
      backgroundColor: 0x2a1a3d, // 時計の紫色背景
      enemyTint: 0x8a2be2, // タイムイーターの紫色
      enemyHp: 30,
      startMessage: `ステージ5「時間との勝負」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'heal_magic', 'wave_left_hand', 'wave_right_hand', 'cast_magic', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: '敵が強化される前に素早く倒しましょう！時間制限があります！'
      }
    });
    
    this.addLog('⏰ 時間制限バトル開始！20秒以内に倒せ！');
    this.addLog('💡 攻撃・回復・魔法詠唱を駆使して素早く倒そう！');
    this.createTimeEffect();
    this.startTimer();
  }

  createTimeEffect() {
    // 時計のエフェクト
    const clockGlow = this.add.graphics();
    clockGlow.fillStyle(0x8a2be2, 0.3);
    clockGlow.fillCircle(this.scale.width * 0.1, this.scale.height * 0.1, 30);
    
    this.tweens.add({
      targets: clockGlow,
      alpha: { from: 0.3, to: 0.7 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  startTimer() {
    // 強化タイマー
    this.time.delayedCall(this.powerUpTime, () => {
      if (!this.powerUpTriggered && this.enemy && this.enemy.hp > 0) {
        this.powerUpEnemy();
      }
    });

    // 警告タイマー
    this.time.delayedCall(this.powerUpTime - 5000, () => {
      this.addLog('⚠️ あと5秒で敵が強化されます！');
    });
  }

  powerUpEnemy() {
    this.powerUpTriggered = true;
    if (this.enemy) {
      this.enemy.maxHp += 20;
      this.enemy.hp += 20;
      this.addLog('💀 タイムイーターが強化されました！HP+20、攻撃力アップ！');
      if (this.enemySprite) {
        this.enemySprite.setTint(0xff4500); // 強化時の赤色
      }
    }
  }
}
