import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User, RefreshCw, Loader2, Mic } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Message } from '../types';
import { GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm Lumina, your personal English tutor. We can practice conversation, fix your grammar, or prepare for an exam. **How can I help you today?**",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef(createChatSession());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: botMessageId,
      role: 'model',
      text: '',
      timestamp: new Date(),
      isStreaming: true
    }]);

    try {
      const streamResult = await sendMessageStream(chatSession.current, userMessage.text);
      let fullText = '';
      
      for await (const chunk of streamResult) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: fullText } 
              : msg
          ));
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, text: "I'm sorry, I lost my connection. Please try again.", isStreaming: false } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Correct my grammar",
    "Roleplay: Ordering coffee",
    "Explain Present Perfect",
    "Quiz me on idioms"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-3 shadow-sm z-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Lumina AI Tutor</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            English Expert • Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
                <Bot size={16} />
              </div>
            )}
            
            <div className={`
              max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-sm' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'}
            `}>
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-slate max-w-none">
                  {msg.text ? <ReactMarkdown>{msg.text}</ReactMarkdown> : <span className="flex gap-1 items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span><span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span></span>}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 mt-1">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-full text-sm text-slate-600 hover:text-indigo-700 transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or speak..."
              className="w-full bg-slate-100 border-none text-slate-900 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none max-h-32 transition-colors"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
               <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Mic size={18} />
               </button>
               <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-lg transition-all duration-200 
                  ${input.trim() && !isLoading 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-transparent text-slate-300 cursor-not-allowed'
                  }`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          AI can make mistakes. Double check translations.
        </p>
      </div>
    </div>
  );
};

export default AITutor;