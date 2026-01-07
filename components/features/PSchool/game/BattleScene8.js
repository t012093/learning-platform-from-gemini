import Phaser from "phaser";
import { BattleScene } from "./battle";

// ステージ8「行動の繰り返し」用のバトルシーン
export class BattleScene8 extends BattleScene {
  constructor() {
    super({ key: "Stage8Battle" });
    this.settings = {
      background: 'camp',
      enemy: 'goblins',
      stageNumber: 8
    };
    
    // ゴブリン部隊の状態管理
    this.goblins = [];
    this.goblinCount = 5;
    this.goblinBaseHP = 10;
    this.goblinHPTexts = [];
    this.goblinSprites = [];
  }

  create() {
    super.create();
    
    // ステージ8の設定
    this.setupStageCommon({
      backgroundColor: 0x8B4513, // キャンプの茶色背景
      enemyTint: 0x228B22, // ゴブリンの緑色
      enemyHp: 50, // 合計HP（5体×10HP）
      startMessage: `ステージ8「行動の繰り返し」が始まりました！${this.settings.enemy}と対決します！`,
      availableBlocks: ['attack_basic', 'heal_magic', 'cast_fire', 'cast_ice', 'repeat_2x', 'wave_left_hand', 'wave_right_hand', 'wait'],
      delayedMessage: {
        delay: 3000,
        text: 'ゴブリン部隊との戦いです！繰り返しブロックで効率的に攻撃しましょう！'
      }
    });
    
    this.addLog('👥 ゴブリン部隊5体との戦いです！');
    this.addLog('💡 「2回繰り返す」ブロックを使って効率的に攻撃しましょう！');
    this.addLog('✨ 魔法詠唱ブロックで繰り返しを活用すれば、複雑な魔法も簡単に発動できます！');
    this.createCampEffect();
    this.setupGoblinSystem();
  }

  createCampEffect() {
    // キャンプファイアのエフェクト
    const fire = this.add.graphics();
    for (let i = 0; i < 6; i++) {
      const x = this.scale.width * 0.3 + Math.random() * 50;
      const y = this.scale.height * 0.7 + Math.random() * 30;
      fire.fillStyle(0xff4500, 0.7);
      fire.fillCircle(x, y, 5);
      
      this.tweens.add({
        targets: fire,
        y: y - 100,
        alpha: 0,
        scale: 0.5,
        duration: 2000,
        repeat: -1,
        delay: i * 300
      });
    }
  }

  setupGoblinSystem() {
    // ゴブリン部隊の初期化
    for (let i = 0; i < this.goblinCount; i++) {
      this.goblins[i] = {
        hp: this.goblinBaseHP,
        alive: true,
        x: 500 + (i % 3) * 80,
        y: 200 + Math.floor(i / 3) * 80
      };
      
      // HPテキストの表示
      this.goblinHPTexts[i] = this.add.text(
        this.goblins[i].x - 20, 
        this.goblins[i].y - 30, 
        `G${i+1}: ${this.goblins[i].hp}`, 
        {
          fontSize: '12px',
          fill: '#ff0000'
        }
      );
    }
    
    this.updateGoblinDisplay();
  }

  updateGoblinDisplay() {
    const aliveCount = this.goblins.filter(g => g.alive).length;
    this.addLog(`残りゴブリン: ${aliveCount}体`);
  }

  damageGoblin(index, damage) {
    if (index < this.goblinCount && this.goblins[index].alive) {
      this.goblins[index].hp -= damage;
      if (this.goblins[index].hp <= 0) {
        this.goblins[index].alive = false;
        this.goblinHPTexts[index].setText('G' + (index+1) + ': 撃破');
        this.goblinHPTexts[index].setFill('#888888');
      } else {
        this.goblinHPTexts[index].setText('G' + (index+1) + ': ' + this.goblins[index].hp);
      }
      this.updateGoblinDisplay();
    }
  }


}
