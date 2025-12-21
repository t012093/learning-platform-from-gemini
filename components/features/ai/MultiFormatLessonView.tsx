import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LearningBlock } from '../../../types';
import ConceptPage from './multi-format/blocks/ConceptPage';
import DialoguePage from './multi-format/blocks/DialoguePage';
import WorkshopPage from './multi-format/blocks/WorkshopPage';
import ReflectionPage from './multi-format/blocks/ReflectionPage';
import BlenderViewportPage from './multi-format/blocks/BlenderViewportPage';
import ShowcasePage from './multi-format/blocks/ShowcasePage';
import ChecklistPage from './multi-format/blocks/ChecklistPage';

// --- Mock Data (Static) ---
const MOCK_BLOCKS: LearningBlock[] = [
  {
    id: '0-showcase',
    type: 'showcase',
    title: 'Welcome to Blender',
    subtitle: 'あなたの想像力を、無限の3D空間で解き放つ旅へ。',
    features: [
        { title: 'VFX & Film', description: 'ハリウッド級の映像効果を作成。', icon: 'film' },
        { title: 'Game Assets', description: 'UnityやUnreal向けのモデル制作。', icon: 'game' },
        { title: 'Architecture', description: 'フォトリアルな建築パース。', icon: 'arch' },
        { title: 'Character', description: '魅力的な3Dキャラクターデザイン。', icon: 'char' },
    ],
    mentorMessage: 'Blenderは最初は難しく見えるかもしれません。でも大丈夫。このコースでは、一つ一つの操作を「手で触って」覚えられるように設計されています。さあ、最初のキューブを動かしに行きましょう！'
  },
  {
    id: '0-checklist',
    type: 'checklist',
    title: 'Blenderの冒険を始める準備',
    tasks: [
        { id: 't1', label: 'Blender公式サイトからダウンロード', details: '安定版を公式サイトから入手します。必要なら要件も確認してください。', imageKeyword: 'Blender download page', linkUrl: 'https://www.blender.org/download/', imageUrl: '/data/curricula/blender/_static/blender-download-page.png', imageCaption: 'Blender download page' },
        { id: 't2', label: 'インストールを実行', details: 'Windows: x64/arm64を選択。Installer版は開始メニュー登録と関連付けあり。Zip版は解凍して実行(管理者不要)。macOS: Intel/Apple Siliconを選択し、.dmgを開いて Blender.app をApplicationsへドラッグ。初回起動は承認が必要。', imageKeyword: 'Blender install wizard', imageUrl: '/data/curricula/blender/_images/about_contribute_install_windows_installer.png', imageCaption: 'Installer example' },
        { id: 't3', label: '画面構成をざっと把握', details: '上部メニュー/ヘッダー、中央3Dビューポート、右のアウトライナー/プロパティ、下のタイムラインが基本。境界をドラッグで分割・結合、ワークスペースでレイアウト切替。', imageKeyword: 'Blender interface overview', imageUrl: '/data/curricula/blender/_images/interface_window-system_introduction_default-screen.png', imageCaption: 'Default layout' },
        { id: 't4', label: '言語設定を日本語に変更', details: 'Edit > Preferences > Interface > Language を日本語に。TranslateのInterface/Tooltips/New Dataを必要に応じてオン。', imageKeyword: 'Blender language settings', imageUrl: '/data/curricula/blender/_static/blender-language-ui.png', imageCaption: 'Language settings' },
    ]
  },
  {
    id: '1',
    type: 'concept',
    title: '量子もつれとは何か？',
    content: '量子もつれ（Quantum Entanglement）は、2つの粒子がどれだけ離れていても、片方の状態が決まると瞬時にもう片方の状態も決まる現象です。アインシュタインはこれを「不気味な遠隔作用」と呼びました。',
    analogy: 'まるで、地球と火星に離れた双子が、同時に同じコインの裏表を出し合うようなものです。'
  },
  {
    id: '2',
    type: 'dialogue',
    lines: [
      { speaker: 'User', text: 'でも、光の速さを超えて情報が伝わるってことですか？' },
      { speaker: 'AI', text: '鋭い質問ですね！実は「情報の伝達」は光速を超えません。あくまで「相関関係」が瞬時に決まるだけなんです。ここが量子力学の面白いところです。', emotion: 'excited' }
    ]
  },
  {
    id: '3-code',
    type: 'workshop',
    subType: 'code',
    goal: 'Pythonで量子回路を作ってみよう',
    steps: [
      'Qiskitライブラリをインストールします: `pip install qiskit`',
      '2つの量子ビットを持つ回路を作成します。',
      'アダマールゲートを適用して重ね合わせ状態を作ります。'
    ]
  },
  {
    id: '3-design',
    type: 'workshop',
    subType: 'design',
    goal: 'UIコンポーネントのデザイン',
    steps: [
      'ベースカラーをIndigo (#6366F1) に設定して視認性を高めます。',
      '角丸 (Border Radius) を24pxにして、親しみやすさを演出します。',
      'ドロップシャドウと僅かな傾きを加え、クリックしたくなる躍動感を表現します。'
    ]
  },
  {
    id: '3-logic',
    type: 'workshop',
    subType: 'logic',
    goal: '注文処理アルゴリズムの構築',
    steps: [
      'ユーザーからの入力データ（注文情報）を受け取るトリガーを配置します。',
      '入力データが有効かどうかをチェックする条件分岐（Valid?）を作成します。',
      '有効なデータのみ、メインの処理プロセスへ送信する接続を完了させます。'
    ]
  },
  {
    id: '3-blender',
    type: 'workshop',
    subType: 'blender',
    goal: 'オブジェクトの基本操作（G/R/S）',
    steps: [
      '3D空間での選択：クリックして立方体をアクティブにします。',
      '移動（Grab）：Gキーを押して、立方体をZ軸方向に持ち上げます。',
      '回転とスケール：Rキーで回転させ、Sキーでサイズを調整して完成です。'
    ]
  },
  {
    id: '4',
    type: 'reflection',
    question: '量子もつれを活用できそうな未来の技術はどれ？',
    options: ['瞬間移動通信', '絶対に解読できない暗号', 'タイムマシン']
  }
];

interface MultiFormatLessonViewProps {
    onBack: () => void;
    forceBlockType?: 'concept' | 'dialogue' | 'workshop' | 'reflection' | 'showcase' | 'checklist';
    forceSubType?: 'code' | 'design' | 'logic' | 'blender';
}

const MultiFormatLessonView: React.FC<MultiFormatLessonViewProps> = ({ onBack, forceBlockType, forceSubType }) => {
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  // Filter or find the block based on forced props
  useEffect(() => {
    if (forceSubType) {
        const idx = MOCK_BLOCKS.findIndex(b => b.type === 'workshop' && (b as any).subType === forceSubType);
        if (idx !== -1) setActiveBlockIndex(idx);
    } else if (forceBlockType) {
        const idx = MOCK_BLOCKS.findIndex(b => b.type === forceBlockType);
        if (idx !== -1) setActiveBlockIndex(idx);
    }
  }, [forceBlockType, forceSubType]);

  const isSingleMode = !!forceBlockType || !!forceSubType;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">
                {isSingleMode ? `${(forceSubType || forceBlockType)?.toUpperCase()} PREVIEW` : 'Multi-Format Curriculum'}
            </span>
            {!isSingleMode && (
                <div className="flex items-center gap-1.5">
                    {MOCK_BLOCKS.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-500 ${
                                idx === activeBlockIndex ? 'w-10 bg-indigo-600' : 
                                idx < activeBlockIndex ? 'w-4 bg-indigo-200' : 'w-2 bg-slate-100'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            {isSingleMode ? 'Lab Demo' : `Step ${(activeBlockIndex + 1)} / ${MOCK_BLOCKS.length}`}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30">
        <div className="max-w-6xl mx-auto w-full min-h-full flex flex-col pt-12 pb-24 px-6 md:px-12">
            <div className="flex-1">
                {MOCK_BLOCKS.map((block, index) => {
                    if (index !== activeBlockIndex) return null;
                    
                    return (
                        <div key={block.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {block.type === 'showcase' && <ShowcasePage block={block as any} />}
                            {block.type === 'checklist' && <ChecklistPage block={block as any} />}
                            {block.type === 'concept' && <ConceptPage block={block as any} />}
                            {block.type === 'dialogue' && <DialoguePage block={block as any} />}
                            {block.type === 'workshop' && (
                                (block as any).subType === 'blender' 
                                ? <BlenderViewportPage block={block as any} /> 
                                : <WorkshopPage block={block as any} />
                            )}
                            {block.type === 'reflection' && <ReflectionPage block={block as any} />}
                        </div>
                    );
                })}
            </div>

            {/* Navigation Controls */}
            {!isSingleMode && (
                <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <button 
                        onClick={() => {
                            window.scrollTo(0, 0);
                            setActiveBlockIndex(Math.max(0, activeBlockIndex - 1));
                        }}
                        disabled={activeBlockIndex === 0}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-0 transition-all"
                    >
                        <ArrowLeft size={18} /> Previous
                    </button>

                    {activeBlockIndex < MOCK_BLOCKS.length - 1 ? (
                        <button 
                            onClick={() => {
                                window.scrollTo(0, 0);
                                setActiveBlockIndex(Math.min(MOCK_BLOCKS.length - 1, activeBlockIndex + 1));
                            }}
                            className="flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] transition-all"
                        >
                            <span>Continue</span>
                            <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 active:scale-[0.98] transition-all"
                        >
                            <span>Complete</span>
                            <CheckCircle2 size={20} />
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MultiFormatLessonView;
