import { DocChapter } from '../../../types';

export const UNITY_CHAPTER_1_DATA: DocChapter = {
  id: 'unity-ch1',
  title: '第1章｜Unity基礎（AI時代版・最重要）',
  subtitle: 'AIに指示を出すための共通言語。Unityの「世界観」を理解する。',
  readingTime: '20 min read',
  sections: [
    {
      id: '1-1',
      title: '1-1. Unityの世界観 (Scene / GameObject / Component)',
      content: [
        {
          type: 'text',
          text: 'Unityの構造は「演劇」や「映画撮影」に例えると理解しやすくなります。この3つのキーワードは、Unity開発の共通言語です。',
          style: 'lead'
        },
        {
          type: 'list',
          items: [
            '**Scene (シーン)**: 場面。タイトル画面、ゲーム画面、リザルト画面など。一度に1つ（または複数）の舞台が存在します。',
            '**GameObject (ゲームオブジェクト)**: 舞台上の役者や大道具。プレイヤー、敵、床、照明、カメラなど、シーンにあるものはすべてGameObjectです。',
            '**Component (コンポーネント)**: 役者に与えられる「役割」や「台本」。GameObjectにComponentをつけることで、ただの箱が「物理挙動する箱」になったり、「光る箱」になったりします。'
          ]
        },
        {
          type: 'callout',
          title: 'Unity開発の本質',
          text: 'Unity開発とは、適切な **GameObject** に適切な **Component** をくっつけて、それらのパラメータ（状態）を調整していく作業です。C#スクリプトもComponentの一種です。',
          variant: 'info'
        },
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
          alt: 'Unity Editor Layout',
          caption: 'Unityエディタの基本4画面：Hierarchy（構成）、Scene（舞台）、Inspector（詳細）、Project（倉庫）。これらがどう連携するかを確認しましょう。'
        }
      ]
    },
    {
      id: '1-2',
      title: '1-2. Scene設計の基礎',
      content: [
        {
          type: 'text',
          text: '初心者がやりがちなミスは、1つのシーンに全ての機能を詰め込んでしまうことです。AIへの指示も複雑になり、管理が破綻します。'
        },
        {
          type: 'list',
          items: [
            '**1シーン1役割**: 「TitleScene」「GameScene」「ResultScene」のように役割を明確に分けましょう。',
            '**軽いシーン設計**: シーンが重いとテストプレイの起動が遅くなり、バイブコーディングのリズムが崩れます。',
            '**バランス**: 逆に細切れにしすぎるとデータの受け渡しが複雑になります。適度な粒度が重要です。'
          ]
        }
      ]
    },
    {
      id: '1-3',
      title: '1-3. GameObjectとComponentのパズル',
      content: [
        {
          type: 'text',
          text: '作成直後のGameObjectは、位置情報しか持たないただの「空の箱」です。ここにComponentを追加して機能を足していきます。'
        },
        {
          type: 'table',
          headers: ['Component名', '役割', '例'],
          rows: [
            ['Transform', '位置・回転・大きさ', '全てのGameObjectが必ず持つ基本機能'],
            ['Mesh Renderer', '形を表示する', '3Dモデルの描画'],
            ['Box Collider', '当たり判定を持つ', '壁、床、障害物'],
            ['Rigidbody', '物理演算に従う', '重力で落ちる、ぶつかって跳ね返る'],
            ['Audio Source', '音を鳴らす', 'BGM、効果音の発生源']
          ]
        },
        {
          type: 'callout',
          title: '🧪 やってみよう：物理演算',
          text: '1. Hierarchyで右クリック > 3D Object > Cube を作成\n2. Inspectorの「Add Component」から `Rigidbody` を検索して追加\n3. 上部の「▶ (再生)」ボタンを押す\n\nこれだけで箱が重力に従って落下します。「コードを書かずに振る舞いを変える」体験です。',
          variant: 'success'
        }
      ]
    },
    {
      id: '1-4',
      title: '1-4. Transform（事故防止）',
      content: [
        {
          type: 'text',
          text: '位置(Position)、回転(Rotation)、大きさ(Scale)を扱うTransformは、AIへの指示ミスが起きやすいポイントです。'
        },
        {
          type: 'list',
          items: [
            '**World座標**: ゲーム世界全体から見た絶対的な値。',
            '**Local座標**: 親オブジェクトから見た相対的な値。'
          ]
        },
        {
          type: 'callout',
          title: 'AIへの指示のコツ',
          text: 'AIに「右に動かして」と頼むとき、「ローカル座標で（向いている方向に）右」なのか「ワールド座標で（画面上の）右」なのかを区別できないと、意図しない挙動になります。',
          variant: 'warning'
        },
        {
          type: 'text',
          text: 'また、UnityではHierarchyウィンドウでドラッグ＆ドロップすることで**親子関係**を作れます。親が動けば子も動く（戦車の砲塔は戦車本体についていく）という仕組みは頻出です。'
        },
        {
          type: 'callout',
          title: '🧪 やってみよう：座標と親子関係',
          text: '1. Cubeを回転させる（Rotation Y: 45など）。\n2. 左上のツールバーで「Global」と「Local」を切り替えて、移動矢印の向きが変わるか確認する。\n3. もう一つSphereを作り、HierarchyでCubeの下にドラッグして「子」にする。\n4. 親のCubeを動かすと、子のSphereもついてくることを確認する。',
          variant: 'success'
        }
      ]
    }
  ]
};
