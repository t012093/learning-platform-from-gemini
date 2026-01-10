import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GLOSSARY_TERMS, GlossaryTerm } from '../../data/glossary/terms';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { useLumina } from '../features/ai/LuminaConciergeView'; // Assuming we can access Lumina context later

// Utility to escape regex characters
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

interface GlossaryTextProps {
  text: string;
}

const GlossaryText: React.FC<GlossaryTextProps> = ({ text }) => {
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setActiveTerm(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTermClick = (e: React.MouseEvent, term: GlossaryTerm) => {
    e.stopPropagation();
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 280; // Match w-[280px]
    const windowWidth = window.innerWidth;
    
    // Default: Align left with the term
    let leftPos = rect.left + window.scrollX;
    
    // If popup goes off-screen to the right, align right with the term instead
    if (rect.left + popupWidth > windowWidth - 20) {
       leftPos = (rect.right + window.scrollX) - popupWidth;
    }
    
    // Final safety check to ensure it doesn't go off-screen to the left
    leftPos = Math.max(10, leftPos);

    setPopupPosition({
      x: leftPos,
      y: rect.bottom + window.scrollY + 8
    });
    setActiveTerm(term);
  };

  const handleAskAI = () => {
    if (!activeTerm) return;
    
    // In a real implementation, this would trigger the Chatbot with context
    // For now, we'll just log or alert
    // alert(`Luminaに聞いてみよう: ${activeTerm.term}\n(ここにチャットボット起動ロジックが入ります)`);
    
    // Dispatch a custom event that the Layout or Chatbot component can listen to
    const event = new CustomEvent('open-lumina-chat', { 
      detail: { 
        message: `${activeTerm.term}について教えてください。`,
        context: activeTerm.aiContextPrompt 
      } 
    });
    window.dispatchEvent(event);
    
    setActiveTerm(null);
  };

  // 1. Markdown Bold Parsing (**text**)
  // 2. Term Parsing
  
  // First, let's process bold markdown to avoid breaking it with term replacement
  // We will represent the text as an array of segments
  // Segment: { text: string, type: 'normal' | 'bold' | 'term', termId?: string }
  
  // Simplification: We will only look for terms in "normal" text, not inside bold text for now to avoid conflict
  // Or simpler: Process bold first, then process terms in the resulting nodes.
  
  const renderContent = () => {
    // Step 1: Split by Bold Markdown
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
      }
      
      // Step 2: Find terms in normal text
      // Create a massive regex for all terms
      // Sort terms by length (desc) to match longest terms first
      const sortedTerms = [...GLOSSARY_TERMS].sort((a, b) => b.term.length - a.term.length);
      const termPattern = sortedTerms.map(t => escapeRegExp(t.term)).join('|');
      
      if (!termPattern) return <span key={i}>{part}</span>;
      
      const regex = new RegExp(`(${termPattern})`, 'g');
      const textParts = part.split(regex);
      
      return (
        <React.Fragment key={i}>
          {textParts.map((subPart, j) => {
            const matchedTerm = sortedTerms.find(t => t.term === subPart);
            if (matchedTerm) {
              return (
                <span 
                  key={j}
                  onClick={(e) => handleTermClick(e, matchedTerm)}
                  className="cursor-help border-b-2 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 transition-colors px-0.5 rounded-sm"
                  title="Click for definition"
                >
                  {subPart}
                </span>
              );
            }
            return <span key={j}>{subPart}</span>;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {renderContent()}
      
      {/* Popover Portal or Absolute Div */}
      {activeTerm && popupPosition && createPortal(
        <div 
            ref={popupRef}
            style={{ 
              position: 'absolute', 
              top: popupPosition.y, 
              left: popupPosition.x,
              zIndex: 9999 
            }}
            className="w-[280px] bg-white rounded-xl shadow-xl border border-indigo-100 p-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <button 
            onClick={() => setActiveTerm(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
               {activeTerm.category}
            </span>
            <h3 className="font-bold text-slate-800">{activeTerm.term}</h3>
          </div>
          
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {activeTerm.definition}
          </p>
          
          <button 
            onClick={handleAskAI}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all group"
          >
            <Sparkles size={14} className="text-indigo-300 group-hover:text-white" />
            AI先生に詳しく聞く
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default GlossaryText;
