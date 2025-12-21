import React, { useState, useEffect, useCallback } from 'react';
import { Box, Move, RotateCw, Maximize, Grid3X3, Command, CheckCircle2, MousePointer2 } from 'lucide-react';
import { WorkshopBlock } from '../../../../types';

interface BlenderViewportPageProps {
  block: WorkshopBlock;
}

const BlenderViewportPage: React.FC<BlenderViewportPageProps> = ({ block }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentMode, setCurrentMode] = useState<'idle' | 'grab' | 'rotate' | 'scale'>('idle');
  const [activeAxis, setActiveAxis] = useState<string | null>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  
  // 3D Transform States
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
  const [rot, setRot] = useState({ x: -20, y: 45, z: 0 });
  const [scale, setScale] = useState(1);

  // Handle Keyboard Inputs
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    setLastKeyPressed(key);
    setTimeout(() => setLastKeyPressed(null), 200);

    // Mode switching
    if (key === 'G') setCurrentMode('grab');
    if (key === 'R') setCurrentMode('rotate');
    if (key === 'S') setCurrentMode('scale');
    if (key === 'ESCAPE') {
        setCurrentMode('idle');
        setActiveAxis(null);
    }

    // Axis constraints
    if (['X', 'Y', 'Z'].includes(key) && currentMode !== 'idle') {
        setActiveAxis(key);
    }

    // Simple interaction simulation: Apply change when key is pressed
    if (currentMode === 'grab') {
        if (key === 'Z') setPos(p => ({ ...p, y: p.y - 20 })); // Blender's Z is up (CSS Y)
        if (key === 'X') setPos(p => ({ ...p, x: p.x + 20 }));
    }
    if (currentMode === 'rotate') {
        setRot(r => ({ ...r, y: r.y + 15 }));
    }
    if (currentMode === 'scale') {
        if (key === 'ARROWUP') setScale(s => s + 0.1);
        if (key === 'ARROWDOWN') setScale(s => Math.max(0.1, s - 0.1));
    }
    
    // Auto-complete missions based on actions
    if (key === 'G' && activeStep === 1) setCompletedSteps(prev => [...new Set([...prev, 1])]);
    if (key === 'Z' && currentMode === 'grab' && activeStep === 1) setActiveStep(2);
  }, [currentMode, activeStep]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getCubeStyle = (): React.CSSProperties => {
    return {
      width: '100px', height: '100px', position: 'relative', transformStyle: 'preserve-3d',
      transition: 'all 0.3s ease-out',
      transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg) translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) scale(${scale})`
    };
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 lg:h-[80vh]">
      {/* Left: Mission Guide */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest mb-4">
            <Box size={14} />
            Live Simulator
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {block.goal}
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
            実際のキーボードでショートカットを押してください。<br/>
            (G: 移動, R: 回転, S: 拡大, X/Y/Z: 軸制限, ESC: 戻る)
          </p>
        </div>

        <div className="space-y-4">
          {block.steps.map((step, idx) => (
            <div key={idx} className={`p-6 rounded-[2rem] border-2 transition-all ${idx === activeStep ? 'border-orange-500 bg-white shadow-xl shadow-orange-100' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
               <div className="flex gap-4">
                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${completedSteps.includes(idx) ? 'bg-orange-500 border-transparent text-white' : 'text-slate-300'}`}>
                        {completedSteps.includes(idx) && <CheckCircle2 size={14} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-1">Step {idx + 1}</h3>
                        <p className="text-sm text-slate-600 font-medium">{step}</p>
                    </div>
               </div>
            </div>
          ))}
        </div>

        {/* Real-time Status */}
        <div className="mt-auto p-6 bg-slate-900 rounded-[2rem] text-white">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transform Data</span>
                <div className="flex gap-2">
                    {['X','Y','Z'].map(a => (
                        <span key={a} className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${activeAxis === a ? 'bg-orange-500' : 'bg-slate-800'}`}>{a}</span>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-orange-400">
                <div>LOC: {pos.x},{Math.round(pos.y*-1)},{pos.z}</div>
                <div>ROT: {Math.round(rot.y)}°</div>
                <div>SCL: {scale.toFixed(2)}</div>
            </div>
        </div>
      </div>

      {/* Right: Actual Viewport */}
      <div className="flex-[1.5] min-w-0 h-[600px] lg:h-auto bg-[#393939] rounded-[3rem] overflow-hidden border-4 border-[#282828] relative shadow-2xl group flex flex-col cursor-crosshair">
        
        {/* Interaction Info Overlay */}
        <div className="absolute top-8 left-8 z-10 space-y-2">
            <div className="bg-[#282828]/90 backdrop-blur px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 shadow-xl">
                <div className={`w-2 h-2 rounded-full ${currentMode !== 'idle' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {currentMode === 'idle' ? 'Object Selection' : `${currentMode} mode active`}
                </span>
            </div>
            {lastKeyPressed && (
                <div className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg animate-out fade-out zoom-out duration-500">
                    KEY: {lastKeyPressed}
                </div>
            )}
        </div>

        {/* Viewport View */}
        <div className="flex-1 relative flex items-center justify-center perspective-[1000px] overflow-hidden">
             {/* Dynamic Axis Lines */}
             {activeAxis === 'Z' && <div className="absolute h-full w-0.5 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] z-0"></div>}
             {activeAxis === 'X' && <div className="absolute w-full h-0.5 bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.5)] z-0"></div>}

             {/* Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] [transform:rotateX(75deg)_translateY(200px)] opacity-40"></div>

             {/* The Interactive Cube */}
             <div style={getCubeStyle()} className="group/cube">
                {[
                  { transform: 'rotateY(0deg) translateZ(50px)', bg: 'bg-orange-500' },
                  { transform: 'rotateY(180deg) translateZ(50px)', bg: 'bg-orange-600' },
                  { transform: 'rotateY(90deg) translateZ(50px)', bg: 'bg-orange-400' },
                  { transform: 'rotateY(-90deg) translateZ(50px)', bg: 'bg-orange-400' },
                  { transform: 'rotateX(90deg) translateZ(50px)', bg: 'bg-orange-300' },
                  { transform: 'rotateX(-90deg) translateZ(50px)', bg: 'bg-orange-700' },
                ].map((face, i) => (
                    <div key={i} className={`absolute inset-0 border border-white/20 ${face.bg} ${currentMode !== 'idle' ? 'opacity-80' : ''}`} style={{ transform: face.transform, backfaceVisibility: 'hidden' }} />
                ))}
                {/* Outline */}
                <div className={`absolute -inset-1 border-2 border-white transition-opacity ${currentMode !== 'idle' ? 'opacity-100' : 'opacity-20'}`}></div>
             </div>
        </div>

        {/* Shortcuts Tray */}
        <div className="p-8 bg-[#282828] border-t border-white/5 flex justify-between items-center">
            <div className="flex gap-3">
                {[
                    { key: 'G', label: 'Grab', active: currentMode === 'grab' },
                    { key: 'R', label: 'Rotate', active: currentMode === 'rotate' },
                    { key: 'S', label: 'Scale', active: currentMode === 'scale' },
                ].map(k => (
                    <div key={k.key} className={`flex flex-col items-center gap-1 transition-all ${k.active ? 'scale-110' : 'opacity-40'}`}>
                        <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-lg ${
                            k.active ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-[#333] border-white/5 text-white/50'
                        } ${lastKeyPressed === k.key ? 'translate-y-1 shadow-inner' : ''}`}>
                            {k.key}
                        </div>
                        <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">{k.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="bg-[#1a1a1a] px-3 py-1 rounded-lg border border-white/5 flex items-center gap-2">
                    <Command size={10} className="text-slate-500" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Press ESC to Cancel</span>
                </div>
                <div className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-1">Lumina Viewport Engine v1.0</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlenderViewportPage;