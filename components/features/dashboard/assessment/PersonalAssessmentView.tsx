
import React, { useState, useEffect } from 'react';
import { ViewState, Big5Profile, AssessmentProfile, PersonalityType } from '../../../../types';
import PersonalityAssessment from './PersonalityAssessment';
import IntroSequence from './IntroSequence';
import ComprehensiveResults from './ComprehensiveResults';
import { analyzePersonality } from '../../../../services/geminiService';
import { useTheme } from '../../../../context/ThemeContext';
import { Loader2, Sparkles } from 'lucide-react';

interface PersonalAssessmentViewProps {
  onNavigate: (view: ViewState) => void;
}

enum Step {
  ASSESSMENT = 'ASSESSMENT',
  ANALYZING = 'ANALYZING',
  INTRO = 'INTRO',
  RESULTS = 'RESULTS'
}

const PersonalAssessmentView: React.FC<PersonalAssessmentViewProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<Step>(Step.ASSESSMENT);
  const [scores, setScores] = useState<Big5Profile | null>(null);
  const [profile, setProfile] = useState<AssessmentProfile | null>(null);
  const { setProfile: setGlobalProfile } = useTheme();

  const handleAssessmentComplete = async (finalScores: Big5Profile) => {
    setScores(finalScores);
    setStep(Step.ANALYZING);

    try {
      // Gemini API で分析を実行
      const advice = await analyzePersonality(finalScores);
      
      const newProfile: AssessmentProfile = {
        scores: finalScores,
        personalityType: advice.personalityType as PersonalityType,
        learningStyle: advice.learningStrategy.title,
        motivation: advice.learningStrategy.approach,
        completedAt: new Date().toISOString(),
        aiAdvice: advice
      };

      setProfile(newProfile);
      setGlobalProfile(finalScores); // グローバルな性格設定を更新
      setStep(Step.INTRO);
    } catch (error) {
      console.error("Personality analysis failed:", error);
      // フォールバック
      setStep(Step.RESULTS); 
    }
  };

  if (step === Step.ASSESSMENT) {
    return (
      <div className="min-h-screen pt-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">AI Identity Scan</h1>
          <p className="text-slate-500 max-w-lg mx-auto font-medium">
            あなたの深層心理を分析し、最適な学習アルゴリズムを構築します。
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
          <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-amber-400 animate-bounce" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">分析プロトコル実行中...</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Deep Neural Insight Pattern Analysis in Progress
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
        <ComprehensiveResults profile={profile} onRestart={() => setStep(Step.ASSESSMENT)} />
      </div>
    );
  }

  return null;
};

export default PersonalAssessmentView;
