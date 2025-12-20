import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Zap, BrainCircuit, Loader2, Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { generateCourse, getMockBlenderCourse } from '../../../services/geminiService';
import { GeneratedCourse, Big5Profile, AssessmentProfile, ViewState } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { STORAGE_KEY } from '../dashboard/assessment/assessmentConstants';

interface CourseGeneratorViewProps {
  onBack: () => void;
  onCourseGenerated: (course: GeneratedCourse) => void;
  onNavigate?: (view: ViewState) => void;
}

const CourseGeneratorView: React.FC<CourseGeneratorViewProps> = ({ onBack, onCourseGenerated, onNavigate }) => {
  const { profile: globalProfile } = useTheme();
  const [topic, setTopic] = useState('');
  const [modelType, setModelType] = useState<'standard' | 'pro'>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [assessment, setAssessment] = useState<AssessmentProfile | null>(null);

  // Load assessment results on mount
  useEffect(() => {
    const savedStr = localStorage.getItem(STORAGE_KEY);
    if (savedStr) {
      try {
        const parsed: AssessmentProfile = JSON.parse(savedStr);
        setAssessment(parsed);
      } catch (e) {
        console.error("Failed to load assessment", e);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);

    // DEMO MODE: If user types "demo", return the mock Blender course
    if (topic.trim().toLowerCase() === 'demo') {
        setTimeout(() => {
            const mockCourse = getMockBlenderCourse();
            onCourseGenerated(mockCourse);
            setIsGenerating(false);
        }, 1500);
        return;
    }

    try {
            // Use saved scores if available, otherwise default to balanced
            const profileToUse: Big5Profile = assessment?.scores || {
                openness: 50,
                conscientiousness: 50,
                extraversion: 50,
                agreeableness: 50,
                neuroticism: 50,
            };

            const course = await generateCourse(topic, modelType, profileToUse);
            onCourseGenerated(course);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate course.');
    } finally {
      if (topic.trim().toLowerCase() !== 'demo') {
         setIsGenerating(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Library
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-indigo-200">
              <Sparkles size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Personalized Course Generator</h1>
            <p className="text-slate-500 text-lg">
              あなたの性格診断結果に基づき、AIが最適な学習パスをオーダーメイドします。
            </p>
          </div>

          <div className="space-y-10">
            {/* Assessment Status Badge */}
            {assessment ? (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Brain className="text-indigo-600 w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-500">Analysis Active</span>
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">タイプ: {assessment.personalityType}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {assessment.learningStyle} を反映した{assessment.scores.openness > 70 ? '創造的で概念的な' : '具体的で実用的な'}解説スタイルを適用します。
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-amber-900 mb-1">性格診断が未完了です</h3>
                  <p className="text-sm text-amber-700">
                    診断を受けることで、より精度の高いパーソナライズが可能になります。
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate?.(ViewState.AI_DIAGNOSIS)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shrink-0"
                >
                  診断を受ける <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Input */}
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-slate-400">
                何を学びたいですか？
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例: 量子コンピューティング、フランス料理、Rustプログラミング..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Model Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setModelType('standard')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  modelType === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-inner'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={20} className={modelType === 'standard' ? 'text-indigo-600' : 'text-slate-400'} />
                  <span className={`font-black uppercase tracking-widest text-xs ${modelType === 'standard' ? 'text-indigo-900' : 'text-slate-600'}`}>Standard</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Gemini 2.5 Flash. 一般的トピック向け。高速かつ効率的。</p>
              </button>

              <button
                onClick={() => setModelType('pro')}
                className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                  modelType === 'pro'
                    ? 'border-purple-600 bg-purple-50/50 shadow-inner'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit size={20} className={modelType === 'pro' ? 'text-purple-600' : 'text-slate-400'} />
                  <span className={`font-black uppercase tracking-widest text-xs ${modelType === 'pro' ? 'text-purple-900' : 'text-slate-600'}`}>Reasoning Pro</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Gemini 3.0 Pro. 複雑な主題向けの深い推論。</p>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm text-center font-bold">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl ${
                isGenerating || !topic.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  GENERICATING CURRICULUM...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  カリキュラムを生成
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseGeneratorView;
