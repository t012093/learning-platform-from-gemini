import React, { useEffect } from 'react';
import {
    Terminal, Box, Palette, Activity, BookOpen,
    Sparkles, Cpu, ArrowRight
} from 'lucide-react';
import { ViewState } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface LearningHubProps {
    onNavigate: (view: ViewState) => void;
}

const LearningHub: React.FC<LearningHubProps> = ({ onNavigate }) => {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('default');
    }, [setTheme]);

    const portals = [
        {
            id: 'web',
            title: 'Web Basics',
            subtitle: 'Web開発の基礎',
            icon: GlobeIcon,
            view: ViewState.PROGRAMMING_WEB,
            color: 'text-cyan-500',
            bg: 'bg-cyan-50',
            borderColor: 'border-cyan-100',
            description: "HTML, CSS, Reactの基礎からモダンなUI構築まで。",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'ai',
            title: 'Gen AI Camp',
            subtitle: '生成AI & Python',
            icon: Cpu,
            view: ViewState.PROGRAMMING_AI,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50',
            borderColor: 'border-yellow-100',
            description: "LLMの仕組みとPythonによるAIアプリケーション開発。",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'vibe',
            title: 'Vibe Coding',
            subtitle: '没入型コード体験',
            icon: Sparkles,
            view: ViewState.PROGRAMMING_VIBE,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            borderColor: 'border-purple-100',
            description: "GitとOSSの世界を冒険する、新感覚のストーリー学習。",
            image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: '3d',
            title: 'Blender 3D',
            subtitle: '3Dモデリング',
            icon: Box,
            view: ViewState.BLENDER,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            borderColor: 'border-orange-100',
            description: "Blenderを使った3DCG制作と空間デザインの基礎。",
            image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'teacher-bot-live',
            title: 'Teacher Bot Live',
            subtitle: 'Blender サイドカー',
            icon: Terminal,
            view: ViewState.TEACHER_BOT_LIVE,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            description: "Blenderの現在ステップを大画面で同期表示。",
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'art',
            title: 'Art Atelier',
            subtitle: '美術史 & 哲学',
            icon: Palette,
            view: ViewState.ART_MUSEUM,
            color: 'text-stone-600',
            bg: 'bg-stone-100',
            borderColor: 'border-stone-200',
            description: "視覚芸術の歴史と理論。クリエイティブの源泉を探る。",
            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'english',
            title: 'Global Communication',
            subtitle: '実践英語 & 異文化理解',
            icon: BookOpen,
            view: ViewState.COURSES,
            color: 'text-teal-500',
            bg: 'bg-teal-50',
            borderColor: 'border-teal-100',
            description: "エンジニアのための実践的英語力。ドキュメント読解から技術的な議論まで。",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="p-6 md:p-12 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-700 mb-2 tracking-tight">
                    Learning Content
                </h1>
                <p className="text-slate-500">
                    興味のある分野を選択して、学習を開始してください。
                </p>
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portals.map((portal) => (
                    <div
                        key={portal.id}
                        onClick={() => onNavigate(portal.view)}
                        className={`
                          group relative bg-white rounded-2xl p-0 cursor-pointer
                          border ${portal.borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1
                          transition-all duration-300 overflow-hidden flex flex-col h-[280px]
                        `}
                    >
                        {/* Image Header Area (Height 45%) */}
                        <div className="h-[45%] w-full relative overflow-hidden bg-slate-100">
                            <img
                                src={portal.image}
                                alt={portal.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-white via-transparent opacity-80`}></div>

                            {/* Floating Icon Badge */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm p-2 rounded-lg text-slate-700 group-hover:scale-110 transition-transform">
                                <portal.icon size={20} className={portal.color} />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 relative">
                            <div className="mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider text-slate-500 bg-opacity-10 px-2 py-0.5 rounded-full ${portal.bg}`}>
                                    {portal.subtitle}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-700 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                                {portal.title}
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                {portal.description}
                            </p>

                            <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Aptitude Test Banner (Optional, keeping it clean for now) */}
            <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between shadow-sm gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">学習パス診断</h3>
                        <p className="text-slate-500 text-sm">あなたの興味とスキルに最適なカリキュラムを提案します。</p>
                    </div>
                </div>
                <button className="whitespace-nowrap bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                    診断を受ける
                </button>
            </div>
        </div>
    );
};

// Helper Icon for standard web
const GlobeIcon = ({ size, className }: { size: number, className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export default LearningHub;
