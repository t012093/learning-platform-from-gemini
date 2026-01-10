
export interface GlossaryTerm {
  id: string;
  term: string;          // マッチさせる主単語
  synonyms?: string[];   // 同義語
  definitions: {         // 言語ごとの定義
    en: string;
    jp: string;
  };
  category: 'unity' | 'code' | 'concept' | 'general';
  aiContextPrompts?: {   // AIへの指示も言語ごとに用意
    en: string;
    jp: string;
  }; 
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'scene',
    term: 'Scene',
    synonyms: ['シーン'],
    definitions: {
      en: 'A basic unit of Unity development, representing a "stage" like a Title screen, Game level, or Result screen.',
      jp: 'Unityの「場面」の単位。タイトル画面、ゲーム本編、リザルト画面など、1つの場面につき1つのSceneファイルを作るのが基本。'
    },
    category: 'unity',
    aiContextPrompts: {
      en: 'The user is a beginner. Explain "Scene" using an analogy of a movie or play. Why not put everything in one scene?',
      jp: 'ユーザーはUnity初心者です。「Scene（シーン）」について、演劇や映画の「場面転換」に例えて説明してください。なぜ全てを1つのシーンで作ってはいけないのかも教えてください。'
    }
  },
  {
    id: 'gameobject',
    term: 'GameObject',
    synonyms: ['ゲームオブジェクト'],
    definitions: {
      en: 'The base class for all entities in Unity scenes. Players, enemies, cameras, and lights are all GameObjects.',
      jp: 'Unityのシーン上に配置される「物体」の総称。プレイヤー、敵、カメラ、光、UI、ただの空っぽの箱、これら全てがGameObject。'
    },
    category: 'unity',
    aiContextPrompts: {
      en: 'Explain "GameObject" as an "empty box" that needs components to do anything.',
      jp: 'ユーザーはUnity初心者です。「GameObject」について、「ただの箱」であるという性質を強調して説明してください。Componentがつかないと何もしないことを例えてください。'
    }
  },
  {
    id: 'component',
    term: 'Component',
    synonyms: ['コンポーネント'],
    definitions: {
      en: 'Functional blocks attached to GameObjects, like Transform (position), MeshRenderer (look), or Rigidbody (physics).',
      jp: 'GameObjectにくっつける「機能」や「部品」。Transform（位置）、MeshRenderer（見た目）、Rigidbody（物理）などがある。'
    },
    category: 'unity',
    aiContextPrompts: {
      en: 'Analogy for Component: equipment, clothing, or skills for a human (GameObject).',
      jp: 'ユーザーはUnity初心者です。「Component」について、GameObjectを人間に例えるなら「服」や「道具」や「スキル」にあたるものとして説明してください。'
    }
  },
  {
    id: 'rigidbody',
    term: 'Rigidbody',
    synonyms: ['リジッドボディ'],
    definitions: {
      en: 'A physics component that makes a GameObject subject to gravity and collision forces.',
      jp: '物理演算Component。これをつけると重力で落ちたり、物にぶつかって跳ね返ったりするようになる。'
    },
    category: 'unity'
  },
  {
    id: 'prefab',
    term: 'Prefab',
    synonyms: ['プレハブ'],
    definitions: {
      en: 'A reusable template for GameObjects. Editing the Prefab asset updates all instances in all scenes.',
      jp: 'GameObjectを「型（テンプレート）」として保存したもの。これをコピーして大量の敵や弾丸を作る。大元のPrefabを修正すると、全てのコピーに反映される。'
    },
    category: 'unity',
    aiContextPrompts: {
      en: 'Analogy for Prefab: a "rubber stamp" or "mold". Contrast it with manual manual editing of 100 objects.',
      jp: 'ユーザーはUnity初心者です。「Prefab（プレハブ）」について、「ハンコ」や「金型」に例えて説明してください。Prefabを使わずに100体の敵を配置した時の絶望的な修正作業と比較してください。'
    }
  },
  {
    id: 'monobehaviour',
    term: 'MonoBehaviour',
    synonyms: ['モノビヘイビア'],
    definitions: {
      en: 'The base class from which every Unity script derives, allowing use of Start() and Update() methods.',
      jp: 'Unityスクリプトの基本となるクラス。これを継承することで、Start()やUpdate()などのUnityの魔法が使えるようになる。'
    },
    category: 'code'
  }
  // ※ 他の用語も同様の形式で拡張可能
];
