import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, CheckCircle2, Circle, ChevronRight, Keyboard, 
  Download, Info, Image as ImageIcon, Zap, Check, Menu,
  MoveHorizontal, Copy, AlertTriangle, ChevronDown, ChevronUp,
  Eye, XCircle, CheckCircle
} from 'lucide-react';

import { BLENDER_COURSE_DATA } from '../../../data/curricula/blender/courseData';

interface BlenderLessonViewProps {
  stageId: number;
  onBack: () => void;
  onComplete: () => void;
}

interface ParameterItem {
  label: string;
  value: string;
}

interface DosAndDontsExample {
  image: string;
  text: string;
}

const ImageSlider: React.FC<{ before: string; after: string; alt: string }> = ({ before, after, alt }) => {
  const [split, setSplit] = useState(50);

  return (
    <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100">
      <img src={after} alt={`${alt} after`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${split}%` }}>
        <img src={before} alt={`${alt} before`} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="absolute inset-y-0" style={{ left: `calc(${split}% - 1px)` }}>
        <div className="h-full w-0.5 bg-white/80 shadow-[0_0_10px_rgba(0,0,0,0.25)]" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2 text-slate-700 shadow-md">
          <MoveHorizontal size={14} />
        </div>
      </div>
      <input
        aria-label="Compare images"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        max={100}
        min={0}
        type="range"
        value={split}
        onChange={(event) => setSplit(Number(event.target.value))}
      />
      <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700">
        Before
      </div>
      <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700">
        After
      </div>
    </div>
  );
};

const XRayOverlay: React.FC<{ base: string; overlay: string }> = ({ base, overlay }) => {
  const [opacity, setOpacity] = useState(0.55);
  const [visible, setVisible] = useState(true);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100">
        <img src={base} alt="Base view" className="absolute inset-0 h-full w-full object-cover" />
        {visible && (
          <img
            src={overlay}
            alt="Overlay view"
            className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
            style={{ opacity }}
          />
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700">
          Base
        </div>
        {visible && (
          <div className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700">
            Overlay
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 px-6 pb-2">
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm transition hover:border-slate-300"
        >
          <Eye size={14} />
          {visible ? 'Hide overlay' : 'Show overlay'}
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
          <span>Opacity</span>
          <input
            aria-label="Overlay opacity"
            className="h-1 w-28 accent-orange-500"
            max={100}
            min={0}
            type="range"
            value={Math.round(opacity * 100)}
            onChange={(event) => setOpacity(Number(event.target.value) / 100)}
          />
          <span>{Math.round(opacity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

const DosAndDonts: React.FC<{ bad: DosAndDontsExample; good: DosAndDontsExample }> = ({ bad, good }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <div className="overflow-hidden rounded-[2rem] border border-rose-200 bg-rose-50">
      <div className="relative aspect-video">
        <img src={bad.image} alt="Bad example" className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          <XCircle size={14} />
          Dont
        </div>
      </div>
      <p className="p-4 text-sm font-semibold text-rose-900">{bad.text}</p>
    </div>
    <div className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-emerald-50">
      <div className="relative aspect-video">
        <img src={good.image} alt="Good example" className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          <CheckCircle size={14} />
          Do
        </div>
      </div>
      <p className="p-4 text-sm font-semibold text-emerald-900">{good.text}</p>
    </div>
  </div>
);

const ParameterGrid: React.FC<{ params: ParameterItem[] }> = ({ params }) => (
  <div className="mb-8 grid gap-3 sm:grid-cols-2">
    {params.map((param) => (
      <div
        key={`${param.label}-${param.value}`}
        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
      >
        <Circle size={12} className="text-orange-500" />
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{param.label}</div>
          <div className="font-bold text-slate-700">{param.value}</div>
        </div>
      </div>
    ))}
  </div>
);

const Troubleshooting: React.FC<{ title: string; text: string }> = ({ title, text }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 text-sm font-bold text-amber-900">
          <span className="rounded-md bg-amber-500 p-1 text-white">
            <AlertTriangle size={14} />
          </span>
          {title}
        </div>
        {open ? <ChevronUp size={16} className="text-amber-700" /> : <ChevronDown size={16} className="text-amber-700" />}
      </button>
      {open && <div className="px-5 pb-5 text-sm font-medium leading-relaxed text-amber-800">{text}</div>}
    </div>
  );
};

// ... (Existing interfaces can be imported or kept for now if local types differ slightly, 
// but ideally we should import LessonStep from courseData.ts. For now, let's keep local interfaces to minimize diff noise
// and just map the data structure if needed, or rely on TS structural typing.)

// Update Component Definition
const BlenderLessonView: React.FC<BlenderLessonViewProps> = ({ stageId, onBack, onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStepId, setActiveStepId] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load Data dynamically
  const lessonData = BLENDER_COURSE_DATA[stageId];

  // Set initial active step
  useEffect(() => {
      if (lessonData && lessonData.steps.length > 0) {
          setActiveStepId(lessonData.steps[0].id);
      }
  }, [lessonData]);

  if (!lessonData) {
      return (
          <div className="flex items-center justify-center h-screen bg-white text-slate-900">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
                  <p className="text-slate-500 mb-6">Stage {stageId} is currently under construction.</p>
                  <button onClick={onBack} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Go Back</button>
              </div>
          </div>
      );
  }

  // Remove the old hardcoded lessonData object
  // const lessonData = { ... } 

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
