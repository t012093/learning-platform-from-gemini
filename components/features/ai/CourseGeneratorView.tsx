import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Zap, BrainCircuit, Loader2, Brain, CheckCircle, ArrowRight, Send, Infinity, User, Bot, RefreshCw } from 'lucide-react';
import { generateCourse, getMockBlenderCourse, createScopingChat, sendMessageStream } from '../../../services/geminiService';
import { GeneratedCourse, Big5Profile, AssessmentProfile, ViewState, Message } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { STORAGE_KEY } from '../dashboard/assessment/assessmentConstants';

interface CourseGeneratorViewProps {
  onBack: () => void;
  onCourseGenerated: (course: GeneratedCourse) => void;
  onNavigate?: (view: ViewState) => void;
}

const CourseGeneratorView: React.FC<CourseGeneratorViewProps> = ({ onBack, onCourseGenerated, onNavigate }) => {
  const { profile: globalProfile } = useTheme();
  const [modelType, setModelType] = useState<'standard' | 'pro' | 'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AssessmentProfile | null>(null);

  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatSession = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load assessment results and initialize chat
  useEffect(() => {
    const savedStr = localStorage.getItem(STORAGE_KEY);
    let currentAssessment = null;
    if (savedStr) {
      try {
        currentAssessment = JSON.parse(savedStr);
        setAssessment(currentAssessment);
      } catch (e) { console.error(e); }
    }
    
    // Initial AI message
    const initialMsg = "こんにちは！今日はどんなことを学びたいですか？具体的なトピックや、今のレベル（初心者など）を教えてください。";
    setMessages([
        {
            id: 'init',
            role: 'model',
            text: initialMsg,
            timestamp: new Date()
        }
    ]);
  }, []);

  useEffect(() => {
    chatSession.current = createScopingChat(assessment?.scores || null, modelType);
  }, [assessment, modelType]);

  // Auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAiTyping) return;

    if (!chatSession.current) {
        chatSession.current = createScopingChat(assessment?.scores || null, modelType);
    }

    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: inputValue,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAiTyping(true);

    try {
        const stream = await sendMessageStream(chatSession.current, inputValue);
        if (!stream || typeof (stream as any)[Symbol.asyncIterator] !== 'function') {
            throw new Error("Invalid stream response from AI.");
        }
        let fullText = '';
        
        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '', timestamp: new Date(), isStreaming: true }]);

        for await (const chunk of stream) {
            const chunkText = typeof (chunk as any).text === 'function'
                ? (chunk as any).text()
                : (chunk as any).text;
            if (!chunkText) continue;
            fullText += chunkText;
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
        }
        
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
    } catch (err) {
        console.error("Chat failed:", err);
        setError("AIとの通信に失敗しました。");
    } finally {
        setIsAiTyping(false);
    }
  };

  const handleGenerate = async () => {
    // Extract the "Topic" from the last few messages or just use the whole history as intent
    const chatHistory = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.text || "General learning";

    setIsGenerating(true);
    setError(null);

    try {
            const profileToUse: Big5Profile = assessment?.scores || {
                openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50,
            };

            // Use the whole chat as the "intent" for deep personalization
            const course = await generateCourse(lastUserMsg, modelType, profileToUse, undefined, assessment || undefined, chatHistory);
            onCourseGenerated(course);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'カリキュラム生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const ModelButton = ({ active, onClick, icon, label, desc, color, badge }: any) => {
    const colorClasses: any = {
      indigo: active ? 'border-indigo-600 bg-indigo-50/50 shadow-inner' : 'border-slate-100 hover:border-slate-200',
      purple: active ? 'border-purple-600 bg-purple-50/50 shadow-inner' : 'border-slate-100 hover:border-slate-200',
      blue: active ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'border-slate-100 hover:border-slate-200',
      emerald: active ? 'border-emerald-600 bg-emerald-50/50 shadow-inner' : 'border-slate-100 hover:border-slate-200',
    };
    const textClasses: any = {
      indigo: active ? 'text-indigo-900' : 'text-slate-600',
      purple: active ? 'text-purple-900' : 'text-slate-600',
      blue: active ? 'text-blue-900' : 'text-slate-600',
      emerald: active ? 'text-emerald-900' : 'text-slate-600',
    };

    return (
      <button onClick={onClick} className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden flex flex-col h-full ${colorClasses[color]}`}>
        {badge && <div className="absolute top-0 right-0 px-1.5 py-0.5 text-[7px] font-black text-white bg-slate-800 rounded-bl-md">{badge}</div>}
        <div className="flex items-center gap-2 mb-1">
          <div className={active ? `text-${color}-600` : 'text-slate-400'}>{icon}</div>
          <span className={`font-black uppercase tracking-widest text-[9px] ${textClasses[color]}`}>{label}</span>
        </div>
        <p className="text-[9px] text-slate-500 font-medium leading-none">{desc}</p>
      </button>
    );
  };

  const canGenerate = messages.length >= 3; // Minimum interaction required

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 pt-12">
      <div className="max-w-4xl w-full flex flex-col h-[85vh]">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors w-fit"
        >
          <ArrowLeft size={20} /> Back to Library
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden flex-1">
          
          {/* Header */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Concierge Scoping</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AI Curriculum Planning Session</p>
                </div>
            </div>

            {/* Model Toggle - Compact */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                {(['standard', 'pro', 'gemini-2.5-flash', 'gemini-2.5-pro'] as const).map(m => (
                    <button 
                        key={m}
                        onClick={() => setModelType(m)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${modelType === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {m === 'standard'
                            ? '2.0F'
                            : m === 'pro'
                            ? '3.0P'
                            : m.replace('gemini-', '')}
                    </button>
                ))}
            </div>
          </div>

          {/* Chat Stage */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-indigo-600 border border-indigo-50'}`}>
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${ 
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isAiTyping && (
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-indigo-50 flex items-center justify-center text-indigo-400">
                                <Bot size={20} />
                            </div>
                            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex gap-3 relative">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="学びたいことについて具体的に教えてください..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all pr-14"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isAiTyping}
                            className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar / Status Area */}
            <div className="w-full md:w-80 border-l border-slate-100 p-8 space-y-8 bg-slate-50/50">
                
                {/* Profile Link */}
                {assessment ? (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Brain size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Analysis Active</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{assessment.personalityType}</h3>
                    <p className="text-[11px] text-slate-500 leading-tight mb-4">{assessment.learningStyle}</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <CheckCircle size={12} /> Personalized
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => onNavigate?.(ViewState.AI_DIAGNOSIS)}
                    className="w-full bg-amber-50 border border-amber-200 p-6 rounded-3xl text-left hover:bg-amber-100 transition-colors group"
                  >
                    <h3 className="font-bold text-amber-900 mb-1">性格診断を推奨</h3>
                    <p className="text-[10px] text-amber-700 mb-3">診断により、AIコンシェルジュがより深くあなたを理解します。</p>
                    <span className="text-[10px] font-black text-amber-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        分析を開始 <ArrowRight size={12} />
                    </span>
                  </button>
                )}

                {/* Model Stats */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Engine</h4>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-indigo-600"><Zap size={14} /></div>
                            <span className="text-xs font-bold text-slate-700 uppercase">{modelType.replace('gemini-', '')}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>

                {/* Generate Action */}
                <div className="pt-4">
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !canGenerate}
                        className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl flex flex-col items-center gap-1 ${ 
                            !canGenerate || isGenerating
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1 active:scale-[0.98]'
                        }`}
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                <span>Generating...</span>
                            </div>
                        ) : (
                            <>
                                <span>カリキュラム生成</span>
                                <span className="text-[8px] opacity-60 font-medium normal-case">{!canGenerate ? '(AIと対話して開始)' : 'Ready to Build'}</span>
                            </>
                        )}
                    </button>
                    {error && <p className="mt-4 text-[10px] text-red-500 font-bold text-center">{error}</p>}
                </div>

                <div className="mt-auto pt-10 text-center">
                    <button 
                        onClick={() => {
                            setMessages([]);
                            chatSession.current = createScopingChat(assessment?.scores || null, modelType);
                            setMessages([{ id: 'reset', role: 'model', text: "プランをリセットしました。何から始めましょうか？", timestamp: new Date() }]);
                        }}
                        className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors"
                    >
                        <RefreshCw size={12} /> Reset Chat
                    </button>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseGeneratorView;
