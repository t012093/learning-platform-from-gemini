
export interface GlossaryTerm {
  id: string;
  term: string;          // マッチさせる単語
  synonyms?: string[];   // 同義語
  definition: string;    // ポップアップで表示する短い説明
  category: 'unity' | 'code' | 'concept' | 'general';
  aiContextPrompt?: string; 
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Unity Core
  {
    id: 'scene',
    term: 'Scene',
    synonyms: ['シーン'],
    definition: 'Unityの「場面」の単位。タイトル画面、ゲーム本編、リザルト画面など、1つの場面につき1つのSceneファイルを作るのが基本。',
    category: 'unity',
    aiContextPrompt: 'ユーザーはUnity初心者です。「Scene（シーン）」について、演劇や映画の「場面転換」に例えて説明してください。なぜ全てを1つのシーンで作ってはいけないのかも教えてください。'
  },
  {
    id: 'gameobject',
    term: 'GameObject',
    synonyms: ['ゲームオブジェクト'],
    definition: 'Unityのシーン上に配置される「物体」の総称。プレイヤー、敵、カメラ、光、UI、ただの空っぽの箱、これら全てがGameObject。',
    category: 'unity',
    aiContextPrompt: 'ユーザーはUnity初心者です。「GameObject」について、「ただの箱」であるという性質を強調して説明してください。Componentがつかないと何もしないことを例えてください。'
  },
  {
    id: 'component',
    term: 'Component',
    synonyms: ['コンポーネント'],
    definition: 'GameObjectにくっつける「機能」や「部品」。Transform（位置）、MeshRenderer（見た目）、Rigidbody（物理）などがある。',
    category: 'unity',
    aiContextPrompt: 'ユーザーはUnity初心者です。「Component」について、GameObjectを人間に例えるなら「服」や「道具」や「スキル」にあたるものとして説明してください。'
  },
  {
    id: 'transform',
    term: 'Transform',
    synonyms: ['トランスフォーム'],
    definition: '全てのアセットが必ず持っているComponent。位置(Position)、回転(Rotation)、大きさ(Scale)を管理する。',
    category: 'unity'
  },
  {
    id: 'rigidbody',
    term: 'Rigidbody',
    synonyms: ['リジッドボディ'],
    definition: '物理演算Component。これをつけると重力で落ちたり、物にぶつかって跳ね返ったりするようになる。',
    category: 'unity'
  },
  {
    id: 'world-local',
    term: 'World座標',
    synonyms: ['World Space', 'ワールド座標'],
    definition: 'ゲーム世界全体の絶対的な中心(0,0,0)からの位置。',
    category: 'unity'
  },
  {
    id: 'local-coord',
    term: 'Local座標',
    synonyms: ['Local Space', 'ローカル座標'],
    definition: '親オブジェクトから見た相対的な位置。親が動けば、子のLocal座標は変わらなくてもWorld座標は変わる。',
    category: 'unity'
  },
  {
    id: 'hierarchy',
    term: 'Hierarchy',
    synonyms: ['ヒエラルキー'],
    definition: 'シーンにある全オブジェクトがリスト表示されるウィンドウ。ここで親子関係を作ることができる。',
    category: 'unity'
  },
  {
    id: 'inspector',
    term: 'Inspector',
    synonyms: ['インスペクター'],
    definition: '選択したGameObjectの詳細設定（Componentの値など）を表示・編集するウィンドウ。',
    category: 'unity'
  }
];
