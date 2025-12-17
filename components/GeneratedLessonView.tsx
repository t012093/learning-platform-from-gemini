import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Maximize2, Volume2, Mic, Settings, X, ChevronRight, Check } from 'lucide-react';

interface GeneratedLessonViewProps {
    onBack: () => void;
    onComplete: () => void;
}

const GeneratedLessonView: React.FC<GeneratedLessonViewProps> = ({ onBack, onComplete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30);

    return (
        <div className="h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
            {/* Main Stage (Slides / Visuals) */}
            <div className="flex-1 relative flex flex-col">
                {/* Visual Content */}
                <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
                    {/* Background Art (Nano Banana Pro Style) */}
                    <div className="absolute inset-0 opacity-60">
                        <img
                            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80"
                            alt="Quantum Slide"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Slide Content */}
                    <div className="relative z-10 max-w-4xl p-12 text-center">
                        <h2 className="text-5xl font-bold mb-8 tracking-tight drop-shadow-xl">The Qubit: Beyond 0 and 1</h2>

                        <div className="flex justify-center gap-12 mb-8">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-500 bg-black/50 flex items-center justify-center backdrop-blur text-2xl font-mono text-slate-400">
                                0
                            </div>
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(129,140,248,0.5)] text-2xl font-mono animate-pulse">
                                |ψ⟩
                            </div>
                            <div className="w-32 h-32 rounded-full border-4 border-slate-500 bg-black/50 flex items-center justify-center backdrop-blur text-2xl font-mono text-slate-400">
                                1
                            </div>
                        </div>

                        <p className="text-2xl font-light text-slate-200 bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            "Unlike a classical bit, a qubit exists in a fluid superposition of states—like a spinning coin before it lands."
                        </p>
                    </div>

                    {/* Captions / Subtitles */}
                    <div className="absolute bottom-12 left-0 right-0 text-center px-4">
                        <p className="bg-black/80 text-white inline-block px-6 py-3 rounded-full text-lg font-medium shadow-lg backdrop-blur">
                            ビットと異なり、量子ビットは0と1の状態を同時に重ね合わせて存在します。
                        </p>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="h-20 bg-slate-900 border-t border-white/10 flex items-center px-6 gap-6 relative z-20">
                    <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <button className="text-white hover:text-indigo-400 transition-colors"><SkipBack size={24} /></button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button className="text-white hover:text-indigo-400 transition-colors"><SkipForward size={24} /></button>
                    </div>

                    <div className="flex-1 flex items-center gap-4">
                        <span className="text-xs font-mono text-slate-400">01:24</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden relative group cursor-pointer">
                            <div style={{ width: `${progress}%` }} className="absolute h-full bg-indigo-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-mono text-slate-400">03:00</span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-indigo-300">Enceladus TTS</span>
                        </div>
                        <Volume2 size={20} className="hover:text-white cursor-pointer" />
                        <Settings size={20} className="hover:text-white cursor-pointer" />
                        <Maximize2 size={20} className="hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Sidebar (Chat / Notes) */}
            <div className="w-80 bg-slate-950 border-l border-white/10 flex flex-col hidden md:flex">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold">AI Tutor Chat</h3>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Gemini 3 Pro</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shrink-0"><Check size={16} /></div>
                        <div className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg rounded-tl-none">
                            Any questions about Superposition? I can explain it with a different metaphor if needed.
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <button className="absolute right-3 top-3 text-slate-400 hover:text-white">
                            <Mic size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratedLessonView;
