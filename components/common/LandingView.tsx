import React from 'react';
import { ArrowRight, Sparkles, Brain, Palette, Code2, Rocket } from 'lucide-react';

interface LandingViewProps {
    onLoginClick: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLoginClick }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Lumina</span>
                    </div>
                    <button
                        onClick={onLoginClick}
                        className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium backdrop-blur-sm"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Ambient Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
                        AI-Powered Learning Platform
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
                        Master the Future <br /> of <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Code & Art</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
                        A personalized learning journey powered by advanced AI tutors.
                        From Web Development to Generative Art, unlock your creative potential today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                        <button
                            onClick={onLoginClick}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                        >
                            <Rocket className="w-5 h-5" />
                            Start Learning Now
                        </button>
                        <button
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition-colors"
                        >
                            View Curriculum
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-900/50 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                <Brain className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Diagnosis & Tutors</h3>
                            <p className="text-slate-400">
                                Get matched with an AI partner (Spark, Focus, Vibe, etc.) based on your personality and learning style.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Interactive Coding</h3>
                            <p className="text-slate-400">
                                Hands-on projects from "Web Studio" to "Vibe Coding". Learn by building real applications.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                                <Palette className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Art & History</h3>
                            <p className="text-slate-400">
                                Explore the intersection of traditional art history and modern generative AI tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                <p>&copy; 2024 Lumina Platform. All rights reserved.</p>
            </footer>

        </div>
    );
};

export default LandingView;
