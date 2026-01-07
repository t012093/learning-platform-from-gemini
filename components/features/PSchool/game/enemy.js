export class Enemy {
    constructor(scene, ui) {
      this.scene = scene;
      this.ui = ui;
      this.hp = 50;
      this.maxHp = 50; // 最大HP値を追加
      this.sprite = null; // スプライト参照用
      this.name = '敵'; // 敵の名前
    }
  
    async takeTurn() {
      this.ui.log("敵のターン！");
      await delay(500);
      
      // シーンの直接メソッドではなくスプライトのアニメーションを使用
      if (this.sprite) {
        // Phaserのスプライトアニメーションを使用
        this.sprite.setTint(0xff0000); // 赤く点滅（攻撃エフェクト）
        await delay(200);
        this.sprite.clearTint();
      }
      
      const damage = Math.floor(Math.random() * 10) + 5;
      this.ui.log(`敵の攻撃！${damage}ダメージ！`);
      
      // プレイヤーのHPを減らす処理
      // ここではsceneからplayerを参照する必要がある
      if (this.scene.player) {
        this.scene.player.hp -= damage;
        this.ui.updateHP(this.scene.player.hp, this.hp);
        
        // プレイヤーのHPがゼロ以下になったかチェック
        if (this.scene.player.hp <= 0) {
          this.ui.log("プレイヤーは倒れた！敵の勝利！");
          await delay(1000);
          // ゲームオーバー状態に移行
          if (this.scene.gameOver) {
            this.scene.gameOver(false); // false = プレイヤー敗北
          }
          return false;
        }
      }
      
      await delay(1000);
      return true;
    }
    
  // 攻撃名を表示するメソッド（ステージ11以降用）
  displayAttack(attackName, damage) {
    this.ui.log(`${this.name}の攻撃！`);
    this.ui.log(`📝 攻撃名: ${attackName}`);
    this.ui.log(`💥 ${damage}ダメージ！`);
  }
  
  // 攻撃を実行してダメージを与えるメソッド（ステージ11以降用）
  performAttack(attackName, damage) {
    // システム変数「敵の技名」を更新
    if (!this.scene.customVariables) {
      this.scene.customVariables = {};
    }
    this.scene.customVariables['敵の技名'] = attackName;
    
    // 攻撃名を表示
    this.displayAttack(attackName, damage);
    
    // プレイヤーにダメージを与える
    if (this.scene.player) {
      const newPlayerHP = Math.max(0, this.scene.player.getHP() - damage);
      this.scene.player.setHP(newPlayerHP);
      
      // HPバーを更新
      if (this.scene.updateHP) {
        this.scene.updateHP(this.scene.player.getHP(), this.getHP());
      }
      
      // プレイヤーが倒れたかチェック
      if (this.scene.player.getHP() <= 0) {
        if (this.scene.playerLose) {
          this.scene.playerLose();
        }
        return false;
      }
    }
    
    return true;
  }
  
  // 敵の名前を設定するメソッド
  setName(name) {
    this.name = name;
  }    // HP取得メソッド
    getHP() {
      return this.hp;
    }
    
    // HP設定メソッド
    setHP(value) {
      this.hp = value;
    }
}

// delay関数をインポート
import { delay } from './utils';
