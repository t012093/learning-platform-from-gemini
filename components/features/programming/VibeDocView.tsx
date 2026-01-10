import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  ArrowLeft, BookOpen, List, Share2, Clock, 
  ChevronRight, AlertTriangle, Info, Lightbulb, CheckCircle2,
  Copy, Check
} from 'lucide-react';
import mermaid from 'mermaid';
import { ViewState, DocChapter, DocBlock } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface VibeDocViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  chapter: DocChapter;
}

const VibeDocView: React.FC<VibeDocViewProps> = ({ onBack, onNavigate, chapter }) => {
  const { setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('');
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
  }, [chapter]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    // Re-run mermaid when content changes
    mermaid.contentLoaded();
  }, [chapter]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-6">
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
        <div className="flex items-center gap-3">
           <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
             <Clock size={14} /> {chapter.readingTime}
           </span>
        </div>
      </header>

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
             <button onClick={() => onNavigate(ViewState.VIBE_PATH)} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                Complete Chapter <CheckCircle2 size={18} />
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
    </div>
  );
};

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
               {block.text}
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
                  <p className={`text-sm leading-relaxed ${style.text}`}>{block.text}</p>
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
                     <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>') }} />
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
