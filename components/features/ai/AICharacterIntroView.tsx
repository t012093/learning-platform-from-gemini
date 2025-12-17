import React from 'react';
import { ViewState } from '../../../types';
import { Sparkles, Brain, Zap, Heart, Anchor, MessageSquare, Bot, Star, ArrowLeft } from 'lucide-react';

interface AICharacterIntroViewProps {
    onBack?: () => void;
    onNavigate: (view: ViewState) => void;
    onSelectCharacter: (id: string) => void;
}

// --- CHARACTER DATA (Shared with Diagnosis) ---
// Ideally this should be in a shared data file, but for now duplicating for modularity.

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
    catchphrase: string;
};

const CHARACTERS: PersonalityType[] = [
    {
        id: 'openness',
        name: 'The Visionary',
        botName: 'Spark',
        botRole: 'イノベーション・パートナー',
        color: 'text-purple-500',
        bgGradient: 'from-purple-500 to-indigo-600',
        icon: Sparkles,
        description: "革新的なアイデアと創造性の源。新しい技術や未踏の領域への挑戦をサポートします。常に「Why not?」と問いかけ、あなたの可能性を広げます。",
        strengths: ["創造的思考", "好奇心", "適応力"],
        catchphrase: "未来を一緒に発明しましょう。"
    },
    {
        id: 'conscientiousness',
        name: 'The Architect',
        botName: 'Focus',
        botRole: '生産性パートナー',
        color: 'text-blue-500',
        bgGradient: 'from-blue-500 to-cyan-600',
        icon: Brain,
        description: "目標達成のための精密な設計図を描くパートナー。効率的な学習計画と習慣化を徹底サポート。迷ったときは常に「最適解」を導き出します。",
        strengths: ["計画力", "一貫性", "細部へのこだわり"],
        catchphrase: "一歩ずつ、確実に頂上へ。"
    },
    {
        id: 'extraversion',
        name: 'The Catalyst',
        botName: 'Vibe',
        botRole: 'モチベーション・パートナー',
        color: 'text-orange-500',
        bgGradient: 'from-orange-400 to-red-500',
        icon: Zap,
        description: "情熱とエネルギーの塊。あなたのモチベーションに火をつけ、行動を加速させます。失敗を恐れず、楽しみながら学ぶ姿勢を伝染させます。",
        strengths: ["エネルギー", "行動力", "コミュニケーション"],
        catchphrase: "Just do it! 走りながら考えよう。"
    },
    {
        id: 'agreeableness',
        name: 'The Mediator',
        botName: 'Echo',
        botRole: '共感パートナー',
        color: 'text-emerald-500',
        bgGradient: 'from-emerald-400 to-teal-500',
        icon: Heart,
        description: "あなたの心に寄り添う優しい聞き手。学習の悩みや不安を受け止め、メンタル面から支えます。ユーザー視点やチームワークの大切さも教えてくれます。",
        strengths: ["共感力", "協調性", "忍耐力"],
        catchphrase: "大丈夫、あなたのペースでいきましょう。"
    },
    {
        id: 'stability',
        name: 'The Anchor',
        botName: 'Luna',
        botRole: '思考深化パートナー',
        color: 'text-slate-500',
        bgGradient: 'from-slate-600 to-zinc-700',
        icon: Anchor,
        description: "静寂の中で深い洞察を与える賢者。表面的な解決ではなく、本質的な理解を促します。複雑なバグや設計課題に直面したとき、彼女の冷静さが助けになります。",
        strengths: ["分析力", "リスク管理", "レジリエンス"],
        catchphrase: "静けさの中に、答えはあります。"
    }
];

const AICharacterIntroView: React.FC<AICharacterIntroViewProps> = ({ onBack, onNavigate, onSelectCharacter }) => {
    return (
        <div className="min-h-screen bg-slate-50 p-8 pb-24">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-6">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-slate-600" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">AIパートナー</h1>
                        <p className="text-slate-500 mt-1">Lumina専属のAIメンターたち。あなたの成長をそれぞれのスタイルで支えます。</p>
                    </div>
                </div>
            </div>

            {/* Characters Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {CHARACTERS.map((char) => (
                    <div
                        key={char.id}
                        onClick={() => onSelectCharacter(char.id)}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 flex flex-col cursor-pointer"
                    >
                        {/* Header Background */}
                        <div className={`h-32 bg-gradient-to-r ${char.bgGradient} opacity-90 group-hover:opacity-100 transition-opacity relative`}>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
                        </div>

                        {/* Icon Avatar */}
                        <div className="px-8 -mt-16 relative z-10 flex justify-between items-end">
                            <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg ring-1 ring-slate-100">
                                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${char.bgGradient} flex items-center justify-center text-white`}>
                                    <char.icon size={40} />
                                </div>
                            </div>
                            <div className="mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full bg-slate-100 ${char.color}`}>
                                    {char.botRole}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    {char.botName}
                                    <span className="text-sm font-normal text-slate-400">/ {char.name}</span>
                                </h2>
                                <p className={`text-sm font-medium italic mt-1 opacity-70 ${char.color}`}>"{char.catchphrase}"</p>
                            </div>

                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                {char.description}
                            </p>

                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">得意分野</h3>
                                <div className="flex flex-wrap gap-2">
                                    {char.strengths.map(s => (
                                        <span key={s} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs font-medium text-slate-600">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigate(ViewState.AI_DIAGNOSIS)}
                                className={`w-full py-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all
                                        bg-white border-slate-200 text-slate-600 hover:border-${char.color.split('-')[1]}-500 hover:text-${char.color.split('-')[1]}-600 hover:bg-slate-50
                             `}
                            >
                                <MessageSquare size={18} /> {char.botName}とチャットする
                            </button>
                        </div>
                    </div>
                ))}

                {/* Locked Slot (Teaser) */}
                <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
                        <Bot size={32} />
                    </div>
                    <h3 className="font-bold text-slate-500 text-lg">準備中</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        セキュリティやデザインなど、専門スキルを持つ新しいAIパートナーがトレーニング中です。
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AICharacterIntroView;
