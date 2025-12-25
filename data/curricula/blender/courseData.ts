export interface Parameter {
  label: string;
  value: string;
}

export interface LessonStep {
  id: string;
  title: string;
  description: string;
  imageType: 'static' | 'compare' | 'overlay' | 'dos_donts';
  imageUrl: string; 
  secondaryImageUrl?: string; // For 'compare' or 'overlay'
  beforeImageUrl?: string;
  badExample?: { image: string, text: string };
  goodExample?: { image: string, text: string };
  hotkeys: string[];
  parameters?: Parameter[]; 
  troubleshooting?: {
    title: string;
    text: string;
  };
  tip?: string;
}

export interface StageData {
  id: number;
  title: string;
  subtitle: string;
  level: string;
  description: string;
  steps: LessonStep[];
}

export const BLENDER_COURSE_DATA: Record<number, StageData> = {
  1: {
    id: 1,
    title: "First Steps into 3D",
    subtitle: "Chapter 1: Mastering the Viewport & Transforms",
    level: "Beginner",
    description: "3D制作の第一歩へようこそ。このレッスンでは、Blenderを自在に操るための基礎、視点操作とオブジェクト変形をマスターします。",
    steps: [
      {
        id: 's1-1',
        title: 'Master the Viewport',
        description: '3D空間を自由に動き回ることが全ての基本です。中マウスボタンを使って、世界をあらゆる角度から観察してみましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Middle Mouse (Rotate)', 'Shift + Middle Mouse (Pan)', 'Scroll (Zoom)'],
        troubleshooting: {
          title: "視点がどこかへ飛んでしまったら？",
          text: "オブジェクトを選択してテンキーの '.' (ピリオド) を押すと、そのオブジェクトに視点をリセットできます。"
        }
      },
      {
        id: 's1-2',
        title: 'Selection Basics',
        description: '操作したいものを正確に選ぶ練習です。Blender 4.0では左クリック選択が標準です。複数のものを選んだり、全てを選択解除する操作を覚えましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Left Click (Select)', 'A (Select All)', 'Alt + A (Deselect All)'],
        tip: "オレンジ色の枠線がついているものが『アクティブ』なオブジェクトです。"
      },
      {
        id: 's1-3',
        title: 'The Transformation Trinity',
        description: '移動(Grab)、回転(Rotate)、拡大縮小(Scale)は3D制作の三種の神器です。ショートカットキーを使って、直感的にオブジェクトの形や位置を変えてみましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['G (Grab/Move)', 'R (Rotate)', 'S (Scale)'],
        parameters: [
          { label: 'Constraint X', value: 'G -> X' },
          { label: 'Constraint Y', value: 'G -> Y' },
          { label: 'Constraint Z', value: 'G -> Z' },
          { label: 'Cancel', value: 'Right Click / Esc' }
        ]
      },
      {
        id: 's1-4',
        title: 'Adding New Worlds',
        description: '何もないところから形を生み出します。MeshメニューからCubeやSphere、あるいは有名なMonkey(Suzanne)を追加してみましょう。',
        imageType: 'overlay',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200', 
        secondaryImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200', 
        hotkeys: ['Shift + A (Add Menu)'],
        tip: "新しいオブジェクトは常に『3D Cursor』がある場所に生成されます。"
      },
      {
        id: 's1-5',
        title: 'Shading & Visualization',
        description: '見た目の切り替えです。作業しやすいソリッド表示と、内部構造が見えるワイヤーフレーム表示、そして完成イメージに近いレンダー表示を使い分けます。',
        imageType: 'compare', 
        beforeImageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=1200',
        imageUrl: 'https://images.unsplash.com/photo-1633412803524-d96562450871?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Z (Shading Pie Menu)', 'Shift + Z (Toggle Wireframe)'],
      },
      {
        id: 's1-6',
        title: 'Enter the Edit Mode',
        description: 'オブジェクトそのものの形を作り変える段階へ進みます。オブジェクトモードから編集モードへ切り替えると、点・辺・面を個別に操作できるようになります。',
        imageType: 'dos_donts',
        imageUrl: '',
        badExample: {
          image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800&sat=-100',
          text: 'オブジェクトモードで形を無理やり歪ませると、後の工程でトラブルの元になります。'
        },
        goodExample: {
          image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
          text: '詳細な形状変化は必ず編集モードで行いましょう。これがプロのワークフローです。'
        },
        hotkeys: ['Tab (Switch Mode)'],
      }
    ]
  },
  2: {
    id: 2,
    title: "Modeling Essentials",
    subtitle: "Chapter 2: Creating the Desk",
    level: "Beginner",
    description: "編集モードの力を解き放ちましょう。基本的なメッシュ操作を駆使して、シンプルな机をモデリングします。ベベル（面取り）によるリアリティの追求も学びます。",
    steps: [
      {
        id: 's2-1',
        title: 'Scaling the Table Top',
        description: 'デフォルトのキューブを机の天板に変身させます。Sキー（スケール）に軸（X/Y/Z）を指定することで、思い通りの比率に変形できます。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['S + Z (Scale Height)', 'S + Y (Scale Width)'],
        tip: "薄く、広くするのがポイントです。"
      },
      {
        id: 's2-2',
        title: 'Creating Legs',
        description: '新しいキューブを追加し、足の形に細長くします。天板の四隅に配置する際は、テンキー7（トップビュー）を使うと位置合わせが簡単です。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1533090368676-1fd25485db88?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Shift + A > Cube', 'G (Move)', 'Numpad 7 (Top View)'],
      },
      {
        id: 's2-3',
        title: 'Duplicate with Precision',
        description: '1本の足を何度も作る必要はありません。「Shift + D」で複製し、XやYを押して軸を固定すれば、正確な位置にコピーできます。',
        imageType: 'overlay',
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1200',
        secondaryImageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1200&blur=20',
        hotkeys: ['Shift + D (Duplicate)', 'X / Y (Lock Axis)'],
        tip: "足の長さを変えるときは、ワイヤーフレーム表示(Shift+Z)にすると底面の頂点だけを選びやすくなります。"
      },
      {
        id: 's2-4',
        title: 'The Magic of Bevel',
        description: 'CGっぽさを消す鍵は「角」にあります。現実の物体に完全に鋭利な角はありません。ベベル（Ctrl+B）を使って、角を少しだけ丸めましょう。',
        imageType: 'compare',
        beforeImageUrl: 'https://images.unsplash.com/photo-1533090368676-1fd25485db88?auto=format&fit=crop&q=80&w=1200', // Sharp
        imageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=1200', // Beveled
        hotkeys: ['Ctrl + A > Scale (Apply Scale First!)', 'Ctrl + B (Bevel)'],
        troubleshooting: {
            title: "ベベルが歪む？",
            text: "オブジェクトモードでスケールを変更した後にベベルをかけると歪みます。必ず「Ctrl+A -> Scale」でスケールを適用してから行いましょう。"
        }
      }
    ]
  },
  3: {
    id: 3,
    title: "Advanced Modeling",
    subtitle: "Chapter 3: The Chair & Scene Setup",
    level: "Intermediate",
    description: "机に合う椅子を作成し、シーン全体を構成します。オブジェクトの親子関係やコレクション整理など、効率的な管理方法も習得します。",
    steps: [
      {
        id: 's3-1',
        title: 'Seat & Backrest',
        description: '椅子の座面を作ります。机の天板と同じ要領ですが、今度は背もたれも必要です。座面を複製し、90度回転させて背もたれにしましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Shift + D (Duplicate)', 'R + X + 90 (Rotate 90deg on X)'],
      },
      {
        id: 's3-2',
        title: 'Edit Mode Precision',
        description: '椅子の足は、座面の下にぴったりくっつけたいですよね。編集モードで面を選択し、「Snapping（スナップ）」機能を使うと、磁石のように吸着させることができます。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Shift + Tab (Toggle Snap)', 'Ctrl (Hold to Snap temporarily)'],
        tip: "スナップ先を「Vertex（頂点）」や「Face（面）」に切り替えて使い分けましょう。"
      },
      {
        id: 's3-3',
        title: 'Organizing with Collections',
        description: 'オブジェクトが増えてきました。「机」「椅子」「床」など、部品ごとにコレクション（フォルダのようなもの）にまとめましょう。',
        imageType: 'dos_donts',
        imageUrl: '',
        badExample: {
            image: 'https://images.unsplash.com/photo-1580196920985-3391d98782a5?auto=format&fit=crop&q=80&w=800',
            text: 'アウトライナーが "Cube.001", "Cube.002"... で埋め尽くされている状態。どれがどれか分かりません。'
        },
        goodExample: {
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
            text: 'Mキーで新しいコレクションを作成し、名前を付けます。ビューポートの表示/非表示も一括で管理できます。'
        },
        hotkeys: ['M (Move to Collection)', 'F2 (Rename)']
      },
      {
        id: 's3-4',
        title: 'Setting the Stage',
        description: '床（Plane）を追加し、家具を配置します。カメラの視点（テンキー0）から見て、魅力的な構図になるように調整しましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Shift + A > Plane', 'Numpad 0 (Camera View)']
      }
    ]
  },
  4: {
    id: 4,
    title: "Bringing it to Life",
    subtitle: "Chapter 4: Materials, Lights & Render",
    level: "Intermediate",
    description: "最後の仕上げです。木材や金属の質感を設定し、ライティングで雰囲気を演出。そして最高の一枚を書き出します。",
    steps: [
        {
            id: 's4-1',
            title: 'Material Basics',
            description: '「マテリアルプレビュー」モードに切り替え、プロパティパネルから新規マテリアルを作成します。Base Colorを変えるだけで世界が変わります。',
            imageType: 'compare',
            beforeImageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=1200', // Grey
            imageUrl: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&q=80&w=1200', // Wood
            hotkeys: ['Z > Material Preview'],
            parameters: [
                { label: 'Base Color', value: 'Pick a color' },
                { label: 'Roughness', value: '0.5 (Matte) - 0.0 (Glossy)' },
                { label: 'Metallic', value: '0.0 (Plastic/Wood) - 1.0 (Metal)' }
            ]
        },
        {
            id: 's4-2',
            title: 'Assigning Multiple Materials',
            description: '机の足は金属、天板は木材にしたい場合、編集モードで面を選択し、「Assign」ボタンで別のマテリアルを適用できます。',
            imageType: 'static',
            imageUrl: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=1200',
            hotkeys: ['Tab (Edit Mode)', 'Material Panel > Assign']
        },
        {
            id: 's4-3',
            title: 'Lighting the Scene',
            description: 'ライトがないとレンダリングは真っ暗です。Point LightやArea Lightを追加し、パワーと位置を調整して、家具の立体感を際立たせましょう。',
            imageType: 'overlay',
            imageUrl: 'https://images.unsplash.com/photo-1513506003013-194a5d68d878?auto=format&fit=crop&q=80&w=1200',
            secondaryImageUrl: 'https://images.unsplash.com/photo-1513506003013-194a5d68d878?auto=format&fit=crop&q=80&w=1200&brightness=150',
            hotkeys: ['Shift + A > Light'],
            tip: "「3点照明（キーライト、フィルライト、バックライト）」を意識するとプロっぽい仕上がりになります。"
        },
        {
            id: 's4-4',
            title: 'Render & Export',
            description: 'F12キーを押してレンダリング！計算が終わったら、Imageメニューから「Save As」で画像として保存しましょう。おめでとうございます、最初の作品の完成です！',
            imageType: 'static',
            imageUrl: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2d00b?auto=format&fit=crop&q=80&w=1200',
            hotkeys: ['F12 (Render Image)', 'Alt + S (Save Image)'],
            troubleshooting: {
                title: "画像が暗すぎる/明るすぎる",
                text: "ライトの「Power（ワット数）」を調整するか、Render Propertiesの「Color Management > Exposure」で調整してください。"
            }
        }
    ]
  }
};
