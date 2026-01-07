import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
  ArrowRight, Terminal, Globe, Cpu, Box,
  Sparkles, CheckCircle, Flame, BrainCircuit, Gamepad2
} from 'lucide-react';
import { ViewState } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { setTheme } = useTheme();
  const { language } = useLanguage();
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setTheme('default');
  }, [setTheme]);

  // Avoid rendering chart until client side & container has size
  useEffect(() => {
    setChartReady(true);
  }, []);

  const copy = {
    en: {
      welcomeTitle: 'Welcome back, Alex',
      welcomeSubtitle: 'Ready to build something amazing today?',
      streak: '3 Day Streak',
      inProgress: 'In Progress',
      chapterProgress: 'Chapter 3 / 5',
      focusTitle: 'The Engine (GitHub)',
      focusDescription: 'Master the OSS ecosystem. Input Wait is your Canvas, and the world is your library.',
      continue: 'Continue',
      timeRemaining: '~ 25 mins remaining',
      explorePathways: 'Explore Pathways',
      webBasics: 'Web Basics',
      vibeCoding: 'Vibe Coding',
      genAiCamp: 'Gen AI Camp',
      blenderLab: '3D Lab',
      aiGenerator: 'AI Generator',
      activityTitle: 'Learning Activity',
      activityTotal: 'Total 2.5 hours this week',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    jp: {
      welcomeTitle: 'おかえりなさい、Alex',
      welcomeSubtitle: '今日も最高のものを作ろう。',
      streak: '3日連続',
      inProgress: '進行中',
      chapterProgress: '第3章 / 5',
      focusTitle: 'The Engine (GitHub)',
      focusDescription: 'OSSのエコシステムをマスター。Input Wait をキャンバスに、世界をあなたのライブラリに。',
      continue: '続ける',
      timeRemaining: '残り約25分',
      explorePathways: '学習パスを探す',
      webBasics: 'Web基礎',
      vibeCoding: 'Vibe Coding',
      genAiCamp: '生成AIキャンプ',
      blenderLab: '3Dラボ',
      aiGenerator: 'AI生成',
      activityTitle: '学習アクティビティ',
      activityTotal: '今週合計 2.5 時間',
      days: ['月', '火', '水', '木', '金', '土', '日']
    }
  } as const;

  const t = copy[language];

  // Simplified Activity Data
  const activityData = t.days.map((day, index) => ({
    day,
    count: [12, 18, 15, 25, 20, 8, 30][index]
  }));

  return (
    <div className="p-6 md:p-12 max-w-[1200px] mx-auto min-h-screen space-y-12">

      {/* 1. Header & Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.welcomeTitle}</h1>
          <p className="text-slate-500">{t.welcomeSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-orange-100">
          <Flame size={16} className="fill-orange-600" />
          {t.streak}
        </div>
      </div>

      {/* 2. Primary Focus: Continue Learning */}
      <div
        onClick={() => onNavigate(ViewState.VIBE_PATH)}
        className="group relative w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl cursor-pointer hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">

          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {t.inProgress}
              </span>
              <span className="text-slate-400 text-sm">{t.chapterProgress}</span>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {t.focusTitle}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                {t.focusDescription}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center gap-2">
                {t.continue} <ArrowRight size={18} />
              </button>
              <div className="text-slate-500 text-sm font-medium">
                {t.timeRemaining}
              </div>
            </div>
          </div>

          {/* Minimal Progress Visual */}
          <div className="shrink-0 relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="#334155" strokeWidth="8" fill="transparent" />
              <circle cx="64" cy="64" r="60" stroke="#9333ea" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset="100" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-2xl font-bold">75%</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Pathways (Simple Grid) */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t.explorePathways}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <DashboardCard
            title={t.webBasics}
            icon={Globe}
            color="text-cyan-500"
            bgColor="bg-cyan-50"
            borderColor="border-cyan-100"
            onClick={() => onNavigate(ViewState.PROGRAMMING_WEB)}
          />

          <DashboardCard
            title={t.vibeCoding}
            icon={Sparkles}
            color="text-purple-500"
            bgColor="bg-purple-50"
            borderColor="border-purple-100"
            onClick={() => onNavigate(ViewState.PROGRAMMING_VIBE)}
            active
          />

          <DashboardCard
            title={t.genAiCamp}
            icon={Cpu}
            color="text-yellow-500"
            bgColor="bg-yellow-50"
            borderColor="border-yellow-100"
            onClick={() => onNavigate(ViewState.PROGRAMMING_AI)}
          />

          <DashboardCard
            title={t.blenderLab}
            icon={Box}
            color="text-orange-500"
            bgColor="bg-orange-50"
            borderColor="border-orange-100"
            onClick={() => onNavigate(ViewState.BLENDER)}
          />

          <DashboardCard
            title={t.aiGenerator}
            icon={BrainCircuit}
            color="text-indigo-500"
            bgColor="bg-indigo-50"
            borderColor="border-indigo-100"
            onClick={() => onNavigate(ViewState.COURSE_GENERATOR)}
          />

          <DashboardCard
            title="P-School"
            icon={Gamepad2}
            color="text-green-500"
            bgColor="bg-green-50"
            borderColor="border-green-100"
            onClick={() => onNavigate(ViewState.P_SCHOOL)}
          />

        </div>
      </div>

      {/* 4. Simple Activity Chart */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-800 font-bold">{t.activityTitle}</h3>
          <span className="text-sm text-slate-400">{t.activityTotal}</span>
        </div>
        <div className="h-[120px] w-full min-w-[260px]">
          {chartReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={120}>
              <LineChart data={activityData}>
                <Line type="monotone" dataKey="count" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4, fill: '#cbd5e1', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#6366f1' }} />
                <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} itemStyle={{ color: 'white' }} cursor={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
};

// Helper Sub-component for Cards
const DashboardCard = ({ title, icon: Icon, color, bgColor, borderColor, onClick, active }: any) => (
  <div
    onClick={onClick}
    className={`
      p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center gap-3 text-center h-40
      ${active ? 'bg-white border-purple-200 shadow-sm ring-2 ring-purple-500/10' : 'bg-white border-slate-200 hover:border-slate-300'}
    `}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor} ${color}`}>
      <Icon size={24} />
    </div>
    <span className={`font-bold ${active ? 'text-slate-800' : 'text-slate-600'}`}>{title}</span>
  </div>
);

export default Dashboard;
