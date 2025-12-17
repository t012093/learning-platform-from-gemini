import React, { useState, useEffect, useRef } from 'react';
import {
   ArrowLeft, MessageSquare, Send, Sparkles, AlertCircle,
   Terminal, Monitor, Check, Sliders, Play, ChevronRight,
   BookOpen, Layers, Zap, Palette, MousePointerClick, XCircle, ArrowRight,
   Target, User, Box, Copy, RefreshCw, LayoutTemplate, CheckCircle2, ArrowDown,
   Pause, Volume2, Trophy
} from 'lucide-react';
import { ViewState } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface VibeChapterOneViewProps {
   onBack: () => void;
   onNavigate: (view: ViewState) => void;
   language: 'en' | 'jp';
   setLanguage: (lang: 'en' | 'jp') => void;
}

// --- LECTURE DATA ---
const getLectureSlides = (lang: 'en' | 'jp') => {
   const content = {
      en: [
         {
            id: 'intro',
            title: "Prompt Engineering Basics",
            subtitle: "The Art of Conversing with AI",
            type: 'intro',
            content: "Prompt Engineering is the skill of crafting words to guide AI. It's not just asking questions; it's drawing blueprints for the result you want."
         },
         {
            id: 'specificity',
            title: "1. Be Specific",
            subtitle: "Write Concrete Instructions",
            type: 'comparison',
            badExample: {
               prompt: "Write a text.",
               result: "(AI is confused)...What text? About the weather?",
               label: "Vague"
            },
            goodExample: {
               prompt: "Write a short introduction for a new moisturizer for women in their 30s.",
               result: "Even in busy days, your skin can shine brighter...",
               label: "Specific"
            },
            desc: "AI runs on words. The clearer your goal and conditions, the higher the accuracy."
         },
         {
            id: 'iteration',
            title: "2. Start Simple, Then Add",
            subtitle: "Layer Your Request",
            type: 'layering',
            layers: [
               { text: "Write a short intro", type: "Base" },
               { text: "+ For working women in their 30s", type: "Target" },
               { text: "+ With an empathetic, gentle tone", type: "Tone" }
            ],
            desc: "You don't need perfection in one shot. Start with a simple instruction, then add context and desires based on the result."
         },
         {
            id: 'structure',
            title: "3. Structure Your Prompt",
            subtitle: "Separate the Elements",
            type: 'structure',
            parts: [
               { label: "Instruction", text: "Summarize the following text.", color: "bg-blue-500" },
               { label: "Context", text: "This is a monthly report for internal use.", color: "bg-purple-500" },
               { label: "Example", text: "Output format: [Sales] $XX...", color: "bg-green-500" }
            ],
            desc: "By clearly separating 'Instruction', 'Context', and 'Example', AI understands your intent precisely."
         },
         {
            id: 'shots',
            title: "4. Zero-shot vs Few-shot",
            subtitle: "The Technique of Examples",
            type: 'shots',
            zeroShot: {
               label: "Zero-shot (No Examples)",
               prompt: "Translate this: 'Hello'",
               desc: "Good for simple tasks."
            },
            fewShot: {
               label: "Few-shot (With Examples)",
               prompt: "Ex: Apple -> Ringo\nEx: Pen -> Pen\nTask: Orange -> ?",
               desc: "Effective when you want to teach a pattern."
            }
         },
         {
            id: 'roles',
            title: "5. Assign a Role",
            subtitle: "Define the Persona",
            type: 'persona',
            personas: [
               { id: 'default', name: 'Default AI', icon: <MessageSquare />, response: "This is a button code." },
               { id: 'expert', name: 'UI Expert', icon: <Palette />, response: "Here is a button designed for high accessibility and click-through rate, using proper padding..." },
               { id: 'critic', name: 'Code Reviewer', icon: <AlertCircle />, response: "This button lacks a hover state. Consider adding transition properties." }
            ],
            desc: "Telling AI 'You are an expert in X' makes it answer from that perspective."
         },
         {
            id: 'summary',
            title: "Summary",
            subtitle: "Design & Refine Cycle",
            type: 'summary',
            points: [
               "Be specific and clear.",
               "Separate elements (Instruction, Context, Example).",
               "Adjust words based on the result."
            ]
         }
      ],
      jp: [
         {
            id: 'intro',
            title: "Prompt Engineering Basics",
            subtitle: "AIと「会話」するための設計技術",
            type: 'intro',
            content: "プロンプトエンジニアリングとは、AIに正しく指示を出すための「言葉づくりの技術」です。単に質問するのではなく、望む結果が出るように設計図を描くプロセスです。"
         },
         {
            id: 'specificity',
            title: "1. Be Specific",
            subtitle: "具体的に書く",
            type: 'comparison',
            badExample: {
               prompt: "文章を作って",
               result: "（AIは困惑）...何の文章ですか？天気の話ですか？",
               label: "曖昧"
            },
            goodExample: {
               prompt: "30代の女性向けに、新しい化粧水の短い紹介文を作って",
               result: "「忙しい毎日でも、肌はもっと輝ける...」",
               label: "明確"
            },
            desc: "AIは言葉で動きます。目的や条件を明確にするほど、精度が上がります。"
         },
         {
            id: 'iteration',
            title: "2. Start Simple, Then Add",
            subtitle: "シンプルに始めて、足していく",
            type: 'layering',
            layers: [
               { text: "短い紹介文を作って", type: "Base" },
               { text: "+ 30代の働く女性向けに", type: "Target" },
               { text: "+ 共感できる優しいトーンで", type: "Tone" }
            ],
            desc: "一発で完璧を目指す必要はありません。まずは簡単な指示を出し、結果を見ながら文脈や要望を足していきましょう。"
         },
         {
            id: 'structure',
            title: "3. Structure Your Prompt",
            subtitle: "形式を分けて書く",
            type: 'structure',
            parts: [
               { label: "Instruction (指示)", text: "以下の文章を要約してください。", color: "bg-blue-500" },
               { label: "Context (背景)", text: "これは社内向けの月次レポートです。", color: "bg-purple-500" },
               { label: "Example (例)", text: "出力形式：【売上】XX円...", color: "bg-green-500" }
            ],
            desc: "「命令」「背景」「例」を明確に分けることで、AIはあなたの意図を正確に理解します。"
         },
         {
            id: 'shots',
            title: "4. Zero-shot vs Few-shot",
            subtitle: "例示のテクニック",
            type: 'shots',
            zeroShot: {
               label: "Zero-shot (例なし)",
               prompt: "この英語を和訳して: 'Hello'",
               desc: "簡単なタスク向け"
            },
            fewShot: {
               label: "Few-shot (例あり)",
               prompt: "例: Apple -> りんご\n例: Pen -> ペン\n本番: Orange -> ?",
               desc: "パターンを理解させたい時に有効"
            }
         },
         {
            id: 'roles',
            title: "5. Assign a Role",
            subtitle: "役割を指定する",
            type: 'persona',
            personas: [
               { id: 'default', name: 'Default AI', icon: <MessageSquare />, response: "これがボタンのコードです。" },
               { id: 'expert', name: 'UI Expert', icon: <Palette />, response: "アクセシビリティとクリック率を考慮し、適切なパディングを使用したボタンデザインです..." },
               { id: 'critic', name: 'Code Reviewer', icon: <AlertCircle />, response: "このボタンにはホバー状態がありません。transitionプロパティの追加を検討してください。" }
            ],
            desc: "「あなたは〇〇の専門家です」と伝えると、その視点で回答してくれます。"
         },
         {
            id: 'summary',
            title: "Summary",
            subtitle: "設計と改善のサイクル",
            type: 'summary',
            points: [
               "具体的・明確に書く",
               "要素（指示・背景・例）を分ける",
               "結果を見て、言葉を調整する"
            ]
         }
      ]
   };
   return content[lang];
};

// --- DATA: Playground Techniques ---
const PROMPT_TECHNIQUES = [
   { id: 'tech_neon', label: 'Neon Cyberpunk', prompt: "Style: Cyberpunk aesthetic. Use neon green (#39ff14) text, black background, and glitch effects.", tags: ['Vibe'] },
   { id: 'tech_corp', label: 'Corporate Trust', prompt: "Style: High-trust corporate. Use Serif fonts, navy blue, plenty of whitespace, and rounded corners.", tags: ['Vibe'] },
   { id: 'tech_minimal', label: 'Swiss Minimal', prompt: "Style: Swiss Design. Helvetica font, large typography, black and white only, grid-based layout.", tags: ['Vibe'] },
   { id: 'tech_mobile', label: 'Mobile First', prompt: "Constraint: Stack elements vertically, ensure touch targets are 44px+, use a bottom navigation bar.", tags: ['Constraint'] },
   { id: 'tech_cta', label: 'High Conversion', prompt: "Goal: Maximize clicks. Make the main button pulse gently and use a contrasting accent color.", tags: ['Goal'] },
];

const generateDynamicPreview = (prompt: string) => {
   const p = prompt.toLowerCase();

   let styles = {
      container: "bg-slate-100 text-slate-900 font-sans",
      header: "text-3xl font-bold mb-4",
      card: "bg-white p-6 rounded-xl shadow-sm border border-slate-200",
      button: "bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all",
      accent: "text-blue-600",
      vibeName: "Default"
   };

   if (p.includes('neon') || p.includes('cyber') || p.includes('glitch')) {
      styles = {
         container: "bg-[#050505] text-green-400 font-mono relative overflow-hidden",
         header: "text-4xl font-bold mb-6 tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]",
         card: "bg-black/50 border border-green-500/50 p-6 relative overflow-hidden before:absolute before:inset-0 before:bg-green-500/5 before:pointer-events-none",
         button: "bg-transparent border-2 border-green-500 text-green-500 px-8 py-3 font-bold tracking-widest hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.8)] transition-all uppercase",
         accent: "text-green-500",
         vibeName: "CYBERPUNK v2.0"
      };
   }
   else if (p.includes('corporate') || p.includes('trust') || p.includes('serif')) {
      styles = {
         container: "bg-[#f8fafc] text-slate-800 font-serif",
         header: "text-4xl font-semibold mb-2 text-[#0f172a]",
         card: "bg-white p-8 shadow-xl shadow-slate-200/50 border-t-4 border-[#0f172a]",
         button: "bg-[#0f172a] text-white px-8 py-3 rounded-none font-sans text-sm tracking-wide hover:bg-slate-800 transition-all",
         accent: "text-[#0f172a]",
         vibeName: "Global Trust Inc."
      };
   }
   else if (p.includes('minimal') || p.includes('swiss') || p.includes('helvetica')) {
      styles = {
         container: "bg-white text-black font-sans",
         header: "text-6xl font-black mb-8 tracking-tight leading-none",
         card: "border-2 border-black p-8 bg-white",
         button: "bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform",
         accent: "text-black underline decoration-4",
         vibeName: "Helvetica®"
      };
   }

   if (p.includes('mobile')) {
      styles.container += " flex flex-col justify-end pb-0";
      styles.card += " rounded-b-none border-b-0 mb-0";
   } else {
      styles.container += " flex flex-col justify-center items-center p-8";
      styles.card += " max-w-md w-full";
   }
   return styles;
};

// --- AUDIO PLAYER COMPONENT ---
interface LectureAudioPlayerProps {
   onTimeUpdate?: (currentTime: number) => void;
}

const LectureAudioPlayer: React.FC<LectureAudioPlayerProps> = ({ onTimeUpdate }) => {
   const audioRef = useRef<HTMLAudioElement>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const [duration, setDuration] = useState(0);
   const [error, setError] = useState(false);

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

         if (onTimeUpdate) {
            onTimeUpdate(current);
         }
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
   };

   const formatTime = (seconds: number) => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
   };

   return (
      <div className={`bg-[#1a1a1a] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-full px-1 py-1 pr-4 flex items-center gap-3 shadow-lg max-w-[200px] md:max-w-xs transition-all hover:border-purple-500/30`}>
         <audio
            ref={audioRef}
            src="/vice/プロンプトエンジニアリング.wav"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={() => setError(true)}
         />

         <button
            onClick={togglePlay}
            disabled={error}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isPlaying ? 'bg-purple-600 text-white' : 'bg-white text-black hover:scale-105'} ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
         >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
         </button>

         <div className="flex-1 flex flex-col justify-center gap-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               <span className={isPlaying ? "text-purple-400" : ""}>
                  {error ? "Audio Missing" : (isPlaying ? "Now Playing" : "Lecture Audio")}
               </span>
               {!error && <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}</span>}
            </div>

            {/* Waveform / Progress */}
            <div className="h-4 flex items-center gap-0.5 overflow-hidden relative cursor-pointer" onClick={(e) => {
               if (audioRef.current && !error) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const width = rect.width;
                  const newTime = (x / width) * duration;
                  audioRef.current.currentTime = newTime;
               }
            }}>
               <div className="absolute inset-0 flex items-center gap-0.5 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                     <div key={i} className="w-1 bg-slate-400 rounded-full" style={{ height: `${30 + Math.random() * 70}%` }}></div>
                  ))}
               </div>

               {!error && (isPlaying ? (
                  <div className="flex items-center gap-0.5 w-full">
                     {Array.from({ length: 20 }).map((_, i) => (
                        <div
                           key={i}
                           className="w-1 bg-purple-500 rounded-full animate-pulse"
                           style={{
                              height: `${30 + Math.random() * 70}%`,
                              animationDelay: `${i * 0.05}s`,
                              animationDuration: '0.8s'
                           }}
                        ></div>
                     ))}
                  </div>
               ) : (
                  <div className="w-full h-0.5 bg-slate-700 rounded-full relative">
                     <div className="absolute left-0 top-0 bottom-0 bg-white rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                     {/* Seek thumb */}
                     <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" style={{ left: `${progress}%` }}></div>
                  </div>
               ))}

               {error && <div className="w-full h-full flex items-center justify-center text-[10px] text-red-500 font-mono">FILE NOT FOUND</div>}
            </div>
         </div>
      </div>
   );
};

const VibeChapterOneView: React.FC<VibeChapterOneViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
   const [phase, setPhase] = useState<'intro' | 'learning' | 'playground'>('intro');
   const [slideIndex, setSlideIndex] = useState(0);
   const [selectedPersonaId, setSelectedPersonaId] = useState('default');
   const { setTheme } = useTheme();

   // Slide Timings for Audio Sync
   const SLIDE_TIMINGS = [0, 26, 51, 78, 108, 136, 158];

   const handleAudioTimeUpdate = (currentTime: number) => {
      // Find the appropriate slide index for the current time
      // We look for the last timing that is less than or equal to current time
      const newIndex = SLIDE_TIMINGS.reduce((acc, startTime, index) => {
         return currentTime >= startTime ? index : acc;
      }, 0);

      if (newIndex !== slideIndex) {
         setSlideIndex(newIndex);
      }
   };

   useEffect(() => {
      setTheme('vibe');
   }, [setTheme]);

   const slides = getLectureSlides(language);

   // Playground State
   const [input, setInput] = useState('');
   const [appliedStyles, setAppliedStyles] = useState(generateDynamicPreview(''));
   const [isTyping, setIsTyping] = useState(false);
   const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([
      { role: 'ai', text: language === 'en' ? "Welcome to the Vibe Lab. Apply what you learned. Use the technique chips or type your own instructions." : "Vibe Labへようこそ。学んだことを応用してください。チップを使うか、自分の言葉で指示してください。" }
   ]);
   const [interactionCount, setInteractionCount] = useState(0);
   const REQUIRED_INTERACTIONS = 2;

   const chatContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (chatContainerRef.current) {
         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
   }, [chatHistory]);

   const handleSend = () => {
      if (!input.trim()) return;
      setChatHistory(prev => [...prev, { role: 'user', text: input }]);
      setIsTyping(true);
      setInteractionCount(prev => prev + 1);

      setTimeout(() => {
         const styles = generateDynamicPreview(input);
         setAppliedStyles(styles);

         let aiResponse = language === 'en' ? "Updating UI based on your vibe." : "バイブに合わせてUIを更新中。";
         if (input.includes('neon')) aiResponse = language === 'en' ? "Injecting Cyberpunk aesthetics. Adding neon glow and terminal fonts." : "サイバーパンクの美学を注入。ネオングローと端末フォントを追加。";
         else if (input.includes('corporate')) aiResponse = language === 'en' ? "Switching to 'Trust' mode. Using serif fonts and a navy palette." : "「信頼」モードへ切り替え。セリフ体とネイビーパレットを使用。";
         else if (input.includes('minimal')) aiResponse = language === 'en' ? "Stripping away noise. Applying Swiss Design principles." : "ノイズを除去。スイスデザインの原則を適用。";

         setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
         setIsTyping(false);
         setInput('');
      }, 1000);
   };

   const handleInject = (technique: typeof PROMPT_TECHNIQUES[0]) => {
      const current = input;
      const separator = current.length > 0 ? " " : "";
      setInput(current + separator + technique.prompt);
   };

   const handleCompleteChapter = () => {
      onNavigate(ViewState.VIBE_PATH);
   };

   const t = {
      en: {
         intro: {
            tag: "Prompt Engineering",
            title: "The Art of Words",
            desc: <>The art of designing words to orchestrate AI. <br /> Learn to speak the language of intelligence.</>,
            btn: "Start Lecture",
            back: "Back to Dashboard"
         },
         lab: {
            title: "VIBE LAB",
            subtitle: "Advanced Prompt Simulation",
            finish: "Finish Chapter",
            system: "System Online",
            mission: "Mission Status",
            tests: "Tests",
            completed: "Completed",
            injectors: "Vibe Injectors",
            placeholder: "Try: 'Act as a Senior Designer. Create a clean profile card...'"
         }
      },
      jp: {
         intro: {
            tag: "プロンプトエンジニアリング",
            title: "言葉の芸術",
            desc: <>AIを指揮するための言葉づくりの技術。<br />知性の言語を話す方法を学びましょう。</>,
            btn: "レクチャー開始",
            back: "ダッシュボードに戻る"
         },
         lab: {
            title: "VIBE LAB",
            subtitle: "高度プロンプトシミュレーション",
            finish: "章を完了",
            system: "システムオンライン",
            mission: "ミッション状況",
            tests: "テスト",
            completed: "完了",
            injectors: "バイブ・インジェクター",
            placeholder: "例：「シニアデザイナーとして振る舞って。クリーンなプロフィールカードを...」"
         }
      }
   }[language];

   // --- RENDER: PHASE 1 (Intro) ---
   if (phase === 'intro') {
      return (
         <div className="h-full bg-[#050505] text-slate-300 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505] z-0"></div>

            {/* Language Toggle (Floating) */}
            <div className="absolute top-6 right-6 z-50 flex bg-white/10 rounded-full p-1 border border-white/10">
               <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
               <button onClick={() => setLanguage('jp')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>JP</button>
            </div>

            <div className="relative z-10 max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <MessageSquare size={40} />
               </div>

               <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.intro.title}</h1>
                  <p className="text-xl text-slate-400 leading-relaxed">
                     {t.intro.desc}
                  </p>
               </div>

               <button
                  onClick={() => setPhase('learning')}
                  className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
               >
                  {t.intro.btn} <ArrowRight size={20} />
               </button>

               <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mt-8 block mx-auto">
                  {t.intro.back}
               </button>
            </div>
         </div>
      );
   }

   // --- RENDER: PHASE 2 (Interactive Lecture) ---
   if (phase === 'learning') {
      const slide = slides[slideIndex];
      const isLastSlide = slideIndex === slides.length - 1;

      return (
         <div className="h-full bg-[#050505] text-slate-300 font-sans flex flex-col">
            {/* Header with Lecture Player */}
            <div className="px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider w-full md:w-auto justify-between md:justify-start">
                  <div className="flex items-center gap-2">
                     <Sparkles size={16} className="text-purple-500" /> Prompt Engineering
                  </div>
                  <button onClick={() => setPhase('intro')} className="p-2 hover:bg-white/10 rounded-full md:hidden"><XCircle size={20} /></button>
               </div>


               <LectureAudioPlayer onTimeUpdate={handleAudioTimeUpdate} />

               <div className="flex items-center gap-4">
                  {/* Language Toggle */}
                  <div className="hidden md:flex bg-white/10 rounded-full p-1 border border-white/10">
                     <button onClick={() => setLanguage('en')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
                     <button onClick={() => setLanguage('jp')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>JP</button>
                  </div>
                  <button onClick={() => setPhase('intro')} className="p-2 hover:bg-white/10 rounded-full hidden md:block"><XCircle size={20} /></button>
               </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex items-center justify-center p-6">
               <div className="max-w-4xl w-full">

                  {/* Slide Content */}
                  <div key={`${slideIndex}-${language}`} className="animate-in fade-in slide-in-from-right-8 duration-500">

                     <div className="mb-8">
                        <span className="text-purple-400 font-bold tracking-widest text-xs uppercase mb-2 block">{slide.title}</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.subtitle}</h2>
                        {slide.type === 'intro' && (
                           <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">{slide.content}</p>
                        )}
                     </div>

                     {/* VISUALIZATIONS */}
                     <div className="bg-[#111] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden min-h-[300px] flex flex-col justify-center">

                        {/* 0. Intro Visual */}
                        {slide.type === 'intro' && (
                           <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                              <div className="relative">
                                 <div className="w-32 h-32 bg-purple-600/20 rounded-full flex items-center justify-center animate-pulse">
                                    <MessageSquare size={48} className="text-purple-400" />
                                 </div>
                                 <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#111] p-2 rounded-lg border border-white/10 shadow-xl">
                                    <Sparkles size={24} className="text-yellow-400" />
                                 </div>
                              </div>
                              <div className="mt-8 flex items-center gap-4 text-slate-500 font-mono text-sm">
                                 <span>Input</span>
                                 <ArrowRight size={16} className="text-slate-600" />
                                 <span className="text-purple-400 font-bold">Model</span>
                                 <ArrowRight size={16} className="text-slate-600" />
                                 <span>Output</span>
                              </div>
                           </div>
                        )}

                        {/* 1. Comparison (Specific vs Vague) */}
                        {slide.type === 'comparison' && slide.badExample && slide.goodExample && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl relative">
                                 <div className="absolute top-4 right-4 text-red-500"><XCircle size={24} /></div>
                                 <span className="text-red-500 font-bold text-xs uppercase mb-2 block">{slide.badExample.label}</span>
                                 <div className="bg-black p-3 rounded-lg text-slate-300 font-mono text-sm mb-4 border border-white/5">
                                    "{slide.badExample.prompt}"
                                 </div>
                                 <div className="text-slate-500 text-sm italic">
                                    {slide.badExample.result}
                                 </div>
                              </div>
                              <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl relative">
                                 <div className="absolute top-4 right-4 text-green-500"><CheckCircle2 size={24} /></div>
                                 <span className="text-green-500 font-bold text-xs uppercase mb-2 block">{slide.goodExample.label}</span>
                                 <div className="bg-black p-3 rounded-lg text-slate-300 font-mono text-sm mb-4 border border-white/5">
                                    "{slide.goodExample.prompt}"
                                 </div>
                                 <div className="text-white text-sm font-medium">
                                    {slide.goodExample.result}
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* 2. Layering (Iterative) */}
                        {slide.type === 'layering' && slide.layers && (
                           <div className="space-y-4 max-w-xl mx-auto w-full">
                              {slide.layers.map((layer, i) => (
                                 <div key={i} className="flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in" style={{ animationDelay: `${i * 200}ms` }}>
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                       {i + 1}
                                    </div>
                                    <div className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                                       <span className="text-slate-200">{layer.text}</span>
                                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{layer.type}</span>
                                    </div>
                                 </div>
                              ))}
                              <div className="flex justify-center pt-4">
                                 <ArrowDown className="text-slate-600 animate-bounce" />
                              </div>
                              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-4 rounded-xl text-center text-white font-bold">
                                 Perfect Result
                              </div>
                           </div>
                        )}

                        {/* 3. Structure (Anatomy) */}
                        {slide.type === 'structure' && slide.parts && (
                           <div className="flex flex-col gap-2 max-w-lg mx-auto w-full">
                              {slide.parts.map((part, i) => (
                                 <div key={i} className="group relative">
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${part.color}`}></div>
                                    <div className="bg-white/5 p-4 pl-6 rounded-r-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                                       <span className={`text-xs font-bold uppercase mb-1 block ${part.color.replace('bg-', 'text-')}`}>{part.label}</span>
                                       <p className="text-slate-300 text-sm font-mono">{part.text}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}

                        {/* 4. Shots (Patterns) */}
                        {slide.type === 'shots' && slide.zeroShot && slide.fewShot && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                              <div className="text-center">
                                 <div className="bg-slate-800 rounded-2xl p-6 mb-4 border border-slate-700">
                                    <div className="font-mono text-xs text-slate-400 mb-2 text-left">Input</div>
                                    <div className="bg-black p-2 rounded text-sm text-left mb-4">{slide.zeroShot.prompt}</div>
                                    <ArrowDown className="mx-auto text-slate-500 mb-2" size={16} />
                                    <div className="font-mono text-xs text-slate-400 mb-2 text-left">Output</div>
                                    <div className="bg-purple-900/20 border border-purple-500/20 p-2 rounded text-sm text-left text-purple-300">???</div>
                                 </div>
                                 <h4 className="font-bold text-white">{slide.zeroShot.label}</h4>
                                 <p className="text-xs text-slate-500">{slide.zeroShot.desc}</p>
                              </div>

                              <div className="text-center">
                                 <div className="bg-slate-800 rounded-2xl p-6 mb-4 border border-slate-700 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-1 bg-green-500 text-black text-[10px] font-bold rounded-bl">Recommended</div>
                                    <div className="font-mono text-xs text-slate-400 mb-2 text-left">Input (Pattern)</div>
                                    <div className="bg-black p-2 rounded text-sm text-left mb-4 whitespace-pre-wrap text-slate-300">{slide.fewShot.prompt}</div>
                                    <ArrowDown className="mx-auto text-slate-500 mb-2" size={16} />
                                    <div className="font-mono text-xs text-slate-400 mb-2 text-left">Output</div>
                                    <div className="bg-green-900/20 border border-green-500/20 p-2 rounded text-sm text-left text-green-400">Orange -{'>'} みかん</div>
                                 </div>
                                 <h4 className="font-bold text-white">{slide.fewShot.label}</h4>
                                 <p className="text-xs text-slate-500">{slide.fewShot.desc}</p>
                              </div>
                           </div>
                        )}

                        {/* 5. Persona (Roles) */}
                        {slide.type === 'persona' && slide.personas && (
                           <div className="space-y-6">
                              <div className="flex justify-center gap-4">
                                 {slide.personas.map((p) => {
                                    const isSelected = selectedPersonaId === p.id;
                                    return (
                                       <button
                                          key={p.id}
                                          onClick={() => setSelectedPersonaId(p.id)}
                                          className="group flex flex-col items-center gap-2"
                                       >
                                          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                             {p.icon}
                                          </div>
                                          <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-500'}`}>{p.name}</span>
                                       </button>
                                    );
                                 })}
                              </div>
                              {/* Demo of static selection for visual */}
                              <div key={selectedPersonaId} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2">
                                 <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shrink-0"><User size={20} /></div>
                                 <div className="bg-black/50 p-4 rounded-xl rounded-tl-sm text-sm text-slate-300">
                                    {(() => {
                                       const persona = slide.personas.find(p => p.id === selectedPersonaId) || slide.personas[0];
                                       return (
                                          <span>
                                             <span className="text-purple-400 font-bold block mb-1">{persona.name}:</span>
                                             "{persona.response}"
                                          </span>
                                       );
                                    })()}
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* 6. Summary */}
                        {slide.type === 'summary' && slide.points && (
                           <div className="text-center">
                              <div className="inline-block p-4 bg-green-500/10 rounded-full text-green-500 mb-6">
                                 <CheckCircle2 size={48} />
                              </div>
                              <ul className="space-y-4 max-w-md mx-auto text-left">
                                 {slide.points.map((pt, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-white">
                                       <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                       {pt}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}

                     </div>

                     {slide.desc && (
                        <p className="text-slate-400 text-center max-w-2xl mx-auto italic border-l-2 border-purple-500 pl-4">
                           "{slide.desc}"
                        </p>
                     )}
                  </div>

               </div>
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-white/10 bg-[#0a0a0a] p-6">
               <div className="max-w-4xl mx-auto flex justify-between items-center">
                  <div className="flex gap-1">
                     {slides.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= slideIndex ? 'w-8 bg-purple-600' : 'w-2 bg-slate-800'}`}></div>
                     ))}
                  </div>

                  <div className="flex gap-4">
                     <button
                        onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
                        disabled={slideIndex === 0}
                        className="text-slate-500 hover:text-white disabled:opacity-30 px-4 py-2"
                     >
                        Back
                     </button>
                     <button
                        onClick={() => isLastSlide ? setPhase('playground') : setSlideIndex(slideIndex + 1)}
                        className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                     >
                        {isLastSlide ? 'Try in Lab' : 'Next'} <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // --- RENDER: PHASE 3 (Playground) ---
   return (
      <div className="h-full bg-[#050505] text-slate-300 font-sans selection:bg-purple-500/30 flex flex-col">
         {/* Navbar */}
         <div className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setPhase('learning')} className="p-2 -ml-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
               </button>
               <div>
                  <h1 className="font-bold text-white text-sm tracking-wider">{t.lab.title}</h1>
                  <p className="text-[10px] text-slate-500 font-mono">{t.lab.subtitle}</p>
               </div>
            </div>

            <div className="flex items-center gap-4">
               {/* Language Toggle */}
               <div className="hidden md:flex bg-white/10 rounded-full p-1 border border-white/10">
                  <button onClick={() => setLanguage('en')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
                  <button onClick={() => setLanguage('jp')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>JP</button>
               </div>

               {interactionCount >= REQUIRED_INTERACTIONS && (
                  <button
                     onClick={handleCompleteChapter}
                     className="animate-in fade-in slide-in-from-right-4 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all hover:scale-105"
                  >
                     <CheckCircle2 size={14} /> {t.lab.finish}
                  </button>
               )}
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-mono text-green-500 hidden md:inline">{t.lab.system}</span>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Chat & Tools */}
            <div className="flex-1 flex flex-col md:w-1/2 min-w-0 border-r border-white/5">
               {/* Mission Status (New) */}
               <div className="bg-[#0a0a0a] border-b border-white/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Trophy size={14} className={interactionCount >= REQUIRED_INTERACTIONS ? "text-yellow-500" : "text-slate-600"} />
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.lab.mission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`text-xs ${interactionCount >= REQUIRED_INTERACTIONS ? "text-green-400" : "text-slate-500"}`}>
                        {interactionCount >= REQUIRED_INTERACTIONS ? t.lab.completed : `${interactionCount} / ${REQUIRED_INTERACTIONS} ${t.lab.tests}`}
                     </span>
                     <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                           className={`h-full transition-all duration-500 ${interactionCount >= REQUIRED_INTERACTIONS ? 'bg-green-500' : 'bg-purple-600'}`}
                           style={{ width: `${Math.min((interactionCount / REQUIRED_INTERACTIONS) * 100, 100)}%` }}
                        ></div>
                     </div>
                  </div>
               </div>

               <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {chatHistory.map((msg, idx) => (
                     <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'ai' && (
                           <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <Sparkles size={14} className="text-purple-400" />
                           </div>
                        )}
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm border border-white/10' : 'bg-[#111] text-slate-300 rounded-tl-sm border border-slate-800'}`}>
                           {msg.text}
                        </div>
                     </div>
                  ))}
                  {isTyping && (
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                           <Sparkles size={14} className="text-purple-400" />
                        </div>
                        <div className="bg-[#111] p-4 rounded-2xl rounded-tl-sm border border-slate-800 flex gap-1 items-center h-12">
                           <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                           <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                           <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                     </div>
                  )}
               </div>

               <div className="bg-[#0a0a0a] border-t border-white/5 p-4">
                  <div className="mb-4">
                     <div className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-2">
                        <Zap size={12} /> {t.lab.injectors}
                     </div>
                     <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {PROMPT_TECHNIQUES.map(tech => (
                           <button key={tech.id} onClick={() => handleInject(tech)} className="whitespace-nowrap bg-[#1a1a1a] border border-white/10 hover:border-purple-500/50 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 group">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all"></span>
                              {tech.label}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                     <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={t.lab.placeholder}
                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 pr-12 text-sm text-white focus:outline-none focus:border-purple-500/50 min-h-[80px] resize-none"
                     />
                     <button onClick={handleSend} disabled={!input.trim()} className="absolute bottom-3 right-3 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors">
                        <Send size={16} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Right: Live Preview */}
            <div className="md:w-1/2 flex flex-col bg-[#111]">
               <div className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4">
                  <div className="flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">localhost:3000</div>
                  <div className="w-4"></div>
               </div>
               <div className={`flex-1 overflow-auto transition-all duration-700 ${appliedStyles.container}`}>
                  <div className={`${appliedStyles.card} animate-in zoom-in-95 duration-500`}>
                     <div className="flex items-center justify-between mb-8">
                        <span className={`text-sm font-bold tracking-widest uppercase ${appliedStyles.accent}`}>{appliedStyles.vibeName}</span>
                        <div className="flex gap-4 text-xs font-medium opacity-60"><span>Work</span><span>About</span><span>Contact</span></div>
                     </div>
                     <h2 className={appliedStyles.header}>Build the future, <br /><span className={appliedStyles.accent}>one pixel at a time.</span></h2>
                     <p className="text-sm opacity-70 mb-8 leading-relaxed max-w-sm">We help brands discover their visual identity through data-driven design.</p>
                     <button className={appliedStyles.button}>Start Project</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default VibeChapterOneView;