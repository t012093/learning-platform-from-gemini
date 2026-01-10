import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, ArrowRight, RefreshCcw, Trophy, Brain
} from 'lucide-react';
import { QuizData } from '../../../types';

interface VibeQuizViewProps {
  quiz: QuizData;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const VibeQuizView: React.FC<VibeQuizViewProps> = ({ quiz, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (optionId === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOptionId === currentQuestion.correctAnswer ? 0 : 0)); // Score is already updated
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    let message = "Keep Learning!";
    if (percentage === 100) message = "Perfect Master!";
    else if (percentage >= 80) message = "Excellent!";
    else if (percentage >= 60) message = "Good Job!";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Trophy size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{message}</h2>
        <p className="text-slate-500 mb-8">You scored {score} out of {quiz.questions.length}</p>
        
        <div className="flex gap-4">
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
          >
            <RefreshCcw size={18} /> Retry
          </button>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-bold shadow-lg shadow-purple-200 transition-transform hover:scale-105"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {/* Header & Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} / {quiz.questions.length}</span>
          <span className="text-xs font-bold text-purple-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.id === currentQuestion.correctAnswer;
            
            // Visual State Logic
            let containerClass = "border-slate-200 hover:border-purple-300 hover:bg-slate-50";
            let icon = null;

            if (isAnswered) {
              if (isSelected && isCorrect) {
                containerClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                icon = <CheckCircle2 className="text-green-600" size={20} />;
              } else if (isSelected && !isCorrect) {
                containerClass = "border-red-500 bg-red-50 ring-1 ring-red-500";
                icon = <XCircle className="text-red-600" size={20} />;
              } else if (!isSelected && isCorrect) {
                containerClass = "border-green-200 bg-green-50/50 opacity-70"; // Show correct answer dimmed
                icon = <CheckCircle2 className="text-green-600/50" size={20} />;
              } else {
                containerClass = "border-slate-100 opacity-50";
              }
            } else if (isSelected) {
               containerClass = "border-purple-500 bg-purple-50 ring-1 ring-purple-500";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${containerClass}`}
              >
                <span className={`font-medium ${isAnswered && !isSelected && !isCorrect ? 'text-slate-400' : 'text-slate-700'}`}>
                  {option.text}
                </span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-6 rounded-xl mb-6 flex gap-4 ${selectedOptionId === currentQuestion.correctAnswer ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
            <div className="shrink-0 mt-1">
              {selectedOptionId === currentQuestion.correctAnswer ? <Brain size={24} className="text-green-600" /> : <Brain size={24} className="text-red-600" />}
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-1">
                {selectedOptionId === currentQuestion.correctAnswer ? 'Explanation' : 'Correction'}
              </h4>
              <p className="text-sm leading-relaxed opacity-90">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleNext}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VibeQuizView;
