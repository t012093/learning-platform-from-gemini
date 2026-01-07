// ====================================================================================
// ゲームエンジン - メインエクスキューター
// ====================================================================================
// 
// このファイルには、ステージ1-14で使用される関数群が含まれています。
//
// 主要な関数：
// - runGameWithCommands(): メイン実行関数（全ステージ）
// - executeGameAction(): 個別アクション実行（全ステージ）
// - complexMagicSequence(): 魔法詠唱（ステージ3-14）
//
// ====================================================================================

import { delay } from "./utils";
import { BattleScene } from "./BattleScene";
import { BattleScene2 } from "./BattleScene2";
import { BattleScene3 } from "./BattleScene3";
import { BattleScene4 } from "./BattleScene4";
import { BattleScene5 } from "./BattleScene5";
import { BattleScene6 } from "./BattleScene6";
import { BattleScene7 } from "./BattleScene7";
import { BattleScene8 } from "./BattleScene8";
import { BattleScene9 } from "./BattleScene9";
import { BattleScene10 } from "./BattleScene10";
import { BattleScene11 } from "./BattleScene11";
import { BattleScene12 } from "./BattleScene12";
import { BattleScene13 } from "./BattleScene13";
import { BattleScene14 } from "./BattleScene14";
import { HomeScene } from "./HomeScene";
import { MapSelectionScene } from "./MapSelectionScene";
import { ShopScene } from "./ShopScene";
import { LibraryScene } from "./LibraryScene";

// ====================================================================================
// ステージ別機能マップ
// ====================================================================================
/*
ステージ1 (BattleScene): 基本の攻撃
- 学習内容: 単純な命令実行・順次処理
- 使用ブロック: attack_basic, wait
- 敵: スライム (HP: 25)

ステージ2 (BattleScene2): 回復の魔法
- 学習内容: 体力管理と回復
- 使用ブロック: attack_basic, heal_magic, wait
- 敵: ポイズンモス (HP: 15)

ステージ3 (BattleScene3): 魔法詠唱
- 学習内容: 詠唱シーケンスの導入（左右=炎、左左=氷）
- 使用ブロック: attack_basic, wave_left_hand, wave_right_hand, cast_magic, wait
- 敵: ファイアゴブリン (HP: 20)

ステージ4 (BattleScene4): 氷の盾
- 学習内容: 属性防御（左左で氷の盾）
- 使用ブロック: attack_basic, wave_left_hand, wave_right_hand, cast_magic, wait
- 敵: フレイムウルフ (HP: 25)

ステージ5 (BattleScene5): 時間との勝負
- 学習内容: タイムアタック戦（20秒以内に倒さないと敵が強化）
- 使用ブロック: attack_basic, heal_magic, wave_left_hand, wave_right_hand, cast_magic, wait
- 敵: タイムイーター (HP: 30、20秒後にHP+20&攻撃力アップ)

ステージ6 (BattleScene6): 解毒薬
- 学習内容: アイテム作成と使用
- 使用ブロック: attack_basic, heal_magic, make_antidote, use_antidote, wave_left_hand, wave_right_hand, cast_magic, wait
- 敵: ポイズンコング (HP: 35、毒攻撃あり)

ステージ7 (BattleScene7): 雷魔法
- 学習内容: 複数属性の詠唱（炎、氷、雷）
- 使用ブロック: attack_basic, heal_magic, cast_fire, cast_ice, cast_thunder, wave_left_hand, wave_right_hand, wait
- 敵: メタルスライム (HP: 20、装甲3、雷が弱点)

ステージ8 (BattleScene8): 行動の繰り返し
- 学習内容: 繰り返し構造（repeat_2x）
- 使用ブロック: attack_basic, heal_magic, cast_fire, cast_ice, repeat_2x, wave_left_hand, wave_right_hand, wait
- 敵: ゴブリン部隊 (5体×HP10)

ステージ9 (BattleScene9): 閃光魔法の習得
- 学習内容: 回避不可攻撃（21回手振りパターンで閃光魔法）
- 使用ブロック: attack_basic, heal_magic, cast_fire, cast_ice, repeat_2x, wave_left_hand, wave_right_hand, cast_magic, wait
- 敵: 影の獣 (HP: 60、通常攻撃を全回避、閃光魔法のみ有効)
- 特殊: 敵攻撃50ダメージ

ステージ10 (BattleScene10): 初級ボス戦
- 学習内容: 魔法シールド破壊＋即死阻止（閃光魔法でシールド破壊、麻痺魔法でチャージ阻止）
- 使用ブロック: attack_basic, heal_magic, cast_fire, cast_ice, cast_thunder, repeat_3x, wave_left_hand, wave_right_hand, wait
- 敵: ダークナイト (HP: 150、魔法シールド、フェーズ変化、チャージ即死攻撃)
- 特殊: 閃光魔法(21連続)でシールド破壊、麻痺魔法(8連続左右)でチャージ阻止

ステージ11 (BattleScene11): 初めての変数
- 学習内容: 攻撃名の記憶・変換・強化システム
- 使用ブロック: attack_basic, heal_magic, cast_magic, remember_enemy_attack, convert_attack, enhance_attack, enemy_attack_name, variable_reference, wave_left_hand, wave_right_hand, wait
- 敵: ミラージュウィザード (HP: 80)
- 特殊: 攻撃を記憶→変換→強化で反射、変数使用で経験値最大4倍

ステージ12 (BattleScene12): 条件分岐とカウンター
- 学習内容: 条件分岐と敵攻撃判定（if_condition）
- 使用ブロック: attack_basic, heal_magic, cast_magic, set_attack_name, attack_name, if_condition, text_equals, number, wave_left_hand, wave_right_hand, cast_magic_value, custom_variable_get, wait
- 敵: ビーストマスター (HP: 80)
- 特殊: 変数「敵の技名」で判定、「野生の本能」(80dmg)には氷の盾(左左)が必須

ステージ13 (BattleScene13): 関数の第一歩
- 学習内容: 関数の定義と呼び出し（引数なし）
- 使用ブロック: custom_function_placeholder, attack_basic, heal_magic, wait
- 敵: 双子剣士
- 特殊: 同じ手順を繰り返すと時間切れ、関数化で解決

ステージ14 (BattleScene14): 引数で弱点を突く
- 学習内容: 引数付き関数
- 使用ブロック: custom_function_placeholder (with args), attack_basic, heal_magic, wait
- 敵: 属性変化スピリット
- 特殊: 敵弱点が毎ターン変化、引数で攻撃属性を切替

※ ステージ15-20は新カリキュラム実装予定（戻り値・複数関数連携・クラス・継承など）
*/

// 魔法詠唱パターンの定義 (ステージ3-14で使用)
const MAGIC_PATTERNS = {
  FIRE: ["left", "right"],           // 左手→右手 = 炎の魔法
  ICE: ["left", "left"],             // 左手→左手 = 氷の魔法
  THUNDER: ["right", "left"],        // 右手→左手 = 雷の魔法
  WATER: ["right", "right"],         // 右手→右手 = 水の魔法
  HEALING: ["left", "right", "left"], // 左→右→左 = 回復魔法
  RAIDEN: ["right", "right", "right", "left"], // 右→右→右→左 = ライデン（水+雷複合魔法）
  PARALYZE: ["left", "right", "left", "right", "left", "right", "left", "right"], // 左右左右左右左右 = 麻痺魔法
  FLASH: ["left", "right", "right", "left", "left", "left", "right", "left", "right", "right", "left", "left", "left", "right", "left", "right", "right", "left", "left", "left", "right"] // 閃光魔法（回避不可攻撃）
};

// ====================================================================================
// メイン実行関数 - 全ステージで使用
// ====================================================================================

// メインのゲーム実行関数
// 使用ステージ: 全ステージ (1-14)
// 機能: ブロックのASTを受け取り、順次実行する
// パターンベース魔法システム用ヘルパー関数
function detectSpellFromPattern(pattern) {
  console.log("detectSpellFromPattern called with pattern:", pattern);
  console.log("MAGIC_PATTERNS:", MAGIC_PATTERNS);
  
  if (!pattern || pattern.length === 0) {
    console.log("Pattern is empty or null");
    return null;
  }
  
  // パターンを文字列に変換して検索
  const patternStr = JSON.stringify(pattern);
  console.log("Pattern as JSON string:", patternStr);
  
  for (const [spellType, spellPattern] of Object.entries(MAGIC_PATTERNS)) {
    const spellPatternStr = JSON.stringify(spellPattern);
    console.log(`Comparing with ${spellType}: ${spellPatternStr}`);
    if (spellPatternStr === patternStr) {
      console.log(`Found match: ${spellType}`);
      return spellType;
    }
  }
  
  console.log("No pattern match found");
  return null; // パターンが一致しない場合
}

function getSpellDisplayName(spellType) {
  const spellNames = {
    'FIRE': '炎の魔法',
    'ICE': '氷の盾', 
    'THUNDER': '雷の魔法',
    'WATER': '水の魔法',
    'HEALING': '回復魔法',
    'RAIDEN': 'ライデン',
    'PARALYZE': '麻痺魔法',
    'FLASH': '閃光魔法'
  };
  
  return spellNames[spellType] || '不明な魔法';
}

export async function runGameWithCommands(ast, game, ui) {
  try {
    // 処理前にASTをチェック
    console.log("Original AST:", JSON.stringify(ast, null, 2));
    
    // ASTをconvertASTToActionsで処理（統一されたAST処理パス）
    console.log("Converting AST to actions using convertASTToActions");
    let actions = [];
    
    actions = await convertASTToActions(ast, game.scene);
    if (!Array.isArray(actions)) {
      console.error("convertASTToActions returned non-array:", actions);
      throw new Error("AST conversion failed: result is not an array");
    }

    console.log("Generated actions:", JSON.stringify(actions, null, 2));

    // アクションの実行
    for (const action of actions) {
      await executeGameAction(action, game, ui);
    }
    
    // 敵のターン（BattleSceneの共通enemyTurn()メソッドを使用）
    if (game.scene && typeof game.scene.enemyTurn === 'function') {
      console.log("Using scene's enemyTurn method (with paralysis support)");
      await game.scene.enemyTurn();
    } else {
      console.log("Using default enemy.takeTurn method");
      await game.enemy.takeTurn();
    }
  } catch (error) {
    console.error("Error running game commands:", error);
    ui.log("エラーが発生しました: " + error.message);
  }
}

// 手振りシーケンスを再帰的に抽出する関数
function extractHandWaveSequence(children, sequence) {
  console.log("extractHandWaveSequence called with children:", children);
  
  for (const child of children) {
    console.log("Processing child:", child);
    
    // 配列の場合は再帰的に処理
    if (Array.isArray(child)) {
      console.log("Child is array, recursing...");
      extractHandWaveSequence(child, sequence);
      continue;
    }
    
    // 繰り返しブロックの処理
    if (child.type === "repeat_2x") {
      console.log("Found repeat_2x block, expanding 2 times");
      if (child.children && child.children.length > 0) {
        // 2回繰り返し
        for (let i = 0; i < 2; i++) {
          extractHandWaveSequence(child.children, sequence);
        }
      }
      continue;
    } else if (child.type === "repeat_3x") {
      console.log("Found repeat_3x block, expanding 3 times");
      if (child.children && child.children.length > 0) {
        // 3回繰り返し
        for (let i = 0; i < 3; i++) {
          extractHandWaveSequence(child.children, sequence);
        }
      }
      continue;
    } else if (child.type === "controls_repeat_ext") {
      // 汎用繰り返しブロック
      const repeatTimes = child.fields?.TIMES || 2; // デフォルト2回
      console.log(`Found controls_repeat_ext block, expanding ${repeatTimes} times`);
      if (child.children && child.children.length > 0) {
        for (let i = 0; i < repeatTimes; i++) {
          extractHandWaveSequence(child.children, sequence);
        }
      }
      continue;
    }
    
    if (child.type === "wave_left_hand") {
      console.log("Found wave_left_hand, adding 'left' to sequence");
      sequence.push("left");
    } else if (child.type === "wave_right_hand") {
      console.log("Found wave_right_hand, adding 'right' to sequence");
      sequence.push("right");
    }
    
    // 子要素があれば再帰的に探す
    if (child.children && child.children.length > 0) {
      console.log("Child has children, recursing...");
      extractHandWaveSequence(child.children, sequence);
    }
  }
  console.log("Current sequence after processing:", sequence);
}

// ====================================================================================
// ユーティリティ関数群 - 特定ステージで使用
// ====================================================================================

// 複合魔法シーケンス実行関数
// 使用ステージ: ステージ3-14（魔法詠唱があるステージ）
// 機能: 手の動きパターンから魔法を識別・実行
export async function complexMagicSequence(sequence) {
  try {
    console.log("Processing complex magic sequence:", sequence);
    
    // Validate sequence pattern
    const validPatterns = {
      "fire_storm": ["fire", "fire", "wind", "fire"],
      "ice_barrier": ["ice", "earth", "ice", "water"],
      "thunder_strike": ["thunder", "air", "thunder", "thunder"],
      "healing_light": ["light", "water", "light", "light"]
    };
    
    let spellType = null;
    let power = 1;
    
    // Check if sequence matches any known pattern
    for (const [spell, pattern] of Object.entries(validPatterns)) {
      if (JSON.stringify(sequence) === JSON.stringify(pattern)) {
        spellType = spell;
        power = pattern.length * 25; // Base power calculation
        break;
      }
    }
    
    if (spellType) {
      console.log(`Recognized spell: ${spellType} with power: ${power}`);
      return { spell: spellType, power, success: true };
    } else {
      // Partial match bonus
      let bestMatch = 0;
      let bestSpell = null;
      
      for (const [spell, pattern] of Object.entries(validPatterns)) {
        let matches = 0;
        for (let i = 0; i < Math.min(sequence.length, pattern.length); i++) {
          if (sequence[i] === pattern[i]) matches++;
        }
        if (matches > bestMatch) {
          bestMatch = matches;
          bestSpell = spell;
        }
      }
      
      if (bestMatch > 0) {
        power = bestMatch * 10; // Partial power
        console.log(`Partial spell match: ${bestSpell} with power: ${power}`);
        return { spell: bestSpell, power, success: false };
      }
    }
    
    return { spell: "unknown", power: 5, success: false };
  } catch (error) {
    console.error("Complex magic sequence processing failed:", error);
    return { spell: "failed", power: 0, success: false };
  }
}

// ====================================================================================
// コアアクション実行関数 - 全ステージで使用
// ====================================================================================

// 個別アクション実行関数
// 使用ステージ: 全ステージ（1-14）
// 機能: 各ブロックタイプに対応するゲーム内アクションを実行
async function executeGameAction(action, game, ui) {
  const { action_type, parameters } = action;
  
  switch (action_type) {    case "Attack":
      // Use scene's handlePlayerAction if available (for BattleScene5, BattleScene6, etc.)
      if (game.scene && typeof game.scene.handlePlayerAction === 'function') {
        console.log("Using scene's handlePlayerAction for Attack");
        try {
          await game.scene.handlePlayerAction("Attack", parameters);
        } catch (e) {
          console.error("Error calling scene's handlePlayerAction for Attack:", e);
          // Fallback to player's attack method
          await game.player.attack();
        }
      } else {
        // Stage9の回避システムチェック
        if (game.scene && game.scene.shadowBeastEvades && 
            typeof game.scene.dealDamageToEnemy === 'function') {
          // BattleScene9の回避システムを使用
          const damage = Math.floor(Math.random() * 10) + 5;
          ui.log("プレイヤーの攻撃！");
          if (game.scene && typeof game.scene.playAnimation === 'function') {
            await game.scene.playAnimation('playerAttack');
          }
          game.scene.dealDamageToEnemy(damage, 'normal');
        } else {
          await game.player.attack();
        }
      }
      break;
      
    case "Heal":
      const healAmount = parameters.amount || 10;
      // Use scene's handlePlayerAction if available (for BattleScene5, BattleScene6, etc.)
      if (game.scene && typeof game.scene.handlePlayerAction === 'function') {
        console.log("Using scene's handlePlayerAction for Heal");
        try {
          await game.scene.handlePlayerAction("Heal", { amount: healAmount });
        } catch (e) {
          console.error("Error calling scene's handlePlayerAction for Heal:", e);
          // Fallback to player's heal method
          await game.player.heal(healAmount);
        }
      } else {
        await game.player.heal(healAmount);
      }
      break;
        case "Wait":
      const seconds = parameters.seconds || 1;
      ui.log(`${seconds}秒間待機中...`);
      
      // シーン用の特殊待機処理（ステージ5向け）
      if (game.scene && typeof game.scene.handlePlayerAction === 'function') {
        console.log("Using scene's handlePlayerAction for Wait");
        try {
          await game.scene.handlePlayerAction("Wait");
        } catch (e) {
          console.error("Error calling scene's handlePlayerAction for Wait:", e);
          // フォールバックとして単純な遅延を使用
          await delay(seconds * 1000);
        }
      } else {
        // 通常の待機処理
        await delay(seconds * 1000);
      }
      break;
      
    case "CallFunction":
      // 関数実行の開始または終了を処理
      const functionName = parameters.name;
      const phase = parameters.phase; // "start" or "end"
      const args = parameters.args || [];
      const namedArgs = parameters.namedArgs || {};
      
      if (phase === "start") {
        console.log(`📢 Function "${functionName}" execution starting`);
        ui.log(`📢 関数 "${functionName}" を実行中...`);
        
        // BattleSceneのonExecuteSavedFunctionStartイベントを発火（引数付き）
        if (game.scene && typeof game.scene.onExecuteSavedFunctionStart === 'function') {
          game.scene.onExecuteSavedFunctionStart(functionName, args, namedArgs);
        }
      } else if (phase === "end") {
        console.log(`✅ Function "${functionName}" execution completed`);
        
        // BattleSceneのonExecuteSavedFunctionEndイベントを発火
        if (game.scene && typeof game.scene.onExecuteSavedFunctionEnd === 'function') {
          game.scene.onExecuteSavedFunctionEnd(functionName);
        }
      }
      break;
      
    case "StartIncantation":
      const spellName = parameters.spellName || parameters.spell;
      ui.log(`${spellName}の魔法を詠唱開始...`);
      break;
        case "WaveLeftHand":
      ui.log("左手を振った！");
      // ステージ3以降で利用する魔法詠唱（左手）の処理
      if (game.scene && typeof game.scene.castSpellLeft === 'function') {
        console.log("Using scene's castSpellLeft method");
        try {
          await game.scene.castSpellLeft();
        } catch (e) {
          console.error("Error calling scene.castSpellLeft:", e);
        }
      } else {
        await delay(500);
      }
      break;
      
    case "WaveRightHand":
      ui.log("右手を振った！");
      // ステージ3以降で利用する魔法詠唱（右手）の処理
      if (game.scene && typeof game.scene.castSpellRight === 'function') {
        console.log("Using scene's castSpellRight method");
        try {
          await game.scene.castSpellRight();
        } catch (e) {
          console.error("Error calling scene.castSpellRight:", e);
        }
      } else {
        await delay(500);
      }
      break;
      
    case "CompleteIncantation":
      const completeSpellName = parameters.spellName || parameters.spell;
      ui.log(`${completeSpellName}の魔法の詠唱成功！`);
      break;
      
    case "FailIncantation":
      const failSpellName = parameters.spellName || parameters.spell;
      ui.log(`${failSpellName}の魔法の詠唱失敗...正しいパターンではありません`);
      break;
      
    case "CastMagic":
      console.log("CastMagic action called with parameters:", parameters);
      
      // 麻痺魔法の特別処理
      if (parameters.type === "PARALYZE" || parameters.spell === "PARALYZE") {
        console.log("Casting PARALYZE spell!");
        ui.log("⚡ 麻痺魔法を詠唱中...");
        
        // BattleSceneの麻痺処理を呼び出し（グローバル化済み）
        if (game.scene && game.scene.applyParalyzeEffect) {
          game.scene.applyParalyzeEffect();
        } else {
          ui.log("🔮 麻痺魔法成功！敵を3ターン麻痺させます");
          console.warn('applyParalyzeEffect method not found');
        }
      }
      // 閃光魔法の特別処理
      else if (parameters.type === "FLASH" || parameters.spell === "FLASH") {
        console.log("Casting FLASH spell!");
        ui.log("✨ 閃光魔法を詠唱中...");
        
        // 閃光魔法の効果（回避不可の大ダメージ）
        if (game.scene && game.scene.applyFlashEffect) {
          game.scene.applyFlashEffect();
        } else {
          // デフォルトの閃光魔法効果
          const damage = 25; // 高威力の固定ダメージ
          ui.log(`⚡ 閃光魔法発動！回避不可の${damage}ダメージ！`);
          
          if (game.enemy) {
            game.enemy.hp -= damage;
            if (game.scene && typeof game.scene.updateHP === 'function') {
              game.scene.updateHP(game.player.hp, game.enemy.hp);
            }
            if (game.scene && typeof game.scene.playAnimation === 'function') {
              await game.scene.playAnimation('magic_flash');
            }
          }
        }
      }
      // ライデンも含めて通常の魔法処理パイプラインを使用
      else if (parameters.type === "RAIDEN") {
        console.log("Casting RAIDEN spell!");
        // 既存のcastSpellパイプラインを使用（ライデン対応済み）
        await game.player.castSpell("RAIDEN");
      } else {
        console.log("Casting normal spell:", parameters.spell);
        // 通常の魔法処理
        await game.player.castSpell(parameters.spell);
      }
      break;
        case "BrewAntidote":
      ui.log("解毒薬を調合中...");
      // Use scene's handlePlayerAction if available (for BattleScene6, etc.)
      if (game.scene && typeof game.scene.handlePlayerAction === 'function') {
        console.log("Using scene's handlePlayerAction for BrewAntidote");
        try {
          await game.scene.handlePlayerAction("BrewAntidote", parameters);
        } catch (e) {
          console.error("Error calling scene's handlePlayerAction for BrewAntidote:", e);
          // Fallback
          if (game.scene && typeof game.scene.brewAntidote === 'function') {
            await game.scene.brewAntidote();
          } else {
            ui.log("解毒薬を調合しました！");
            await delay(1000);
          }
        }
      } else if (game.scene && typeof game.scene.brewAntidote === 'function') {
        console.log("Using scene's brewAntidote method");
        try {
          await game.scene.brewAntidote();
        } catch (e) {
          console.error("Error calling scene's brewAntidote method:", e);
          ui.log("解毒薬の調合に失敗しました");
        }
      } else {
        ui.log("解毒薬を調合しました！");
        await delay(1000);
      }
      break;
        case "UsePotion":
      const potionType = parameters.potion_type || "ANTIDOTE";
      ui.log(`${getPotionDisplayName(potionType)}を使用します`);
      // Use scene's handlePlayerAction if available (for BattleScene6, etc.)
      if (game.scene && typeof game.scene.handlePlayerAction === 'function') {
        console.log("Using scene's handlePlayerAction for UsePotion");
        try {
          await game.scene.handlePlayerAction("UsePotion", parameters);
        } catch (e) {
          console.error("Error calling scene's handlePlayerAction for UsePotion:", e);
          // Fallback
          if (game.scene && typeof game.scene.usePotion === 'function') {
            await game.scene.usePotion(potionType);
          } else {
            ui.log(`${getPotionDisplayName(potionType)}の効果が発動しました！`);
            await delay(1000);
          }
        }
      } else if (game.scene && typeof game.scene.usePotion === 'function') {
        console.log("Using scene's usePotion method with type:", potionType);
        try {
          await game.scene.usePotion(potionType);
        } catch (e) {
          console.error("Error calling scene's usePotion method:", e);
          ui.log("薬の使用に失敗しました");
        }
      } else {
        ui.log(`${getPotionDisplayName(potionType)}の効果が発動しました！`);
        await delay(1000);
      }      break;
      
    case "RepeatStart":
      ui.log("繰り返し処理を開始");
      break;

    case "RepeatEnd":
      ui.log("繰り返し処理を終了");
      break;
      


    case "Number":
      console.log(`Number: ${action.value}`);
      return action.value;

    // カスタム変数・リスト操作
    case "CustomVariableGet":
      const getVarName = action.varName || "custom_var";
      if (!game.customVariables) {
        game.customVariables = {};
      }
      const varValue = game.customVariables[getVarName];
      ui.log(`📌 変数「${getVarName}」: ${varValue}`);
      return varValue;

    case "CustomVariableSet":
      const setVarName = action.varName || "custom_var";
      let setValue = "";
      if (action.value_actions && action.value_actions.length > 0) {
        for (const valueAction of action.value_actions) {
          const result = await executeGameAction(valueAction, game, ui);
          if (result !== undefined) {
            setValue = result;
          }
        }
      } else {
        setValue = action.value;
      }
      if (!game.customVariables) {
        game.customVariables = {};
      }
      game.customVariables[setVarName] = setValue;
      ui.log(`📝 変数「${setVarName}」に「${setValue}」を設定しました`);
      break;

    case "CustomListGet":
      const getListName = action.listName || "custom_list";
      let getIndex = 0;
      if (action.index_actions && action.index_actions.length > 0) {
        for (const indexAction of action.index_actions) {
          const result = await executeGameAction(indexAction, game, ui);
          if (result !== undefined) {
            getIndex = parseInt(result);
          }
        }
      } else {
        getIndex = action.index || 0;
      }
      if (!game.customLists) {
        game.customLists = {};
      }
      if (!game.customLists[getListName]) {
        game.customLists[getListName] = [];
      }
      const listValue = game.customLists[getListName][getIndex];
      ui.log(`📖 リスト「${getListName}」の${getIndex}番目: ${listValue}`);
      return listValue;

    case "CustomListAdd":
      const addListName = action.listName || "custom_list";
      let customAddValue = "";
      if (action.item_actions && action.item_actions.length > 0) {
        for (const itemAction of action.item_actions) {
          const result = await executeGameAction(itemAction, game, ui);
          if (result !== undefined) {
            customAddValue = result;
          }
        }
      } else {
        customAddValue = action.value;
      }
      if (!game.customLists) {
        game.customLists = {};
      }
      if (!game.customLists[addListName]) {
        game.customLists[addListName] = [];
      }
      game.customLists[addListName].push(customAddValue);
      ui.log(`➕ リスト「${addListName}」に「${customAddValue}」を追加しました（長さ: ${game.customLists[addListName].length}）`);
      break;

    case "CustomListLength":
      const lengthListName = action.listName || "custom_list";
      if (!game.customLists) {
        game.customLists = {};
      }
      if (!game.customLists[lengthListName]) {
        game.customLists[lengthListName] = [];
      }
      const customListLength = game.customLists[lengthListName].length;
      ui.log(`📊 リスト「${lengthListName}」の長さ: ${customListLength}`);
      return customListLength;
      
      
    case "CastWaterSpell":
      ui.log("水の魔法を唱える...");
      if (game.scene && typeof game.scene.castWaterSpell === 'function') {
        console.log("Using scene's castWaterSpell method");
        try {
          await game.scene.castWaterSpell(parameters);
        } catch (e) {
          console.error("Error calling scene's castWaterSpell method:", e);
          ui.log("水の魔法に失敗しました");
        }
      } else {
        ui.log("水の魔法を唱えました");
        await delay(1000);
      }
      break;
      
    case "CastFireSpell":
      ui.log("炎の魔法を唱える...");
      if (game.scene && typeof game.scene.castFireSpell === 'function') {
        console.log("Using scene's castFireSpell method");
        try {
          await game.scene.castFireSpell(parameters);
        } catch (e) {
          console.error("Error calling scene's castFireSpell method:", e);
          ui.log("炎の魔法に失敗しました");
        }
      } else {
        ui.log("炎の魔法を唱えました");
        await delay(1000);
      }
      break;
      
    case "CastThunderSpell":
      ui.log("雷の魔法を唱える...");
      if (game.scene && typeof game.scene.castThunderSpell === 'function') {
        console.log("Using scene's castThunderSpell method");
        try {
          await game.scene.castThunderSpell(parameters);
        } catch (e) {
          console.error("Error calling scene's castThunderSpell method:", e);
          ui.log("雷の魔法に失敗しました");
        }
      } else {
        ui.log("雷の魔法を唱えました");
        await delay(1000);
      }
      break;
    
    case "CustomVariableSet":
      ui.log(`変数「${parameters.varName}」に値「${parameters.value}」をセット`);
      // 実際の変数設定はconvertASTToActions内で既に実行済み
      break;
    
    case "CustomListAdd":
      ui.log(`リスト「${parameters.listName}」に値「${parameters.value}」を追加`);
      // 実際のリスト追加はconvertASTToActions内で既に実行済み
      break;

  }
}

// ====================================================================================
// AST変換関数群
// ====================================================================================

// 新しいAST処理関数（ステージ12以降の複雑な構造に対応）
async function convertASTToActions(ast, battleScene) {
  const actions = [];
  
  function processNode(node) {
    if (!node) return null;
    
    // プリミティブ値の場合はそのまま返す
    if (typeof node !== 'object') {
      return node;
    }
    
    // 配列の場合は最初の要素を処理（ただしif_conditionの場合は全要素を保持）
    if (Array.isArray(node)) {
      if (node.length === 0) return null;
      // 複数要素がある場合は順次処理
      const results = [];
      for (const item of node) {
        const result = processNode(item);
        if (result !== null && result !== undefined) {
          results.push(result);
        }
      }
      return results.length === 1 ? results[0] : results;
    }
    
    const type = node.type;
    const fields = node.fields || {};
    
    // typeが存在しない場合
    if (!type) {
      console.warn("Node without type:", node);
      return null;
    }
    
    switch (type) {
      // ========== 基本アクション ==========
      case 'attack_basic':
        console.log('Processing attack_basic block');
        actions.push({
          action_type: "Attack",
          parameters: { attackType: 'normal' }
        });
        break;
        
      case 'attack':
        const attackType = fields.ATTACK_TYPE || 'normal';
        console.log(`Processing attack block with type: ${attackType}`);
        actions.push({
          action_type: "Attack",
          parameters: { attackType: attackType }
        });
        break;

      case 'heal_magic':
        console.log('Processing heal_magic block');
        actions.push({
          action_type: "Heal",
          parameters: { amount: 10 }
        });
        break;

      // ========== 魔法詠唱 ==========
      case 'wave_left_hand':
        console.log('Processing wave_left_hand block');
        actions.push({
          action_type: "WaveLeftHand",
          parameters: {}
        });
        break;
        
      case 'wave_right_hand':
        console.log('Processing wave_right_hand block');
        actions.push({
          action_type: "WaveRightHand",
          parameters: {}
        });
        break;
        
      case 'cast_magic': {
        // extractHandWaveSequenceを使って繰り返しブロックも展開
        const handWaveSequence = [];
        if (node.children && Array.isArray(node.children)) {
          extractHandWaveSequence(node.children, handWaveSequence);
        }
        
        console.log(`Processing cast_magic block with sequence: ${handWaveSequence.join('→')} (length: ${handWaveSequence.length})`);
        
        if (handWaveSequence.length > 0) {
          // パターンから魔法タイプを判定
          const detectedSpell = detectSpellFromPattern(handWaveSequence);
          
          if (detectedSpell) {
            actions.push({
              action_type: "StartIncantation",
              parameters: { 
                spell: getSpellDisplayName(detectedSpell),
                pattern: handWaveSequence.join("→")
              }
            });
            
            // 魔法を実行
            const expectedPattern = MAGIC_PATTERNS[detectedSpell];
            const isCorrect = JSON.stringify(handWaveSequence) === JSON.stringify(expectedPattern);
            
            if (isCorrect) {
              actions.push({
                action_type: "CompleteIncantation",
                parameters: { 
                  spell: detectedSpell,
                  pattern: handWaveSequence.join(",")
                }
              });
              
              if (detectedSpell === "HEALING") {
                actions.push({
                  action_type: "CastHealingMagic",
                  parameters: { power: 30 }
                });
              } else {
                actions.push({
                  action_type: "CastMagic",
                  parameters: { 
                    spell: detectedSpell,
                    type: detectedSpell
                  }
                });
              }
            } else {
              actions.push({
                action_type: "FailIncantation",
                parameters: { 
                  spell: detectedSpell,
                  pattern: handWaveSequence.join(","),
                  expected: expectedPattern.join(",")
                }
              });
            }
          } else {
            console.warn(`No spell detected for pattern: ${handWaveSequence.join('→')}`);
          }
        } else {
          console.warn('cast_magic block has no hand wave sequence');
        }
        break;
      }

      case 'cast_fire':
        console.log('Processing cast_fire block');
        actions.push({
          action_type: "CastFireSpell",
          parameters: { spell: 'FIRE' }
        });
        break;

      case 'cast_ice':
        console.log('Processing cast_ice block');
        actions.push({
          action_type: "CastMagic",
          parameters: { spell: 'ICE', type: 'ICE' }
        });
        break;

      case 'cast_thunder':
        console.log('Processing cast_thunder block');
        actions.push({
          action_type: "CastThunderSpell",
          parameters: { spell: 'THUNDER' }
        });
        break;

      case 'cast_water':
        console.log('Processing cast_water block');
        actions.push({
          action_type: "CastWaterSpell",
          parameters: { spell: 'WATER' }
        });
        break;

      // ========== 繰り返し ==========
      case 'repeat_2x':
        console.log('Processing repeat_2x block');
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < 2; i++) {
            node.children.forEach(child => processNode(child));
          }
        }
        break;
        
      case 'repeat_3x':
        console.log('Processing repeat_3x block');
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < 3; i++) {
            node.children.forEach(child => processNode(child));
          }
        }
        break;

      case 'controls_repeat_ext':
        const repeatTimes = fields.TIMES || 2;
        console.log(`Processing controls_repeat_ext block (${repeatTimes} times)`);
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < repeatTimes; i++) {
            node.children.forEach(child => processNode(child));
          }
        }
        break;

      // ========== アイテム関連 ==========
      case 'make_antidote':
      case 'brew_antidote':
        console.log('Processing make_antidote block');
        actions.push({
          action_type: "BrewAntidote",
          parameters: {}
        });
        break;

      case 'use_antidote':
        console.log('Processing use_antidote block');
        actions.push({
          action_type: "UsePotion",
          parameters: { potion_type: 'ANTIDOTE' }
        });
        break;

      case 'use_potion':
        const potionType = fields.POTION_TYPE || 'ANTIDOTE';
        console.log(`Processing use_potion block with type: ${potionType}`);
        actions.push({
          action_type: "UsePotion",
          parameters: { potion_type: potionType }
        });
        break;

      // ========== ステージ11 変数操作 ==========
      case 'remember_enemy_attack':
        console.log('Processing remember_enemy_attack block');
        actions.push({
          action_type: "RememberEnemyAttack",
          parameters: {}
        });
        break;

      case 'convert_attack':
        const convertInput = node.inputs?.INPUT;
        let convertValue = "";
        let convertUseVariable = false;
        
        if (convertInput) {
          if (convertInput.type === "variable_reference") {
            convertValue = convertInput.fields?.VAR_NAME || "";
            convertUseVariable = true;
          } else if (convertInput.type === "enemy_attack_name") {
            convertValue = convertInput.fields?.ATTACK_NAME || "";
            convertUseVariable = false;
          }
        }
        
        console.log(`Processing convert_attack block: ${convertValue} (useVariable: ${convertUseVariable})`);
        actions.push({
          action_type: "ConvertAttack",
          parameters: { 
            input: convertValue,
            useVariable: convertUseVariable
          }
        });
        break;

      case 'enhance_attack':
        const enhanceInput = node.inputs?.INPUT;
        let enhanceValue = "";
        let enhanceUseVariable = false;
        
        if (enhanceInput) {
          if (enhanceInput.type === "variable_reference") {
            enhanceValue = enhanceInput.fields?.VAR_NAME || "";
            enhanceUseVariable = true;
          } else if (enhanceInput.type === "enemy_attack_name") {
            enhanceValue = enhanceInput.fields?.ATTACK_NAME || "";
            enhanceUseVariable = false;
          }
        }
        
        console.log(`Processing enhance_attack block: ${enhanceValue} (useVariable: ${enhanceUseVariable})`);
        actions.push({
          action_type: "EnhanceAttack",
          parameters: { 
            input: enhanceValue,
            useVariable: enhanceUseVariable
          }
        });
        break;

      case 'enemy_attack_name':
        const attackName = fields.ATTACK_NAME || "";
        console.log(`Processing enemy_attack_name block: ${attackName}`);
        return attackName;

      case 'variable_reference':
        const varRefName = fields.VAR_NAME || "attack_var";
        console.log(`Processing variable_reference block: ${varRefName}`);
        return varRefName;

      // ========== ステージ12 条件分岐・変数 ==========
      case 'set_attack_name':
        const setAttackName = fields.ATTACK_NAME || "";
        console.log(`Processing set_attack_name block: ${setAttackName}`);
        actions.push({
          action_type: "SetAttackName",
          parameters: { attackName: setAttackName }
        });
        break;

      case 'attack_name':
        console.log('Processing attack_name block');
        actions.push({
          action_type: "GetAttackName",
          parameters: {}
        });
        break;

      // ========== 関数実行 ==========
      case "custom_function_placeholder": {
        // mutation情報から関数名とパラメータ情報を取得
        const functionName = node.mutation?.function_name || fields.FUNCTION_NAME || node.functionName || 'Function';
        const paramNamesStr = node.mutation?.parameters || '';
        const paramNames = paramNamesStr ? paramNamesStr.split(',').map(p => p.trim()).filter(Boolean) : [];
        
        console.log(`🔧 Processing custom function placeholder: ${functionName}`);
        console.log(`  ├─ Parameters from mutation: ${paramNames.join(', ')}`);
        
        // 引数を処理
        const args = [];
        const argInputs = node.inputs || {};
        Object.keys(argInputs)
          .filter(key => key && key.indexOf('ARG_') === 0)
          .sort((a, b) => {
            const aIndex = parseInt(a.replace('ARG_', ''), 10);
            const bIndex = parseInt(b.replace('ARG_', ''), 10);
            return (isNaN(aIndex) ? 0 : aIndex) - (isNaN(bIndex) ? 0 : bIndex);
          })
          .forEach(key => {
            const idx = parseInt(key.replace('ARG_', ''), 10);
            const value = processNode(argInputs[key]);
            args[isNaN(idx) ? args.length : idx] = value;
          });
        
        // 名前付き引数を作成
        let namedArgs = {};
        paramNames.forEach((paramName, index) => {
          if (paramName && args[index] !== undefined) {
            namedArgs[paramName] = args[index];
          }
        });
        
        console.log(`  ├─ Args: [${args.join(', ')}]`);
        console.log(`  ├─ Named args:`, namedArgs);
        
        // executeSavedFunction APIを使用して関数実行アクションを生成
        const functionActions = executeSavedFunction(
          functionName,
          args.map(value => value === undefined ? null : value),
          namedArgs,
          battleScene
        );
        
        // 生成されたアクションを追加
        actions.push(...functionActions);
        
        console.log(`  └─ ✅ Function "${functionName}" actions added (${functionActions.length} actions)`);
        
        return null;
      }
      
      case "custom_variable_get": {
        const varName = fields.VAR_NAME;
        console.log(`[custom_variable_get] Field VAR_NAME: "${varName}"`);
        
        if (!varName || varName === "変数名") {
          console.warn("❌ Variable name not set or is template. Available variables:", Object.keys(battleScene.customVariables || {}));
          console.warn("   If you see '変数名', please select a variable from the dropdown in Blockly editor.");
          return null;
        }
        
        const value = battleScene.customVariables[varName];
        console.log(`✅ Get variable "${varName}": ${JSON.stringify(value)}`);
        return value;
      }
      
      case "custom_variable_set": {
        const varName = fields.VAR_NAME;
        if (!varName || varName === "変数名") {
          console.warn("Variable name not set:", node);
          return null;
        }
        // childrenが配列の場合は最初の要素、それ以外はそのまま処理
        const childValue = node.children && node.children.length > 0 ? node.children[0] : node.children;
        const value = processNode(childValue);
        battleScene.customVariables[varName] = value;
        console.log(`Set variable ${varName} = ${value}`);
        actions.push({
          action_type: "CustomVariableSet",
          parameters: { varName, value }
        });
        return value;
      }
      
      case "custom_list_add": {
        const listName = fields.LIST_NAME;
        if (!listName || listName === "リスト名") {
          console.warn("List name not set:", node);
          return null;
        }
        // childrenが配列の場合は最初の要素、それ以外はそのまま処理
        const childValue = node.children && node.children.length > 0 ? node.children[0] : node.children;
        const value = processNode(childValue);
        if (!battleScene.customLists[listName]) {
          battleScene.customLists[listName] = [];
        }
        battleScene.customLists[listName].push(value);
        console.log(`Add to list ${listName}: ${value}`);
        actions.push({
          action_type: "CustomListAdd",
          parameters: { listName, value }
        });
        return null;
      }
      
      case "custom_list_get": {
        const listName = fields.LIST_NAME;
        if (!listName || listName === "リスト名") {
          console.warn("List name not set:", node);
          return null;
        }
        // childrenが配列の場合は最初の要素、それ以外はそのまま処理
        const childValue = node.children && node.children.length > 0 ? node.children[0] : node.children;
        const index = processNode(childValue);
        if (!battleScene.customLists[listName]) {
          console.warn(`List ${listName} does not exist`);
          return null;
        }
        // インデックスは1始まり
        const value = battleScene.customLists[listName][index - 1] || null;
        console.log(`Get from list ${listName}[${index}]: ${value}`);
        return value;
      }
      
      case "custom_list_length": {
        const listName = fields.LIST_NAME;
        if (!listName || listName === "リスト名") {
          console.warn("List name not set:", node);
          return 0;
        }
        const length = battleScene.customLists[listName]?.length || 0;
        console.log(`Length of list ${listName}: ${length}`);
        return length;
      }
      
      case "custom_function_placeholder": {
        // mutation情報から関数名とパラメータ情報を取得
        const functionName = node.mutation?.function_name || fields.FUNCTION_NAME || 'Function';
        const paramNamesStr = node.mutation?.parameters || '';
        const mutationParamNames = paramNamesStr ? paramNamesStr.split(',').map(p => p.trim()).filter(Boolean) : [];
        
        if (!functionName || functionName === 'Function') {
          console.warn('Function block without name:', node);
          break;
        }
        
        const args = [];
        const argInputs = node.inputs || {};
        Object.keys(argInputs)
          .filter(key => key && key.indexOf('ARG_') === 0)
          .sort((a, b) => {
            const aIndex = parseInt(a.replace('ARG_', ''), 10);
            const bIndex = parseInt(b.replace('ARG_', ''), 10);
            return (isNaN(aIndex) ? 0 : aIndex) - (isNaN(bIndex) ? 0 : bIndex);
          })
          .forEach(key => {
            const idx = parseInt(key.replace('ARG_', ''), 10);
            const value = processNode(argInputs[key]);
            args[isNaN(idx) ? args.length : idx] = value;
          });

        let namedArgs = {};
        // まずmutationのパラメータ名を使用
        if (mutationParamNames.length > 0) {
          mutationParamNames.forEach((paramName, index) => {
            if (paramName && args[index] !== undefined) {
              namedArgs[paramName] = args[index];
            }
          });
        } else if (window.variableEditor && typeof window.variableEditor.getFunctionParameters === 'function') {
          // フォールバック: VariableEditorから取得
          const params = window.variableEditor.getFunctionParameters(functionName) || [];
          params.forEach((paramName, index) => {
            if (paramName) {
              namedArgs[paramName] = args[index];
            }
          });
        }

        // executeSavedFunction APIを使用して関数実行アクションを生成
        const functionActions = executeSavedFunction(
          functionName,
          args.map(value => value === undefined ? null : value),
          namedArgs,
          battleScene
        );
        
        // 生成されたアクションを追加
        actions.push(...functionActions);
        break;
      }
      
      case "text_equals": {
        const children = node.children || [];
        console.log(`  🔤 [text_equals] Comparing...`);
        console.log(`    Left node:`, children[0]?.type, children[0]?.fields);
        console.log(`    Right node:`, children[1]?.type, children[1]?.fields);
        
        const left = processNode(children[0]);
        const right = processNode(children[1]);
        
        console.log(`    Left value: "${left}" (${typeof left})`);
        console.log(`    Right value: "${right}" (${typeof right})`);
        
        const result = String(left) === String(right);
        console.log(`    Result: ${result} (${JSON.stringify(left)} === ${JSON.stringify(right)})`);
        return result;
      }
      
      case "text": {
        return fields.TEXT || "";
      }
      
      case "math_number": {
        return parseFloat(fields.NUM || 0);
      }
      // ========== 条件分岐 ==========
      case "if_condition": {
        // children: [condition1, do1, condition2, do2, ..., else]
        const children = node.children || [];
        console.log(`\n🔀 [if_condition] Processing with ${children.length} children`);
        
        // childrenの内容を詳細ログ
        children.forEach((child, idx) => {
          if (idx % 2 === 0) {
            console.log(`  [${idx}] Condition node:`, child?.type || child);
          } else {
            console.log(`  [${idx}] Do node:`, child?.type || child);
          }
        });
        
        // 条件とアクションをペアで処理
        const numConditions = Math.floor(children.length / 2);
        console.log(`  Number of if/elseif pairs: ${numConditions}`);
        
        for (let i = 0; i < numConditions; i++) {
          const conditionIndex = i * 2;
          const doIndex = i * 2 + 1;
          const conditionNode = children[conditionIndex];
          const doNode = children[doIndex];
          
          console.log(`\n  🔍 Evaluating condition ${i + 1}...`);
          const condition = processNode(conditionNode);
          console.log(`  ➡️ Condition ${i + 1} result: ${JSON.stringify(condition)} (${typeof condition})`);
          
          if (condition === true) {
            // 条件が真の場合、対応するdoブロックを実行
            console.log(`  ✅ Condition ${i + 1} is TRUE, executing do block...`);
            processNode(doNode);
            console.log(`  ✅ Do block ${i + 1} executed, exiting if_condition`);
            return; // 最初に真になった条件のブロックのみ実行
          } else {
            console.log(`  ❌ Condition ${i + 1} is FALSE, skipping do block`);
          }
        }
        
        // すべての条件が偽の場合、elseブロックを実行
        if (children.length % 2 === 1) {
          console.log(`\n  📌 All conditions false, executing else block (index ${children.length - 1})`);
          const elseNode = children[children.length - 1];
          processNode(elseNode);
        } else {
          console.log(`\n  📌 All conditions false, no else block available`);
        }
        return;
      }
      
      case "cast_magic_value": {
        // handWaveSequenceを抽出
        const handWaveSequence = [];
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
          // ネストした配列を平坦化
          function flattenWaves(arr) {
            if (!arr || !Array.isArray(arr)) return;
            for (const item of arr) {
              if (Array.isArray(item)) {
                flattenWaves(item);
              } else if (item && typeof item === 'object' && item.type) {
                if (item.type === "wave_left_hand") handWaveSequence.push("left");
                if (item.type === "wave_right_hand") handWaveSequence.push("right");
              }
            }
          }
          flattenWaves(node.children);
        }
        
        console.log(`Cast magic value with sequence: ${handWaveSequence.join(', ')}`);
        
        // パターンから魔法タイプを判定
        const detectedSpell = detectSpellFromPattern(handWaveSequence);
        
        if (detectedSpell) {
          actions.push({
            action_type: "StartIncantation",
            parameters: { 
              spell: getSpellDisplayName(detectedSpell),
              pattern: handWaveSequence.join("→")
            }
          });
          
          // 魔法を実行
          const expectedPattern = MAGIC_PATTERNS[detectedSpell];
          const isCorrect = JSON.stringify(handWaveSequence) === JSON.stringify(expectedPattern);
          
          if (isCorrect) {
            actions.push({
              action_type: "CompleteIncantation",
              parameters: { 
                spell: detectedSpell,
                pattern: handWaveSequence.join(",")
              }
            });
            
            if (detectedSpell === "HEALING") {
              actions.push({
                action_type: "CastHealingMagic",
                parameters: { power: 30 }
              });
            } else {
              actions.push({
                action_type: "CastMagic",
                parameters: { 
                  spell: detectedSpell,
                  type: detectedSpell
                }
              });
            }
          } else {
            actions.push({
              action_type: "FailIncantation",
              parameters: { 
                spell: detectedSpell,
                pattern: handWaveSequence.join(","),
                expected: expectedPattern.join(",")
              }
            });
          }
        }
        return;
      }
      
      case "complex_magic_sequence": {
        const sequence = [];
        // Extract sequence from child nodes if present
        if (node.children && Array.isArray(node.children)) {
          for (const child of node.children) {
            if (child.fields && child.fields.ELEMENT) {
              sequence.push(child.fields.ELEMENT);
            }
          }
        }
        console.log(`Processing complex_magic_sequence: ${sequence.join(', ')}`);
        actions.push({
          action_type: "ComplexMagicSequence",
          parameters: { sequence }
        });
        break;
      }
      
      default:
        console.warn("Unknown or unsupported node type:", type, node);
        return null;
    }
  }
  
  // ルートノードから処理開始
  console.log("=== Starting AST processing ===");
  if (Array.isArray(ast)) {
    ast.forEach((node, index) => {
      console.log(`Processing root node ${index}:`, node);
      processNode(node);
    });
  } else {
    console.log("Processing single root node:", ast);
    processNode(ast);
  }
  console.log("=== AST processing complete ===");
  console.log("Generated actions:", actions);
  
  return actions;
}

// グローバルに公開（BattleScene12のカウンターシステムで使用）
if (typeof window !== 'undefined') {
  window.convertASTToActions = convertASTToActions;
  window.executeGameAction = executeGameAction;
}
