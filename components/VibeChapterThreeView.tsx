
import React, { useState, useEffect, useRef } from 'react';
import {
   ArrowLeft, Terminal, Play, Check, ArrowRight,
   MessageSquare, Loader2, Sparkles, FolderOpen, FileCode, CheckCircle2,
   X, AlertCircle, Pause, Volume2
} from 'lucide-react';
import { ViewState } from '../types';

// --- AUDIO PLAYER COMPONENT ---
interface LectureAudioPlayerProps {
   label?: string;
   src?: string;
   onTimeUpdate?: (currentTime: number) => void;
   onAudioEnded?: () => void;
}

const LectureAudioPlayer: React.FC<LectureAudioPlayerProps> = ({ label = "Lecture Audio", src = "/vice/vscodeの使い方.wav", onTimeUpdate, onAudioEnded }) => {
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
         // Auto-play next track if possible (user interaction policy might block this but we try)
         if (src && !src.includes("codex.wav")) {
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
      if (onAudioEnded) {
         onAudioEnded();
      }
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
                  {error ? "Audio Missing" : (isPlaying ? "Codex" : label)}
               </span>
               {!error && <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}</span>}
            </div>

            {/* Waveform */}
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
                  {Array.from({ length: 15 }).map((_, i) => (
                     <div key={i} className="w-1 bg-slate-400 rounded-full" style={{ height: `${30 + Math.random() * 70}%` }}></div>
                  ))}
               </div>
               {!error && (isPlaying ? (
                  <div className="flex items-center gap-0.5 w-full">
                     {Array.from({ length: 15 }).map((_, i) => (
                        <div
                           key={i}
                           className="w-1 bg-blue-500 rounded-full animate-pulse"
                           style={{
                              height: `${30 + Math.random() * 70}%`,
                              animationDelay: `${i * 0.05}s`,
                              animationDuration: '0.8s'
                           }}
                        ></div>
                     ))}
                  </div>
               ) : (
                  <div className="flex items-center gap-0.5 w-full">
                     {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="w-1 bg-slate-600 rounded-full" style={{ height: `${30 + Math.random() * 70}%` }}></div>
                     ))}
                  </div>
               ))}

               {/* Progress Overlay */}
               <div className="absolute top-0 left-0 h-full bg-white/10 pointer-events-none" style={{ width: `${progress}%` }}></div>
            </div>
         </div>
      </div>
   );
};

interface VibeChapterThreeViewProps {
   onBack: () => void;
   onNavigate: (view: ViewState) => void;
   language: 'en' | 'jp';
   setLanguage: (lang: 'en' | 'jp') => void;
}

const VibeChapterThreeView: React.FC<VibeChapterThreeViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
   const [slide, setSlide] = useState(0);
   const [currentTrack, setCurrentTrack] = useState(0);
   const totalSlides = 6;

   // Playlist Definition
   // Track 1: codex.wav (Setup & Intro)
   // Track 2: ai2.wav (Interaction & Result)
   const playlist = [
      { src: "/vice/codex.wav", slides: [0, 1, 2, 3] },
      { src: "/vice/ai2.wav", slides: [4, 5] }
   ];

   // Audio Sync Logic
   const handleTimeUpdate = (time: number) => {
      if (currentTrack === 0) {
         // codex.wav logic
         if (time < 20) setSlide(0);      // Intro
         else if (time < 40) setSlide(1); // Open Terminal
         else if (time < 70) setSlide(2); // Install
         else setSlide(3);                // Boot
      } else if (currentTrack === 1) {
         // ai2.wav logic
         if (time < 30) setSlide(4);      // Prompt
         else setSlide(5);                // Result
      }
   };

   const handleTrackEnd = () => {
      if (currentTrack < playlist.length - 1) {
         const nextTrack = currentTrack + 1;
         setCurrentTrack(nextTrack);
         setSlide(playlist[nextTrack].slides[0]);
      }
   };

   const content = {
      en: {
         chapter: "Chapter 3: The Engine",
         slides: [
            { title: "The Engine", desc: "You don't need to understand everything. \nJust use what is displayed." },
            { title: "Open Terminal", desc: "Menu > Terminal > New Terminal. \nThe black box is where magic happens." },
            { title: "Install Codex", desc: "Copy the command. Paste it. Enter. \nWait for the matrix to load." },
            { title: "Wake Up Codex", desc: "Codex is waiting for your words. \nThe 'Input Wait' state is your canvas." },
            { title: "Your First Order", desc: "'Create a simple web page here.' \nWatch the AI think and build." },
            { title: "The Experience", desc: "You define the 'What'. \nCodex handles the 'How'. \nThat is Vibe Coding." }
         ]
      },
      jp: {
         chapter: "第3章：エンジン",
         slides: [
            { title: "エンジン", desc: "これから出る文字列は、\n理解しなくていい。\n読めなくていい。\n\n表示されたものを、そのまま使う。\nそれだけで進めます。" },
            { title: "ターミナルを開く", desc: "画面上のメニューから\n「ターミナル」→「新しいターミナル」\nを選んでください。\n\n画面の下に出る黒いエリア。\nここが Codex を動かす場所です。" },
            { title: "Codexをインストール", desc: "これから読み上げるコマンドを、\nそのままコピーして貼ってください。\n\n文字が流れていきますが、\n気にしなくて大丈夫です。\n準備をしているだけです。" },
            { title: "Codexを起動", desc: "起動コマンドを貼って Enter。\nすると「入力待ち」の状態になります。\n\nこれは、Codex が\nあなたの言葉を待っているサインです。" },
            { title: "はじめての指示", desc: "「このフォルダに、シンプルなWebページを作りたい」\n\nEnterを押すと、Codexが考え始めます。\n「やっていいですか？」と聞かれたら、\n従ってください。" },
            { title: "AIと一緒に作る", desc: "エクスプローラーを見てください。\nファイルが増えていますね。\n\n中身を理解する必要はありません。\n「AIが作ってくれた」「動いた」\nそれで十分です。" }
         ]
      }
   };

   const t = content[language];


   // --- SLIDE COMPONENTS ---

   const IntroSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto animate-in fade-in duration-700">
         <Sparkles size={80} className="text-purple-400 mb-8 animate-pulse" />
         <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 whitespace-pre-wrap">{t.slides[0].title}</h1>
         <p className="text-xl md:text-2xl text-slate-400 leading-relaxed whitespace-pre-wrap">
            {t.slides[0].desc}
         </p>
      </div>
   );

   const OpenTerminalSlide = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <div className="w-full max-w-3xl bg-[#1e1e1e] rounded-xl border border-slate-700 shadow-2xl overflow-hidden relative">
            {/* Mock Menu Bar */}
            <div className="h-8 bg-[#333] flex items-center px-4 gap-4 text-xs text-slate-400 border-b border-black">
               <span>File</span>
               <span>Edit</span>
               <span>Selection</span>
               <span>View</span>
               <span>Go</span>
               <span>Run</span>
               <span className="text-white bg-blue-600 px-2 py-0.5 rounded animate-pulse">Terminal</span>
               <span>Help</span>
            </div>

            {/* Terminal Area Animation */}
            <div className="h-64 bg-black flex items-center justify-center relative">
               <div className="absolute inset-x-0 bottom-0 h-48 bg-[#0a0a0a] border-t border-slate-700 animate-in slide-in-from-bottom duration-700 flex flex-col p-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase">
                     <span>Terminal</span>
                     <X size={14} />
                  </div>
                  <div className="flex-1 font-mono text-sm text-slate-300">
                     user@vibe-coding:~$ <span className="animate-pulse">_</span>
                  </div>
               </div>
            </div>
         </div>
         <h2 className="text-3xl font-bold text-white mt-12 mb-4">{t.slides[1].title}</h2>
         <p className="text-center text-slate-400 whitespace-pre-wrap">{t.slides[1].desc}</p>
      </div>
   );

   const InstallSlide = () => {
      const [step, setStep] = useState(0); // 0: Command, 1: Installing...

      useEffect(() => {
         if (step === 0) {
            const timer = setTimeout(() => setStep(1), 1500);
            return () => clearTimeout(timer);
         }
      }, [step]);

      return (
         <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
            <div className="w-full max-w-3xl bg-black rounded-xl border border-slate-700 shadow-2xl font-mono text-sm p-4 h-96 overflow-hidden relative">
               <div className="text-green-400 mb-2">➜  ~ npm install -g @openai/codex</div>

               {step >= 1 && (
                  <div className="space-y-1 text-slate-400 animate-in fade-in duration-300">
                     <div>[..................] \ fetchMetadata: sill mapToRegistry uri https://registry.npmjs.org/@openai/codex</div>
                     <div className="text-white">deprecated Request@2.88.2: request has been deprecated...</div>
                     <div className="text-blue-400">added 142 packages in 3s</div>
                     <div className="text-green-400 mt-4">➜  ~ <span className="animate-pulse">_</span></div>
                  </div>
               )}

               {/* Matrix Effect Overlay/Side Graphic */}
               <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-900/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Help Button for missing NPM */}
            <div className="w-full max-w-3xl mt-2 flex justify-end">
               <button className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full" onClick={() => alert("First, install Node.js from nodejs.org")}>
                  <AlertCircle size={12} /> Don't have npm?
               </button>
            </div>

            <h2 className="text-3xl font-bold text-white mt-6 mb-4">{t.slides[2].title}</h2>
            <p className="text-center text-slate-400 whitespace-pre-wrap">{t.slides[2].desc}</p>
         </div>
      );
   };

   const BootSlide = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
         <div className="w-full max-w-3xl bg-black rounded-xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)] font-mono text-sm p-6 h-64 relative flex flex-col justify-center items-center">
            <div className="text-purple-400 mb-4 animate-pulse text-lg">● Codex AI Engine</div>
            <div className="w-full max-w-md bg-slate-900 rounded-lg p-4 flex items-center gap-2 border border-slate-700">
               <span className="text-green-500">❯</span>
               <span className="text-slate-500 italic">Waiting for input...</span>
            </div>
         </div>
         <h2 className="text-3xl font-bold text-white mt-8 mb-4">{t.slides[3].title}</h2>
         <p className="text-center text-slate-400 whitespace-pre-wrap">{t.slides[3].desc}</p>
      </div>
   );

   const PromptSlide = () => {
      const [stage, setStage] = useState(0); // 0: Input, 1: Thinking, 2: Action

      useEffect(() => {
         const t1 = setTimeout(() => setStage(1), 2000);
         const t2 = setTimeout(() => setStage(2), 5000);
         return () => { clearTimeout(t1); clearTimeout(t2); };
      }, []);

      return (
         <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
            <div className="w-full max-w-3xl bg-black rounded-xl border border-slate-700 p-6 min-h-[400px] flex flex-col font-mono relative">

               {/* User Input */}
               <div className="flex gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">U</div>
                  <div className="bg-slate-900 rounded-lg p-4 text-white border border-slate-700 max-w-lg">
                     このフォルダに、シンプルな Web ページを作りたい
                  </div>
               </div>

               {/* AI Thinking */}
               {stage >= 1 && (
                  <div className="flex gap-4 mb-6 animate-in fade-in slide-in-from-left-2">
                     <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center"><Sparkles size={14} /></div>
                     <div className="text-purple-400 italic flex items-center gap-2">
                        {stage === 1 ? <>Thinking process <Loader2 size={14} className="animate-spin" /></> : "Task Analyzed"}
                     </div>
                  </div>
               )}

               {/* Action Plan */}
               {stage >= 2 && (
                  <div className="ml-12 border-l-2 border-purple-500/30 pl-6 space-y-2 animate-in fade-in duration-500">
                     <div className="flex items-center gap-2 text-green-400"><CheckCircle2 size={16} /> Create index.html</div>
                     <div className="flex items-center gap-2 text-green-400"><CheckCircle2 size={16} /> Create style.css</div>
                     <div className="bg-slate-900 p-3 rounded border border-purple-500/30 text-xs text-slate-300 mt-2">
                        I've created a basic landing page structure for you. Check the files?
                     </div>
                  </div>
               )}
            </div>
            <h2 className="text-3xl font-bold text-white mt-8 mb-4">{t.slides[4].title}</h2>
         </div>
      );
   };

   const ResultSlide = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto">
         <div className="flex gap-8 w-full items-center justify-center animate-in zoom-in duration-700">
            {/* Explorer View */}
            <div className="w-64 bg-[#252526] h-80 rounded-xl border border-black shadow-2xl p-4 flex flex-col gap-2">
               <div className="text-xs font-bold text-slate-500 uppercase mb-2">Explorer</div>
               <div className="flex items-center gap-2 text-yellow-400 bg-white/5 p-2 rounded"><FileCode size={16} /> index.html <span className="ml-auto text-xs text-green-500 font-bold">NEW</span></div>
               <div className="flex items-center gap-2 text-blue-400 bg-white/5 p-2 rounded"><FileCode size={16} /> style.css <span className="ml-auto text-xs text-green-500 font-bold">NEW</span></div>
            </div>

            {/* Arrow */}
            <ArrowRight size={48} className="text-slate-600" />

            {/* Preview with Browser */}
            <div className="w-96 bg-white h-80 rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
               <div className="h-6 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
               </div>
               <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">Hello World</h1>
                  <p className="text-slate-500">Generated by Codex</p>
                  <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Get Started</button>
               </div>
            </div>
         </div>

         <h2 className="text-4xl font-bold text-white mt-12 mb-6">{t.slides[5].title}</h2>
         <p className="text-xl text-slate-400 whitespace-pre-wrap text-center max-w-2xl">{t.slides[5].desc}</p>

         <button
            onClick={() => onNavigate(ViewState.VIBE_PATH)}
            className="mt-12 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
         >
            {language === 'en' ? "Finish Chapter" : "章を完了する"} <Check size={20} />
         </button>
      </div>
   );


   return (
      <div className="h-screen bg-[#050505] text-slate-300 font-sans flex flex-col">
         {/* Audio Player */}
         <LectureAudioPlayer
            label={`Chapter 3: ${currentTrack === 0 ? "Setup" : "Interaction"}`}
            src={playlist[currentTrack].src}
            onTimeUpdate={handleTimeUpdate}
            onAudioEnded={handleTrackEnd}
         />

         {/* Progress Bar */}
         <div className="w-full h-1 bg-slate-900">
            <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${((slide + 1) / totalSlides) * 100}%` }}></div>
         </div>

         {/* Navbar */}
         <div className="px-6 py-4 flex justify-between items-center border-b border-white/5">
            <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors">
               <X size={24} />
            </button>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               {t.chapter} <span className="bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded text-[10px] border border-purple-500/30">CODEX</span>
            </div>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
               <button onClick={() => setLanguage('en')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>EN</button>
               <button onClick={() => setLanguage('jp')} className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>JP</button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-hidden p-6 relative">
            {slide === 0 && <IntroSlide />}
            {slide === 1 && <OpenTerminalSlide />}
            {slide === 2 && <InstallSlide />}
            {slide === 3 && <BootSlide />}
            {slide === 4 && <PromptSlide />}
            {slide === 5 && <ResultSlide />}
         </div>
      </div>
   );
};

export default VibeChapterThreeView;