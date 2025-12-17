import React, { useState } from 'react';
import { Sparkles, ArrowRight, Brain, Zap, Heart, Anchor, Search, RefreshCw, MessageSquare, ChevronRight } from 'lucide-react';
import { ViewState } from '../types';

interface AIDiagnosisViewProps {
    onNavigate: (view: ViewState) => void;
}

// --- CONFIGURATION ---

type Trait = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'stability';

type PersonalityType = {
    id: Trait;
    name: string;
    botName: string;
    botRole: string;
    color: string;
    bgGradient: string;
    icon: any;
    description: string;
    strengths: string[];
};

const PERSONALITY_TYPES: Record<Trait, PersonalityType> = {
    openness: {
        id: 'openness',
        name: 'The Visionary (開放性)',
        botName: 'Spark',
        botRole: 'Innovation Partner',
        color: 'text-purple-500',
        bgGradient: 'from-purple-500 to-indigo-600',
        icon: Sparkles,
        description: "新しいアイデアと創造性を愛するあなたには、革新的な提案をする「Spark」が相棒です。",
        strengths: ["Creative Thinking", "Curiosity", "Adaptability"]
    },
    conscientiousness: {
        id: 'conscientiousness',
        name: 'The Architect (誠実性)',
        botName: 'Focus',
        botRole: 'Productivity Partner',
        color: 'text-blue-500',
        bgGradient: 'from-blue-500 to-cyan-600',
        icon: Brain,
        description: "計画的で着実なあなたには、目標達成を徹底サポートする「Focus」が最適です。",
        strengths: ["Planning", "Consistency", "Detail-oriented"]
    },
    extraversion: {
        id: 'extraversion',
        name: 'The Catalyst (外向性)',
        botName: 'Vibe',
        botRole: 'Motivation Partner',
        color: 'text-orange-500',
        bgGradient: 'from-orange-400 to-red-500',
        icon: Zap,
        description: "エネルギッシュで行動派のあなたには、共に走り続ける熱い相棒「Vibe」がマッチします。",
        strengths: ["Energy", "Action", "Communication"]
    },
    agreeableness: {
        id: 'agreeableness',
        name: 'The Mediator (協調性)',
        botName: 'Echo',
        botRole: 'Empathy Partner',
        color: 'text-emerald-500',
        bgGradient: 'from-emerald-400 to-teal-500',
        icon: Heart,
        description: "調和を大切にするあなたには、優しく寄り添い、成長を見守る「Echo」がおすすめです。",
        strengths: ["Empathy", "Collaboration", "Patience"]
    },
    stability: {
        id: 'stability',
        name: 'The Anchor (安定性)',
        botName: 'Luna',
        botRole: 'Deep Think Partner',
        color: 'text-slate-500',
        bgGradient: 'from-slate-600 to-zinc-700',
        icon: Anchor,
        description: "慎重で思慮深いあなたには、深い洞察と安心感を提供する「Luna」が寄り添います。",
        strengths: ["Analysis", "Risk Management", "Resilience"]
    }
};

const QUESTIONS = [
    {
        id: 1,
        text: "新しい技術やツールが出たらすぐに試してみたい？",
        trait: 'openness' as Trait
    },
    {
        id: 2,
        text: "学習スケジュールは細かく立ててから始めたい？",
        trait: 'conscientiousness' as Trait
    },
    {
        id: 3,
        text: "一人で黙々とやるより、誰かと議論しながら進めたい？",
        trait: 'extraversion' as Trait
    },
    {
        id: 4,
        text: "エラーが出た時、まずは直感で修正してみることが多い？",
        trait: 'openness' as Trait
    },
    {
        id: 5,
        text: "他人のコードを読むとき、効率よりも読みやすさを気にする？",
        trait: 'agreeableness' as Trait
    },
    {
        id: 6,
        text: "予期せぬバグが出ると、少しパニックになってしまう？",
        trait: 'stability' as Trait,
        reverse: true // Yes = Low stability (High neuroticism) -> Wait, logic needed.
        // Let's simpler logic: Score maps to Affinity with Bot.
        // If Yes -> Luna (Stability/Caution) might be good support? Or reverse?
        // Let's assume Yes = Match with this Trait for simplicity.
    },
    {
        id: 7,
        text: "毎日コツコツ続けることが苦にならない？",
        trait: 'conscientiousness' as Trait
    },
    {
        id: 8,
        text: "自分の作ったものを積極的にSNSで公開したい？",
        trait: 'extraversion' as Trait
    }
];

const AIDiagnosisView: React.FC<AIDiagnosisViewProps> = ({ onNavigate }) => {
    const [step, setStep] = useState(0); // 0:Intro, 1-N:Qs, 99:Analysis, 100:Result
    const [scores, setScores] = useState<Record<Trait, number>>({
        openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, stability: 0
    });

    const handleStart = () => setStep(1);

    const handleAnswer = (trait: Trait, value: number) => {
        setScores(prev => ({ ...prev, [trait]: prev[trait] + value }));

        if (step < QUESTIONS.length) {
            setStep(prev => prev + 1);
        } else {
            setStep(99); // Analyze
            setTimeout(() => setStep(100), 2500);
        }
    };

    const getResult = (): PersonalityType => {
        // Return trait with highest score
        let maxTrait: Trait = 'openness';
        let maxScore = -1;
        (Object.keys(scores) as Trait[]).forEach(t => {
            if (scores[t] > maxScore) {
                maxScore = scores[t];
                maxTrait = t;
            }
        });
        return PERSONALITY_TYPES[maxTrait];
    };

    const resultBot = getResult();

    // --- RENDER ---

    if (step === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-left space-y-6">
                        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full font-bold text-sm">
                            <Brain size={16} /> AI Personality Match
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                            Find Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Perfect AI Partner</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed">
                            学習スタイルは一人ひとり違います。<br />
                            Big Five性格分析に基づき、あなたに最適な<br />「専属AIメンター」をマッチングします。
                        </p>
                        <button
                            onClick={handleStart}
                            className="group bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-3 w-fit"
                        >
                            診断スタート <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="relative h-[400px] hidden md:block">
                        {/* Decorative Bots */}
                        <div className="absolute top-0 right-10 w-24 h-24 bg-purple-100 rounded-2xl rotate-12 flex items-center justify-center shadow-lg animate-bounce duration-[3000ms]">
                            <Sparkles className="text-purple-600" size={40} />
                        </div>
                        <div className="absolute bottom-10 left-10 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-md animate-pulse">
                            <Brain className="text-blue-600" size={32} />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex items-center justify-center">
                            <Search size={64} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step > 0 && step <= QUESTIONS.length) {
        const q = QUESTIONS[step - 1];
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-lg w-full">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                        <span>Question {step}</span>
                        <span>{QUESTIONS.length} Total</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full mb-12 overflow-hidden">
                        <div
                            className="h-full bg-slate-800 transition-all duration-300"
                            style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                        ></div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-12 text-center h-20 flex items-center justify-center">
                        {q.text}
                    </h2>

                    <div className="space-y-3">
                        <button onClick={() => handleAnswer(q.trait, 2)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                            非常によく当てはまる
                        </button>
                        <button onClick={() => handleAnswer(q.trait, 1)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                            当てはまる
                        </button>
                        <button onClick={() => handleAnswer(q.trait, 0)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                            どちらでもない
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 99) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-black opacity-50"></div>
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                    <h2 className="text-3xl font-bold mb-2">Analyzing Big Five Traits...</h2>
                    <div className="flex gap-4 justify-center mt-8 opacity-50 text-sm font-mono">
                        <span className="animate-pulse">OPEN</span>
                        <span className="animate-pulse delay-75">CONS</span>
                        <span className="animate-pulse delay-150">EXTR</span>
                        <span className="animate-pulse delay-200">AGRE</span>
                        <span className="animate-pulse delay-300">STAB</span>
                    </div>
                </div>
            </div>
        );
    }

    // Result
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700">

                {/* Left: Bot Visual */}
                <div className={`relative w-full md:w-1/2 p-12 flex flex-col items-center justify-center bg-gradient-to-br ${resultBot.bgGradient}`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10 w-48 h-48 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center shadow-2xl mb-8 animate-in zoom-in duration-700">
                        <resultBot.icon size={80} className="text-white drop-shadow-md" />
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{resultBot.botName}</h2>
                    <div className="text-white/80 font-medium tracking-widest uppercase text-sm bg-white/10 px-4 py-1 rounded-full">
                        {resultBot.botRole}
                    </div>
                </div>

                {/* Right: Analysis Details */}
                <div className="flex-1 p-10 bg-slate-900 text-slate-300">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Matched Personality</div>
                            <h3 className="text-2xl font-bold text-white max-w-xs">{resultBot.name}</h3>
                        </div>
                        <div onClick={() => setStep(0)} className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-slate-500 hover:text-white">
                            <RefreshCw size={20} />
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed mb-8 text-slate-400">
                        {resultBot.description}
                    </p>

                    <div className="space-y-6 mb-10">
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Core Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                                {resultBot.strengths.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Fake Chart Visualization */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Trait Profile</h4>
                            <div className="flex items-end gap-2 h-16">
                                {(Object.keys(scores) as Trait[]).map(t => {
                                    const isMax = t === resultBot.id;
                                    const height = 20 + (scores[t] * 15); // visual fake
                                    return (
                                        <div key={t} className="flex-1 flex flex-col justify-end group cursor-help">
                                            <div
                                                className={`w-full rounded-t-sm transition-all duration-1000 ${isMax ? 'bg-white' : 'bg-slate-700'}`}
                                                style={{ height: `${Math.min(height, 100)}%` }}
                                            ></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => onNavigate(ViewState.AI_TUTOR)}
                            className="flex-1 bg-white text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={20} /> Chat with {resultBot.botName}
                        </button>
                        <button
                            onClick={() => onNavigate(ViewState.DASHBOARD)}
                            className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 hover:border-slate-600"
                        >
                            Later
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AIDiagnosisView;
