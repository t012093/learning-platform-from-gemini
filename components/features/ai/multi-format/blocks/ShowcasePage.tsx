import React from 'react';
import { Film, Gamepad2, Building2, User, Sparkles, ArrowDown } from 'lucide-react';
import { ShowcaseBlock } from '../../../../types';

interface ShowcasePageProps {
  block: ShowcaseBlock;
}

const ShowcasePage: React.FC<ShowcasePageProps> = ({ block }) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'film': return <Film size={32} />;
      case 'game': return <Gamepad2 size={32} />;
      case 'arch': return <Building2 size={32} />;
      case 'char': return <User size={32} />;
      default: return <Sparkles size={32} />;
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white overflow-hidden rounded-[3rem] relative shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center p-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-orange-300 font-bold uppercase text-xs tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles size={14} />
          Welcome to the new world
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent animate-in fade-in zoom-in duration-1000">
          {block.title}
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 delay-300 duration-700">
          {block.subtitle}
        </p>

        <div className="animate-bounce absolute bottom-8 opacity-50">
            <ArrowDown size={24} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {block.features.map((feature, idx) => (
                <div 
                    key={idx} 
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                        {getIcon(feature.icon)}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Mentor Message */}
      <div className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-pink-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl">
                    <Sparkles size={40} className="text-orange-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">"Let's create something amazing."</h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    {block.mentorMessage}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;
