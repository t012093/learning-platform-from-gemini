import React from 'react';
import {
   ArrowLeft, Play, Box, Layers, Zap, Image as ImageIcon,
   MousePointer2, Camera, CheckCircle2, Lock, Download, Star, ChevronLeft
} from 'lucide-react';
import { ViewState } from '../../../types';

interface BlenderPathViewProps {
   onBack: () => void;
   onStartLesson: () => void;
}

const BlenderPathView: React.FC<BlenderPathViewProps> = ({ onBack, onStartLesson }) => {
   const project = {
      title: "The Ultimate Donut",
      description: "Create a photorealistic donut from scratch. Center your viewport and prepare for the rite of passage.",
      level: "Beginner",
      duration: "4h 30m",
      software: "Blender 4.0",
      thumbnail: "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&q=80&w=1200",
      stages: [
         {
            id: 1,
            title: "Modeling the Base",
            desc: "Viewport navigation, mesh primitives, and proportional editing.",
            tools: ["Edit Mode", "Torus"],
            status: "completed",
            icon: Box
         },
         {
            id: 2,
            title: "Sculpting Details",
            desc: "Add realistic imperfections to the dough using sculpt brushes.",
            tools: ["Sculpt Mode", "Remesh"],
            status: "completed",
            icon: MousePointer2
         },
         {
            id: 3,
            title: "Shading & Texturing",
            desc: "Procedural dough materials and glossy icing setup using nodes.",
            tools: ["Shader Editor", "Nodes"],
            status: "current",
            icon: Layers
         },
         {
            id: 4,
            title: "Geometry Nodes (Sprinkles)",
            desc: "Scatter sprinkles randomly using the node-based system.",
            tools: ["Geo Nodes"],
            status: "locked",
            icon: Zap
         },
         {
            id: 5,
            title: "Rendering & Compositing",
            desc: "Lighting, camera depth of field, and final render output.",
            tools: ["Cycles"],
            status: "locked",
            icon: Camera
         }
      ]
   };

   const currentStage = project.stages.find(s => s.status === 'current');

   return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-600 pb-20">

         {/* Cinematic Header (Centered) */}
         <div className="relative h-[350px] w-full bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center">
            <img
               src={project.thumbnail}
               alt="Course Hero"
               className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

            <div className="absolute top-6 left-6 z-20">
               <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold bg-black/20 backdrop-blur px-4 py-2 rounded-full"
               >
                  <ChevronLeft size={16} /> Back to Lab
               </button>
            </div>

            <div className="relative z-10 p-6 max-w-2xl mx-auto space-y-4">
               <div className="flex items-center justify-center gap-3">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-900/20">
                     {project.level}
                  </span>
                  <span className="text-white/60 text-xs font-mono tracking-widest border border-white/20 px-3 py-1 rounded-full">
                     {project.software}
                  </span>
               </div>

               <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{project.title}</h1>
               <p className="text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">{project.description}</p>
            </div>
         </div>

         {/* Main Content: Single Column */}
         <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">

            {/* Project Meta Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                     {currentStage ? <currentStage.icon size={24} /> : <Star size={24} />}
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current Stage</div>
                     <div className="font-bold text-slate-800">{currentStage?.title || "Complete"}</div>
                  </div>
               </div>

               <button
                  onClick={onStartLesson}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:-translate-y-0.5"
               >
                  Resume <Play size={16} fill="currentColor" />
               </button>
            </div>

            {/* Stages List */}
            <div className="space-y-4">
               {project.stages.map((stage, idx) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';
                  const isLocked = stage.status === 'locked';

                  return (
                     <div
                        key={stage.id}
                        className={`
                     relative flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300
                     ${isCurrent
                              ? 'bg-white border-orange-200 shadow-lg shadow-orange-100/50 scale-[1.02] z-10'
                              : 'bg-white border-slate-100 hover:border-slate-300'}
                     ${isLocked ? 'opacity-60 bg-slate-50' : 'cursor-pointer'}
                   `}
                        onClick={() => !isLocked && isCurrent && onStartLesson()}
                     >
                        {/* Status Icon */}
                        <div className={`
                       shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border-2
                       ${isCompleted ? 'bg-green-50 border-green-100 text-green-600' :
                              isCurrent ? 'bg-orange-500 border-orange-500 text-white' :
                                 'bg-slate-100 border-transparent text-slate-400'}
                    `}>
                           {isCompleted ? <CheckCircle2 size={20} /> :
                              isLocked ? <Lock size={18} /> :
                                 <stage.icon size={20} />}
                        </div>

                        <div className="flex-1">
                           <h3 className={`font-bold text-base mb-1 ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                              {stage.title}
                           </h3>
                           <p className="text-sm text-slate-500 leading-snug">{stage.desc}</p>
                        </div>

                        {isCurrent && (
                           <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100/50">
                              In Progress
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>

         </div>
      </div>
   );
};

export default BlenderPathView;