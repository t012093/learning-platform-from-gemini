
import React, { useState, useEffect } from 'react';
import { ViewState, Big5Profile, AssessmentProfile, PersonalityType } from '../../../../types';
import PersonalityAssessment from './PersonalityAssessment';
import IntroSequence from './IntroSequence';
import ComprehensiveResults from './ComprehensiveResults';
import { analyzePersonality } from '../../../../services/geminiService';
import { useTheme } from '../../../../context/ThemeContext';
import { Loader2, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { STORAGE_KEY } from './assessmentConstants';

interface PersonalAssessmentViewProps {
  onNavigate: (view: ViewState) => void;
}

enum Step {
  OVERVIEW = 'OVERVIEW',
  ASSESSMENT = 'ASSESSMENT',
  ANALYZING = 'ANALYZING',
  INTRO = 'INTRO',
  RESULTS = 'RESULTS'
}

const PersonalAssessmentView: React.FC<PersonalAssessmentViewProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<Step>(Step.OVERVIEW);
  const [profile, setProfile] = useState<AssessmentProfile | null>(null);
  const { setProfile: setGlobalProfile } = useTheme();

  // 初回ロード時に保存された診断結果を読み込む
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedProfile = JSON.parse(saved);
        setProfile(parsedProfile);
        setGlobalProfile(parsedProfile.scores);
        setStep(Step.RESULTS);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
  }, [setGlobalProfile]);

  const handleAssessmentComplete = async (finalScores: Big5Profile) => {
    setStep(Step.ANALYZING);

    try {
      // Gemini API で分析を実行
      const advice = await analyzePersonality(finalScores);
      
      const newProfile: AssessmentProfile = {
        scores: finalScores,
        personalityType: (advice?.personalityType || 'バランサー') as PersonalityType,
        learningStyle: advice?.learningStrategy?.title || 'バランス型学習',
        motivation: advice?.learningStrategy?.approach || '継続的な改善',
        completedAt: new Date().toISOString(),
        aiAdvice: advice
      };

      // 保存
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      setGlobalProfile(finalScores); // グローバルな性格設定を更新
      setStep(Step.INTRO);
    } catch (error) {
      console.error("Personality analysis failed:", error);
      // エラー時も最低限のプロファイルを作成して結果画面を表示（無限ロード回避）
      const fallbackProfile: AssessmentProfile = {
        scores: finalScores,
        personalityType: 'バランサー',
        learningStyle: '標準学習モード',
        motivation: '安定した成長',
        completedAt: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
      setStep(Step.RESULTS); 
    }
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setStep(Step.ASSESSMENT);
  };

  if (step === Step.OVERVIEW) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white/95 rounded-[2.5rem] p-10 text-center shadow-2xl border border-white/40">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl mx-auto mb-10 flex items-center justify-center text-4xl text-white shadow-xl">
             <Sparkles className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">AI学習診断プログラム</h1>
          <p className="text-slate-600 mb-10 leading-relaxed font-medium text-lg">
            あなたの潜在能力を可視化し、脳の特性に最もフィットするパーソナライズされたカリキュラムを構築します。
          </p>
          <button 
            onClick={() => setStep(Step.ASSESSMENT)}
            className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center space-x-3 group"
          >
            <span>分析を開始する</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Powered by Gemini 2.5 Flash • Big Five Matrix
          </p>
        </div>
      </div>
    );
  }

  if (step === Step.ASSESSMENT) {
    return (
      <div className="min-h-screen pt-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">AI Identity Scan</h1>
          <p className="text-slate-500 max-w-lg mx-auto font-bold text-xs uppercase tracking-widest opacity-60">
            Deep Neural Insight Pattern Analysis in Progress
          </p>
        </div>
        <PersonalityAssessment onComplete={handleAssessmentComplete} />
      </div>
    );
  }

  if (step === Step.ANALYZING) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-indigo-50">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
          <Brain className="absolute -top-4 -right-4 w-10 h-10 text-amber-400 animate-bounce" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">分析プロトコル実行中...</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Constructing Personalized Learning Neural Network
          </p>
          <div className="max-w-md mx-auto pt-8">
             <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 animate-[progress_3s_ease-in-out_infinite]"></div>
             </div>
          </div>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 50%; transform: translateX(50%); }
            100% { width: 0%; transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  if (step === Step.INTRO && profile) {
    return <IntroSequence profile={profile} onFinish={() => setStep(Step.RESULTS)} />;
  }

  if (step === Step.RESULTS && profile) {
    return (
      <div className="pt-8">
        <ComprehensiveResults profile={profile} onRestart={handleRestart} />
      </div>
    );
  }

  return null;
};

export default PersonalAssessmentView;
