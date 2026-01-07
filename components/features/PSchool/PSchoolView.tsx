import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import Blockly from 'scratch-blocks/dist/vertical';
import './PSchool.css';

// Import block definitions (side effects)
import './blockly/blocks';

// Import game logic
import { AuthenticationScene } from './game/AuthenticationScene';
import { MainMenuScene } from './game/MainMenuScene';
import { HomeScene } from './game/HomeScene';
import { MapSelectionScene } from './game/MapSelectionScene';
import { LibraryScene } from './game/LibraryScene';
import { ShopScene } from './game/ShopScene';
import { StoryScene } from './game/StoryScene';
import { BattleScene } from './game/BattleScene';
import { BattleScene2 } from './game/BattleScene2';
import { BattleScene3 } from './game/BattleScene3';
import { BattleScene4 } from './game/BattleScene4';
import { BattleScene5 } from './game/BattleScene5';
import { BattleScene6 } from './game/BattleScene6';
import { BattleScene7 } from './game/BattleScene7';
import { BattleScene8 } from './game/BattleScene8';
import { BattleScene9 } from './game/BattleScene9';
import { BattleScene10 } from './game/BattleScene10';
import { BattleScene11 } from './game/BattleScene11';
import { BattleScene12 } from './game/BattleScene12';
import { BattleScene13 } from './game/BattleScene13';
import { BattleScene14 } from './game/BattleScene14';
import { VariableEditor } from './variableEditor';
import { runGameWithCommands } from './game/engine';
import { UI } from './game/ui';

// Import toolbox XML
import toolboxXmlString from './blockly/toolbox.xml?raw';

// Helper function to extract AST (adapted from index.js)
function blockToAST(block: any): any {
  const ast: any = {
    type: block.type,
    fields: {},
    children: [],
    inputs: {},
    mutation: null
  };

  if (block.mutationToDom && typeof block.mutationToDom === 'function') {
    try {
      const mutationDom = block.mutationToDom();
      if (mutationDom && mutationDom.attributes) {
        ast.mutation = {};
        for (let i = 0; i < mutationDom.attributes.length; i++) {
          const attr = mutationDom.attributes[i];
          ast.mutation[attr.name] = attr.value;
        }
      }
    } catch (e) {
      console.warn('Failed to extract mutation:', e);
    }
  }

  const inputList = block.inputList;
  for (const input of inputList) {
    for (const field of input.fieldRow) {
      if (field.name) {
        ast.fields[field.name] = field.getValue();
      }
    }

    const connection = input.connection;
    if (connection && connection.targetBlock()) {
      const connectionType = connection.type;
      const isStatementInput =
        connectionType === Blockly.NEXT_STATEMENT ||
        connectionType === Blockly.INPUT_STATEMENT ||
        input.type === Blockly.NEXT_STATEMENT ||
        input.type === Blockly.INPUT_STATEMENT;

      if (isStatementInput) {
        let currentBlock = connection.targetBlock();
        while (currentBlock) {
          const targetAst = blockToAST(currentBlock);
          if (Array.isArray(targetAst)) {
            targetAst.forEach(child => ast.children.push(child));
          } else {
            ast.children.push(targetAst);
          }
          currentBlock = currentBlock.nextConnection && currentBlock.nextConnection.targetBlock();
        }
      } else {
        const targetBlock = connection.targetBlock();
        const targetAst = blockToAST(targetBlock);
        const normalizedTarget = Array.isArray(targetAst) ? targetAst[0] : targetAst;
        const inputName = input.name || 'INPUT';
        ast.inputs[inputName] = normalizedTarget;
      }
    }
  }
  return ast;
}

function getASTFromWorkspace(workspace: any) {
  const topBlocks = workspace.getTopBlocks(true);
  return Promise.resolve(topBlocks.map((block: any) => blockToAST(block)));
}

const PSchoolView: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const workspaceRef = useRef<any>(null);
  const [isBlocklyVisible, setIsBlocklyVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // --- Initialize Blockly ---
    console.log("Initializing Blockly...");
    const blocklyDiv = document.getElementById("blocklyDiv");
    if (!blocklyDiv) return;

    let toolbox;
    try {
      const parser = new DOMParser();
      toolbox = parser.parseFromString(toolboxXmlString, "text/xml").documentElement;
      (window as any).originalToolboxXml = toolboxXmlString;
    } catch (e) {
      console.error("Toolbox parse error", e);
      // Fallback
      toolbox = `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox"></xml>`;
    }

    // Important: In a real app, you need to point media to a valid path.
    // For now, we assume 'media/' exists in public or handle it later.
    const workspace = Blockly.inject("blocklyDiv", {
      toolbox: toolbox,
      media: "https://unpkg.com/scratch-blocks@1.1.210/media/",
      scrollbars: true,
      horizontalLayout: false,
      sounds: true,
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.8,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.1
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: 'rgba(204, 204, 204, 0.3)',
        snap: true
      }
    });

    workspaceRef.current = workspace;
    (window as any).blocklyWorkspace = workspace;
    (window as any).workspace = workspace;
    (window as any).blockToAST = blockToAST;

    // Apply transparency
    const applyTransparency = () => {
        const workspaceElement = document.querySelector('.blocklyWorkspace') as HTMLElement;
        if (workspaceElement) {
          workspaceElement.style.background = 'rgba(255, 255, 255, 0.1)';
          workspaceElement.style.backdropFilter = 'blur(5px)';
        }
        const mainBackground = document.querySelector('.blocklyMainBackground') as any;
        if (mainBackground) {
            mainBackground.style.fill = 'rgba(255, 255, 255, 0.05)';
            mainBackground.style.fillOpacity = '0.05';
        }
    };
    setTimeout(applyTransparency, 500);


    // --- Initialize Variable Editor ---
    const variableEditor = new VariableEditor();
    (window as any).variableEditor = variableEditor;
    setTimeout(() => {
        if (variableEditor && workspace) {
            variableEditor.regenerateToolbox();
        }
    }, 1000);

    // --- Initialize Phaser ---
    console.log("Initializing Phaser...");
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      parent: 'gameCanvas',
      render: {
        antialias: true,
        pixelArt: false,
        powerPreference: 'default',
        // resolution: window.devicePixelRatio || 1
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [
        HomeScene, // Start with HomeScene
        AuthenticationScene,
        MainMenuScene,
        MapSelectionScene,
        LibraryScene,
        ShopScene,
        StoryScene,
        BattleScene,
        BattleScene2,
        BattleScene3,
        BattleScene4,
        BattleScene5,
        BattleScene6,
        BattleScene7,
        BattleScene8,
        BattleScene9,
        BattleScene10,
        BattleScene11,
        BattleScene12,
        BattleScene13,
        BattleScene14
      ],
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 }, // Fix gravity typing
            debug: false
        }
      },
      backgroundColor: '#2c3e50'
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    (window as any).game = game;

    // Inject mock data when game is ready
    game.events.once('ready', () => {
        try {
             // Mock user data since auth is handled by parent app
             const mockPlayerData = {
                 userId: 'local_user',
                 email: 'player@example.com',
                 username: 'Player',
                 isGuest: false
             };
             console.log('🚀 Game Ready: Restarting HomeScene with mock data:', mockPlayerData);
             
             // We need to stop the auto-started HomeScene and restart it with data
             // Or just let it run if defaults are fine.
             // Let's restart to ensure data is passed.
             game.scene.start('HomeScene', { playerData: mockPlayerData });
        } catch (e) {
            console.error("Failed to inject data into Home scene", e);
        }
    });

    // Cleanup
    return () => {
      console.log("Cleaning up PSchoolView...");
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
      // Clean globals if needed
      // delete (window as any).game;
      // delete (window as any).blocklyWorkspace;
    };
  }, []);

  const handleRun = async () => {
    console.log("Run button clicked");
    if (!workspaceRef.current) return;

    // Logic from index.js executeCommands
    try {
        const { getAvailableBlocksByLevel } = await import('./game/levelBlockRestrictions.js');
        // Mock getUserLevel for now
        const getUserLevel = async () => 20; 
        const userLevel = await getUserLevel();
        const availableBlocks = getAvailableBlocksByLevel(userLevel);
        const usedBlocks = workspaceRef.current.getAllBlocks().map((block: any) => block.type);
        const unauthorizedBlocks = usedBlocks.filter((blockType: string) => !availableBlocks.includes(blockType));

        if (unauthorizedBlocks.length > 0) {
             alert(`Level ${userLevel} restricted blocks: ${unauthorizedBlocks.join(', ')}`);
             return;
        }
    } catch (e) {
        console.error("Restriction check failed", e);
    }

    const ast = await getASTFromWorkspace(workspaceRef.current);
    
    // Find active battle scene
    const game = gameRef.current;
    if (!game) return;

    const scenes = game.scene.getScenes(true); // active only
    const battleSceneKeys = ['Stage20Battle', 'Stage19Battle', 'Stage18Battle', 'Stage17Battle', 'Stage16Battle', 'Stage15Battle', 'Stage14Battle', 'Stage13Battle', 'Stage12Battle', 'Stage11Battle', 'Stage10Battle', 'Stage9Battle', 'Stage8Battle', 'Stage7Battle', 'Stage6Battle', 'Stage5Battle', 'Stage4Battle', 'Stage3Battle', 'Stage2Battle', 'BattleScene'];
    
    let battleScene: any = null;
    for (const key of battleSceneKeys) {
        battleScene = scenes.find((s: any) => s.scene.key === key);
        if (battleScene) break;
    }

    if (battleScene) {
        const blockCount = battleScene.getCurrentBlockCount ? battleScene.getCurrentBlockCount() : workspaceRef.current.getAllBlocks().length;
        if (typeof battleScene.updateBattleStats === 'function') {
            battleScene.updateBattleStats(blockCount);
        }

        await runGameWithCommands(ast, {
            player: battleScene.player,
            enemy: battleScene.enemy,
            scene: battleScene
        }, battleScene.ui || new UI());
    } else {
        console.warn("No active battle scene found.");
    }
  };

  const toggleBlockly = () => {
    setIsBlocklyVisible(!isBlocklyVisible);
    // Resize game logic if needed
    setTimeout(() => {
        if (gameRef.current) {
            gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
        }
    }, 100);
  };

  const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
      setTimeout(() => {
        if (workspaceRef.current) {
            Blockly.svgResize(workspaceRef.current);
        }
      }, 100);
  };

  return (
    <div className="p-school-container">
      {/* Game Container */}
      <div id="gameCanvas" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Toggle Button */}
      <button 
        className="toggle-button p-school-btn" 
        onClick={toggleBlockly}
        style={{
            background: isBlocklyVisible ? 'rgba(244, 67, 54, 0.9)' : 'rgba(66, 133, 244, 0.9)'
        }}
      >
        {isBlocklyVisible ? '✖️ 閉じる' : '📝 ブロック'}
      </button>

      {/* Blockly Panel */}
      <div 
        id="blocklyPanel" 
        className={`blockly-panel ${isBlocklyVisible ? '' : 'hidden'} ${isFullscreen ? 'fullscreen' : ''}`}
      >
          <div id="blocklyDiv" />
          
          <button 
            className="fullscreen-button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "元のサイズに戻す" : "全画面表示"}
          >
             {isFullscreen ? '◱' : '⛶'}
          </button>
      </div>

      {/* Run Button - Only visible when needed, controlled by CSS/JS usually but we can force it here if we want */}
      <button 
        id="runButton" 
        className="run-button" 
        onClick={handleRun}
        // Logic to show/hide run button based on scene would be better in the scene itself or via state
        // For now, let the global styles/logic handle it if possible, OR
        // we can assume it should be visible when blockly is visible?
        // The original logic shows it via CSS display none/block based on scene?
        // Actually original index.js doesn't seem to toggle it much except in CSS.
        // Let's make it visible if Blockly is visible for now.
        style={{ display: isBlocklyVisible ? 'block' : 'none' }}
      >
        実行 ▶
      </button>

    </div>
  );
};

export default PSchoolView;
