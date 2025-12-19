import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Maximize2, Volume2, Send, Bot, MessageSquare, X, Lightbulb, Target, Sparkles, Key, Palette } from 'lucide-react';
import { GeneratedCourse } from '../../../types';

interface GeneratedLessonViewProps {
    course: GeneratedCourse | null;
    onBack: () => void;
    onComplete: () => void;
}

const GeneratedLessonView: React.FC<GeneratedLessonViewProps> = ({ course, onBack, onComplete }) => {
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (!course) {
        return (
            <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No Course Data Found</h2>
                    <button onClick={onBack} className="bg-indigo-600 px-6 py-2 rounded-lg">Go Back</button>
                </div>
            </div>
        );
    }

    const currentChapter = course.chapters[currentChapterIndex];
    const isLastChapter = currentChapterIndex === course.chapters.length - 1;
    const slides = currentChapter.slides || [];
    const hasSlides = slides.length > 0;
    const currentSlide = hasSlides ? slides[currentSlideIndex] : null;
    const isLastSlide = hasSlides ? currentSlideIndex === slides.length - 1 : true;

    const handleNext = () => {
        if (isLastChapter) {
            onComplete();
        } else {
            setCurrentChapterIndex(prev => prev + 1);
            setCurrentSlideIndex(0);
            setIsPlaying(false);
        }
    };

    const handlePrev = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
            setCurrentSlideIndex(0);
            setIsPlaying(false);
        }
    };

    const handleNextSlide = () => {
        if (!hasSlides) return;
        if (isLastSlide) {
            handleNext();
        } else {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const handlePrevSlide = () => {
        if (!hasSlides) return;
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        } else {
            handlePrev();
        }
    };

    return (
        <div className="h-screen bg-slate-950 text-white flex overflow-hidden w-full font-sans">
            {/* Main Stage (Content) */}
            <div className="flex-1 relative flex flex-col h-full min-w-0 overflow-y-auto">
                {/* Hero / Header Section */}
                <div className="relative min-h-[40vh] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 opacity-30">
                        <img
                            src={`https://picsum.photos/seed/${course.id + currentChapterIndex}/1920/1080`}
                            alt="Lesson Background"
                            className="w-full h-full object-cover blur-sm scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                        <span className="inline-block text-indigo-300 font-mono text-xs tracking-widest uppercase bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-500/20 backdrop-blur-sm">
                            Chapter {currentChapterIndex + 1} / {course.chapters.length} • {currentChapter.duration}
                            {hasSlides && ` • Slide ${currentSlideIndex + 1} / ${slides.length}`}
                        </span>
                        
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                            {currentChapter.title}
                        </h2>
                        
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            {hasSlides ? (currentSlide?.title || currentChapter.content) : currentChapter.content}
                        </p>
                    </div>
                </div>

                {/* Rich Content Cards */}
                <div className="flex-1 bg-slate-950 relative z-10">
                    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* When slides exist, use them as the primary content; otherwise show the classic cards */}
                        {hasSlides ? (() => {
                            const normalizeLayout = (hint?: string) => {
                                const h = (hint || '').toLowerCase();
                                if (/visual|image|gallery|media/.test(h)) return 'visual-first';
                                if (/text-only|mono|stack/.test(h)) return 'text-only';
                                if (/wide|hero/.test(h)) return 'wide';
                                return 'two-column';
                            };
                            const mapVisualPreset = (style?: string) => {
                                const s = (style || '').toLowerCase();
                                if (s.includes('cyan') || s.includes('neon') || s.includes('indigo')) {
                                    return {
                                        gradient: 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-cyan-900/50 border-cyan-600/30',
                                        chip: 'bg-cyan-900/30 text-cyan-200 border border-cyan-600/30'
                                    };
                                }
                                if (s.includes('sunset') || s.includes('warm')) {
                                    return {
                                        gradient: 'bg-gradient-to-br from-amber-900/60 via-slate-900 to-rose-900/40 border-amber-500/30',
                                        chip: 'bg-amber-900/40 text-amber-200 border border-amber-500/30'
                                    };
                                }
                                return {
                                    gradient: 'bg-slate-900/60 border border-slate-800',
                                    chip: 'bg-slate-800/60 text-slate-200 border border-slate-700/60'
                                };
                            };
                            const mapAccentIcon = (name?: string) => {
                                const n = (name || '').toLowerCase();
                                if (n.includes('light') || n.includes('idea')) return Lightbulb;
                                if (n.includes('target') || n.includes('goal')) return Target;
                                if (n.includes('palette') || n.includes('art')) return Palette;
                                if (n.includes('key')) return Key;
                                return Sparkles;
                            };
                            const mapMotionStyle = (cue?: string) => {
                                const c = (cue || '').toLowerCase();
                                if (c.includes('slide-left')) return { animation: 'slideLeft 0.55s ease-out' };
                                if (c.includes('slide-up')) return { animation: 'slideUp 0.55s ease-out' };
                                if (c.includes('pop')) return { animation: 'popIn 0.45s ease-out' };
                                return { animation: 'fadeIn 0.6s ease-out' };
                            };

                            const layout = normalizeLayout(currentSlide?.layoutHint);
                            const visualPreset = mapVisualPreset(currentSlide?.visualStyle);
                            const MotionIcon = mapAccentIcon(currentSlide?.accentIcon);
                            const motionStyle = mapMotionStyle(currentSlide?.motionCue);

                            const containerBase = `rounded-2xl p-6 transition-colors md:col-span-2 ${visualPreset.gradient}`;
                            const gridClass =
                                layout === 'text-only'
                                    ? 'grid grid-cols-1 gap-4'
                                    : layout === 'visual-first'
                                        ? 'grid grid-cols-1 md:grid-cols-3 gap-6 items-center'
                                        : layout === 'wide'
                                            ? 'grid grid-cols-1 md:grid-cols-4 gap-6 items-start'
                                            : 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start';

                            const textColSpan =
                                layout === 'wide' ? 'md:col-span-3' : layout === 'visual-first' ? 'md:col-span-2' : 'md:col-span-1';

                            return (
                                <>
                                    <style>{`
                                      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                                      @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                                      @keyframes slideLeft { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
                                      @keyframes popIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                                    `}</style>
                                    <div className={`${containerBase} shadow-lg shadow-indigo-900/10`} style={motionStyle}>
                                        <div className="flex items-center justify-between mb-4 text-emerald-300">
                                            <div className="flex items-center gap-3">
                                                <Sparkles size={24} />
                                                <h3 className="font-bold text-lg text-slate-50">スライド</h3>
                                            </div>
                                            <div className="text-xs text-slate-200/70">Slide {currentSlideIndex + 1} / {slides.length}</div>
                                        </div>
                                        <div className={gridClass}>
                                            {layout !== 'text-only' && (
                                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-start justify-between h-full gap-4">
                                                    <div className={`${visualPreset.chip} px-3 py-1 rounded-full text-xs font-semibold`}>
                                                        {currentSlide?.visualStyle || "Creative Style"}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-50">
                                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                                            <MotionIcon size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-300">{currentSlide?.accentIcon || "sparkles"}</p>
                                                            <p className="text-xs text-slate-400">layout: {layout}</p>
                                                        </div>
                                                    </div>
                                                    {currentSlide?.motionCue && (
                                                        <p className="text-xs text-slate-300/80">motion: {currentSlide.motionCue}</p>
                                                    )}
                                                </div>
                                            )}
                                            <div className={`bg-slate-950/60 border border-slate-800 rounded-xl p-4 ${textColSpan}`}>
                                                <h4 className="text-slate-100 font-bold mb-3">{currentSlide?.title || 'Slide'}</h4>
                                                <ul className="space-y-2">
                                                    {currentSlide?.bullets?.map((b, idx) => (
                                                        <li key={idx} className="text-slate-300 text-sm flex gap-2 items-start" style={motionStyle}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={handlePrevSlide} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">
                                                    Prev Slide
                                                </button>
                                                <button onClick={handleNextSlide} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors">
                                                    {isLastSlide ? 'Next Chapter' : 'Next Slide'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })() : (
                            <>
                                {/* 1. Why It Matters (Motivation) */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4 text-amber-400">
                                        <Target size={24} />
                                        <h3 className="font-bold text-lg text-slate-200">なぜ重要なのか？</h3>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        {currentChapter.whyItMatters || "この知識はあなたのスキルセットの基盤となります。"}
                                    </p>
                                </div>

                                {/* 2. Analogy (Understanding) */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                                        <Lightbulb size={24} />
                                        <h3 className="font-bold text-lg text-slate-200">たとえて言うなら...</h3>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed italic">
                                        "{currentChapter.analogy || "それはまるで、新しい言語を学ぶようなものです。"}"
                                    </p>
                                </div>

                                {/* 3. Key Concepts (Knowledge) */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4 text-cyan-400">
                                        <Key size={24} />
                                        <h3 className="font-bold text-lg text-slate-200">キーコンセプト</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {currentChapter.keyConcepts && currentChapter.keyConcepts.length > 0 ? (
                                            currentChapter.keyConcepts.map((concept, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-slate-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                                    {concept}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-slate-500">基本概念</li>
                                        )}
                                    </ul>
                                </div>

                                {/* 4. Action Step (Practice) */}
                                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-lg shadow-indigo-900/10">
                                    <div className="flex items-center gap-3 mb-4 text-indigo-400">
                                        <Sparkles size={24} />
                                        <h3 className="font-bold text-lg text-white">アクション・ステップ</h3>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed font-medium">
                                        {currentChapter.actionStep || "エディタを開いて、学んだことを試してみましょう。"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Bottom Spacer */}
                    <div className="h-24"></div>
                </div>

                {/* Player Controls (Fixed Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex items-center px-6 gap-6 z-30">
                    <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <button onClick={handlePrev} disabled={currentChapterIndex === 0} className={`transition-colors ${currentChapterIndex === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-white hover:text-indigo-400'}`}>
                            <SkipBack size={24} />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={handleNext} className="text-white hover:text-indigo-400 transition-colors">
                            <SkipForward size={24} />
                        </button>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4 text-slate-400">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg transition-colors ${isSidebarOpen ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}>
                            <MessageSquare size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar (Chat / Notes) */}
            <div className={`bg-slate-900 border-l border-white/10 flex flex-col transition-all duration-300 ease-in-out h-full shrink-0 ${isSidebarOpen ? 'w-96 translate-x-0' : 'w-0 translate-x-full opacity-0 overflow-hidden'}`}>
                <div className="w-96 flex flex-col h-full">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/30">
                        <div>
                            <h3 className="font-bold text-sm text-slate-200">Lumina AI Tutor</h3>
                            <p className="text-xs text-slate-500">Context: {currentChapter.title}</p>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="text-sm text-slate-300 bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                                <p className="mb-2 font-bold text-indigo-300">ここでのポイント:</p>
                                <p>{currentChapter.analogy}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 bg-slate-950/30">
                        <div className="relative">
                            <input type="text" placeholder="質問する..." className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500/50 text-slate-200" />
                            <button className="absolute right-3 top-3 text-slate-500 hover:text-white"><Send size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratedLessonView;
