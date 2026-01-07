import { BattleScene as BaseBattleScene } from './battle';

// ステージ1「基本の攻撃」用のバトルシーン
export class BattleScene extends BaseBattleScene {
    constructor() {
        super({ key: 'BattleScene' });
        this.settings = {
            background: 'forest',
            enemy: 'スライム',
            scratchMode: true,
            stageNumber: 1
        };
    }

    async create() {
        super.create();
        
        // ステージ1の設定
        await this.setupStageCommon({
            backgroundColor: 0x228B22, // 森の緑色背景
            enemyTint: 0x32CD32, // スライムの緑色
            enemyHp: 25,
            startMessage: `ステージ1「基本の攻撃」が始まりました！${this.settings.enemy}と対決します！`,
            availableBlocks: ['attack_basic', 'wait'],
            delayedMessage: {
                delay: 2000,
                text: '右側のブロックエディターで「攻撃」ブロックを使って敵を倒しましょう！'
            }
        });
        
        this.addLog('まずは基本的な攻撃を覚えましょう！');
    }
}
