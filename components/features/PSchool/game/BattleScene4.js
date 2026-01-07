import Phaser from 'phaser';
import { BattleScene } from './battle';

// ステージ4「氷の盾」用のバトルシーン
export class BattleScene4 extends BattleScene {
  constructor() {
    super({ key: 'Stage4Battle' });
    this.settings = {
      background: 'snow',
      enemy: 'flamewolf',
      stageNumber: 4
    };
    
    // 魔法詠唱の状態を追跡
    this.spellCastState = {
      sequence: [],
      isActive: false,
      requiredPattern: ['left', 'left'] // 氷の魔法のパターン
    };
  }

  create() {
    super.create();
    
    // ステージ4の設定
    this.setupStageCommon({
      backgroundColor: 0x4d79a4, // 雪原の青い背景
      enemyTint: 0xff6600, // フレイムウルフのオレンジ色
      enemyHp: 25,
      startMessage: `ステージ4「氷の盾」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'wave_left_hand', 'wave_right_hand', 'cast_magic', 'ice_shield', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: '左手→左手の順番で氷の魔法を発動し、敵の攻撃を防ぎましょう！'
      }
    });
    
    this.addLog('🛡️ 氷の盾（左手→左手）で敵の炎攻撃を防ぎましょう！');
    this.addLog('💡 魔法詠唱ブロックで左手を2回振ると氷の盾を展開できます！');
    this.createSnowEffect();
  }

  createSnowEffect() {
    // 雪のエフェクト
    for (let i = 0; i < 20; i++) {
      const snowflake = this.add.graphics();
      snowflake.fillStyle(0xffffff, 0.8);
      snowflake.fillCircle(Math.random() * this.scale.width, Math.random() * this.scale.height, 2);
      
      this.tweens.add({
        targets: snowflake,
        y: `+=${this.scale.height + 50}`,
        x: `+=${(Math.random() - 0.5) * 100}`,
        duration: 3000 + Math.random() * 2000,
        repeat: -1
      });
    }
  }
}
