
import React, { useState, useEffect, useRef } from 'react';
import {
   ArrowLeft, Monitor, Cloud, HardDrive, Download, X, Check,
   Terminal, Code2, Play, Search, Box, Settings, Sparkles, Command,
   ArrowRight, FileCode, FolderOpen, Menu, ChevronRight, ChevronDown, CheckCircle2,
   Pause, Volume2, AlertCircle, FilePlus, Save, Edit3, Laptop,
   Keyboard, Zap, LayoutGrid, User, GitBranch, RefreshCcw, FileText, Brain,
   MessageSquare, Repeat, CheckSquare, List, Wrench, Layers, ChefHat, Palette,
   GraduationCap, MousePointer, Info
} from 'lucide-react';
import { ViewState } from '../../../types';

// --- AUDIO PLAYER COMPONENT (Reused) ---
interface LectureAudioPlayerProps {
   label?: string;
   src?: string;
   onTimeUpdate?: (currentTime: number) => void;
   onAudioEnded?: () => void;
}

const LectureAudioPlayer: React.FC<LectureAudioPlayerProps> = ({ label = "Lecture Audio-2", src = "/vice/開発環境について.wav", onTimeUpdate, onAudioEnded }) => {
   const audioRef = useRef<HTMLAudioElement>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const [duration, setDuration] = useState(0);
   const [error, setError] = useState(false);

   // Reset when src changes
   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.load();
         setIsPlaying(false);
         // Auto-play is tricky due to browser policies, but user expects continuity
         if (src && !src.includes("開発環境について")) {
            // Try auto-playing subsequent tracks if possible
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
         }
      }
   }, [src]);

   const togglePlay = () => {
      if (audioRef.current) {
         if (isPlaying) {
            audioRef.current.pause();
         } else {
            audioRef.current.play().catch(() => setError(true));
         }
         setIsPlaying(!isPlaying);
      }
   };

   const handleTimeUpdate = () => {
      if (audioRef.current) {
         const current = audioRef.current.currentTime;
         const total = audioRef.current.duration;
         setProgress((current / total) * 100);
         if (onTimeUpdate) onTimeUpdate(current);
      }
   };

   const handleLoadedMetadata = () => {
      if (audioRef.current) {
         setDuration(audioRef.current.duration);
         setError(false);
      }
   };

   const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onAudioEnded) onAudioEnded();
   };

   const formatTime = (seconds: number) => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
   };

   return (
      <div className={`fixed top-20 right-6 z-50 bg-[#1a1a1a] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-full px-1 py-1 pr-4 flex items-center gap-3 shadow-lg max-w-[200px] transition-all hover:border-blue-500/30`}>
         <audio
            ref={audioRef}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={() => setError(true)}
         />
         <button
            onClick={togglePlay}
            disabled={error}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isPlaying ? 'bg-blue-600 text-white' : 'bg-white text-black hover:scale-105'} ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
         >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
         </button>
         <div className="flex-1 flex flex-col justify-center gap-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               <span className={isPlaying ? "text-blue-400" : ""}>
                  {error ? "Audio Missing" : (isPlaying ? "Chapter 2" : label)}
               </span>
               {!error && <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}</span>}
            </div>
            <div className="h-4 flex items-center gap-0.5 overflow-hidden relative cursor-pointer" onClick={(e) => {
               if (audioRef.current && !error) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const width = rect.width;
                  const newTime = (x / width) * duration;
                  audioRef.current.currentTime = newTime;
               }
            }}>
               <div className="absolute inset-0 bg-slate-700/30"></div>
               <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
            </div>
         </div>
      </div>
   );
};

interface VibeChapterTwoViewProps {
   onBack: () => void;
   onNavigate: (view: ViewState) => void;
   language: 'en' | 'jp';
   setLanguage: (lang: 'en' | 'jp') => void;
}

const VibeChapterTwoView: React.FC<VibeChapterTwoViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
   const [slide, setSlide] = useState(0);
   const [activePart, setActivePart] = useState<number | null>(null); // null = Menu, 0,1,2 = Parts

   const totalSlides = 14;

   // Playlist Definition
   const playlist = [
      { id: 0, title: "Part 1: The Environment", desc: "Talent vs Environment", src: "/vice/開発環境について.wav", slides: [0, 1, 2, 3] },
      { id: 1, title: "Part 2: Visual Studio Code", desc: "Your Workbench", src: "/vice/vscode使い方.wav", slides: [4, 5, 6] },
      { id: 2, title: "Part 3: Terminal & AI", desc: "The Modern Workflow", src: "/vice/vscodeとai.wav", slides: [7, 8, 9, 10, 11, 12, 13] }
   ];

   // Initialize slide when part is selected
   const startPart = (partIndex: number) => {
      setActivePart(partIndex);
      setSlide(playlist[partIndex].slides[0]);
   };

   // Audio Logic
   const handleTimeUpdate = (time: number) => {
      if (activePart === 0) {
         if (time < 20) setSlide(0);      // Intro
         else if (time < 40) setSlide(1); // Definition
         else if (time < 60) setSlide(2); // Metaphor
         else setSlide(3);                // Perfection
      } else if (activePart === 1) {
         if (time < 20) setSlide(4);      // Two Faces
         else if (time < 40) setSlide(5); // VS Code Intro
         else setSlide(6);                // Usage
      } else if (activePart === 2) {
         if (time < 20) setSlide(7);      // Terminal Intro
         else if (time < 40) setSlide(8); // Terminal Def
         else if (time < 60) setSlide(9); // Don't Memorize
         else if (time < 80) setSlide(10); // Why Terminal
         else if (time < 100) setSlide(11); // CLI & AI
         else if (time < 120) setSlide(12); // Role
         else setSlide(13);               // Conclusion
      }
   };

   const handleTrackEnd = () => {
      // Return to menu or auto-next? User asked for selection, so maybe return or stay?
      // Let's offer a "Next Part" button in UI instead of auto-jump for better control
      // But for "Finish", we go to menu?
      if (activePart !== null && activePart < playlist.length - 1) {
         // Optional: Auto-advance (commented out for now based on 'Selection' request)
         // startPart(activePart + 1);
      }
   };

   // --- CONTENT ---
   const content = {
      en: {
         chapter: "Chapter 2: The Cockpit",
         slides: [
            { title: "The Environment", desc: "It's not about talent.\nIt's about the 'Workplace' and 'How to use it'." },
            { title: "What is Development?", desc: "Write -> Save -> Run -> Fix.\nJust repeating this loop." },
            { title: "Your Workspace", desc: "Cooking -> Kitchen.\nStudying -> Desk.\nProgramming -> Development Environment." },
            { title: "No Perfection Needed", desc: "It doesn't have to be perfect from the start.\nIf it works, it works. If it breaks, fix it." },
            { title: "Two Faces", desc: "1. The Graphic World (GUI)\n2. The Text World (CLI)" },
            { title: "Visual Studio Code", desc: "Your Workbench.\nUsed globally. Simple to start." },
            { title: "Usage is Simple", desc: "Open File.\nWrite Text.\nSave.\nCheck Result." },
            { title: "The Terminal", desc: "The other important place inside VS Code." },
            { title: "Text Interface", desc: "Asking the computer with words.\n'Move this', 'Prepare that'." },
            { title: "Don't Memorize", desc: "You don't need to read or understand it.\nJust Copy, Paste, and Enter." },
            { title: "Why Terminal?", desc: "Because modern AI lives there." },
            { title: "CLI & AI", desc: "Codex, Claude Code, etc.\nThey work best with text commands." },
            { title: "Your Role", desc: "You don't use the terminal.\nAI uses it.\nYou are the Director." },
            { title: "Fearless", desc: "The goal is not to master it.\nThe goal is to stop fearing it." }
         ]
      },
      jp: {
         chapter: "第2章：コックピット",
         slides: [
            { title: "開発環境について", desc: "これは才能の話ではありません。\n「作業する場所」と「その使い方」の話です。" },
            { title: "開発とは？", desc: "書いて、保存して、動かして、直す。\nこの繰り返しのことです。" },
            { title: "作業する場所", desc: "料理ならキッチン。\n勉強なら机。\nプログラミングなら「開発環境」。" },
            { title: "完璧じゃなくていい", desc: "動けばいい。\n壊れたら作り直せばいい。\n最初から完璧である必要はありません。" },
            { title: "２つの顔", desc: "1. 画面で操作する世界 (GUI)\n2. 文字で操作する世界 (CLI)" },
            { title: "Visual Studio Code", desc: "プログラミング用の作業机。\n世界中で使われています。" },
            { title: "使い方はシンプル", desc: "ファイルを開く。\n書く。\n保存する。\nこれだけで十分です。" },
            { title: "ターミナル", desc: "VS Codeの中にある、もう一つの大事な場所。" },
            { title: "言葉でお願いする", desc: "「これを動かして」「準備して」\nマウスの代わりに言葉で指示を出します。" },
            { title: "覚えなくていい", desc: "読めなくていい。理解しなくていい。\nコピペしてEnterを押すだけです。" },
            { title: "なぜ必要なのか？", desc: "最近のAIは、ターミナルから動くものが主流だからです。" },
            { title: "CLI と AI", desc: "Codex や Claude Code。\nAIにとって、文字での指示が一番仕事がしやすいのです。" },
            { title: "あなたの役割", desc: "ターミナルを使うのは AI です。\nあなたは結果を見て判断する「監督」です。" },
            { title: "怖くなくなること", desc: "使いこなす必要はありません。\n「これが作業場所なんだ」と分かるだけで十分です。" }
         ]
      }
   };

   const t = content[language];
   const s = t.slides;

   // --- MENU COMPONENT ---
   const MenuScreen = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto animate-in fade-in duration-700">
         <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Chapter 2: The Cockpit</h1>
         <p className="text-slate-400 mb-12 text-center max-w-2xl">Master your environment. Understand the relationship between you, the editor, and the AI.</p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-8">
            {/* Card 1 */}
            <div
               onClick={() => startPart(0)}
               className="group bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4 opacity-50"><Laptop size={48} className="text-slate-700 group-hover:text-blue-500 transition-colors" /></div>
               <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Part 1</div>
               <h3 className="text-xl font-bold text-white mb-2">Environment</h3>
               <p className="text-slate-400 text-sm">Talent vs Environment. Understanding the "Kitchen".</p>
               <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono"><Play size={10} /> 3 min</div>
            </div>

            {/* Card 2 */}
            <div
               onClick={() => startPart(1)}
               className="group bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4 opacity-50"><Code2 size={48} className="text-slate-700 group-hover:text-blue-500 transition-colors" /></div>
               <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Part 2</div>
               <h3 className="text-xl font-bold text-white mb-2">VS Code</h3>
               <p className="text-slate-400 text-sm">GUI vs CLI. Your main workbench explained.</p>
               <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono"><Play size={10} /> 2 min</div>
            </div>

            {/* Card 3 */}
            <div
               onClick={() => startPart(2)}
               className="group bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4 opacity-50"><Terminal size={48} className="text-slate-700 group-hover:text-blue-500 transition-colors" /></div>
               <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Part 3</div>
               <h3 className="text-xl font-bold text-white mb-2">Terminal & AI</h3>
               <p className="text-slate-400 text-sm">Why AI loves the CLI. Your role as Director.</p>
               <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono"><Play size={10} /> 4 min</div>
            </div>
         </div>

         <div className="mt-12 flex items-center gap-2 text-slate-500 text-sm">
            <Info size={16} /> <span>Select a part to begin learning</span>
         </div>
      </div>
   );

   // --- SLIDE COMPONENTS ---

   // 0: Intro
   const SlideIntro = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto animate-in fade-in duration-700">
         <div className="mb-8 relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
            <Monitor size={80} className="text-white relative z-10" />
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 whitespace-pre-wrap">{s[0].title}</h1>
         <p className="text-xl md:text-2xl text-slate-400 leading-relaxed whitespace-pre-wrap">{s[0].desc}</p>
      </div>
   );

   // 1: Definition Loop
   const SlideDefinition = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-12">{s[1].title}</h2>
         <div className="flex items-center gap-4 md:gap-8 text-xl md:text-2xl font-bold text-slate-300">
            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-0">
               <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700"><Edit3 size={32} className="text-blue-400" /></div>
               <span>Write</span>
            </div>
            <ArrowRight className="text-slate-600" />
            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-150">
               <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700"><Save size={32} className="text-green-400" /></div>
               <span>Save</span>
            </div>
            <ArrowRight className="text-slate-600" />
            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-300">
               <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700"><Play size={32} className="text-yellow-400" /></div>
               <span>Run</span>
            </div>
            <ArrowRight className="text-slate-600" />
            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-500">
               <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700"><Wrench size={32} className="text-red-400" /></div>
               <span>Fix</span>
            </div>
         </div>
         <div className="mt-12 flex items-center gap-2 text-slate-500 animate-pulse">
            <Repeat size={20} /> <span className="text-sm">Repeat Loop</span>
         </div>
      </div>
   );

   // 2: Metaphor
   const SlideMetaphor = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-12 animate-in fade-in slide-in-from-top-8 duration-700">{s[2].title}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-6 text-center transform hover:scale-105 transition-transform duration-500 animate-in fade-in slide-in-from-bottom-8 delay-0 fill-mode-forwards">
               <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <ChefHat size={40} className="text-orange-400" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cooking</h3>
                  <p className="text-slate-400">Kitchen</p>
               </div>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-6 text-center transform hover:scale-105 transition-transform duration-500 animate-in fade-in slide-in-from-bottom-8 delay-150 fill-mode-forwards">
               <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center">
                  <Palette size={40} className="text-pink-400" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white mb-2">Art</h3>
                  <p className="text-slate-400">Atelier</p>
               </div>
            </div>
            <div className="bg-blue-900/20 p-8 rounded-2xl border border-blue-500/50 flex flex-col items-center gap-6 text-center shadow-[0_0_30px_rgba(59,130,246,0.2)] transform hover:scale-110 transition-transform duration-500 animate-in fade-in slide-in-from-bottom-8 delay-300 fill-mode-forwards relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-400/10 blur-xl animate-pulse"></div>
               <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center relative z-10">
                  <Laptop size={40} className="text-blue-400 animate-bounce" style={{ animationDuration: '3s' }} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">Dev</h3>
                  <p className="text-blue-300 font-bold">Environment</p>
               </div>
            </div>
         </div>
      </div>
   );

   // 3: Perfection Trap
   const SlidePerfection = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
         <div className="mb-12 relative inline-block animate-in zoom-in duration-500">
            <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-0 animate-[pulse_2s_infinite]"></div>
            <AlertCircle size={80} className="text-slate-600 mb-4 mx-auto" />
            {/* Strikethrough effect */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 rotate-[-15deg] transform origin-center scale-x-0 animate-in slide-in-from-right duration-500 fill-mode-forwards delay-500" style={{ animationFillMode: 'forwards', transform: 'rotate(-45deg)' }}></div>
         </div>
         <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">{s[3].title}</h2>
         <p className="text-xl text-slate-400 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">{s[3].desc}</p>

         <div className="mt-12 flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 delay-500 duration-700">
            <div className="bg-green-500/10 text-green-400 px-6 py-2 rounded-full border border-green-500/20 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-default">
               <Check size={16} /> Works = Good
            </div>
            <div className="bg-blue-500/10 text-blue-400 px-6 py-2 rounded-full border border-blue-500/20 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-default">
               <Wrench size={16} /> Broken = Fix
            </div>
         </div>
      </div>
   );

   // 4: Two Faces
   const SlideTwoFaces = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-12 animate-in fade-in slide-in-from-top-4 duration-700">{s[4].title}</h2>
         <div className="flex w-full gap-8 h-80">
            {/* GUI */}
            <div className="flex-1 bg-white rounded-xl overflow-hidden relative group animate-in slide-in-from-left-8 fade-in duration-700 delay-0">
               <div className="absolute inset-0 bg-slate-100 flex flex-col">
                  <div className="h-6 bg-slate-200 border-b flex items-center px-4 gap-1">
                     <div className="w-2 h-2 rounded-full bg-red-400"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  </div>
                  <div className="p-4 flex gap-4">
                     <div className="w-16 h-full bg-slate-200 rounded animate-pulse"></div>
                     <div className="flex-1 space-y-2">
                        <div className="w-full h-4 bg-slate-200 rounded animate-pulse delay-75"></div>
                        <div className="w-2/3 h-4 bg-slate-200 rounded animate-pulse delay-150"></div>
                        <div className="w-1/2 h-8 bg-blue-500 rounded mt-4 shadow-lg flex items-center justify-center text-white text-xs font-bold transform transition-transform group-hover:scale-105 cursor-default hover:bg-blue-600">Click Me</div>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-4 left-0 w-full text-center">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">GUI (Screen)</span>
               </div>
            </div>

            {/* CLI */}
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative font-mono text-sm p-4 border border-slate-700 animate-in slide-in-from-right-8 fade-in duration-700 delay-200">
               <div className="text-green-400 animate-in fade-in duration-300 delay-500">user@pc:~$ <span className="text-white">mkdir project</span></div>
               <div className="text-green-400 animate-in fade-in duration-300 delay-1000">user@pc:~$ <span className="text-white">cd project</span></div>
               <div className="text-green-400 animate-in fade-in duration-300 delay-1500">user@pc:~/project$ <span className="text-white">_</span><span className="animate-pulse bg-slate-500 w-2 h-4 inline-block align-middle ml-1"></span></div>

               <div className="absolute bottom-4 right-0 w-full text-center">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">CLI (Text)</span>
               </div>
            </div>
         </div>
      </div>
   );

   // 5: VS Code Intro
   const SlideVSCode = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
         <div className="w-32 h-32 bg-[#007ACC] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 animate-[bounce_3s_infinite]">
            <Code2 size={64} className="text-white" />
         </div>
         <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">{s[5].title}</h2>
         <p className="text-xl text-slate-400 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">{s[5].desc}</p>
         <div className="mt-8 flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">
            <div className="bg-slate-800 px-4 py-2 rounded border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors cursor-default">Microsoft</div>
            <div className="bg-slate-800 px-4 py-2 rounded border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors cursor-default">Free & Open Source</div>
            <div className="bg-slate-800 px-4 py-2 rounded border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors cursor-default">#1 Editor</div>
         </div>
      </div>
   );

   // 6: VS Code Usage
   const SlideVSCodeUsage = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-8 animate-in fade-in slide-in-from-top-4 duration-700">{s[6].title}</h2>
         <div className="w-full max-w-3xl bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col h-96 animate-in zoom-in-95 duration-700">
            <div className="h-8 bg-[#333] flex items-center px-4 justify-between border-b border-black">
               <span className="text-xs text-slate-400">Visual Studio Code</span>
            </div>
            <div className="flex flex-1">
               {/* Sidebar */}
               <div className="w-16 bg-[#333] flex flex-col items-center py-4 gap-4 border-r border-black">
                  <FileCode className="text-white animate-in slide-in-from-left-4 fade-in duration-500 delay-300" size={24} />
                  <Search className="text-slate-500 animate-in slide-in-from-left-4 fade-in duration-500 delay-400" size={24} />
                  <GitBranch className="text-slate-500 animate-in slide-in-from-left-4 fade-in duration-500 delay-500" size={24} />
               </div>
               {/* Main */}
               <div className="flex-1 p-8 flex flex-col items-center justify-center">
                  <div className="space-y-6 w-full max-w-md">
                     <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-lg animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 hover:bg-white/10 transition-colors">
                        <FilePlus size={20} className="text-blue-400" /> Open/Create File
                     </div>
                     <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-lg animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 hover:bg-white/10 transition-colors">
                        <Edit3 size={20} className="text-yellow-400" /> Write Code
                     </div>
                     <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-lg animate-in slide-in-from-bottom-4 fade-in duration-500 delay-700 hover:bg-white/10 transition-colors">
                        <Save size={20} className="text-green-400" /> Save (Ctrl+S)
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   // 7: Terminal Intro
   const SlideTerminalIntro = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
         <Terminal size={80} className="text-white mb-8 animate-[pulse_2s_infinite]" />
         <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">{s[7].title}</h2>
         <p className="text-xl text-slate-400 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">{s[7].desc}</p>
      </div>
   );

   // 8, 9: Terminal Definition & usage
   const SlideTerminalDef = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-12 animate-in fade-in slide-in-from-top-4 duration-700">{s[8].title}</h2>
         <div className="w-full max-w-2xl bg-black rounded-lg border border-slate-700 p-6 font-mono text-sm relative shadow-2xl animate-in zoom-in-95 duration-700">
            <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 rounded-t-lg border-b border-slate-800 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <span className="text-slate-500 text-xs ml-2">bash</span>
            </div>
            <div className="mt-6 space-y-4">
               <div className="text-slate-400 animate-in fade-in delay-300"># Asking the computer...</div>
               <div className="flex gap-2 animate-in fade-in delay-700">
                  <span className="text-green-400">➜</span>
                  <span className="text-white typing-effect">please prepare environment</span>
               </div>
               <div className="text-slate-500 pt-2 animate-pulse delay-1000">Running setup...</div>
            </div>
         </div>
         <p className="mt-8 text-slate-400 whitespace-pre-wrap text-center max-w-2xl animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700">{s[9].desc}</p>
      </div>
   );

   // 10, 11: AI & CLI
   const SlideAIContext = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-12 animate-in fade-in slide-in-from-top-4 duration-700">{s[10].title}</h2>
         <div className="flex items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left-8 fade-in duration-700">
               <div className="w-24 h-24 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50 animate-[bounce_3s_infinite]">
                  <Sparkles size={40} className="text-white" />
               </div>
               <span className="font-bold text-purple-300">Modern AI</span>
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-500 to-green-500 w-32 md:w-64 rounded-full relative animate-in zoom-in duration-700 delay-300">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loves</div>
               <div className="absolute inset-0 bg-white/20 blur-md animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-right-8 fade-in duration-700 delay-150">
               <div className="w-24 h-24 bg-black border border-green-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                  <Terminal size={40} className="text-green-400" />
               </div>
               <span className="font-bold text-green-400">Terminal (CLI)</span>
            </div>
         </div>
         <p className="mt-12 text-slate-400 text-center max-w-2xl animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700">{s[11].desc}</p>
      </div>
   );

   // 12: Role
   const SlideRole = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
         <div className="mb-12 flex justify-center animate-in zoom-in duration-700">
            <div className="relative">
               <User size={80} className="text-slate-600" />
               <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full border-4 border-black animate-[bounce_2s_infinite]">
                  <Monitor size={20} className="text-white" />
               </div>
            </div>
         </div>
         <h2 className="text-4xl font-bold text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">{s[12].title}</h2>
         <p className="text-xl text-slate-400 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">{s[12].desc}</p>
      </div>
   );

   // 13: Conclusion
   const SlideConclusion = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center animate-in zoom-in duration-700">
         <CheckCircle2 size={80} className="text-green-400 mb-8" />
         <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">{s[13].title}</h2>
         <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mb-12">
            {s[13].desc}
         </p>
         <button
            onClick={() => onNavigate(ViewState.VIBE_PATH)}
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
         >
            Finish Chapter <ArrowRight size={20} />
         </button>
      </div>
   );


   return (
      <div className="h-screen bg-[#050505] text-slate-300 font-sans flex flex-col">
         {activePart !== null && (
            <>
               {/* Audio Player */}
               <LectureAudioPlayer
                  src={playlist[activePart].src}
                  label={`Part ${activePart + 1}`}
                  onTimeUpdate={handleTimeUpdate}
                  onAudioEnded={handleTrackEnd}
               />

               {/* Progress Bar (Global or Local? Local seems better for parts) */}
               <div className="w-full h-1 bg-slate-900">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((slide + 1) / totalSlides) * 100}%` }}></div>
               </div>
            </>
         )}

         {/* Navbar */}
         <div className="px-6 py-4 flex justify-between items-center border-b border-white/5">
            <button
               onClick={() => {
                  if (activePart !== null) setActivePart(null); // Back to Menu
                  else onBack(); // Back to App
               }}
               className="text-slate-500 hover:text-white transition-colors flex items-center gap-2"
            >
               {activePart !== null && <ArrowLeft size={16} />}
               <X size={24} />
            </button>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               {activePart === null ? "Chapter 2" : `Part ${activePart + 1}`} <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-[10px] border border-blue-500/30">COCKPIT</span>
            </div>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
               <button onClick={() => setLanguage('en')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
               <button onClick={() => setLanguage('jp')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>JP</button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-hidden p-6 relative">
            {activePart === null ? (
               <MenuScreen />
            ) : (
               <>
                  {slide === 0 && <SlideIntro />}
                  {slide === 1 && <SlideDefinition />}
                  {slide === 2 && <SlideMetaphor />}
                  {slide === 3 && <SlidePerfection />}
                  {slide === 4 && <SlideTwoFaces />}
                  {slide === 5 && <SlideVSCode />}
                  {slide === 6 && <SlideVSCodeUsage />}
                  {slide === 7 && <SlideTerminalIntro />}
                  {(slide === 8 || slide === 9) && <SlideTerminalDef />}
                  {(slide === 10 || slide === 11) && <SlideAIContext />}
                  {slide === 12 && <SlideRole />}
                  {slide === 13 && <SlideConclusion />}
               </>
            )}
         </div>
      </div>
   );
};

export default VibeChapterTwoView;