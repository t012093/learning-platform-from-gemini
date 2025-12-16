import React from 'react';
import { Course } from '../types';
import { ArrowLeft, CheckCircle, Lock, Play, Star } from 'lucide-react';

interface CoursePathViewProps {
  course: Course;
  onStartLesson: () => void;
  onBack: () => void;
}

const CoursePathView: React.FC<CoursePathViewProps> = ({ course, onStartLesson, onBack }) => {
  // Mock Weeks Structure
  const weeks = [
    { id: 1, title: 'Week 1: Core Templates', desc: 'Master the "I’m exploring..." pattern.', status: 'completed' },
    { id: 2, title: 'Week 2: Logic & Linking', desc: 'Connecting ideas with "Therefore" & "However".', status: 'current' },
    { id: 3, title: 'Week 3: Softening & Safety', desc: 'Sounding professional, not aggressive.', status: 'locked' },
    { id: 4, title: 'Week 4: Public Output', desc: 'Bio, Event intro, and Q&A statements.', status: 'locked' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="relative bg-slate-900 text-white pb-20 pt-8">
        <div className="absolute inset-0 overflow-hidden">
          <img src={course.thumbnail} alt="Background" className="w-full h-full object-cover opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 font-medium"
          >
            <ArrowLeft size={20} /> Back to Curriculum
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
             <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold">{course.title.charAt(0)}</span>
             </div>
             <div className="flex-1">
               <div className="flex gap-3 mb-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.color.replace('bg-', 'text-')} bg-white`}>
                    {course.category}
                 </span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
               <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">{course.description}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Path Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-10 pb-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Your Learning Path</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
               <Star className="text-yellow-400 fill-yellow-400" size={18} />
               <span>4 Weeks / 12 Lessons</span>
            </div>
          </div>

          <div className="space-y-0 relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-100 rounded-full"></div>

            {weeks.map((week, index) => {
               const isLast = index === weeks.length - 1;
               const isLocked = week.status === 'locked';
               const isCurrent = week.status === 'current';
               const isCompleted = week.status === 'completed';

               return (
                 <div key={week.id} className={`relative flex gap-6 ${!isLast ? 'mb-8' : ''}`}>
                   {/* Status Icon */}
                   <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 transition-all
                      ${isCompleted ? 'bg-green-100 border-white text-green-600' : 
                        isCurrent ? 'bg-indigo-600 border-indigo-100 text-white shadow-lg shadow-indigo-200' : 
                        'bg-slate-100 border-white text-slate-300'}
                   `}>
                      {isCompleted ? <CheckCircle size={28} /> : 
                       isLocked ? <Lock size={24} /> : 
                       <span className="font-bold text-xl">{week.id}</span>}
                   </div>

                   {/* Card Content */}
                   <div className={`
                      flex-1 p-5 rounded-2xl border transition-all
                      ${isCurrent 
                        ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' 
                        : 'bg-slate-50 border-slate-100 opacity-80'}
                   `}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-bold text-lg mb-1 ${isCurrent ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {week.title}
                          </h3>
                          <p className="text-slate-500 text-sm">{week.desc}</p>
                        </div>
                        {isCurrent && (
                          <button 
                            onClick={onStartLesson}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-transform active:scale-95 flex items-center gap-2"
                          >
                            Start <Play size={14} fill="currentColor" />
                          </button>
                        )}
                      </div>
                      
                      {isCurrent && (
                        <div className="mt-4 flex gap-2">
                           <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">3 Lessons</span>
                           <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">1 Quiz</span>
                        </div>
                      )}
                   </div>
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePathView;