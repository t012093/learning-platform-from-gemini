import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
  ArrowRight, Terminal, Globe, Cpu, Box,
  Sparkles, CheckCircle, Flame
} from 'lucide-react';
import { ViewState } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('default');
  }, [setTheme]);

  // Simplified Activity Data
  const activityData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 20 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 30 },
  ];

  return (
    <div className="p-6 md:p-12 max-w-[1200px] mx-auto min-h-screen space-y-12">

      {/* 1. Header & Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, Alex</h1>
          <p className="text-slate-500">Ready to build something amazing today?</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-orange-100">
          <Flame size={16} className="fill-orange-600" />
          3 Day Streak
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
                In Progress
              </span>
              <span className="text-slate-400 text-sm">Chapter 3 / 5</span>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                The Engine (GitHub)
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                Master the OSS ecosystem. Input Wait is your Canvas, and the world is your library.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center gap-2">
                Continue <ArrowRight size={18} />
              </button>
              <div className="text-slate-500 text-sm font-medium">
                ~ 25 mins remaining
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
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Explore Pathways</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <DashboardCard
            title="Web Basics"
            icon={Globe}
            color="text-cyan-500"
            bgColor="bg-cyan-50"
            borderColor="border-cyan-100"
            onClick={() => onNavigate(ViewState.PROGRAMMING_WEB)}
          />

          <DashboardCard
            title="Vibe Coding"
            icon={Sparkles}
            color="text-purple-500"
            bgColor="bg-purple-50"
            borderColor="border-purple-100"
            onClick={() => onNavigate(ViewState.PROGRAMMING_VIBE)}
            active
          />

          <DashboardCard
            title="Gen AI Camp"
            icon={Cpu}
            color="text-yellow-500"
            bgColor="bg-yellow-50"
            borderColor="border-yellow-100"
            onClick={() => onNavigate(ViewState.PROGRAMMING_AI)}
          />

          <DashboardCard
            title="3D Lab"
            icon={Box}
            color="text-orange-500"
            bgColor="bg-orange-50"
            borderColor="border-orange-100"
            onClick={() => onNavigate(ViewState.BLENDER)}
          />

        </div>
      </div>

      {/* 4. Simple Activity Chart */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-800 font-bold">Learning Activity</h3>
          <span className="text-sm text-slate-400">Total 2.5 hours this week</span>
        </div>
        <div className="h-[100px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <Line type="monotone" dataKey="count" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4, fill: '#cbd5e1', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#6366f1' }} />
              <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} itemStyle={{ color: 'white' }} cursor={false} />
            </LineChart>
          </ResponsiveContainer>
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