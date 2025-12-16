import React from 'react';
import { Course } from '../types';
import { COURSES_DATA } from '../services/curriculumData';
import { Briefcase } from 'lucide-react';

interface CourseListProps {
  onSelectCourse: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onSelectCourse }) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Curriculum</h1>
        <p className="text-slate-500 mt-2">Choose a path to boost your fluency.</p>
        
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Business', 'Test Prep'].map((cat, i) => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border
                ${i === 0 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES_DATA.map((course) => (
          <div 
            key={course.id} 
            onClick={() => onSelectCourse(course.id)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-2">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4 flex-1">{course.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-4">
                 <div className="flex items-center gap-1">
                   <Briefcase size={14} /> 
                   <span>{course.totalLessons} Lessons</span>
                 </div>
              </div>

              {course.progress > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{course.progress}% Completed</span>
                    <span>{course.completedLessons}/{course.totalLessons}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${course.color} h-full rounded-full`} 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                </div>
              ) : (
                <button className="w-full py-3 text-center text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                  Start Learning
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;