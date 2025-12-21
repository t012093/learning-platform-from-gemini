import React, { useState } from 'react';
import { ViewState, GeneratedCourse } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { getCourseById } from './services/curriculumData';

// Common Components
import Layout from './components/common/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoginView from './components/common/LoginView';
import LandingView from './components/common/LandingView';
import LoginModal from './components/common/LoginModal';
import LessonView from './components/common/LessonView';
import Library from './components/common/Library';

// Dashboard Features
import Dashboard from './components/features/dashboard/Dashboard';
import CourseList from './components/features/dashboard/CourseList';
import CoursePathView from './components/features/dashboard/CoursePathView';
import LearningHub from './components/features/dashboard/LearningHub';
import ProfilePassport from './components/features/dashboard/ProfilePassport';
import MyContent from './components/features/dashboard/MyContent';

// AI Features
import CourseGeneratorView from './components/features/ai/CourseGeneratorView';
import GeneratedCourseView from './components/features/ai/GeneratedCourseView';
import GeneratedLessonView from './components/features/ai/GeneratedLessonView';
import LuminaConciergeView from './components/features/ai/LuminaConciergeView';
import PersonalAssessmentView from './components/features/dashboard/assessment/PersonalAssessmentView';
import AICharacterIntroView from './components/features/ai/AICharacterIntroView';
import AICharacterDetailView from './components/features/ai/AICharacterDetailView';

// Blender Features
import BlenderCurriculum from './components/features/blender/BlenderCurriculum';
import BlenderPathView from './components/features/blender/BlenderPathView';
import BlenderLessonView from './components/features/blender/BlenderLessonView';

// Programming Features
import ProgrammingCurriculum from './components/features/programming/ProgrammingCurriculum';
import ProgrammingCourseView from './components/features/programming/ProgrammingCourseView';
import PythonBeginnerView from './components/features/programming/PythonBeginnerView';
import HtmlCssView from './components/features/programming/HtmlCssView';
import HtmlCssPathView from './components/features/programming/HtmlCssPathView';
import HtmlCssPartTwoView from './components/features/programming/HtmlCssPartTwoView';
import WebInspectorView from './components/features/programming/WebInspectorView';
import VibePrologueView from './components/features/programming/VibePrologueView';
import VibeChapterOneView from './components/features/programming/VibeChapterOneView';
import VibeChapterTwoView from './components/features/programming/VibeChapterTwoView';
import VibeChapterThreeView from './components/features/programming/VibeChapterThreeView';
import VibeChapterFiveView from './components/features/programming/VibeChapterFiveView';
import VibePathView from './components/features/programming/VibePathView';

// Art Features
import ArtMuseumView from './components/features/art/ArtMuseumView';
import ArtHistoryView from './components/features/art/ArtHistoryView';
import ArtPeriodDetailView from './components/features/art/ArtPeriodDetailView';
import ArtKintsugiView from './components/features/art/ArtKintsugiView';
import ArtCurriculumView from './components/features/art/ArtCurriculumView';
import ArtIntroView from './components/features/art/ArtIntroView';
import ArtCraftsView from './components/features/art/ArtCraftsView';
import ArtCraftDetailView from './components/features/art/ArtCraftDetailView';
import ArtTribalView from './components/features/art/ArtTribalView';
import ArtTribalDetailView from './components/features/art/ArtTribalDetailView';

// Sonic Features
import SonicLabView from './components/features/sonic/SonicLabView';
import SonicSynthView from './components/features/sonic/SonicSynthView';

import { User, Settings, Bell, Shield } from 'lucide-react';

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

import MultiFormatLessonView from './components/features/ai/MultiFormatLessonView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // AI Generated Course State
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [latestGeneratedForLibrary, setLatestGeneratedForLibrary] = useState<GeneratedCourse | null>(null);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginPageVisible, setIsLoginPageVisible] = useState(false);

  // Art Language State
  const [artLanguage, setArtLanguage] = useState<'en' | 'jp'>('en');
  // Vibe Language State
  const [vibeLanguage, setVibeLanguage] = useState<'en' | 'jp'>('en');

  // Selected Craft/Tribal State
  const [selectedCraftId, setSelectedCraftId] = useState<string | null>(null);
  const [selectedTribalId, setSelectedTribalId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

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
  };

  const handleCharacterSelect = (charId: string) => {
    setSelectedCharacterId(charId);
    setCurrentView(ViewState.AI_CHARACTER_DETAIL);
  };
  
  const handleCourseGenerated = (course: GeneratedCourse) => {
    setGeneratedCourse(course);
    setLatestGeneratedForLibrary(course);
    setCurrentView(ViewState.GENERATED_COURSE_PATH);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.MULTI_FORMAT_DEMO:
        return <MultiFormatLessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} />;
      case ViewState.DEMO_CONCEPT:
        return <MultiFormatLessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} forceBlockType="concept" />;
      case ViewState.DEMO_DIALOGUE:
        return <MultiFormatLessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} forceBlockType="dialogue" />;
      case ViewState.DEMO_WORKSHOP:
        return <MultiFormatLessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} forceBlockType="workshop" />;
      case ViewState.DEMO_REFLECTION:
        return <MultiFormatLessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} forceBlockType="reflection" />;
      case ViewState.DEMO_BLENDER:
        return <MultiFormatLessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} forceSubType="blender" />;
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.COURSE_GENERATOR:
        return <CourseGeneratorView onBack={() => setCurrentView(ViewState.DASHBOARD)} onCourseGenerated={handleCourseGenerated} onNavigate={setCurrentView} />;
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

      case ViewState.AI_DIAGNOSIS:
        return <PersonalAssessmentView onNavigate={setCurrentView} />;

      // AI Characters
      case ViewState.AI_CHARACTERS:
        return <AICharacterIntroView onNavigate={setCurrentView} onSelectCharacter={handleCharacterSelect} />;
      case ViewState.AI_CHARACTER_DETAIL:
        return <AICharacterDetailView
          characterId={selectedCharacterId || 'openness'}
          onNavigate={setCurrentView}
          onBack={() => setCurrentView(ViewState.AI_CHARACTERS)}
        />;

      case ViewState.PROFILE:
        return <ProfilePassport onNavigate={setCurrentView} />;
      case ViewState.MY_CONTENT:
        return <MyContent onNavigate={setCurrentView} onSelectCourse={handleCourseGenerated} newCourseForLibrary={latestGeneratedForLibrary} />;
      case ViewState.GENERATED_COURSE_PATH:
        if (!generatedCourse) return <MyContent onNavigate={setCurrentView} onSelectCourse={handleCourseGenerated} />;
        return <GeneratedCourseView course={generatedCourse} onBack={() => setCurrentView(ViewState.MY_CONTENT)} onStartLesson={() => {
            console.log("App: Switching to GENERATED_LESSON_VIEW");
            setCurrentView(ViewState.GENERATED_LESSON_VIEW);
          }} />;
      case ViewState.GENERATED_LESSON_VIEW:
        return <GeneratedLessonView course={generatedCourse} onBack={() => setCurrentView(ViewState.GENERATED_COURSE_PATH)} onComplete={() => setCurrentView(ViewState.GENERATED_COURSE_PATH)} />;
      case ViewState.LESSON:
        return <LessonView onBack={() => setCurrentView(ViewState.DASHBOARD)} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {!isLoggedIn ? (
          isLoginPageVisible ?
            <LoginView onLoginSuccess={() => setIsLoggedIn(true)} /> :
            <LandingView onLoginClick={() => setIsLoginPageVisible(true)} />
        ) : (
          <>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} />
            <Layout currentView={currentView} onNavigate={setCurrentView}>
              {renderContent()}
            </Layout>
          </>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
