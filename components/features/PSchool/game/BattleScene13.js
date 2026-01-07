import { BattleScene } from './battle';

// Stage 13 "First Functions" - Learning function definition and calling
export class BattleScene13 extends BattleScene {
  constructor() {
    super({ key: 'Stage13Battle' });
    this.settings = {
      background: 'armory',
      enemy: 'twinblade',
      stageNumber: 13
    };

    this.guardActive = true;
    this.functionUsed = false;
    this.executingFunctionName = null;
    this.currentFunctionHits = 0;
    this.comboGoal = 3;
    this.justBrokeGuard = false;
    this.totalTurns = 0;
    this.functionCallCount = 0;
  }

  create() {
    super.create();

    this.guardActive = true;
    this.functionUsed = false;
    this.executingFunctionName = null;
    this.currentFunctionHits = 0;
    this.comboGoal = 3;
    this.justBrokeGuard = false;
    this.totalTurns = 0;
    this.functionCallCount = 0;

    this.setupStageCommon({
      backgroundColor: 0x2d1b15,
      enemyTint: 0xcbd6ff,
      enemyHp: 120,
      startMessage: 'Stage 13: The Twinblade Knights fight with perfect coordination!',
      availableBlocks: ['custom_function_placeholder', 'attack_basic', 'heal_magic', 'wait'],
      delayedMessage: {
        delay: 3500,
        text: 'Their linked guard blocks single attacks. Use a function to chain 3 attacks together!'
      }
    });

    if (this.enemy) {
      this.enemy.setName('Twinblade Knights');
    }

    this.guardText = this.add.text(10, 150, '', {
      fontSize: '16px',
      fill: '#fdd835',
      fontStyle: 'bold'
    });
    this.statusText = this.add.text(10, 172, '', {
      fontSize: '14px',
      fill: '#f0f0f0'
    });
    this.hintText = this.add.text(10, 194, '', {
      fontSize: '13px',
      fill: '#81d4fa'
    });

    this.addLog('=== Stage 13: First Functions ===');
    this.addLog('The Twinblade Knights have a linked guard that blocks scattered attacks.');
    this.addLog('💡 Hint: Open the variable editor (bottom left) → Functions tab');
    this.addLog('💡 Create a function that does: Attack → Attack → Attack');
    this.addLog('💡 Then call it from your main program to break their guard!');
    this.resetDualGuard();
  }

  resetDualGuard() {
    this.guardActive = true;
    this.comboHitsThisTurn = 0;
    this.currentFunctionHits = 0;
    if (this.guardText) {
      this.guardText.setText('🛡️ Linked Guard: ACTIVE');
      this.guardText.setColor('#fdd835');
    }
    if (this.statusText) {
      this.statusText.setText(`Need 3 hits in ONE function call to break it!`);
    }
    if (this.hintText) {
      if (this.functionCallCount === 0) {
        this.hintText.setText('💡 Tip: Create a function with 3 attacks, then call it!');
      } else {
        this.hintText.setText('');
      }
    }
    if (this.enemy && typeof this.enemy.setTint === 'function') {
      this.enemy.setTint(0xcbd6ff);
    }
  }

  breakDualGuard() {
    if (!this.guardActive) {
      return;
    }
    this.guardActive = false;
    this.justBrokeGuard = true;
    if (this.guardText) {
      this.guardText.setText('💥 Linked Guard: BROKEN');
      this.guardText.setColor('#ff7043');
    }
    if (this.statusText) {
      this.statusText.setText('Excellent! The guard is down!');
    }
    if (this.hintText) {
      this.hintText.setText('🎯 Now follow up with more attacks!');
    }
    this.addLog('✨ Perfect! The linked guard shattered!');
    this.addLog('🎉 You learned how to use functions!');
    
    // Guard break bonus damage
    const burstDamage = 30;
    const stillFighting = this.dealDamageToEnemy(burstDamage, 'critical');
    if (stillFighting === false) {
      return;
    }
  }

  onExecuteSavedFunctionStart(name) {
    // 基底クラスの実装を呼び出し
    super.onExecuteSavedFunctionStart(name);
    
    // ステージ13固有の処理
    this.functionUsed = true;
    this.executingFunctionName = name;
    this.currentFunctionHits = 0;
    this.functionCallCount += 1;
    this.addLog(`📢 Function "${name}" is executing...`);
    if (this.guardActive) {
      this.addLog('⚔️ Combo attack sequence starting!');
    }
  }

  onExecuteSavedFunctionEnd(name) {
    // 基底クラスの実装を呼び出し
    super.onExecuteSavedFunctionEnd(name);
    
    // ステージ13固有の処理
    if (this.executingFunctionName === name) {
      if (this.guardActive && this.currentFunctionHits < this.comboGoal) {
        this.addLog(`❌ Only ${this.currentFunctionHits}/${this.comboGoal} hits. The guard held!`);
        this.addLog(`💡 Remember: Your function needs 3 attack blocks inside it!`);
      } else if (this.guardActive && this.currentFunctionHits >= this.comboGoal) {
        // Guard should already be broken, this is just a safety check
      }
    }
    this.executingFunctionName = null;
    this.currentFunctionHits = 0;
  }

  onExecuteSavedFunctionAction(name) {
    // 基底クラスの実装を呼び出し
    super.onExecuteSavedFunctionAction(name);
    
    // ステージ13固有の処理
    this.functionUsed = true;
  }

  async handlePlayerAction(actionType) {
    if (actionType === 'Attack') {
      await this.performTwinStrike();
      return true;
    }
    return false;
  }

  async performTwinStrike() {
    if (this.battleEnded) {
      return;
    }

    if (typeof this.playAnimation === 'function') {
      await this.playAnimation('playerAttack');
    }

    if (this.guardActive) {
      if (this.executingFunctionName) {
        // Counting hits within function execution
        this.currentFunctionHits += 1;
        this.addLog(`⚔️ Hit ${this.currentFunctionHits}/${this.comboGoal}`);
        
        if (this.statusText) {
          const remaining = this.comboGoal - this.currentFunctionHits;
          if (remaining > 0) {
            this.statusText.setText(`${remaining} more hit(s) needed in this function!`);
          }
        }
        
        if (this.currentFunctionHits >= this.comboGoal) {
          this.breakDualGuard();
        }
      } else {
        // Single attack outside of function
        this.addLog('⚠️ Single attack blocked by the linked guard!');
        this.addLog('💡 You need to call your function with 3 attacks!');
        if (this.statusText) {
          this.statusText.setText('Blocked! Use your function block!');
        }
      }
    } else {
      // Guard is broken, normal damage
      if (this.justBrokeGuard) {
        this.justBrokeGuard = false;
      } else {
        const baseDamage = this.executingFunctionName ? 20 : 12;
        this.addLog(`⚔️ Hit for ${baseDamage} damage!`);
        const stillAlive = this.dealDamageToEnemy(baseDamage, 'normal');
        if (stillAlive === false) {
          return;
        }
      }
    }

    if (!this.battleEnded && !this.executingFunctionName) {
      this.time.delayedCall(900, () => this.enemyAction());
    }
  }

  enemyAction() {
    if (this.battleEnded) {
      return;
    }

    this.totalTurns += 1;
    this.resetDualGuard();

    const patterns = [
      { name: 'Twin Slash', damage: 15, message: '⚔️⚔️ Twin Slash!' },
      { name: 'Cross Guard Counter', damage: 18, message: '🛡️⚔️ Cross Guard Counter!' },
      { name: 'Spiral Dash', damage: 16, message: '🌀 Spiral Dash!' }
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    this.addLog(pattern.message);

    if (this.enemy && typeof this.enemy.performAttack === 'function') {
      this.enemy.performAttack(pattern.name, pattern.damage);
    } else {
      const newHP = Math.max(0, this.player.hp - pattern.damage);
      this.player.setHP(newHP);
      this.updateHP(this.player.hp, this.enemy.hp);
      if (newHP <= 0) {
        this.gameOver(false);
      }
      return;
    }

    if (this.player.getHP() <= 0) {
      this.gameOver(false);
    } else if (this.totalTurns === 2 && !this.functionUsed) {
      this.time.delayedCall(1000, () => {
        this.addLog('💡 Hint: Open the Variable Editor (📝 button) → Functions tab');
        this.addLog('💡 Create a function and add 3 "Attack" blocks inside it');
        this.addLog('💡 Then use the function block in your main program!');
      });
    }
  }
}
