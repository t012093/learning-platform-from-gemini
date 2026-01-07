import Phaser from "phaser";
import { BattleScene } from "./battle";

// ステージ7「雷魔法」用のバトルシーン
export class BattleScene7 extends BattleScene {
  constructor() {
    super({ key: "Stage7Battle" });
    this.settings = {
      background: 'metalcavern',
      enemy: 'metalslime',
      stageNumber: 7
    };
    
    // メタルスライムの特殊状態管理
    this.armorMode = true;
    this.armorHealth = 3;
    this.thunderWeakness = true;
    
    // ダメージ計算用の係数
    this.normalAttackDamage = 2;
    this.fireSpellDamage = 3;
    this.iceSpellDamage = 3;
    this.thunderSpellDamage = 15;
  }

  create() {
    super.create();
    
    // ステージ7の設定
    this.setupStageCommon({
      backgroundColor: 0x404040, // 金属洞窟の灰色背景
      enemyTint: 0x808080, // メタルスライムの金属色
      enemyHp: 20,
      startMessage: `ステージ7「雷魔法」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'heal_magic', 'cast_fire', 'cast_ice', 'cast_thunder', 'wave_left_hand', 'wave_right_hand', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: 'メタルスライムは高い防御力を持っています！雷魔法が効果的です！'
      }
    });
    
    this.addLog('⚡ 装甲の硬いメタルスライムです！雷の魔法（右手→左手）で弱点を突きましょう！');
    this.addLog('💡 複数の属性魔法を使い分けて戦いましょう！');
    this.createMetalEffect();
    this.setupArmorSystem();
  }

  createMetalEffect() {
    // 金属の光沢エフェクト
    const sparkles = this.add.graphics();
    for (let i = 0; i < 8; i++) {
      const x = this.scale.width * 0.7 + Math.random() * 100;
      const y = this.scale.height * 0.4 + Math.random() * 150;
      sparkles.fillStyle(0xffffff, 0.8);
      sparkles.fillCircle(x, y, 3);
      
      this.tweens.add({
        targets: sparkles,
        alpha: 0,
        duration: 2000,
        repeat: -1,
        yoyo: true,
        delay: i * 250
      });
    }
  }

  setupArmorSystem() {
    // 装甲システムの初期化
    this.armorStatusText = this.add.text(10, 150, 'アーマー: 3', {
      fontSize: '16px',
      fill: '#888888'
    });
    this.weaknessText = this.add.text(10, 170, '弱点: 雷', {
      fontSize: '16px',
      fill: '#ffff00'
    });
  }

  damageArmor() {
    if (this.armorHealth > 0) {
      this.armorHealth--;
      this.armorStatusText.setText('アーマー: ' + this.armorHealth);
      if (this.armorHealth === 0) {
        this.armorMode = false;
        this.addLog('⚡ 装甲が破壊されました！通常ダメージが通るようになります！');
        this.armorStatusText.setText('アーマー: 破壊');
        this.armorStatusText.setFill('#ff0000');
      }
    }
  }
}
