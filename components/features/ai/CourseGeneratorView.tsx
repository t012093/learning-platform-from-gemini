import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Zap, BrainCircuit, Loader2, User, Book, Dna, Feather, Heart } from 'lucide-react';
import { generateCourse, getMockBlenderCourse } from '../../../services/geminiService';
import { GeneratedCourse, Big5Profile } from '../../../types';

interface CourseGeneratorViewProps {
  onBack: () => void;
  onCourseGenerated: (course: GeneratedCourse) => void;
}

const CourseGeneratorView: React.FC<CourseGeneratorViewProps> = ({ onBack, onCourseGenerated }) => {
  const [topic, setTopic] = useState('');
  const [modelType, setModelType] = useState<'standard' | 'pro'>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Big5Profile>({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handlePresetSelect = (preset: 'artist' | 'scientist' | 'teacher' | 'entrepreneur' | 'balanced') => {
    switch (preset) {
      case 'artist':
        setUserProfile({ openness: 90, conscientiousness: 40, extraversion: 60, agreeableness: 70, neuroticism: 30 });
        break;
      case 'scientist':
        setUserProfile({ openness: 80, conscientiousness: 90, extraversion: 40, agreeableness: 50, neuroticism: 60 });
        break;
      case 'teacher':
        setUserProfile({ openness: 70, conscientiousness: 80, extraversion: 70, agreeableness: 85, neuroticism: 40 });
        break;
      case 'entrepreneur':
        setUserProfile({ openness: 75, conscientiousness: 85, extraversion: 80, agreeableness: 40, neuroticism: 55 });
        break;
      case 'balanced':
      default:
        setUserProfile({ openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 });
        break;
    }
  };

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
        }, 1500); // Fake delay for realism
        return;
    }

    try {
      const course = await generateCourse(topic, modelType, userProfile);
      onCourseGenerated(course);
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('Failed to generate course. Please try again.');
      }
    } finally {
      if (topic.trim().toLowerCase() !== 'demo') {
         setIsGenerating(false);
      }
    }
  };

  const renderSlider = (name: keyof Big5Profile, label: string, Icon: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
        <Icon size={16} className="text-indigo-500" /> {label}: <span className="font-bold">{userProfile[name]}</span>
      </label>
      <input
        type="range"
        min="0"
        max="100"
        name={name}
        value={userProfile[name]}
        onChange={handleSliderChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Library
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <Sparkles size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">AI Course Generator</h1>
            <p className="text-slate-500">
              トピックを入力し、あなたの学習スタイルに合わせてパーソナライズされたカリキュラムを作成します。
            </p>
          </div>

          <div className="space-y-8">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                何を学びたいですか？
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例: 量子コンピューティング、フランス料理、Rustプログラミング..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Model Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setModelType('standard')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  modelType === 'standard'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={20} className={modelType === 'standard' ? 'text-indigo-600' : 'text-slate-400'} />
                  <span className={`font-bold ${modelType === 'standard' ? 'text-indigo-900' : 'text-slate-600'}`}>Standard</span>
                </div>
                <p className="text-xs text-slate-500">Gemini 2.0 Flash. 一般的なトピック向け。高速かつ効率的。</p>
              </button>

              <button
                onClick={() => setModelType('pro')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                  modelType === 'pro'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                 {modelType === 'pro' && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                        PRO
                    </div>
                 )}
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit size={20} className={modelType === 'pro' ? 'text-purple-600' : 'text-slate-400'} />
                  <span className={`font-bold ${modelType === 'pro' ? 'text-purple-900' : 'text-slate-600'}`}>Reasoning Pro</span>
                </div>
                <p className="text-xs text-slate-500">Gemini 3.0 Pro. 複雑な主題向けの深い推論。</p>
              </button>
            </div>

            {/* Big5 Profile Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">あなたの学習スタイルを調整</h2>
              <p className="text-slate-600 text-sm mb-4">あなたのBig5性格特性に基づいて、AIがカリキュラムの構成や説明のトーンを最適化します。</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => handlePresetSelect('balanced')} className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200">バランス</button>
                <button onClick={() => handlePresetSelect('artist')} className="text-xs px-3 py-1 rounded-full bg-blue-100 border border-blue-200 hover:bg-blue-200">芸術家肌</button>
                <button onClick={() => handlePresetSelect('scientist')} className="text-xs px-3 py-1 rounded-full bg-green-100 border border-green-200 hover:bg-green-200">科学者肌</button>
                <button onClick={() => handlePresetSelect('teacher')} className="text-xs px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 hover:bg-yellow-200">教育者肌</button>
                <button onClick={() => handlePresetSelect('entrepreneur')} className="text-xs px-3 py-1 rounded-full bg-purple-100 border border-purple-200 hover:bg-purple-200">起業家肌</button>
              </div>

              <div className="space-y-4">
                {renderSlider('openness', '開放性 (Openness)', Feather)}
                {renderSlider('conscientiousness', '誠実性 (Conscientiousness)', Book)}
                {renderSlider('extraversion', '外向性 (Extraversion)', User)}
                {renderSlider('agreeableness', '協調性 (Agreeableness)', Heart)}
                {renderSlider('neuroticism', '神経症傾向 (Neuroticism)', Dna)}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                isGenerating || !topic.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  カリキュラムを生成中...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
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
