import React, { useEffect } from 'react';
import {
    Terminal, Box, Palette, Activity, BookOpen,
    Sparkles, Cpu, ArrowRight, Gamepad2
} from 'lucide-react';
import { ViewState } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

interface LearningHubProps {
    onNavigate: (view: ViewState) => void;
}

const LearningHub: React.FC<LearningHubProps> = ({ onNavigate }) => {
    const { setTheme } = useTheme();
    const { language } = useLanguage();

    useEffect(() => {
        setTheme('default');
    }, [setTheme]);

    const copy = {
        en: {
            headerTitle: 'Learning Content',
            headerSubtitle: 'Select a field to start learning.',
            portals: {
                web: {
                    title: 'Web Basics',
                    subtitle: 'Web Development Fundamentals',
                    description: 'From HTML, CSS, and React basics to modern UI build workflows.'
                },
                ai: {
                    title: 'Gen AI Camp',
                    subtitle: 'Generative AI & Python',
                    description: 'Learn how LLMs work and build AI apps with Python.'
                },
                vibe: {
                    title: 'Vibe Coding',
                    subtitle: 'Immersive Coding Experience',
                    description: 'Story-driven learning through Git and OSS.'
                },
                blender: {
                    title: 'Blender 3D',
                    subtitle: '3D Modeling',
                    description: 'Basics of 3D creation and spatial design with Blender.'
                },
                teacherBot: {
                    title: 'Teacher Bot Live',
                    subtitle: 'Blender Sidecar',
                    description: 'Sync the current Blender step on a big screen.'
                },
                art: {
                    title: 'Art Atelier',
                    subtitle: 'Art History & Philosophy',
                    description: 'Explore the history and theory of visual arts.'
                },
                english: {
                    title: 'Global Communication',
                    subtitle: 'Practical English & Cross-cultural',
                    description: 'Practical English for engineers, from docs to technical discussions.'
                },
                scratch: {
                    title: 'Scratch game',
                    subtitle: 'Block Coding RPG',
                    description: 'Learn programming by building battle scripts with Scratch-style blocks.'
                },
                unity: {
                    title: 'Unity AI Game Dev',
                    subtitle: 'AI x Unity Game Dev',
                    description: 'Develop games using Unity and AI. Learn the role of an architect.'
                }
            },
            bannerTitle: 'Learning Path Diagnosis',
            bannerSubtitle: 'We recommend a curriculum tailored to your interests and skills.',
            bannerCta: 'Take the Assessment'
        },
        jp: {
            headerTitle: '学習コンテンツ',
            headerSubtitle: '興味のある分野を選択して、学習を開始してください。',
            portals: {
                web: {
                    title: 'Web Basics',
                    subtitle: 'Web開発の基礎',
                    description: 'HTML, CSS, Reactの基礎からモダンなUI構築まで。'
                },
                ai: {
                    title: 'Gen AI Camp',
                    subtitle: '生成AI & Python',
                    description: 'LLMの仕組みとPythonによるAIアプリケーション開発。'
                },
                vibe: {
                    title: 'Vibe Coding',
                    subtitle: '没入型コード体験',
                    description: 'GitとOSSの世界を冒険する、新感覚のストーリー学習。'
                },
                blender: {
                    title: 'Blender 3D',
                    subtitle: '3Dモデリング',
                    description: 'Blenderを使った3DCG制作と空間デザインの基礎。'
                },
                teacherBot: {
                    title: 'Teacher Bot Live',
                    subtitle: 'Blender サイドカー',
                    description: 'Blenderの現在ステップを大画面で同期表示。'
                },
                art: {
                    title: 'Art Atelier',
                    subtitle: '美術史 & 哲学',
                    description: '視覚芸術の歴史と理論。クリエイティブの源泉を探る。'
                },
                english: {
                    title: 'Global Communication',
                    subtitle: '実践英語 & 異文化理解',
                    description: 'エンジニアのための実践的英語力。ドキュメント読解から技術的な議論まで。'
                },
                scratch: {
                    title: 'Scratch game',
                    subtitle: 'ブロックプログラミングRPG',
                    description: 'Scratchブロックでバトルの作戦を組み、遊びながらプログラミングを学ぶ。'
                },
                unity: {
                    title: 'Unity AI Game Dev',
                    subtitle: 'AI x Unity ゲーム開発',
                    description: 'AIと共にUnityでゲームを作る。コードを書くのではなく、設計する力を養う。'
                }
            },
            bannerTitle: '学習パス診断',
            bannerSubtitle: 'あなたの興味とスキルに最適なカリキュラムを提案します。',
            bannerCta: '診断を受ける'
        }
    } as const;

    const t = copy[language];

    const portals = [
        {
            id: 'web',
            title: t.portals.web.title,
            subtitle: t.portals.web.subtitle,
            icon: GlobeIcon,
            view: ViewState.PROGRAMMING_WEB,
            color: 'text-cyan-500',
            bg: 'bg-cyan-50',
            borderColor: 'border-cyan-100',
            description: t.portals.web.description,
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'ai',
            title: t.portals.ai.title,
            subtitle: t.portals.ai.subtitle,
            icon: Cpu,
            view: ViewState.PROGRAMMING_AI,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50',
            borderColor: 'border-yellow-100',
            description: t.portals.ai.description,
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'vibe',
            title: t.portals.vibe.title,
            subtitle: t.portals.vibe.subtitle,
            icon: Sparkles,
            view: ViewState.PROGRAMMING_VIBE,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            borderColor: 'border-purple-100',
            description: t.portals.vibe.description,
            image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'scratch-game',
            title: t.portals.scratch.title,
            subtitle: t.portals.scratch.subtitle,
            icon: Gamepad2,
            view: ViewState.P_SCHOOL,
            color: 'text-green-600',
            bg: 'bg-green-50',
            borderColor: 'border-green-100',
            description: t.portals.scratch.description,
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'unity',
            title: t.portals.unity.title,
            subtitle: t.portals.unity.subtitle,
            icon: Gamepad2,
            view: ViewState.UNITY_AI_GAME_DEV,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100',
            description: t.portals.unity.description,
            image: "https://images.unsplash.com/photo-1596727147705-54a9d0a514d7?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: '3d',
            title: t.portals.blender.title,
            subtitle: t.portals.blender.subtitle,
            icon: Box,
            view: ViewState.BLENDER,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            borderColor: 'border-orange-100',
            description: t.portals.blender.description,
            image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'teacher-bot-live',
            title: t.portals.teacherBot.title,
            subtitle: t.portals.teacherBot.subtitle,
            icon: Terminal,
            view: ViewState.TEACHER_BOT_LIVE,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            description: t.portals.teacherBot.description,
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'art',
            title: t.portals.art.title,
            subtitle: t.portals.art.subtitle,
            icon: Palette,
            view: ViewState.ART_MUSEUM,
            color: 'text-stone-600',
            bg: 'bg-stone-100',
            borderColor: 'border-stone-200',
            description: t.portals.art.description,
            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 'english',
            title: t.portals.english.title,
            subtitle: t.portals.english.subtitle,
            icon: BookOpen,
            view: ViewState.COURSES,
            color: 'text-teal-500',
            bg: 'bg-teal-50',
            borderColor: 'border-teal-100',
            description: t.portals.english.description,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="p-6 md:p-12 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-700 mb-2 tracking-tight">
                    {t.headerTitle}
                </h1>
                <p className="text-slate-500">
                    {t.headerSubtitle}
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
                        <h3 className="font-bold text-slate-800">{t.bannerTitle}</h3>
                        <p className="text-slate-500 text-sm">{t.bannerSubtitle}</p>
                    </div>
                </div>
                <button className="whitespace-nowrap bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                    {t.bannerCta}
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
