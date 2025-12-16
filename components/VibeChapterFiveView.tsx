import React, { useState } from 'react';
import {
   ArrowLeft, Globe, GitBranch, History, Package, X, Check,
   ArrowRight, FolderGit2, Book, Star, Download, Search, Zap,
   AlertTriangle, RotateCcw, Copy, Share2
} from 'lucide-react';
import { ViewState } from '../types';

interface VibeChapterFiveViewProps {
   onBack: () => void;
   onNavigate: (view: ViewState) => void;
   language: 'en' | 'jp';
   setLanguage: (lang: 'en' | 'jp') => void;
}

const VibeChapterFiveView: React.FC<VibeChapterFiveViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
   const [slide, setSlide] = useState(0);
   const totalSlides = 5;

   const content = {
      en: {
         chapter: "Chapter 5: The World",
         intro: {
            title: "The World",
            desc: <>Your code doesn't live in a void. <br /> It lives in <span className="text-white font-bold">Repositories</span>, travels through <span className="text-white font-bold">History</span>, and connects to the <span className="text-white font-bold">Global Brain</span>.</>,
            btn: "Explore the Network"
         },
         history: {
            title: "The Time Machine",
            subtitle: "Git is your save point. In Vibe Coding, you will break things. That's okay.",
            commits: [
               { msg: "Initial Commit" },
               { msg: "feat: Add Glitter" },
               { msg: "feat: Mega Vibe (WIP)" }
            ],
            error: { title: "System Critical Error", desc: "You broke the vibe. The app is crashing.", btn: "Respawn (Revert)" },
            safe: "✨ Safe State Loaded",
            btn: "Continue Journey"
         },
         repo: {
            title: "The Project Box",
            subtitle: 'A "Repository" is just a folder with superpowers. The README is its cover art.',
            readme: { title: "Project Vibe", desc: "A minimalist approach to coding using AI orchestration.", badgeTip: "Add a Vibe Badge to your README to signal quality." },
            btn: "Commit Changes"
         },
         oss: {
            title: "The Infinite Warehouse",
            subtitle: <>Why write everything yourself? Use <span className="text-white font-bold">Open Source</span> (OSS). It's like free Lego blocks.</>,
            placeholder: "Search for a vibe (e.g., motion, 3d, ui)...",
            btnInstall: "Add to Project",
            btnInstalled: "Installed",
            btnNext: "Inventory Full. Finish Chapter."
         },
         done: {
            title: "World Unlocked",
            desc: <>You now understand the ecosystem. <br />Code is not just text; it's a shared history and a global collaboration.</>,
            btn: "Return to Path"
         }
      },
      jp: {
         chapter: "第5章：ザ・ワールド",
         intro: {
            title: "ザ・ワールド",
            desc: <>あなたのコードは真空の中に存在するのではありません。<br /><span className="text-white font-bold">リポジトリ</span>に住み、<span className="text-white font-bold">歴史</span>を旅し、<span className="text-white font-bold">地球規模の頭脳</span>と繋がるのです。</>,
            btn: "ネットワークを探索"
         },
         history: {
            title: "タイムマシン",
            subtitle: "Gitはセーブポイントです。バイブコーディングでは、壊すこともあります。でも大丈夫。",
            commits: [
               { msg: "Initial Commit (初期コミット)" },
               { msg: "feat: Add Glitter (キラキラ追加)" },
               { msg: "feat: Mega Vibe (WIP) (作業中)" }
            ],
            error: { title: "システム致命的エラー", desc: "バイブが壊れました。アプリがクラッシュしています。", btn: "リスポーン（元に戻す）" },
            safe: "✨ 安全な状態をロードしました",
            btn: "旅を続ける"
         },
         repo: {
            title: "プロジェクトの箱",
            subtitle: '「リポジトリ」はスーパーパワーを持ったフォルダです。READMEはそのカバーアートです。',
            readme: { title: "Project Vibe", desc: "AIオーケストレーションを使用したミニマリストなコーディングアプローチ。", badgeTip: "品質を示すためにREADMEにVibeバッジを追加しましょう。" },
            btn: "変更をコミット"
         },
         oss: {
            title: "無限の倉庫",
            subtitle: <>なぜすべて自分で書くのですか？ <span className="text-white font-bold">オープンソース</span> (OSS) を使いましょう。無料のレゴブロックのようなものです。</>,
            placeholder: "バイブを検索 (例: motion, 3d, ui)...",
            btnInstall: "プロジェクトに追加",
            btnInstalled: "インストール済み",
            btnNext: "インベントリ満タン。章を完了。"
         },
         done: {
            title: "ワールド解放",
            desc: <>エコシステムを理解しましたね。<br />コードは単なるテキストではありません。共有された歴史であり、世界的なコラボレーションなのです。</>,
            btn: "パスに戻る"
         }
      }
   };

   const t = content[language];

   // --- SLIDE 0: Intro ---
   const IntroSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto animate-in fade-in duration-700">
         <div className="relative mb-12">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative z-10">
               <Globe size={48} className="text-white" />
            </div>
            {/* Orbiting Elements */}
            <div className="absolute inset-0 animate-spin-slow">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full blur-md opacity-50"></div>
            </div>
            <div className="absolute inset-0 animate-spin-slow animation-delay-1000" style={{ animationDirection: 'reverse' }}>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full blur-md opacity-50"></div>
            </div>
         </div>

         <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t.intro.title}</h1>
         <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-12">
            {t.intro.desc}
         </p>

         <button
            onClick={() => setSlide(1)}
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
         >
            {t.intro.btn} <ArrowRight size={20} />
         </button>
      </div>
   );

   // --- SLIDE 1: History (Time Machine) ---
   const HistorySlide = () => {
      const [currentCommit, setCurrentCommit] = useState(2); // 0: Init, 1: Feat, 2: Broken, 3: Fixed

      const commits = [
         { id: 0, msg: t.history.commits[0].msg, code: "console.log('Hello');", status: 'stable' },
         { id: 1, msg: t.history.commits[1].msg, code: "console.log('Hello ✨');\naddSparkles();", status: 'stable' },
         { id: 2, msg: t.history.commits[2].msg, code: "console.log('Hello ✨');\naddSparkles();\n// TODO: Fix this mess\nwhile(true) { crash() }", status: 'broken' },
      ];

      const handleRevert = () => {
         setCurrentCommit(1); // Go back to stable
      };

      return (
         <div className="flex flex-col h-full max-w-5xl mx-auto pt-4">
            <div className="text-center mb-8">
               <h2 className="text-3xl font-bold text-white mb-2">{t.history.title}</h2>
               <p className="text-slate-400 text-sm">{t.history.subtitle}</p>
            </div>

            <div className="flex flex-1 gap-8 min-h-0">
               {/* Timeline (Left) */}
               <div className="w-64 border-r border-white/10 pr-8 flex flex-col items-end py-8 relative">
                  <div className="absolute top-0 bottom-0 right-[-1px] w-0.5 bg-slate-800"></div>

                  {commits.map((c, i) => (
                     <div key={c.id} className="relative mb-12 flex items-center">
                        <div className="text-right mr-4">
                           <div className={`text-sm font-bold ${currentCommit === i ? 'text-white' : 'text-slate-500'}`}>{c.msg}</div>
                           <div className="text-xs text-slate-600 font-mono">a1b{c.id}</div>
                        </div>
                        <button
                           onClick={() => setCurrentCommit(i)}
                           className={`
                       w-4 h-4 rounded-full border-4 z-10 transition-all relative
                       ${currentCommit === i
                                 ? 'bg-white border-blue-500 scale-150'
                                 : c.status === 'broken' ? 'bg-slate-900 border-red-500' : 'bg-slate-900 border-slate-600 hover:border-slate-400'}
                     `}
                        >
                        </button>
                        {currentCommit === i && <div className="absolute right-[-24px] text-blue-500"><ArrowLeft size={16} /></div>}
                     </div>
                  ))}
               </div>

               {/* Code View (Right) */}
               <div className="flex-1 flex flex-col justify-center">
                  <div className={`
                 bg-[#1e1e1e] rounded-xl border-2 p-6 shadow-2xl transition-all duration-300 relative overflow-hidden
                 ${commits[currentCommit].status === 'broken' ? 'border-red-500/50 shadow-red-900/20' : 'border-[#333]'}
              `}>
                     {/* Header */}
                     <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-xs font-mono text-slate-500">app.js</span>
                     </div>

                     <pre className="font-mono text-sm text-slate-300 min-h-[100px]">
                        {commits[currentCommit].code}
                     </pre>

                     {/* Error State Overlay */}
                     {commits[currentCommit].status === 'broken' && (
                        <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                           <AlertTriangle size={48} className="text-red-500 mb-4" />
                           <h3 className="text-2xl font-bold text-white mb-2">{t.history.error.title}</h3>
                           <p className="text-red-200 mb-6">{t.history.error.desc}</p>
                           <button
                              onClick={handleRevert}
                              className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
                           >
                              <RotateCcw size={18} /> {t.history.error.btn}
                           </button>
                        </div>
                     )}
                  </div>

                  {commits[currentCommit].status === 'stable' && currentCommit === 1 && (
                     <div className="mt-8 text-center animate-in slide-in-from-bottom-4">
                        <p className="text-green-400 text-sm mb-4">{t.history.safe}</p>
                        <button
                           onClick={() => setSlide(2)}
                           className="bg-slate-800 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-700 transition-colors"
                        >
                           {t.history.btn} <ArrowRight size={16} className="inline ml-2" />
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   };

   // --- SLIDE 2: Repository (The Box) ---
   const RepoSlide = () => {
      const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

      return (
         <div className="flex flex-col h-full max-w-5xl mx-auto pt-4">
            <div className="text-center mb-6">
               <h2 className="text-3xl font-bold text-white mb-2">{t.repo.title}</h2>
               <p className="text-slate-400 text-sm">{t.repo.subtitle}</p>
            </div>

            <div className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row">
               {/* Sidebar */}
               <div className="w-full md:w-64 bg-[#161b22] border-r border-slate-800 p-4">
                  <div className="flex items-center gap-2 text-white font-bold mb-6">
                     <FolderGit2 size={20} className="text-blue-400" />
                     <span>lumina-vibe</span>
                     <span className="text-xs border border-slate-600 px-1.5 rounded-full text-slate-400">Public</span>
                  </div>

                  <div className="space-y-1">
                     <div className="flex items-center gap-2 text-slate-400 text-sm p-2 hover:bg-slate-800 rounded cursor-pointer">
                        <FolderGit2 size={16} /> src
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 text-sm p-2 hover:bg-slate-800 rounded cursor-pointer">
                        <FolderGit2 size={16} /> public
                     </div>
                     <div className="flex items-center gap-2 text-white bg-blue-500/10 text-sm p-2 rounded cursor-pointer font-bold">
                        <Book size={16} /> README.md
                     </div>
                  </div>
               </div>

               {/* Main Content */}
               <div className="flex-1 p-8 overflow-y-auto">
                  <div className="border border-slate-700 rounded-xl bg-[#0d1117]">
                     <div className="border-b border-slate-700 p-3 bg-[#161b22] flex items-center gap-2 text-sm font-bold text-slate-300">
                        <Book size={16} /> README.md
                     </div>
                     <div className="p-8 prose prose-invert max-w-none">
                        <h1 className="text-4xl font-extrabold border-b border-slate-700 pb-2 mb-4">
                           {t.repo.readme.title}
                           {selectedBadge && <img src={selectedBadge} className="inline-block ml-4 h-6 mb-1" alt="badge" />}
                        </h1>
                        <p className="text-lg text-slate-300">
                           {t.repo.readme.desc}
                        </p>

                        <div className="my-8 p-6 bg-[#161b22] rounded-xl border border-dashed border-slate-700 text-center">
                           <p className="text-sm text-slate-500 mb-4">{t.repo.readme.badgeTip}</p>
                           <div className="flex flex-wrap justify-center gap-4">
                              <button onClick={() => setSelectedBadge("https://img.shields.io/badge/Vibe-Immaculate-purple")} className="hover:scale-105 transition-transform"><img src="https://img.shields.io/badge/Vibe-Immaculate-purple" alt="badge" /></button>
                              <button onClick={() => setSelectedBadge("https://img.shields.io/badge/Built_with-Love-red")} className="hover:scale-105 transition-transform"><img src="https://img.shields.io/badge/Built_with-Love-red" alt="badge" /></button>
                              <button onClick={() => setSelectedBadge("https://img.shields.io/badge/AI-Orchestrated-blue")} className="hover:scale-105 transition-transform"><img src="https://img.shields.io/badge/AI-Orchestrated-blue" alt="badge" /></button>
                           </div>
                        </div>

                        <h3>Installation</h3>
                        <pre className="bg-[#161b22] p-4 rounded-lg">npm install vibe-core</pre>
                     </div>
                  </div>

                  {selectedBadge && (
                     <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-4">
                        <button
                           onClick={() => setSlide(3)}
                           className="bg-green-600 text-white px-6 py-3 rounded-md font-bold hover:bg-green-500 transition-colors flex items-center gap-2"
                        >
                           {t.repo.btn} <Check size={16} />
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   };

   // --- SLIDE 3: OSS (Infinite Warehouse) ---
   const OssSlide = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [installed, setInstalled] = useState<string[]>([]);

      const libraries = [
         { id: 'react', name: 'React', desc: 'The library for web and native user interfaces.', stars: '213k', color: 'text-blue-400' },
         { id: 'tailwind', name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid UI development.', stars: '78k', color: 'text-cyan-400' },
         { id: 'framer', name: 'Framer Motion', desc: 'A production-ready motion library for React.', stars: '22k', color: 'text-purple-400' },
         { id: 'three', name: 'Three.js', desc: 'JavaScript 3D Library.', stars: '95k', color: 'text-white' },
         { id: 'lucide', name: 'Lucide Icons', desc: 'Beautiful & consistent icon toolkit.', stars: '8k', color: 'text-orange-400' },
      ];

      const filteredLibs = libraries.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const handleInstall = (id: string) => {
         if (!installed.includes(id)) {
            setInstalled([...installed, id]);
         }
      };

      return (
         <div className="flex flex-col h-full max-w-4xl mx-auto pt-4">
            <div className="text-center mb-8">
               <h2 className="text-3xl font-bold text-white mb-2">{t.oss.title}</h2>
               <p className="text-slate-400 text-sm">{t.oss.subtitle}</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
               <input
                  type="text"
                  placeholder={t.oss.placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#161b22] border border-slate-700 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-blue-500 transition-colors"
               />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-20">
               {filteredLibs.map(lib => {
                  const isInstalled = installed.includes(lib.id);
                  return (
                     <div key={lib.id} className="bg-[#0d1117] border border-slate-800 p-6 rounded-xl hover:border-slate-600 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className={`text-xl font-bold ${lib.color}`}>{lib.name}</h3>
                           <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Star size={12} /> {lib.stars}
                           </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">{lib.desc}</p>
                        <button
                           onClick={() => handleInstall(lib.id)}
                           disabled={isInstalled}
                           className={`
                        w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                        ${isInstalled
                                 ? 'bg-slate-800 text-slate-500 cursor-default'
                                 : 'bg-white text-black hover:bg-blue-500 hover:text-white'}
                      `}
                        >
                           {isInstalled ? <><Check size={16} /> {t.oss.btnInstalled}</> : <><Download size={16} /> {t.oss.btnInstall}</>}
                        </button>
                     </div>
                  );
               })}
            </div>

            {/* Next Step trigger */}
            {installed.length >= 2 && (
               <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-in slide-in-from-bottom-10 fade-in">
                  <button
                     onClick={() => setSlide(4)}
                     className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                     {t.oss.btnNext} <ArrowRight size={20} />
                  </button>
               </div>
            )}
         </div>
      );
   };

   // --- SLIDE 4: Completion ---
   const CompleteSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center animate-in zoom-in duration-500">
         <div className="relative mb-8">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(147,51,234,0.5)] relative z-10">
               <Globe size={48} />
            </div>
            <div className="absolute top-0 right-[-20px] bg-[#0d1117] border border-slate-700 p-2 rounded-lg shadow-xl animate-bounce">
               <Star className="text-yellow-400 fill-yellow-400" size={20} />
            </div>
         </div>

         <h1 className="text-4xl font-bold text-white mb-4">{t.done.title}</h1>
         <p className="text-xl text-slate-400 mb-12 max-w-lg mx-auto">
            {t.done.desc}
         </p>
         <button
            onClick={() => onNavigate(ViewState.VIBE_PATH)}
            className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 transition-colors"
         >
            {t.done.btn}
         </button>
      </div>
   );

   return (
      <div className="h-screen bg-[#050505] text-slate-300 font-sans flex flex-col">
         {/* Progress Bar */}
         <div className="w-full h-1 bg-slate-900">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((slide + 1) / totalSlides) * 100}%` }}></div>
         </div>

         {/* Navbar */}
         <div className="px-6 py-4 flex justify-between items-center border-b border-white/5">
            <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors">
               <X size={24} />
            </button>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               {t.chapter} <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400">GitHub</span>
            </div>
            {/* Language Toggle */}
            <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
               <button onClick={() => setLanguage('en')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
               <button onClick={() => setLanguage('jp')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>JP</button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-hidden p-6 relative">
            {slide === 0 && <IntroSlide />}
            {slide === 1 && <HistorySlide />}
            {slide === 2 && <RepoSlide />}
            {slide === 3 && <OssSlide />}
            {slide === 4 && <CompleteSlide />}
         </div>
      </div>
   );
};

export default VibeChapterFiveView;