import React, { useState } from 'react';
import { ViewState } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CoursePathView from './components/CoursePathView';
import AITutor from './components/AITutor';
import LessonView from './components/LessonView';
import Library from './components/Library';
import BlenderCurriculum from './components/BlenderCurriculum';
import BlenderPathView from './components/BlenderPathView';
import BlenderLessonView from './components/BlenderLessonView';
import ProgrammingCurriculum from './components/ProgrammingCurriculum';
import ProgrammingCourseView from './components/ProgrammingCourseView';
import PythonBeginnerView from './components/PythonBeginnerView';
import HtmlCssView from './components/HtmlCssView';
import HtmlCssPathView from './components/HtmlCssPathView';
import HtmlCssPartTwoView from './components/HtmlCssPartTwoView';
import WebInspectorView from './components/WebInspectorView';
import VibePrologueView from './components/VibePrologueView';
import VibeChapterOneView from './components/VibeChapterOneView';
import VibeChapterTwoView from './components/VibeChapterTwoView';
import VibeChapterThreeView from './components/VibeChapterThreeView';
import VibeChapterFiveView from './components/VibeChapterFiveView';
import VibePathView from './components/VibePathView';
import ArtMuseumView from './components/ArtMuseumView';
import ArtHistoryView from './components/ArtHistoryView';
import ArtPeriodDetailView from './components/ArtPeriodDetailView';
import ArtKintsugiView from './components/ArtKintsugiView';
import ArtCurriculumView from './components/ArtCurriculumView';
import ArtIntroView from './components/ArtIntroView';
import ArtCraftsView from './components/ArtCraftsView';
import ArtCraftDetailView from './components/ArtCraftDetailView';
import ArtTribalView from './components/ArtTribalView'; // New
import ArtTribalDetailView from './components/ArtTribalDetailView';
import LearningHub from './components/LearningHub'; // New
import SonicLabView from './components/SonicLabView';
import SonicSynthView from './components/SonicSynthView';
import LoginModal from './components/LoginModal';
import { getCourseById } from './services/curriculumData';
import { User, Settings, Bell, Shield } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';

const ProfilePlaceholder: React.FC = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="h-32 bg-indigo-600"></div>
      <div className="px-8 pb-8">
        <div className="relative -top-12 mb-[-12px] flex justify-between items-end">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
              <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Edit Profile</button>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mt-4">Alex Johnson</h1>
        <p className="text-slate-500">Passionate Learner • Level 12</p>

        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Settings size={20} /></div>
              <span className="font-medium text-slate-700">Account Settings</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Bell size={20} /></div>
              <span className="font-medium text-slate-700">Notifications</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg text-green-600"><Shield size={20} /></div>
              <span className="font-medium text-slate-700">Privacy & Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Art Language State
  const [artLanguage, setArtLanguage] = useState<'en' | 'jp'>('en');
  // Vibe Language State
  const [vibeLanguage, setVibeLanguage] = useState<'en' | 'jp'>('en');

  // Selected Craft/Tribal State
  const [selectedCraftId, setSelectedCraftId] = useState<string | null>(null);
  const [selectedTribalId, setSelectedTribalId] = useState<string | null>(null);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView(ViewState.COURSE_DETAILS);
  };

  const handleStartLessonAttempt = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setCurrentView(ViewState.LESSON);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setCurrentView(ViewState.LESSON);
  };

  // Helper to navigate to a specific craft
  const handleCraftSelect = (craftId: string) => {
    setSelectedCraftId(craftId);
    if (craftId === 'kintsugi') {
      setCurrentView(ViewState.ART_KINTSUGI);
    } else {
      setCurrentView(ViewState.ART_CRAFT_DETAIL);
    }
  };

  // Helper to navigate to tribal section
  const handleTribalSelect = (chapterId: string) => {
    setSelectedTribalId(chapterId);
    setCurrentView(ViewState.ART_TRIBAL_DETAIL);
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.LEARNING_HUB:
        return <LearningHub onNavigate={setCurrentView} />;
      case ViewState.COURSES:
        return <CourseList onSelectCourse={handleCourseSelect} />;
      case ViewState.COURSE_DETAILS:
        const course = selectedCourseId ? getCourseById(selectedCourseId) : null;
        if (!course) return <CourseList onSelectCourse={handleCourseSelect} />;
        return (
          <CoursePathView
            course={course}
            onStartLesson={handleStartLessonAttempt}
            onBack={() => setCurrentView(ViewState.COURSES)}
          />
        );
      case ViewState.BLENDER:
        return <BlenderCurriculum onNavigate={setCurrentView} />;
      case ViewState.BLENDER_PATH:
        return <BlenderPathView
          onBack={() => setCurrentView(ViewState.BLENDER)}
          onStartLesson={() => setCurrentView(ViewState.BLENDER_LESSON)}
        />;
      case ViewState.BLENDER_LESSON:
        return <BlenderLessonView
          onBack={() => setCurrentView(ViewState.BLENDER_PATH)}
          onComplete={() => setCurrentView(ViewState.BLENDER_PATH)}
        />;
      case ViewState.PROGRAMMING:
      case ViewState.PROGRAMMING_WEB:
        return <ProgrammingCurriculum onNavigate={setCurrentView} initialTrack="web" />;
      case ViewState.PROGRAMMING_AI:
        return <ProgrammingCurriculum onNavigate={setCurrentView} initialTrack="ai" />;

      // Detailed Programming Paths
      case ViewState.PROGRAMMING_PATH:
        return <ProgrammingCourseView onBack={() => setCurrentView(ViewState.PROGRAMMING)} />;
      case ViewState.PYTHON_COURSE:
        return <PythonBeginnerView onBack={() => setCurrentView(ViewState.PROGRAMMING_AI)} />;
      case ViewState.HTML_CSS_PATH:
        return <HtmlCssPathView
          onBack={() => setCurrentView(ViewState.PROGRAMMING_WEB)}
          onNavigate={setCurrentView}
        />;
      case ViewState.HTML_CSS_COURSE:
        return <HtmlCssView onBack={() => setCurrentView(ViewState.HTML_CSS_PATH)} />;
      case ViewState.HTML_CSS_PART_TWO:
        return <HtmlCssPartTwoView onBack={() => setCurrentView(ViewState.HTML_CSS_PATH)} />;
      case ViewState.WEB_INSPECTOR:
        return <WebInspectorView onBack={() => setCurrentView(ViewState.HTML_CSS_PATH)} onNavigate={setCurrentView} />;

      case ViewState.PROGRAMMING_VIBE:
      case ViewState.VIBE_PATH:
        return <VibePathView
          onBack={() => setCurrentView(ViewState.LEARNING_HUB)}
          onNavigate={setCurrentView}
          language={vibeLanguage}
          setLanguage={setVibeLanguage}
        />;
      case ViewState.VIBE_PROLOGUE:
        return <VibePrologueView
          onBack={() => setCurrentView(ViewState.VIBE_PATH)}
          onNavigate={setCurrentView}
          language={vibeLanguage}
          setLanguage={setVibeLanguage}
        />;
      case ViewState.VIBE_CHAPTER_1:
        return <VibeChapterOneView
          onBack={() => setCurrentView(ViewState.VIBE_PATH)}
          onNavigate={setCurrentView}
          language={vibeLanguage}
          setLanguage={setVibeLanguage}
        />;
      case ViewState.VIBE_CHAPTER_2:
        return <VibeChapterTwoView
          onBack={() => setCurrentView(ViewState.VIBE_PATH)}
          onNavigate={setCurrentView}
          language={vibeLanguage}
          setLanguage={setVibeLanguage}
        />;
      case ViewState.VIBE_CHAPTER_3:
        return <VibeChapterThreeView
          onBack={() => setCurrentView(ViewState.VIBE_PATH)}
          onNavigate={setCurrentView}
          language={vibeLanguage}
          setLanguage={setVibeLanguage}
        />;
      case ViewState.VIBE_CHAPTER_5:
        return <VibeChapterFiveView
          onBack={() => setCurrentView(ViewState.VIBE_PATH)}
          onNavigate={setCurrentView}
          language={vibeLanguage}
          setLanguage={setVibeLanguage}
        />;

      // Art Routes
      case ViewState.ART_MUSEUM:
        return <ArtMuseumView onNavigate={setCurrentView} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_HISTORY:
        return <ArtHistoryView onBack={() => setCurrentView(ViewState.ART_MUSEUM)} onNavigate={setCurrentView} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_CURRICULUM:
        return <ArtCurriculumView onBack={() => setCurrentView(ViewState.ART_MUSEUM)} onNavigate={setCurrentView} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_INTRO:
        return <ArtIntroView onBack={() => setCurrentView(ViewState.ART_CURRICULUM)} onNavigate={setCurrentView} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_PERIOD_DETAIL:
        return <ArtPeriodDetailView onBack={() => setCurrentView(ViewState.ART_CURRICULUM)} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_CRAFTS:
        return <ArtCraftsView onBack={() => setCurrentView(ViewState.ART_MUSEUM)} onSelectCraft={handleCraftSelect} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_CRAFT_DETAIL:
        return <ArtCraftDetailView craftId={selectedCraftId || 'urushi'} onBack={() => setCurrentView(ViewState.ART_CRAFTS)} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_KINTSUGI:
        return <ArtKintsugiView onBack={() => setCurrentView(ViewState.ART_CRAFTS)} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_TRIBAL:
        return <ArtTribalView onBack={() => setCurrentView(ViewState.ART_MUSEUM)} onSelectChapter={handleTribalSelect} language={artLanguage} setLanguage={setArtLanguage} />;
      case ViewState.ART_TRIBAL_DETAIL:
        return <ArtTribalDetailView chapterId={selectedTribalId || 'intro'} onBack={() => setCurrentView(ViewState.ART_TRIBAL)} language={artLanguage} setLanguage={setArtLanguage} />;

      // Sonic Lab Routes
      case ViewState.SONIC_LAB:
        return <SonicLabView onNavigate={setCurrentView} />;
      case ViewState.SONIC_SYNTH:
        return <SonicSynthView onBack={() => setCurrentView(ViewState.SONIC_LAB)} />;

      case ViewState.LIBRARY:
        return <Library />;
      case ViewState.AI_TUTOR:
        return <AITutor />;
      case ViewState.PROFILE:
        return <ProfilePlaceholder />;
      case ViewState.LESSON:
        return <LessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <ThemeProvider>
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </Layout>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />
    </ThemeProvider>
  );
};

export default App;