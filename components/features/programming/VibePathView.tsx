import React from 'react';
import {
  ArrowLeft, CheckCircle2, Lock, Play, Star, MapPin,
  Sparkles, Monitor, Brain, Terminal, Zap, Globe, MessageSquare,
  ArrowRight, Calendar, User
} from 'lucide-react';
import { ViewState } from '../../../types';

interface VibePathViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  language: 'en' | 'jp';
  setLanguage: (lang: 'en' | 'jp') => void;
}

const VibePathView: React.FC<VibePathViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {

  const content = {
    en: {
      back: "Back to Campus",
      tag: "Vibe Coding Path",
      title: "Orchestrating Intelligence",
      subtitle: "Master the art of directing AI to build software. No memorization required.",
      progressTitle: "Track Status",
      level: "Intermediate",
      time: "12 Hours",
      chapters: [
        {
          id: 'prologue',
          title: 'Prologue: The Paradigm Shift',
          desc: 'Understand the mindset. Why coding is dead, and long live coding.',
          duration: "45 min",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'ch1',
          title: 'Chapter 1: The Power of Speech',
          desc: 'Prompt Engineering Lab. Learn "Role", "Context", and "Vibe".',
          duration: "90 min",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'ch2',
          title: 'Chapter 2: The Cockpit',
          desc: 'Cloud vs. Local, VSCode basics, and dancing with Copilot.',
          duration: "120 min",
          image: "https://images.unsplash.com/photo-1607799275518-d79f278ec964?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'ch3',
          title: 'Chapter 3: The World (GitHub)',
          desc: 'Time machines, Save points, and the infinite library of Open Source.',
          duration: "150 min",
          image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=800"
        },
      ]
    },
    jp: {
      back: "キャンパスに戻る",
      tag: "バイブコーディング・パス",
      title: "知性のオーケストレーション",
      subtitle: "AIを指揮してソフトウェアを構築する技術。暗記は不要です。",
      progressTitle: "コース進捗",
      level: "中級",
      time: "12時間",
      chapters: [
        {
          id: 'prologue',
          title: 'プロローグ：パラダイムシフト',
          desc: 'マインドセットを理解する。なぜ「コーディング」は死に、新たに生まれ変わるのか。',
          duration: "45分",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'ch1',
          title: '第1章：言葉の力',
          desc: 'プロンプトエンジニアリング研究所。「役割」「文脈」「バイブ」を学ぶ。',
          duration: "90分",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'ch2',
          title: '第2章：コックピット',
          desc: 'クラウド vs ローカル。VSCodeの基礎と、Copilotとのダンス。',
          duration: "120分",
          image: "https://images.unsplash.com/photo-1607799275518-d79f278ec964?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 'ch3',
          title: '第3章：ザ・ワールド (GitHub)',
          desc: 'タイムマシン、セーブポイント、そして無限のオープンソース図書館。',
          duration: "150分",
          image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=800"
        },
      ]
    }
  };

  const t = content[language];

  // Map static data to translated content
  const chapters = [
    {
      ...t.chapters[0],
      status: 'completed',
      view: ViewState.VIBE_PROLOGUE,
    },
    {
      ...t.chapters[1],
      status: 'completed',
      view: ViewState.VIBE_CHAPTER_1,
    },
    {
      ...t.chapters[2],
      status: 'completed',
      view: ViewState.VIBE_CHAPTER_2,
    },
    {
      ...t.chapters[3],
      status: 'current',
      view: ViewState.VIBE_CHAPTER_3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-600 pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1600"
          alt="Vibe Coding Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-[2px]"></div>

        <div className="absolute inset-0 flex flex-col justify-center max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-start w-full mb-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> {t.back}
            </button>

            {/* Language Toggle */}
            <div className="flex bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/20">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-purple-900' : 'text-purple-100 hover:text-white'}`}>EN</button>
              <button onClick={() => setLanguage('jp')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'jp' ? 'bg-white text-purple-900' : 'text-purple-100 hover:text-white'}`}>JP</button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-900/20">
              {t.tag}
            </div>
            <span className="text-purple-100/90 text-sm font-mono tracking-wider">CHAPTER 3 / 4</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{t.title}</h1>
          <p className="text-purple-100 max-w-2xl text-lg leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Learning Highlights (Inserted) */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: MessageSquare,
            title: language === 'en' ? "Prompt Engineering" : "プロンプトエンジニアリング",
            desc: language === 'en' ? "Master the art of communicating with AI." : "AIと対話する技術を極める。"
          },
          {
            icon: Zap,
            title: language === 'en' ? "AI-Native Editors" : "AIネイティブエディタ",
            desc: language === 'en' ? "Cursor & Copilot workflow mastery." : "CursorとCopilotを使いこなす。"
          },
          {
            icon: Globe,
            title: language === 'en' ? "Open Source" : "オープンソース世界",
            desc: language === 'en' ? "Understand the global ecosystem." : "世界の共有知のエコシステムを理解。"
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/90 backdrop-blur-sm border border-purple-100 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg shrink-0">
              <item.icon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm mb-0.5">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar (Floating) - Removed negative margin to float below highlights naturally */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg shadow-purple-200/50 border border-purple-100 flex items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.progressTitle}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-purple-600">75%</span>
                <span className="text-xs text-slate-400 font-medium">COMPLETED</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="hidden md:flex gap-8 border-l border-slate-100 pl-8">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">Time</div>
              <div className="font-medium text-slate-700">{t.time}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">Level</div>
              <div className="font-medium text-slate-700">{t.level}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-200/80"></div>

          <div className="space-y-8">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="relative flex gap-8 group">
                {/* Status Icon */}
                <div className={`
                            relative z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-all duration-300 bg-white
                            ${chapter.status === 'completed' ? 'border-purple-500 text-purple-500' : ''}
                            ${chapter.status === 'current' ? 'border-purple-500 text-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.15)] scale-110' : ''}
                            ${chapter.status === 'locked' ? 'border-slate-200 text-slate-300' : ''}
                        `}>
                  {chapter.status === 'completed' && <CheckCircle2 size={24} className="fill-purple-50" />}
                  {chapter.status === 'current' && <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>}
                  {chapter.status === 'locked' && <Lock size={20} />}
                </div>

                {/* Content Card */}
                <div className={`flex-1 transition-all duration-300 ${chapter.status === 'current' ? 'transform -translate-y-1' : 'opacity-80 hover:opacity-100'}`}>
                  <div
                    onClick={() => chapter.status !== 'locked' && chapter.view && onNavigate(chapter.view)}
                    className={`
                                    group/card rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col md:flex-row h-full md:h-40
                                    ${chapter.status === 'current'
                        ? 'bg-white border-purple-200/80 shadow-xl shadow-purple-100/40 cursor-pointer hover:border-purple-300 hover:shadow-purple-100/60'
                        : 'bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-100'}
                                    ${chapter.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                                `}
                  >
                    {/* Image Section */}
                    <div className="w-full md:w-48 relative overflow-hidden shrink-0">
                      <img
                        src={chapter.image}
                        alt={chapter.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${chapter.status === 'locked' ? 'grayscale opacity-70' : 'group-hover/card:scale-110'}`}
                      />
                      {/* Overlay for locked items */}
                      {chapter.status === 'locked' && <div className="absolute inset-0 bg-slate-100/50 backdrop-grayscale"></div>}

                      {/* Current Label on Image */}
                      {chapter.status === 'current' && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-purple-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                          NOW LIVE
                        </div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 p-5 flex flex-col justify-center relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg tracking-tight ${chapter.status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
                          {chapter.title}
                          {chapter.status === 'completed' && <span className="ml-2 text-xs font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full align-middle">Done</span>}
                        </h3>
                      </div>

                      <p className={`text-sm leading-relaxed line-clamp-2 md:line-clamp-none ${chapter.status === 'locked' ? 'text-slate-400' : 'text-slate-500'} mb-3`}>
                        {chapter.desc}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${chapter.status === 'locked' ? 'text-slate-300' : 'text-slate-400'}`}>
                          <Calendar size={12} /> {chapter.duration}
                        </span>

                        {chapter.status === 'current' ? (
                          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm bg-purple-50 px-4 py-2 rounded-lg group-hover/card:bg-purple-500 group-hover/card:text-white transition-all">
                            Start <ArrowRight size={16} />
                          </div>
                        ) : (
                          chapter.status === 'completed' && (
                            <div className="w-8 h-8 rounded-full bg-slate-50 text-purple-600 flex items-center justify-center">
                              <CheckCircle2 size={16} />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibePathView;