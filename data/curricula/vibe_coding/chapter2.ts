import { DocChapter } from '../../../types';

export const VIBE_CHAPTER_2_DATA: DocChapter = {
  id: 'vibe-ch2',
  title: '第2章｜AIと企画する力を身につける',
  subtitle: '「ふんわりしたアイデア」を、エンジニアリング可能な「設計図」に翻訳する技術',
  readingTime: '30 min read',
  sections: [
    {
      id: '2-1',
      title: '2-1. ChatGPTとの壁打ち設計術',
      content: [
        {
          type: 'text',
          text: 'プログラミングにおけるAIは「単なるコード生成機」ではありません。もっと上流の、「何を作るか」を相談できる**「シニアエンジニア兼プロダクトマネージャー」**です。',
          style: 'lead'
        },
        {
          type: 'text',
          text: 'いきなり「コード書いて」と言うのは、建築家に「とりあえずレンガ積んで」と言うようなものです。まずは「どんな家を建てたいか」を相談しましょう。これを「壁打ち」と呼びます。'
        },
        {
          type: 'callout',
          title: 'Step 1: 役割を与える (Role Prompting)',
          text: 'AIに適切な帽子を被せます。「優秀なPM」「ベテランエンジニア」などの役割を与えることで、回答の質と視座が変わります。',
          variant: 'info'
        },
        {
          type: 'code',
          language: 'markdown',
          filename: '壁打ち開始のプロンプト例',
          code: `あなたは百戦錬磨のプロダクトマネージャー兼フルスタックエンジニアです。
私は「個人開発者向けのタスク管理アプリ」を作りたいと考えています。
まだアイデアが曖昧なので、壁打ち相手になってください。
まずは、このアプリのターゲットユーザーと、彼らが抱える課題を明確にするための質問を私に投げかけてください。`
        },
        {
          type: 'text',
          text: 'このように、「質問してください」と頼むのがコツです。AIに答えを出させるのではなく、AIに引き出してもらうことで、自分の思考が整理されます。'
        }
      ]
    },
    {
      id: '2-2',
      title: '2-2. 「作りたい」を構造化する（要件定義）',
      content: [
        {
          type: 'text',
          text: '壁打ちでアイデアが固まってきたら、それを「システムとして実装可能な形」に翻訳します。ここで重要なのは**「機能の棚卸し」**と**「優先順位付け」**です。',
        },
        {
          type: 'callout',
          title: 'AIに出力させるべき成果物',
          text: `1. 機能一覧（Must/Should/Wantに分類）
2. ユーザーフロー（画面遷移の流れ）
3. データモデル（扱う情報の定義）`,
          variant: 'tip'
        },
        {
          type: 'code',
          language: 'markdown',
          filename: '仕様書生成プロンプト',
          code: `議論の内容をまとめ、以下の項目を含む「要件定義書（PRD）」のドラフトを作成してください。

## 1. アプリの概要
## 2. ターゲットユーザーと課題
## 3. コア機能（MVPに必須な機能3つ厳選）
## 4. 画面遷移図（Mermaid記法）
## 5. データモデル案（Mermaid記法：ER図）

技術スタックは React, TypeScript, Tailwind CSS, Supabase を想定してください。`
        },
        {
          type: 'mermaid',
          chart: `flowchart TD
    Start(アプリ起動) --> Login{ログイン済み?}
    Login --No--> Auth[認証画面]
    Login --Yes--> Dashboard[ダッシュボード]
    Auth --> Dashboard
    Dashboard --> TaskList[タスク一覧]
    Dashboard --> AddTask[タスク追加]
    AddTask --> Save{保存}
    Save --> TaskList`,
          caption: 'AIが生成する画面遷移フローの例'
        }
      ]
    },
    {
      id: '2-3',
      title: '2-3. データモデリングの「バイブ」',
      content: [
        {
          type: 'text',
          text: 'アプリ開発で最も重要なのが「データ設計」です。ここさえ間違っていなければ、UIは後からいくらでも修正できます。AIには「リレーション（関係性）」を言葉で伝えます。'
        },
        {
          type: 'list',
          style: 'check',
          items: [
            '**1対多 (1:N)**: 「1人のユーザーは、複数のタスクを持つ」',
            '**多対多 (N:M)**: 「タスクは複数のタグを持ち、タグも複数のタスクに使われる」',
            '**1対1 (1:1)**: 「ユーザーは1つのプロフィール設定を持つ」'
          ]
        },
        {
          type: 'mermaid',
          chart: `erDiagram
    USER ||--o{ TASK : "has"
    USER ||--o{ TAG : "creates"
    TASK }|--|{ TAG : "labeled_with"
    
    USER {
        uuid id PK
        string email
        string username
    }
    TASK {
        uuid id PK
        uuid user_id FK
        string title
        boolean is_completed
    }
    TAG {
        uuid id PK
        string name
        string color
    }`,
          caption: 'ユーザー、タスク、タグの関係を示すER図'
        },
        {
          type: 'callout',
          title: 'DB設計のコツ',
          text: '「Supabaseで使うためのSQL（DDL）を書いて」と頼む前に、まずはこのER図を出力させ、関係性が正しいかを目視で確認しましょう。いきなりコードを書かせると修正が大変です。',
          variant: 'warning'
        }
      ]
    },
    {
      id: '2-4',
      title: '2-4. UI/UXを言語化するデザイン・ボキャブラリー',
      content: [
        {
          type: 'text',
          text: '「いい感じのデザインにして」は禁句です。AIには**「デザインシステム」**や**「雰囲気」**を具体的な言葉（ボキャブラリー）で伝える必要があります。'
        },
        {
          type: 'table',
          headers: ['キーワード', 'AIの解釈・出力傾向'],
          rows: [
            ['Modern / Clean', '余白多め、サンセリフ体、フラットデザイン'],
            ['Bento Grids', 'Appleのようなグリッドレイアウト、角丸のカード'],
            ['Neubrutalism', '太い枠線、原色使い、強いドロップシャドウ'],
            ['Glassmorphism', 'すりガラス効果、背景ぼかし、半透明'],
            ['Corporate / Trust', 'ネイビー・青基調、堅実なフォント、情報の密度高め']
          ]
        },
        {
          type: 'text',
          text: '参考になるWebサイトがあれば、「このURLのような配色の雰囲気で」と伝えるのも有効です（Geminiはマルチモーダルなので、スクショを貼るのが最強です）。'
        },
        {
          type: 'code',
          language: 'text',
          filename: 'UI指定のプロンプト例',
          code: `UIデザインの方向性：
- "Bento Grids" スタイルを採用してください。
- 配色は "Slate-900" を背景に、アクセントに "Violet-500" を使用。
- 各カードには薄いボーダーと、ホバー時の微細なスケールアップエフェクトをつけてください。
- shadcn/ui のコンポーネントライブラリを使用する前提で実装してください。`
        }
      ]
    },
    {
      id: '2-5',
      title: '2-5. 失敗しない要件定義：MVPの美学',
      content: [
        {
          type: 'text',
          text: 'AI開発は爆速ですが、それでも機能が増えればバグの温床になります。最初のリリース（MVP: Minimum Viable Product）では、勇気を持って機能を削ぎ落とします。'
        },
        {
          type: 'list',
          style: 'number',
          items: [
            '**Must (必須)**: これがないとゴミ。絶対に作る。',
            '**Should (推奨)**: あった方がいいが、リリースを遅らせるほどではない。',
            '**Won\'t (やらない)**: 今回は作らないと決めること。これが一番大事。'
          ]
        },
        {
          type: 'callout',
          title: 'AI時代のMVP開発',
          text: `AIを使えば「後から機能追加」のコストは極めて低いです。だからこそ、最初は**「ログインできて、文字が表示されるだけ」**くらいの極小構成からスタートし、そこから雪だるま式に機能を足していく（イテレーティブ開発）のが正解です。`,
          variant: 'success'
        }
      ]
    }
  ]
};
