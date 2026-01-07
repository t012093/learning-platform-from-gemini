import Phaser from "phaser";
import { BattleScene } from "./battle";

// ステージ6「解毒薬」用のバトルシーン
export class BattleScene6 extends BattleScene {
  constructor() {
    super({ key: "Stage6Battle" });
    this.settings = {
      background: 'laboratory',
      enemy: 'poisonkong',
      stageNumber: 6
    };
    
    // プレイヤーの毒状態管理
    this.playerPoisoned = false;
    this.poisonDamage = 3;
    this.antidotes = 0;
  }

  create() {
    super.create();
    
    // ステージ6の設定
    this.setupStageCommon({
      backgroundColor: 0x2d4a2d, // 研究室の緑色背景
      enemyTint: 0x4d0080, // ポイズンコングの紫色
      enemyHp: 35,
      startMessage: `ステージ6「解毒薬」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'heal_magic', 'make_antidote', 'use_antidote', 'wave_left_hand', 'wave_right_hand', 'cast_magic', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: '毒攻撃に注意！解毒薬を調合して毒を治療しましょう！'
      }
    });
    
    this.addLog('🧪 解毒薬を作成して毒に対抗しましょう！');
    this.addLog('💡 「解毒薬を作る」→「解毒薬を使う」の順番で毒を治療できます！');
    this.createLabEffect();
    this.setupPoisonSystem();
  }

  createLabEffect() {
    // 研究室のエフェクト
    const bubbles = this.add.graphics();
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.scale.width;
      const y = this.scale.height * 0.8 + Math.random() * 100;
      bubbles.fillStyle(0x00ff00, 0.5);
      bubbles.fillCircle(x, y, 8);
      
      this.tweens.add({
        targets: bubbles,
        y: y - 200,
        alpha: 0,
        duration: 3000,
        repeat: -1,
        delay: i * 500
      });
    }
  }

  setupPoisonSystem() {
    // 毒システムの初期化
    this.statusText = this.add.text(10, 150, 'ステータス: 正常', {
      fontSize: '16px',
      fill: '#00ff00'
    });
  }

  applyPoison() {
    if (!this.playerPoisoned) {
      this.playerPoisoned = true;
      this.addLog('💚 毒状態になりました！毎ターン3ダメージを受けます！');
      this.statusText.setText('ステータス: 毒');
      this.statusText.setFill('#ff0000');
    }
  }

  curePoison() {
    if (this.playerPoisoned && this.antidotes > 0) {
      this.playerPoisoned = false;
      this.antidotes--;
      this.addLog('💙 解毒薬を使用！毒が治りました！');
      this.statusText.setText('ステータス: 正常');
      this.statusText.setFill('#00ff00');
    }
  }

  makeAntidote() {
    this.antidotes++;
    this.addLog('🧪 解毒薬を調合しました！在庫: ' + this.antidotes);
  }
}
