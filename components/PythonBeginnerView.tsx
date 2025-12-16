import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Play, RefreshCw, CheckCircle2, 
  Terminal, BookOpen, BarChart3, ChevronDown, 
  ChevronRight, Circle, PlayCircle, Lock
} from 'lucide-react';

interface PythonBeginnerViewProps {
  onBack: () => void;
}

const PythonBeginnerView: React.FC<PythonBeginnerViewProps> = ({ onBack }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [showPlot, setShowPlot] = useState(false);
  
  const initialCode = `# Let's analyze some sales data
import pandas as pd

data = {
    'Fruit': ['Apples', 'Bananas', 'Cherries'],
    'Sales': [120, 200, 150]
}

df = pd.DataFrame(data)

# Calculate total sales
total = df['Sales'].sum()
print(f"Total Sales: {total}")

# Display the top seller
print("Top Seller:")
print(df.loc[df['Sales'].idxmax()])`;

  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const curriculum = [
    { id: 1, title: '01. Variables & Types', status: 'completed' },
    { id: 2, title: '02. Lists & Dictionaries', status: 'completed' },
    { id: 3, title: '03. Data Analysis Intro', status: 'active' },
    { id: 4, title: '04. Visualizing Data', status: 'locked' },
  ];

  const runCode = () => {
    setIsRunning(true);
    setConsoleOutput(null);
    setShowPlot(false);

    // Simulate Python execution delay
    setTimeout(() => {
      setIsRunning(false);
      
      // Simple logic to check if the code still vaguely resembles the solution
      // In a real app, this would send 'code' to a backend execution environment
      if (code.includes("sum()") && code.includes("idxmax()")) {
         setConsoleOutput(`Total Sales: 470
Top Seller:
Fruit    Bananas
Sales        200
Name: 1, dtype: object`);
         setShowPlot(true);
      } else {
         // Fallback output if they changed the logic significantly
         setConsoleOutput(`Traceback (most recent call last):
  File "<stdin>", line 8, in <module>
  // Simulation: Code structure changed significantly.
  // Result may vary based on your edits.`);
      }

    }, 1500);
  };

  // Simple syntax highlighter function
  const renderHighlightedCode = (sourceCode: string) => {
    return sourceCode.split('\n').map((line, i) => (
      <div key={i} className="whitespace-pre min-h-[1.5em]">
          {line.length === 0 ? <br /> : 
           line.trim().startsWith('#') ? <span className="text-green-600 italic">{line}</span> :
           (
             <span>
               {line.split(/(\s+|[(){}=[\],'])/).map((token, j) => {
                 if (['import', 'as', 'print', 'def', 'return'].includes(token)) return <span key={j} className="text-purple-400">{token}</span>;
                 if (['pandas', 'pd', 'DataFrame', 'sum', 'idxmax', 'loc'].includes(token)) return <span key={j} className="text-blue-300">{token}</span>;
                 if (!isNaN(Number(token))) return <span key={j} className="text-orange-300">{token}</span>;
                 if (token.startsWith("'") || token.startsWith('"') || token.endsWith("'") || token.endsWith('"')) return <span key={j} className="text-yellow-300">{token}</span>;
                 return <span key={j} className="text-slate-300">{token}</span>;
               })}
             </span>
           )
          }
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-300 font-sans selection:bg-yellow-500/30">
      
      {/* Navbar - Python Style */}
      <div className="border-b border-slate-800 bg-[#0f111a]/95 backdrop-blur sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-yellow-500 flex items-center justify-center text-white font-bold shadow-lg">
                Py
             </div>
             <div>
               <h1 className="font-bold text-slate-100 text-sm">Data Science Bootcamp</h1>
               <div className="flex items-center gap-2">
                 <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-yellow-500"></div>
                 </div>
                 <span className="text-[10px] text-slate-500 font-mono">Module 3/10</span>
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex px-3 py-1 bg-slate-800/50 rounded border border-slate-700 items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-slate-400">Kernel Ready</span>
           </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        
        {/* Left Sidebar: Curriculum Map */}
        <div className="w-64 border-r border-slate-800 hidden lg:flex flex-col bg-[#0f111a]">
           <div className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Notebooks</h3>
              <div className="space-y-1">
                 {curriculum.map((item) => {
                    const isActive = item.status === 'active';
                    const isCompleted = item.status === 'completed';
                    const isLocked = item.status === 'locked';

                    return (
                       <button 
                         key={item.id}
                         disabled={isLocked}
                         className={`
                           w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                           ${isActive ? 'bg-slate-800 text-yellow-400 border-l-2 border-yellow-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
                           ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                         `}
                       >
                          {isCompleted ? <CheckCircle2 size={16} className="text-green-500" /> : 
                           isLocked ? <Lock size={16} /> : 
                           <PlayCircle size={16} className={isActive ? 'text-yellow-400' : 'text-slate-500'} />}
                          {item.title}
                       </button>
                    );
                 })}
              </div>
           </div>
           
           <div className="mt-auto p-4 border-t border-slate-800">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                 <h4 className="text-blue-400 text-xs font-bold mb-1 flex items-center gap-1">
                    <BookOpen size={12}/> Documentation
                 </h4>
                 <p className="text-[10px] text-slate-400 leading-relaxed">
                    Pandas <code>DataFrame</code> is a 2-dimensional labeled data structure.
                 </p>
              </div>
           </div>
        </div>

        {/* Main Content: The Notebook Interface */}
        <div className="flex-1 overflow-y-auto bg-[#0d0e14]">
           <div className="max-w-4xl mx-auto p-6 space-y-8">
              
              {/* Context / Theory Cell */}
              <div className="prose prose-invert prose-slate max-w-none">
                 <h1>Introduction to Data Analysis</h1>
                 <p className="text-lg text-slate-400">
                    Now that we understand lists and dictionaries, let's look at <strong>Pandas</strong>. 
                    It's the most popular library for data manipulation. Think of it like "Excel for Python".
                 </p>
                 <div className="not-prose bg-slate-900/50 border border-slate-800 rounded-xl p-4 my-4 flex gap-4 items-start">
                    <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500 mt-1">
                       <Terminal size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-200 text-sm mb-1">Concept: The DataFrame</h3>
                       <p className="text-sm text-slate-400">
                          A <code>DataFrame</code> creates a table from your data. It organizes data into rows and columns, making it easy to summarize.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Interactive Code Cell */}
              <div className={`
                 group rounded-xl border-2 transition-all overflow-hidden bg-[#1e1e1e] shadow-2xl relative
                 ${isRunning ? 'border-yellow-500/50' : 'border-slate-800 hover:border-slate-700'}
              `}>
                 {/* Cell Toolbar */}
                 <div className="bg-[#252526] px-4 py-2 flex justify-between items-center border-b border-[#333]">
                    <span className="text-xs font-mono text-slate-500">In [1]:</span>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={runCode}
                         disabled={isRunning}
                         className={`
                           flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all
                           ${isRunning 
                             ? 'bg-slate-700 text-slate-400 cursor-wait' 
                             : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'}
                         `}
                       >
                          {isRunning ? <RefreshCw size={14} className="animate-spin"/> : <Play size={14} fill="currentColor"/>}
                          Run Cell
                       </button>
                    </div>
                 </div>

                 {/* Code Editor Area */}
                 <div className="p-4 font-mono text-sm leading-relaxed relative min-h-[200px] flex">
                    
                    {/* Line Numbers */}
                    <div className="text-slate-600 select-none text-right pr-4 border-r border-slate-800 mr-4 w-8 shrink-0">
                       {code.split('\n').map((_, i) => (
                          <div key={i} className="min-h-[1.5em]">{i + 1}</div>
                       ))}
                    </div>
                    
                    {/* Editor Container */}
                    <div className="relative flex-1">
                      
                      {/* 1. Syntax Highlight Layer (Bottom) */}
                      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                        {renderHighlightedCode(code)}
                      </div>

                      {/* 2. Transparent Editable Layer (Top) */}
                      <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white resize-none outline-none z-10 font-mono leading-relaxed"
                        spellCheck="false"
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                      />
                    </div>
                 </div>
              </div>

              {/* Output Cell */}
              {(consoleOutput || isRunning) && (
                 <div className="pl-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-2">
                       <div className="w-1 bg-slate-700 rounded-full"></div>
                       <div className="flex-1 space-y-4">
                          {/* Text Output */}
                          {consoleOutput && (
                             <div className="font-mono text-sm text-slate-300 bg-black/30 p-4 rounded-lg border border-slate-800/50">
                                <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                             </div>
                          )}

                          {/* Graphical Output (Mock) */}
                          {showPlot && (
                             <div className="bg-white p-4 rounded-lg border border-slate-200 w-full max-w-sm">
                                <h4 className="text-slate-900 font-bold text-xs mb-2 text-center">Sales Distribution</h4>
                                <div className="flex items-end justify-center gap-4 h-32 border-b border-slate-200 pb-2">
                                   <div className="w-12 bg-blue-500 rounded-t h-[60%] relative group">
                                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100">120</span>
                                   </div>
                                   <div className="w-12 bg-yellow-400 rounded-t h-[100%] relative group">
                                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100">200</span>
                                   </div>
                                   <div className="w-12 bg-red-500 rounded-t h-[75%] relative group">
                                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100">150</span>
                                   </div>
                                </div>
                                <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-500 font-medium">
                                   <span className="w-12 text-center">Apples</span>
                                   <span className="w-12 text-center">Bananas</span>
                                   <span className="w-12 text-center">Cherries</span>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              )}

              {/* Next Steps */}
              {showPlot && (
                 <div className="mt-8 p-6 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-2xl flex items-center justify-between animate-in zoom-in duration-300">
                    <div>
                       <h3 className="text-green-400 font-bold text-lg mb-1">Excellent work!</h3>
                       <p className="text-slate-400 text-sm">You've successfully analyzed your first dataset.</p>
                    </div>
                    <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-colors">
                       Next Lesson <ChevronRight size={16} />
                    </button>
                 </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};

export default PythonBeginnerView;