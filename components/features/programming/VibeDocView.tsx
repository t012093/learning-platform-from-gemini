import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  ArrowLeft, BookOpen, List, Share2, Clock, 
  ChevronRight, AlertTriangle, Info, Lightbulb, CheckCircle2,
  Copy, Check, FileText, Presentation, ChevronLeft, Maximize2, Minimize2, Brain
} from 'lucide-react';
import mermaid from 'mermaid';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ViewState, DocChapter, DocBlock, QuizData } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import VibeQuizView from './VibeQuizView';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface VibeDocViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  chapter: DocChapter;
  pdfUrl?: string;
  quizData?: QuizData;
}

const VibeDocView: React.FC<VibeDocViewProps> = ({ onBack, onNavigate, chapter, pdfUrl, quizData }) => {
  const { setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('');
  const [viewMode, setViewMode] = useState<'doc' | 'slide' | 'quiz'>('doc');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setTheme('light'); // Document view works best in light/clean mode
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'sans-serif'
    });
    return () => setTheme('system');
  }, [setTheme]);

  // Scroll Spy Logic
  useEffect(() => {
    if (viewMode !== 'doc') return;
    
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    chapter.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [chapter, viewMode]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    // Re-run mermaid when content changes or mode switches to doc
    if (viewMode === 'doc') {
       mermaid.contentLoaded();
    }
  }, [chapter, viewMode]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Header (Hidden in Slide Mode for immersion, or minimal) */}
      <header className={`fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-6 transition-transform duration-300 ${viewMode === 'slide' ? '-translate-y-full hover:translate-y-0' : ''}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Vibe Coding Curriculum</span>
            <span className="text-sm font-bold text-slate-800 line-clamp-1">{chapter.title}</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('doc')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'doc' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={14} />
            Doc
          </button>
          
          {pdfUrl && (
            <button
              onClick={() => setViewMode('slide')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'slide' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Presentation size={14} />
              Slide
            </button>
          )}

          {quizData && (
            <button
              onClick={() => setViewMode('quiz')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'quiz' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Brain size={14} />
              Quiz
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
           <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
             <Clock size={14} /> {chapter.readingTime}
           </span>
        </div>
      </header>

      {viewMode === 'doc' && (
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <article className="lg:col-span-8 lg:col-start-2 xl:col-span-7 xl:col-start-3">
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider mb-6">
               Chapter 1
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              {chapter.title}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-serif italic">
              {chapter.subtitle}
            </p>
          </header>

          <div className="space-y-16">
            {chapter.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection(section.id)}>
                   <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-sm group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">#</span>
                   {section.title}
                </h2>
                <div className="space-y-8">
                  {section.content.map((block, idx) => (
                    <BlockRenderer key={idx} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Chapter Footer */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                <ArrowLeft size={16} /> Back to Course
             </button>
             <button onClick={() => setViewMode(quizData ? 'quiz' : 'doc')} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                {quizData ? 'Take Quiz' : 'Complete'} <CheckCircle2 size={18} />
             </button>
          </div>
        </article>

        {/* Right Sidebar (TOC) */}
        <aside className="hidden xl:block col-span-2 relative">
          <div className="sticky top-32">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <List size={14} /> On this page
             </h3>
             <ul className="space-y-1 relative border-l border-slate-100">
                {chapter.sections.map((section) => (
                  <li key={section.id} className="relative">
                     <button
                        onClick={() => scrollToSection(section.id)}
                        className={`text-sm py-1.5 pl-4 text-left w-full transition-colors border-l-2 -ml-[2px] ${
                           activeSection === section.id 
                             ? 'border-purple-500 text-purple-600 font-medium' 
                             : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                     >
                        {section.title.split('. ')[1] || section.title}
                     </button>
                  </li>
                ))}
             </ul>
          </div>
        </aside>

      </main>
      )}
      
      {viewMode === 'slide' && pdfUrl && (
         <SlideViewer pdfUrl={pdfUrl} onBack={() => setViewMode('doc')} />
      )}

      {viewMode === 'quiz' && quizData && (
         <div className="pt-16 min-h-screen bg-slate-50">
            <VibeQuizView 
               quiz={quizData} 
               onComplete={(score) => console.log('Quiz completed', score)}
               onBack={() => setViewMode('doc')}
            />
         </div>
      )}
    </div>
  );
};

// --- Custom Slide Viewer ---
// --- Custom Slide Viewer ---
const SLIDE_TIMINGS = [
  0,    // 1. 表紙
  28,   // 2. なぜ「設計図」が必要なのか
  55,   // 3. AI開発を成功させる4つの柱
  75,   // 4. 01 構造（Structure）
  95,   // 5. アプリケーションは「一つのレストラン」
  125,  // 6. 指示の精度が劇的に向上する思考法
  145,  // 7. 02 通信（Communication）
  160,  // 8. 「人間との対話」と「機械との対話」
  185,  // 9. AIへの具体的な依頼方法
  205,  // 10. 03 公開（Launch）
  220,  // 11. ローカルPCから、世界へ
  240,  // 12. 04 時間（Time）
  255,  // 13. Gitは「失敗を許可する道具」
  275,  // 14. 恐れずに実験するために
  290,  // 15. まとめ
  9999  // End
];

const SlideViewer: React.FC<{ pdfUrl: string; onBack: () => void }> = ({ pdfUrl, onBack }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(0.9);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !autoAdvance) return;
    
    const currentTime = audioRef.current.currentTime;
    // Find the slide index that corresponds to the current time
    // SLIDE_TIMINGS[i] is the start time of slide i+1
    let nextSlide = 1;
    for (let i = 0; i < SLIDE_TIMINGS.length; i++) {
      if (currentTime >= SLIDE_TIMINGS[i]) {
        nextSlide = i + 1;
      } else {
        break;
      }
    }

    if (nextSlide !== pageNumber && nextSlide <= numPages) {
      setPageNumber(nextSlide);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        changePage(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        changePage(-1);
      } else if (event.key === 'Escape') {
        onBack();
      } else if (event.key === ' ') {
        event.preventDefault(); // Prevent scroll
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages, isPlaying]);

  return (
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col items-center justify-center z-[100]">
      {/* Top Controls (Fade on hover) */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onBack} className="text-white/80 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} /> Exit
        </button>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setAutoAdvance(!autoAdvance)} 
             className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${autoAdvance ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-transparent border-white/20 text-white/50'}`}
           >
             Auto-Sync: {autoAdvance ? 'ON' : 'OFF'}
           </button>
           <div className="text-white/80 text-sm font-medium">
             {pageNumber} / {numPages}
           </div>
        </div>
      </div>

      {/* Audio Player (Hidden visually but functional) */}
      <audio 
        ref={audioRef} 
        src="/audio/vibe/chapter1.wav"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Slide Area */}
      <div className="flex-1 flex items-center justify-center w-full h-full p-4 md:p-8 overflow-hidden relative">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex items-center justify-center shadow-2xl"
          loading={
             <div className="flex flex-col items-center text-slate-400 gap-3">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading Slides...</span>
             </div>
          }
          error={<div className="text-red-400 bg-red-900/20 px-4 py-2 rounded">Failed to load PDF.</div>}
        >
          <div className="relative rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
             <Page 
               pageNumber={pageNumber} 
               scale={scale} 
               renderAnnotationLayer={false}
               renderTextLayer={false}
               className="transition-opacity duration-200"
             />
             
             {/* Invisible Click Zones for Navigation */}
             <div className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize z-10" onClick={() => changePage(-1)} title="Previous" />
             <div className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize z-10" onClick={() => changePage(1)} title="Next" />
          </div>
        </Document>

        {/* Navigation Arrows (Visual Only) */}
        <button 
           onClick={() => changePage(-1)}
           disabled={pageNumber <= 1}
           className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all disabled:opacity-0"
        >
           <ChevronLeft size={32} />
        </button>
        <button 
           onClick={() => changePage(1)}
           disabled={pageNumber >= numPages}
           className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all disabled:opacity-0"
        >
           <ChevronRight size={32} />
        </button>
      </div>

      {/* Bottom Controls (Play/Pause & Progress) */}
      <div className="w-full bg-black/40 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-center gap-4 relative z-50">
         <button 
           onClick={togglePlay}
           className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
         >
            {isPlaying ? <span className="w-4 h-4 bg-black rounded-sm" /> : <Presentation size={20} className="ml-1" />}
         </button>
         
         <div className="flex-1 max-w-2xl h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
            if (audioRef.current) {
               const rect = e.currentTarget.getBoundingClientRect();
               const percent = (e.clientX - rect.left) / rect.width;
               audioRef.current.currentTime = percent * audioRef.current.duration;
            }
         }}>
            <div 
               className="absolute inset-y-0 left-0 bg-purple-500 transition-all duration-100" 
               style={{ width: `${audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0}%` }} 
            />
         </div>
      </div>
    </div>
  );
};

// --- Mermaid Block Component ---


// --- Mermaid Block Component ---
const MermaidBlock: React.FC<{ chart: string; caption?: string }> = ({ chart, caption }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const id = useId().replace(/:/g, ''); // Generate unique ID for mermaid container

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;
      
      try {
        // Generate a unique ID for this specific render attempt to avoid conflicts
        const uniqueRenderId = `mermaid-svg-${id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueRenderId, chart);
        setSvgContent(svg);
      } catch (error) {
        console.error('Mermaid rendering failed:', error);
        setSvgContent(`<div class="p-4 bg-red-50 text-red-600 text-sm font-mono rounded">Diagram Error: Invalid Syntax</div>`);
      }
    };

    renderChart();
  }, [chart, id]);

  return (
    <div className="my-8 p-8 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center relative">
       <div className="absolute top-4 right-4 px-2 py-1 bg-white rounded border border-slate-200 text-[10px] font-bold text-slate-400 uppercase">Diagram</div>
       <div 
         ref={containerRef}
         className="w-full flex justify-center overflow-x-auto"
         dangerouslySetInnerHTML={{ __html: svgContent }}
       />
       {caption && <p className="mt-4 text-sm text-slate-500 font-medium text-center">{caption}</p>}
    </div>
  );
};

import GlossaryText from '../../common/GlossaryText';

// --- Block Renderers ---

const BlockRenderer: React.FC<{ block: DocBlock }> = ({ block }) => {
   switch (block.type) {
      case 'text':
         return (
            <p className={`
               leading-8 text-slate-700
               ${block.style === 'lead' ? 'text-xl font-light text-slate-600 mb-8' : 'text-base'}
               ${block.style === 'quote' ? 'font-serif text-lg italic text-slate-600 border-l-4 border-slate-200 pl-4 py-1' : ''}
            `}>
               <GlossaryText text={block.text} />
            </p>
         );
      
      case 'image':
         return (
            <figure className={`my-8 ${block.layout === 'full' ? '-mx-6 md:-mx-12' : ''}`}>
               <img src={block.src} alt={block.alt} className="w-full rounded-xl shadow-md border border-slate-100" />
               {block.caption && (
                  <figcaption className="text-center text-xs text-slate-400 mt-2 font-medium">
                     {block.caption}
                  </figcaption>
               )}
            </figure>
         );

      case 'code':
         return (
            <div className="my-6 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg border border-slate-800/50 group">
               {block.filename && (
                  <div className="bg-[#252526] px-4 py-2 text-xs text-slate-400 font-mono border-b border-white/5 flex justify-between items-center">
                     <span>{block.filename}</span>
                     <span className="uppercase opacity-50">{block.language}</span>
                  </div>
               )}
               <pre className="p-4 overflow-x-auto text-sm font-mono text-blue-100 leading-relaxed">
                  <code>{block.code}</code>
               </pre>
            </div>
         );

      case 'callout':
         const variants = {
            info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', icon: Info, iconColor: 'text-blue-500' },
            warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', icon: AlertTriangle, iconColor: 'text-amber-500' },
            tip: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', icon: Lightbulb, iconColor: 'text-emerald-500' },
            success: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-900', icon: CheckCircle2, iconColor: 'text-green-500' },
         };
         const style = variants[block.variant];
         const Icon = style.icon;

         return (
            <div className={`my-8 p-6 rounded-xl border ${style.bg} ${style.border} flex gap-4`}>
               <div className={`mt-0.5 shrink-0 ${style.iconColor}`}><Icon size={20} /></div>
               <div>
                  {block.title && <h4 className={`font-bold text-sm uppercase tracking-wide mb-2 ${style.text} opacity-80`}>{block.title}</h4>}
                  <p className={`text-sm leading-relaxed ${style.text}`}>
                     <GlossaryText text={block.text} />
                  </p>
               </div>
            </div>
         );

      case 'list':
         return (
            <ul className={`my-6 space-y-3 ${block.style === 'number' ? 'list-decimal pl-5' : ''}`}>
               {block.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 leading-relaxed group">
                     {block.style !== 'number' && (
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 group-hover:scale-125 transition-transform" />
                     )}
                     <span>
                       <GlossaryText text={item} />
                     </span>
                  </li>
               ))}
            </ul>
         );

      case 'mermaid':
         return <MermaidBlock chart={block.chart} caption={block.caption} />;

      default:
         return null;
   }
};

export default VibeDocView;
