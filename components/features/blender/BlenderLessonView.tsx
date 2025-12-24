import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, CheckCircle2, Circle, ChevronRight, Keyboard, 
  Download, Info, Image as ImageIcon, Zap, Check, Menu,
  MoveHorizontal, Copy, AlertTriangle, ChevronDown, ChevronUp,
  Eye, XCircle, CheckCircle
} from 'lucide-react';

interface BlenderLessonViewProps {
  onBack: () => void;
  onComplete: () => void;
}

interface Parameter {
  label: string;
  value: string;
}

interface LessonStep {
  id: string;
  title: string;
  description: string;
  imageType: 'static' | 'compare' | 'overlay' | 'dos_donts';
  imageUrl: string; 
  // For 'compare' or 'overlay'
  secondaryImageUrl?: string; 
  beforeImageUrl?: string;
  // For 'dos_donts'
  badExample?: { image: string, text: string };
  goodExample?: { image: string, text: string };
  
  hotkeys: string[];
  parameters?: Parameter[]; 
  troubleshooting?: {
    title: string;
    text: string;
  };
  tip?: string;
}

// --- SUB-COMPONENTS ---

// 1. Before/After Slider
const ImageSlider = ({ before, after, alt }: { before: string, after: string, alt: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-[2rem] overflow-hidden cursor-col-resize group select-none shadow-inner border border-slate-100"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <img src={after} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-white/90 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur-md uppercase tracking-wider shadow-sm">Smooth Shading</div>

      <div 
        className="absolute inset-0 w-full h-full overflow-hidden rounded-[2rem]"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={before} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur-md uppercase tracking-wider shadow-sm">Flat Shading</div>
      </div>

      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl text-slate-900 ring-4 ring-black/5">
          <MoveHorizontal size={20} />
        </div>
      </div>
    </div>
  );
};

// 2. X-Ray Overlay (Hold to reveal)
const XRayOverlay = ({ base, overlay }: { base: string, overlay: string }) => {
  return (
    <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden group cursor-pointer border border-slate-100 shadow-inner bg-slate-100">
      {/* Base Image */}
      <img src={base} className="absolute inset-0 w-full h-full object-cover" alt="Base" />
      
      {/* Overlay Image (Hidden by default, shown on hover/active) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 z-10 bg-slate-900/5 backdrop-blur-[2px]">
         <img src={overlay} className="w-full h-full object-cover" alt="Wireframe" />
      </div>

      {/* Label/Instruction */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-full text-xs font-black border border-white/50 flex items-center gap-2 pointer-events-none group-hover:opacity-0 transition-opacity shadow-lg">
         <Eye size={16} className="text-orange-500" />
         Hover to see Wireframe
      </div>
       <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
         X-Ray Mode
      </div>
    </div>
  );
};

// 3. Do's and Don'ts Grid
const DosAndDonts = ({ bad, good }: { bad: {image: string, text: string}, good: {image: string, text: string} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Bad Example */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
        <div className="relative aspect-video">
           <img src={bad.image} alt="Bad Example" className="w-full h-full object-cover opacity-80" />
           <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
             <XCircle size={20} />
           </div>
        </div>
        <div className="p-3">
           <h4 className="text-red-400 font-bold text-xs uppercase mb-1">Don't Do This</h4>
           <p className="text-slate-400 text-sm leading-snug">{bad.text}</p>
        </div>
      </div>

      {/* Good Example */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl overflow-hidden">
        <div className="relative aspect-video">
           <img src={good.image} alt="Good Example" className="w-full h-full object-cover opacity-80" />
           <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
             <CheckCircle size={20} />
           </div>
        </div>
        <div className="p-3">
           <h4 className="text-green-400 font-bold text-xs uppercase mb-1">Do This Instead</h4>
           <p className="text-slate-400 text-sm leading-snug">{good.text}</p>
        </div>
      </div>
    </div>
  );
};

const ParameterGrid = ({ params }: { params: Parameter[] }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (val: string, idx: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {params.map((p, idx) => (
        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
          <div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{p.label}</div>
            <div className="text-slate-900 font-mono font-bold text-lg">{p.value}</div>
          </div>
          <button 
            onClick={() => handleCopy(p.value, idx)}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
            title="Copy value"
          >
            {copiedIndex === idx ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
      ))}
    </div>
  );
};

const Troubleshooting = ({ title, text }: { title: string, text: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-4 border border-orange-200 bg-orange-50/30 rounded-[2rem] overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-orange-50 transition-colors"
      >
        <div className="flex items-center gap-4 text-orange-600">
          <div className="bg-orange-500 text-white p-1.5 rounded-lg shadow-orange-200 shadow-lg">
             <AlertTriangle size={18} />
          </div>
          <span className="font-black text-sm uppercase tracking-wider">Troubleshooting: {title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-orange-400"/> : <ChevronDown size={20} className="text-orange-400"/>}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-slate-600 text-base leading-relaxed border-t border-orange-100 font-medium">
          {text}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

const BlenderLessonView: React.FC<BlenderLessonViewProps> = ({ onBack, onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStepId, setActiveStepId] = useState<string>('s1');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Enhanced Lesson Data with new patterns
  const lessonData = {
    title: "Blender 4.0 Mastery: The Beginning",
    subtitle: "Chapter 1: Mastering the 3D Space",
    level: "Beginner",
    steps: [
      {
        id: 's1',
        title: 'Master the Viewport',
        description: '3D空間を自由に動き回ることが全ての基本です。中マウスボタンを使って、世界をあらゆる角度から観察してみましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Middle Mouse (Rotate)', 'Shift + Middle Mouse (Pan)', 'Scroll (Zoom)'],
        troubleshooting: {
          title: "視点がどこかへ飛んでしまったら？",
          text: "オブジェクトを選択してテンキーの '.' (ピリオド) を押すと、そのオブジェクトに視点をリセットできます。"
        }
      },
      {
        id: 's2',
        title: 'Selection Basics',
        description: '操作したいものを正確に選ぶ練習です。Blender 4.0では左クリック選択が標準です。複数のものを選んだり、全てを選択解除する操作を覚えましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Left Click (Select)', 'A (Select All)', 'Alt + A (Deselect All)'],
        tip: "オレンジ色の枠線がついているものが『アクティブ』なオブジェクトです。"
      },
      {
        id: 's3',
        title: 'The Transformation Trinity',
        description: '移動(Grab)、回転(Rotate)、拡大縮小(Scale)は3D制作の三種の神器です。ショートカットキーを使って、直感的にオブジェクトの形や位置を変えてみましょう。',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['G (Grab/Move)', 'R (Rotate)', 'S (Scale)'],
        parameters: [
          { label: 'Constraint X', value: 'G -> X' },
          { label: 'Constraint Y', value: 'G -> Y' },
          { label: 'Constraint Z', value: 'G -> Z' },
          { label: 'Cancel', value: 'Right Click / Esc' }
        ]
      },
      {
        id: 's4',
        title: 'Adding New Worlds',
        description: '何もないところから形を生み出します。MeshメニューからCubeやSphere、あるいは有名なMonkey(Suzanne)を追加してみましょう。',
        imageType: 'overlay',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200', 
        secondaryImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200', 
        hotkeys: ['Shift + A (Add Menu)'],
        tip: "新しいオブジェクトは常に『3D Cursor』がある場所に生成されます。"
      },
      {
        id: 's5',
        title: 'Shading & Visualization',
        description: '見た目の切り替えです。作業しやすいソリッド表示と、内部構造が見えるワイヤーフレーム表示、そして完成イメージに近いレンダー表示を使い分けます。',
        imageType: 'compare', 
        beforeImageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=1200',
        imageUrl: 'https://images.unsplash.com/photo-1633412803524-d96562450871?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Z (Shading Pie Menu)', 'Shift + Z (Toggle Wireframe)'],
      },
      {
        id: 's6',
        title: 'Enter the Edit Mode',
        description: 'オブジェクトそのものの形を作り変える段階へ進みます。オブジェクトモードから編集モードへ切り替えると、点・辺・面を個別に操作できるようになります。',
        imageType: 'dos_donts',
        imageUrl: '',
        badExample: {
          image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800&sat=-100',
          text: 'オブジェクトモードで形を無理やり歪ませると、後の工程でトラブルの元になります。'
        },
        goodExample: {
          image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
          text: '詳細な形状変化は必ず編集モードで行いましょう。これがプロのワークフローです。'
        },
        hotkeys: ['Tab (Switch Mode)'],
      }
    ] as LessonStep[]
  };

  const toggleStep = (id: string) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(s => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  const scrollToStep = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveStepId(id);
    }
  };

  const progressPercentage = Math.round((completedSteps.length / lessonData.steps.length) * 100);

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900">
      
      {/* Top Header */}
      <div className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-base text-slate-900">{lessonData.title}</h1>
            <p className="text-xs text-slate-500">{lessonData.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:block w-48">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                 <span>Progress</span>
                 <span className="text-orange-600">{progressPercentage}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-500 transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" style={{ width: `${progressPercentage}%` }}></div>
              </div>
           </div>

           <button 
             onClick={onComplete}
             disabled={progressPercentage < 100}
             className={`
               px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2
               ${progressPercentage === 100 
                 ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20' 
                 : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
             `}
           >
             Finish Stage <CheckCircle2 size={16} />
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden bg-slate-50/50">
        
        {/* Left: Scrollable Tutorial Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200" ref={scrollContainerRef}>
           <div className="max-w-3xl mx-auto px-6 py-12">
              
              {/* Intro Card */}
              <div className="mb-16 text-center">
                 <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                   {lessonData.level}
                 </span>
                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 mb-6 tracking-tight italic">Your 3D Journey Starts Here.</h1>
                 <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto font-medium">
                   3D制作の第一歩へようこそ。このレッスンでは、Blenderを自在に操るための基礎、視点操作とオブジェクト変形をマスターします。
                 </p>
              </div>

              {/* Steps Stream */}
              <div className="space-y-16 relative">
                 {/* Vertical Connector Line */}
                 <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-slate-100 hidden md:block"></div>

                 {lessonData.steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isActive = activeStepId === step.id;

                    return (
                      <div 
                        key={step.id} 
                        id={step.id}
                        className={`relative pl-0 md:pl-16 transition-all duration-500 ${isCompleted ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
                        onMouseEnter={() => setActiveStepId(step.id)}
                      >
                         {/* Number Badge */}
                         <div 
                            onClick={() => toggleStep(step.id)}
                            className={`
                               absolute left-0 top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center font-black z-10 cursor-pointer transition-all hidden md:flex
                               ${isCompleted 
                                 ? 'bg-green-500 border-white text-white shadow-lg' 
                                 : isActive ? 'bg-orange-500 border-white text-white shadow-lg scale-110' : 'bg-white border-slate-100 text-slate-400 shadow-sm'}
                            `}
                         >
                            {isCompleted ? <Check size={20} /> : index + 1}
                         </div>

                         {/* Content Card */}
                         <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-1.5 overflow-hidden hover:border-indigo-200 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 group shadow-sm">
                            
                            {/* Visual Area based on Type */}
                            {step.imageType === 'compare' && step.beforeImageUrl ? (
                               <ImageSlider 
                                 before={step.beforeImageUrl} 
                                 after={step.imageUrl} 
                                 alt={step.title} 
                               />
                            ) : step.imageType === 'overlay' && step.secondaryImageUrl ? (
                               <XRayOverlay
                                 base={step.imageUrl}
                                 overlay={step.secondaryImageUrl}
                               />
                            ) : step.imageType === 'dos_donts' && step.badExample && step.goodExample ? (
                               <div className="p-6 pb-0">
                                 <DosAndDonts bad={step.badExample} good={step.goodExample} />
                               </div>
                            ) : (
                              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100">
                                 <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                              </div>
                            )}

                            {/* Hotkey Bar */}
                            {step.hotkeys.length > 0 && (
                              <div className={`${step.imageType === 'dos_donts' ? 'px-6 pb-4' : 'px-8 pt-6'} flex flex-wrap gap-2`}>
                                {step.hotkeys.map(hk => (
                                  <div key={hk} className="bg-slate-50 border border-slate-100 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm group-hover:bg-indigo-50/50 transition-colors">
                                     <Keyboard size={12} className="text-orange-500" />
                                     {hk}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Text Body */}
                            <div className="p-8 md:p-10 pt-4">
                               <div className="flex justify-between items-start mb-6">
                                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">{step.title}</h2>
                                  <button 
                                    onClick={() => toggleStep(step.id)}
                                    className={`
                                      flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border transition-all uppercase tracking-widest
                                      ${isCompleted 
                                        ? 'bg-green-50 border-green-100 text-green-600' 
                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900'}
                                    `}
                                  >
                                     {isCompleted ? 'Completed' : 'Mark Done'}
                                  </button>
                               </div>
                               
                               <p className="text-slate-600 leading-relaxed text-lg font-medium mb-8">
                                  {step.description}
                               </p>

                               {/* Parameters Grid */}
                               {step.parameters && (
                                 <ParameterGrid params={step.parameters} />
                               )}

                               {/* Tip Box */}
                               {step.tip && (
                                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-4 text-indigo-700 text-sm font-medium mb-4 shadow-sm">
                                     <div className="bg-indigo-600 text-white p-1 rounded-lg shrink-0 h-fit">
                                        <Info size={16} />
                                     </div>
                                     <span>{step.tip}</span>
                                  </div>
                               )}

                               {/* Troubleshooting Accordion */}
                               {step.troubleshooting && (
                                 <Troubleshooting 
                                   title={step.troubleshooting.title} 
                                   text={step.troubleshooting.text} 
                                 />
                               )}
                            </div>
                         </div>
                      </div>
                    );
                 })}
              </div>

              {/* End of Section */}
              <div className="mt-24 p-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-center bg-white shadow-xl shadow-slate-200/20">
                 <h3 className="text-2xl font-black text-slate-900 mb-2">Stage Complete</h3>
                 <p className="text-slate-500 font-medium mb-8">You've successfully built the base mesh!</p>
                 <button 
                   onClick={onComplete}
                   disabled={progressPercentage < 100}
                   className={`
                      mx-auto px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-3 uppercase tracking-widest shadow-xl
                      ${progressPercentage === 100 
                         ? 'bg-slate-900 text-white hover:scale-105 active:scale-95 shadow-slate-900/20' 
                         : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}
                   `}
                 >
                    Next Lesson <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Sticky Sidebar Navigation (TOC) */}
        <div className="w-80 border-l border-slate-100 bg-white hidden xl:flex flex-col">
           <div className="p-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Table of Contents</h3>
              <div className="space-y-3 relative">
                 {/* Track Line */}
                 <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-50"></div>

                 {lessonData.steps.map((step, idx) => {
                    const isDone = completedSteps.includes(step.id);
                    const isActive = activeStepId === step.id;
                    return (
                       <div 
                         key={step.id}
                         onClick={() => scrollToStep(step.id)}
                         className={`
                           relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all group
                           ${isActive ? 'bg-indigo-50 shadow-sm shadow-indigo-100/50' : 'hover:bg-slate-50'}
                         `}
                       >
                          <div className={`
                             relative z-10 w-6 h-6 rounded-lg border-2 flex items-center justify-center text-[10px] font-black transition-all
                             ${isDone 
                               ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-100' 
                               : isActive ? 'bg-white border-indigo-600 text-indigo-600 scale-110' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-400'}
                          `}>
                             {isDone ? <Check size={12} /> : idx + 1}
                          </div>
                          <span className={`text-sm font-bold transition-colors ${isActive ? 'text-indigo-900' : isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                             {step.title}
                          </span>
                       </div>
                    );
                 })}
              </div>
           </div>

           <div className="mt-auto p-8 border-t border-slate-50 space-y-6">
              <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-2xl text-blue-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <Download size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800">Reference_Ref.zip</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">2.4 MB • Assets</p>
                      </div>
                  </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-[2rem] p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-orange-600 mb-3">
                     <div className="bg-orange-500 text-white p-1 rounded-md shadow-orange-100 shadow-lg">
                        <Zap size={14} fill="currentColor" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pro Tip</span>
                  </div>
                  <p className="text-xs text-orange-900/70 leading-relaxed font-bold">
                     Always apply scale (Ctrl+A) before sculpting, otherwise your brushes will be distorted!
                  </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BlenderLessonView;