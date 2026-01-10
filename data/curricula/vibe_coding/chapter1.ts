import { DocChapter } from '../../../types';

export const VIBE_CHAPTER_1_DATA: DocChapter = {
  id: 'vibe-ch1',
  title: '第1章｜人間が理解すべき最低ライン',
  subtitle: 'AIに指示を出すために、最低限知っておくべき「Webの仕組み」',
  readingTime: '15 min read',
  sections: [
    {
      id: '1-1',
      title: '1-1. フロントエンド / バックエンド / DBの関係',
      content: [
        {
          type: 'text',
          text: '「アプリを作りたい」とAIに頼むとき、私たちが作ろうとしているものは一体何なのでしょうか？大きく分けて3つの要素が連携して動いています。',
          style: 'lead'
        },
        {
          type: 'mermaid',
          chart: `graph LR
    User((ユーザー)) --> Front[フロントエンド<br>店舗の内装/接客]
    Front <-->|API| Back[バックエンド<br>厨房/司令塔]
    Back <-->|SQL| DB[(データベース<br>巨大な冷蔵庫)]`,
          caption: 'Webアプリケーションの3層構造'
        },
        {
          type: 'callout',
          title: 'レストランで例えると...',
          text: 'フロントエンドは「客席とウェイター」、バックエンドは「厨房のシェフ」、データベースは「食材庫」です。お客さん（ユーザー）は厨房（バックエンド）に直接入ることはできません。必ずウェイター（フロントエンド）を通して注文します。',
          variant: 'tip'
        },
        {
          type: 'text',
          text: 'AIに指示を出すときは、「これは厨房（バックエンド）の処理？それとも客席（フロントエンド）の話？」と意識するだけで、生成されるコードの精度が劇的に上がります。'
        },
        {
          type: 'list',
          items: [
            '**フロントエンド (Frontend)**: ブラウザで動く部分。ReactやVue.jsなどで作られます。ユーザーの目に触れる全てです。',
            '**バックエンド (Backend)**: サーバーで動く部分。Node.jsやPythonなどで作られます。データの加工や保存を担当します。',
            '**データベース (DB)**: データを永続的に保存する場所。PostgreSQLやMySQLなどが使われます。'
          ]
        }
      ]
    },
    {
      id: '1-2',
      title: '1-2. UIとは何か、APIとは何か',
      content: [
        {
          type: 'text',
          text: '「UIを作って」と「APIを作って」は、全く異なる作業依頼です。この2つの境界線を理解しましょう。'
        },
        {
          type: 'text',
          text: '**UI (User Interface)** は人間とコンピュータの接点です。ボタン、入力フォーム、画面レイアウトなど、「人間が操作するもの」です。'
        },
        {
          type: 'text',
          text: '**API (Application Programming Interface)** は、フロントエンドとバックエンド（またはシステム同士）が会話するための窓口です。'
        },
        {
          type: 'code',
          language: 'json',
          filename: 'APIのレスポンス例 (JSON)',
          code: `{
  "userId": "u_12345",
  "name": "Gemini User",
  "role": "admin",
  "lastLogin": "2026-01-10T10:00:00Z"
}`
        },
        {
          type: 'callout',
          title: 'バイブコーディングのコツ',
          text: '「UIをリッチにして」と言うとAIはCSSやアニメーションを調整します。「APIからもっとデータを取ってきて」と言うとAIはバックエンドのロジックやSQLを修正します。ここを混同しないことが重要です。',
          variant: 'info'
        }
      ]
    },
    {
      id: '1-3',
      title: '1-3. デプロイとは「何が起きている行為」か',
      content: [
        {
          type: 'text',
          text: 'ローカル（自分のPC）で作ったアプリを、世界中の人が使えるようにすることを「デプロイ (Deploy)」と呼びます。これは単なるファイルコピーではありません。'
        },
        {
          type: 'list',
          style: 'number',
          items: [
            '**ビルド (Build)**: 人間が読みやすいコードを、機械が効率よく実行できる形式に変換・圧縮すること。',
            '**転送**: サーバー（VercelやRenderなど）にファイルを送ること。',
            '**起動**: サーバー上でプログラムを走らせ、リクエストを待ち受ける状態にすること。'
          ]
        },
        {
          type: 'callout',
          title: 'よくあるエラー',
          text: '「ローカルでは動いていたのに、デプロイしたら動かない」という現象は、環境変数（APIキーなど）の設定忘れや、ビルドプロセスの違いによって起こります。',
          variant: 'warning'
        }
      ]
    },
    {
      id: '1-4',
      title: '1-4. Gitはなぜ必須なのか（時間を保存する技術）',
      content: [
        {
          type: 'text',
          text: 'AI開発において、Gitは「コードのバックアップ」以上の意味を持ちます。それは「セーブポイント」であり、AIが破壊したコードを「時間を巻き戻して」修復するための唯一の手段です。'
        },
        {
          type: 'list',
          items: [
            '**Commit**: セーブポイントを作成する。「ここまで動いていた」という記録。',
            '**Push**: セーブデータをクラウド（GitHub）にアップロードする。',
            '**Revert**: 失敗した未来をなかったことにして、過去のセーブポイントに戻る。'
          ]
        },
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1200',
          alt: 'Time Machine',
          caption: 'Gitは開発者のためのタイムマシンです。恐れずに実験するために必須のツールです。'
        },
        {
          type: 'text',
          text: 'AIは時々、大胆な修正を行って既存の機能を壊すことがあります。Gitがあれば、「昨日の状態に戻して」と念じる必要はありません。コマンド一つで確実に戻れます。'
        }
      ]
    }
  ]
};
