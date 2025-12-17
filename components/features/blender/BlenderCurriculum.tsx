import React, { useState } from 'react';
import {
  Box, Layers, Play, Clock, Zap, Palette, Move3d,
  ChevronRight, Star, Command, Cuboid
} from 'lucide-react';
import { ViewState } from '../../../types';

interface BlenderCurriculumProps {
  onNavigate: (view: ViewState) => void;
}

const BLENDER_COURSES = [
  {
    id: 'b1',
    title: 'The Donut Tutorial',
    titleJp: 'ドーナツ・チュートリアル',
    desc: 'Blenderの登竜門。モデリング、スカルプト、レンダリングの基礎をドーナツ制作を通して学ぶ。',
    thumbnail: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&q=80&w=800',
    level: 'Beginner',
    duration: '4h 30m',
    tags: ['Modeling', 'Shading', 'Particles'],
    progress: 100,
    recommended: true,
    badge: 'MUST START'
  },
  {
    id: 'b2',
    title: 'Low Poly Isometric Room',
    titleJp: 'ローポリ・アイソメトリックルーム',
    desc: 'ハードサーフェスモデリング、ライティング、そして魅力的な構図の作り方。',
    thumbnail: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=800',
    level: 'Beginner',
    duration: '3h 15m',
    tags: ['Hard Surface', 'Lighting', 'Composition'],
    progress: 45
  },
  {
    id: 'b3',
    title: 'Cozy Character Sculpting',
    titleJp: 'キャラクター・スカルプティング',
    desc: '有機的な形状のスカルプト、リメッシュ、そしてキャラクターリギングの基礎。',
    thumbnail: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
    level: 'Intermediate',
    duration: '6h 00m',
    tags: ['Sculpting', 'Character', 'Rigging'],
    progress: 0
  },
  {
    id: 'b4',
    title: 'Procedural Geometry Nodes',
    titleJp: 'ジオメトリノードの魔術',
    desc: 'ノードベースのワークフローで、無限のバリエーションを持つ植物や建物を生成する。',
    thumbnail: 'https://images.unsplash.com/photo-1633412803524-d96562450871?auto=format&fit=crop&q=80&w=800',
    level: 'Advanced',
    duration: '8h 20m',
    tags: ['Geo Nodes', 'Math', 'Procedural'],
    progress: 0
  },
  {
    id: 'b5',
    title: 'Realistic Product Viz',
    titleJp: '写実的プロダクトビジュアライズ',
    desc: 'スタジオライティング、ガラスマテリアル、そしてCMのような流体シミュレーション。',
    thumbnail: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=800',
    level: 'Intermediate',
    duration: '5h 45m',
    tags: ['Physics', 'Cycles', 'Commercial'],
    progress: 0
  }
];

const BlenderCurriculum: React.FC<BlenderCurriculumProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');

  const handleProjectClick = () => {
    onNavigate(ViewState.BLENDER_PATH);
  };

  return (
    <div className="min-h-screen font-sans pb-20 bg-slate-50 transition-colors duration-500">

      {/* Header Info */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="border p-2 rounded-xl bg-white border-slate-200 text-orange-500">
            <Box size={20} />
          </div>
          <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">
            3D Lab v1.0
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">
          何を<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">創造</span>しますか？
        </h1>
        <p className="text-lg max-w-xl text-slate-600">
          頂点を操作し、光を操り、あなたの想像力を3次元の世界へ解き放ちましょう。
        </p>
      </div>

      {/* Active Track Description (Static for Blender for now) */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="border rounded-xl p-6 flex items-start gap-4 bg-orange-50/30 border-orange-100 shadow-sm">
          <div className="p-3 rounded-lg bg-orange-500/10">
            <Move3d size={20} className="text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-base mb-1 text-slate-800">Blenderとは？</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              世界で最も人気のあるオープンソース3DCG制作スイート。モデリング、アニメーション、VFXまでこれ一つで完結します。
            </p>
          </div>
        </div>
      </div>

      {/* Course Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLENDER_COURSES.map(course => (
          <div
            key={course.id}
            onClick={handleProjectClick}
            className={`
              group rounded-2xl cursor-pointer transition-all overflow-hidden flex flex-col h-full relative border
              bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-100 hover:-translate-y-1
            `}
          >
            {/* Image Section (Top, Fixed Height) */}
            <div className="h-48 w-full relative overflow-hidden shrink-0 bg-slate-100">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                {course.badge && (
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                    {course.badge}
                  </div>
                )}
                {course.recommended && (
                  <div className="bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-orange-100 flex items-center gap-1">
                    <Star size={10} className="fill-orange-600" /> 必修
                  </div>
                )}
              </div>
            </div>

            {/* Content Section (Bottom) */}
            <div className="flex-1 p-6 flex flex-col relative">

              {/* Title Area */}
              <div className="mb-3">
                <h3 className="font-bold text-lg leading-tight mb-1 transition-colors text-slate-800 group-hover:text-orange-600">
                  {course.titleJp || course.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed flex-1">
                {course.desc}
              </p>

              {/* Footer Info */}
              <div className="pt-4 border-t flex items-center justify-between border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                    {course.level}
                  </span>
                  <span className="text-xs font-medium flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} /> {course.duration}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-50 text-slate-400 group-hover:bg-orange-500 group-hover:text-white">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Helper Card: Coming Soon */}
        <div className="text-center py-24 border border-dashed rounded-3xl border-slate-300 flex flex-col items-center justify-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Cuboid size={20} />
          </div>
          <p className="text-slate-500 font-medium">More projects coming soon...</p>
        </div>
      </div>

      {/* Footer / Tip */}
      <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <p className="text-slate-500 text-sm">
          Pro Tip: <span className="text-slate-400 font-mono">B</span> でボックス選択、 <span className="text-slate-400 font-mono">C</span> でサークル選択が可能です。
        </p>
      </div>

    </div>
  );
};

export default BlenderCurriculum;