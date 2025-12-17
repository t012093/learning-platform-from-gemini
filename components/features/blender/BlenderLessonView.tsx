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
      className="relative w-full aspect-video rounded-xl overflow-hidden cursor-col-resize group select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <img src={after} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider">Smooth Shading</div>

      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img src={before} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider">Flat Shading</div>
      </div>

      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-900 ring-4 ring-black/10">
          <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  );
};

// 2. X-Ray Overlay (Hold to reveal)
const XRayOverlay = ({ base, overlay }: { base: string, overlay: string }) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer">
      {/* Base Image */}
      <img src={base} className="absolute inset-0 w-full h-full object-cover" alt="Base" />
      
      {/* Overlay Image (Hidden by default, shown on hover/active) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 z-10 bg-slate-900">
         <img src={overlay} className="w-full h-full object-cover opacity-80" alt="Wireframe" />
      </div>

      {/* Label/Instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2 pointer-events-none group-hover:opacity-0 transition-opacity">
         <Eye size={14} className="text-orange-400" />
         Hover to see Wireframe
      </div>
       <div className="absolute top-4 right-4 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {params.map((p, idx) => (
        <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 flex justify-between items-center group">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase mb-0.5">{p.label}</div>
            <div className="text-slate-200 font-mono font-medium">{p.value}</div>
          </div>
          <button 
            onClick={() => handleCopy(p.value, idx)}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Copy value"
          >
            {copiedIndex === idx ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      ))}
    </div>
  );
};

const Troubleshooting = ({ title, text }: { title: string, text: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-4 border border-orange-500/30 bg-orange-500/5 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-500/10 transition-colors"
      >
        <div className="flex items-center gap-3 text-orange-400">
          <AlertTriangle size={18} />
          <span className="font-bold text-sm">Troubleshooting: {title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-orange-400"/> : <ChevronDown size={16} className="text-orange-400"/>}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-slate-300 text-sm leading-relaxed border-t border-orange-500/10">
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
    title: "Stage 1: Modeling the Base",
    subtitle: "The Donut Tutorial • Part 1",
    level: "Beginner",
    steps: [
      {
        id: 's1',
        title: 'Clear the Scene',
        description: 'Blender opens with a default Cube, Camera, and Light. For this project, we want a completely empty scene to start fresh. Hover your mouse in the viewport, select everything, and delete.',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['A (Select All)', 'X (Delete)'],
        troubleshooting: {
          title: "I can't delete everything?",
          text: "Make sure your mouse cursor is hovering inside the 3D Viewport window, not the timeline or menus, before pressing 'A'."
        }
      },
      {
        id: 's2',
        title: 'Add a Torus',
        description: 'The torus is the perfect primitive shape for a donut. Open the Add menu and select Mesh > Torus. It will appear at the 3D Cursor (center of the world).',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Shift + A'],
        tip: "If the menu doesn't appear, ensure you are in 'Object Mode' (top left corner)."
      },
      {
        id: 's3',
        title: 'Adjust Dimensions',
        description: 'Before clicking away, look at the bottom-left corner for the "Add Torus" panel. We need specific values to get a realistic dough shape.',
        imageType: 'static',
        imageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['F9 (Restore Panel)'],
        parameters: [
          { label: 'Major Segments', value: '40' },
          { label: 'Minor Segments', value: '16' },
          { label: 'Major Radius', value: '0.1 m' },
          { label: 'Minor Radius', value: '0.05 m' }
        ]
      },
      {
        id: 's4',
        title: 'Check Your Topology',
        description: 'We want "Quads" (4-sided polygons), not triangles. This ensures the mesh deforms cleanly when we sculpt it later. Hover over the image to check the wireframe.',
        imageType: 'overlay', // Using the new X-Ray pattern
        imageUrl: 'https://images.unsplash.com/photo-1633412803524-d96562450871?auto=format&fit=crop&q=80&w=1200', // Solid
        secondaryImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200', // Wireframe mock
        hotkeys: ['Z (Shading Pie Menu)', 'Shift + Z (Toggle Wireframe)'],
        tip: "A clean topology loop is crucial for the subdivision surface modifier we will add later."
      },
      {
        id: 's5',
        title: 'Apply Shade Smooth',
        description: 'Right now the donut looks blocky. Use "Shade Smooth" to fake a smooth surface.',
        imageType: 'compare', 
        beforeImageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=1200',
        imageUrl: 'https://images.unsplash.com/photo-1633412803524-d96562450871?auto=format&fit=crop&q=80&w=1200',
        hotkeys: ['Right Click > Shade Smooth'],
      },
      {
        id: 's6',
        title: 'Avoid Common Scale Issues',
        description: 'When scaling objects, always apply your scale. Otherwise, modifiers will act unpredictably.',
        imageType: 'dos_donts', // Using the new Do/Don't pattern
        imageUrl: '', // Not used for this type
        badExample: {
          image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800&sat=-100',
          text: 'Stretched textures and weird sculpting brushes? You likely forgot to apply scale.'
        },
        goodExample: {
          image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
          text: 'Apply Scale (Ctrl+A) resets values to 1.0, ensuring predictable behavior.'
        },
        hotkeys: ['Ctrl + A > Scale'],
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
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100">
      
      {/* Top Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-base text-white">{lessonData.title}</h1>
            <p className="text-xs text-slate-400">{lessonData.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:block w-48">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                 <span>Progress</span>
                 <span className="text-orange-500">{progressPercentage}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
           </div>

           <button 
             onClick={onComplete}
             disabled={progressPercentage < 100}
             className={`
               px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2
               ${progressPercentage === 100 
                 ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                 : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
             `}
           >
             Finish Stage <CheckCircle2 size={16} />
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Scrollable Tutorial Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700" ref={scrollContainerRef}>
           <div className="max-w-3xl mx-auto px-6 py-12">
              
              {/* Intro Card */}
              <div className="mb-12 text-center">
                 <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                   {lessonData.level}
                 </span>
                 <h1 className="text-4xl font-bold text-white mt-4 mb-4">Let's make a donut.</h1>
                 <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
                   Follow these steps to create your first 3D mesh. We'll focus on getting the correct shape and scale.
                 </p>
              </div>

              {/* Steps Stream */}
              <div className="space-y-16 relative">
                 {/* Vertical Connector Line */}
                 <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-800 hidden md:block"></div>

                 {lessonData.steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isActive = activeStepId === step.id;

                    return (
                      <div 
                        key={step.id} 
                        id={step.id}
                        className={`relative pl-0 md:pl-16 transition-all duration-500 ${isCompleted ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}
                        onMouseEnter={() => setActiveStepId(step.id)}
                      >
                         {/* Number Badge */}
                         <div 
                            onClick={() => toggleStep(step.id)}
                            className={`
                               absolute left-0 top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center font-bold z-10 cursor-pointer transition-colors hidden md:flex
                               ${isCompleted 
                                 ? 'bg-green-500 border-slate-900 text-white' 
                                 : isActive ? 'bg-orange-500 border-slate-900 text-white' : 'bg-slate-800 border-slate-900 text-slate-400'}
                            `}
                         >
                            {isCompleted ? <Check size={20} /> : index + 1}
                         </div>

                         {/* Content Card */}
                         <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-1 overflow-hidden hover:border-slate-600 transition-colors">
                            
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
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                                 <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                              </div>
                            )}

                            {/* Hotkey Bar */}
                            {step.hotkeys.length > 0 && (
                              <div className={`${step.imageType === 'dos_donts' ? 'px-6 pb-4' : 'px-6 pt-4'} flex flex-wrap gap-2`}>
                                {step.hotkeys.map(hk => (
                                  <div key={hk} className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
                                     <Keyboard size={12} className="text-orange-400" />
                                     {hk}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Text Body */}
                            <div className="p-6 md:p-8 pt-2">
                               <div className="flex justify-between items-start mb-4">
                                  <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                                  <button 
                                    onClick={() => toggleStep(step.id)}
                                    className={`
                                      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors
                                      ${isCompleted 
                                        ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'}
                                    `}
                                  >
                                     {isCompleted ? 'Completed' : 'Mark Done'}
                                  </button>
                               </div>
                               
                               <p className="text-slate-300 leading-relaxed text-lg mb-6">
                                  {step.description}
                               </p>

                               {/* Parameters Grid */}
                               {step.parameters && (
                                 <ParameterGrid params={step.parameters} />
                               )}

                               {/* Tip Box */}
                               {step.tip && (
                                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 text-indigo-200 text-sm mb-2">
                                     <Info size={18} className="shrink-0 mt-0.5" />
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
              <div className="mt-20 p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center">
                 <h3 className="text-xl font-bold text-slate-200 mb-2">Stage Complete</h3>
                 <p className="text-slate-500 mb-6">You've successfully built the base mesh!</p>
                 <button 
                   onClick={onComplete}
                   disabled={progressPercentage < 100}
                   className={`
                      mx-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                      ${progressPercentage === 100 
                         ? 'bg-white text-slate-900 hover:scale-105 shadow-xl shadow-white/10' 
                         : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                   `}
                 >
                    Next Lesson <ChevronRight size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Sticky Sidebar Navigation (TOC) */}
        <div className="w-80 border-l border-slate-800 bg-slate-900 hidden xl:flex flex-col">
           <div className="p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Table of Contents</h3>
              <div className="space-y-1 relative">
                 {/* Track Line */}
                 <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

                 {lessonData.steps.map((step, idx) => {
                    const isDone = completedSteps.includes(step.id);
                    const isActive = activeStepId === step.id;
                    return (
                       <div 
                         key={step.id}
                         onClick={() => scrollToStep(step.id)}
                         className={`
                           relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group
                           ${isActive ? 'bg-slate-800' : 'hover:bg-slate-800/50'}
                         `}
                       >
                          <div className={`
                             relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors
                             ${isDone 
                               ? 'bg-green-500 border-green-500 text-white' 
                               : isActive ? 'bg-slate-900 border-orange-500 text-orange-500' : 'bg-slate-900 border-slate-600 text-slate-500 group-hover:border-slate-400'}
                          `}>
                             {isDone ? <Check size={12} /> : idx + 1}
                          </div>
                          <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                             {step.title}
                          </span>
                       </div>
                    );
                 })}
              </div>
           </div>

           <div className="mt-auto p-6 border-t border-slate-800 space-y-4">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start gap-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                        <Download size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Reference_Ref.zip</h3>
                        <p className="text-xs text-slate-400 mt-0.5">2.4 MB</p>
                      </div>
                  </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                     <Zap size={16} />
                     <span className="text-xs font-bold uppercase">Pro Tip</span>
                  </div>
                  <p className="text-xs text-orange-100/80 leading-relaxed">
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