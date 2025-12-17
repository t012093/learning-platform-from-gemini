import React, { useState } from 'react';
import {
    User, LogOut, RotateCcw
} from 'lucide-react';
import { ViewState } from '../types';

interface ProfilePassportProps {
    onNavigate: (view: ViewState) => void;
}

const ProfilePassport: React.FC<ProfilePassportProps> = ({ onNavigate }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Mock User Data
    const user = {
        name: "Alex Smith",
        id: "LUM-8829-XJ",
        role: "Cadet Engineer",
        level: 12,
        xp: 4580,
        streak: 5,
        joined: "2024.11.01",
        email: "alex.smith@lumina.edu",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400"
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center pt-12 pb-20 px-4 md:pt-24">

            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-2">Student ID</h1>
                <p className="text-slate-500">Manage your identity and credentials.</p>
            </div>

            {/* 3D Flip Container - Using inline styles for reliable 3D transforms */}
            <div
                className="relative w-full max-w-[480px] h-[300px] group"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="relative w-full h-full transition-all duration-700"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >

                    {/* FRONT: The ID Card */}
                    <div
                        className={`absolute inset-0 ${isFlipped ? 'pointer-events-none' : ''}`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-white via-slate-50 to-slate-200 rounded-3xl shadow-2xl overflow-hidden border border-white/60 relative flex flex-col ring-1 ring-white/50">

                            {/* Gloss Overlay */}
                            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-60 mix-blend-overlay"></div>
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none z-20 opacity-80"></div>

                            {/* Background Art */}
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
                                {/* Grid Pattern */}
                                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.2 }}></div>
                            </div>

                            {/* Card Content */}
                            <div className="relative z-10 p-6 flex flex-col h-full justify-between">

                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-900/20">L</div>
                                        <div>
                                            <span className="block font-bold tracking-tight text-slate-800 text-sm leading-none">Lumina Campus</span>
                                            <span className="text-[10px] text-slate-500 font-mono">ID CARD</span>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-100/80 backdrop-blur-sm text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200/50 shadow-sm">
                                        Active
                                    </div>
                                </div>

                                {/* Main Identity */}
                                <div className="flex gap-5 items-center mt-2">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-inner border-[3px] border-white shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform ring-1 ring-slate-100">
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-1 drop-shadow-sm">{user.name}</h2>
                                        <p className="text-xs font-semibold text-indigo-700 bg-indigo-50/80 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit border border-indigo-100">{user.role}</p>
                                    </div>
                                </div>

                                {/* Footer Stats & Action */}
                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex gap-5">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</div>
                                            <div className="text-lg font-bold text-slate-800 leading-none mt-0.5">{user.level}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">XP</div>
                                            <div className="text-lg font-bold text-slate-800 leading-none mt-0.5">{user.xp}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsFlipped(true)}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-indigo-200 shadow-sm px-3 py-1.5 rounded-full"
                                    >
                                        <RotateCcw size={10} /> Flip
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* BACK: Settings / Data */}
                    <div
                        className={`absolute inset-0 ${!isFlipped ? 'pointer-events-none' : ''}`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50 relative text-slate-300 flex flex-col ring-1 ring-white/10">

                            {/* Gloss Overlay */}
                            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-30"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10"></div>

                            {/* Chip Visual */}
                            <div className="absolute top-6 right-6 w-10 h-8 rounded bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-[0_2px_10px_rgba(251,191,36,0.4)] border border-amber-300 flex items-center justify-center z-30">
                                <div className="w-6 h-full border-l border-r border-amber-600/30 mx-auto bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-50"></div>
                            </div>


                            <div className="relative z-10 p-6 flex flex-col h-full justify-between">

                                <div>
                                    <h3 className="font-bold text-white text-sm">System Access</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Restricted Area</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Student ID</label>
                                        <div className="font-mono text-xs text-white tracking-widest bg-black/30 px-2 py-1.5 rounded border border-white/10 w-fit">
                                            {user.id}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Email</label>
                                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {user.email}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">API Key</label>
                                        <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded border border-white/10 text-xs">
                                            <span className="font-mono text-slate-400">sk-•••••••••</span>
                                            <button className="ml-auto text-[9px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-white transition-colors border border-white/5">
                                                Show
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors">
                                        <LogOut size={12} /> Sign Out
                                    </button>
                                    <button
                                        onClick={() => setIsFlipped(false)}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Front <RotateCcw size={12} />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Helper Text */}
            <div className="mt-8 text-center opacity-60">
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    This digital ID grants you access to all Lumina facilities including the Vibe Coding cockpit and the Art Atelier.
                </p>
            </div>

        </div>
    );
};

export default ProfilePassport;
