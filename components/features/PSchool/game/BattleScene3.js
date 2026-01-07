import Phaser from 'phaser';
import { BattleScene } from './battle';

// ステージ3「魔法の詠唱」用のバトルシーン
export class BattleScene3 extends BattleScene {
  constructor() {
    super({ key: 'Stage3Battle' });
    this.settings = {
      background: 'volcano',
      enemy: 'firegoblin',
      stageNumber: 3
    };
    
    // 魔法詠唱の状態を追跡
    this.spellCastState = {
      sequence: [],
      isActive: false,
      requiredPattern: ['right', 'right', 'left'] // 炎の魔法のパターン
    };
  }

  create() {
    super.create();
    
    // ステージ3の設定
    this.setupStageCommon({
      backgroundColor: 0x661400, // 火山地帯の赤い背景
      enemyTint: 0xff4400, // ファイアゴブリンの赤っぽいオレンジ色
      enemyHp: 20,
      startMessage: `ステージ3「魔法の詠唱」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'wave_left_hand', 'wave_right_hand', 'cast_magic', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: '📖 魔法の書を参照して、詠唱パターンを確認しましょう'
      }
    });
    
    this.addLog('✨ 魔法の詠唱を覚えましょう！');
    this.addLog('💡 左手→右手で炎の魔法、左手→左手で氷の魔法を発動できます！');
    this.addLog('📖 魔法の書（右下）で詠唱パターンを確認しましょう');
    this.createFireEffect();
  }

  createFireEffect() {
    // 火山のエフェクト
    const fireGlow = this.add.graphics();
    fireGlow.fillStyle(0xff4400, 0.3);
    fireGlow.fillRect(0, this.scale.height * 0.8, this.scale.width, this.scale.height * 0.2);
    
    this.tweens.add({
      targets: fireGlow,
      alpha: { from: 0.3, to: 0.6 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
  }
}
