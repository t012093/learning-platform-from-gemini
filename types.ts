
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ActivityData {
  day: string;
  minutes: number;
}

// New Types for the Personalized Curriculum
export interface LessonTemplate {
  id: string;
  text: string;
  category: 'core' | 'softening' | 'bridging';
  example: string;
}

export interface LessonTask {
  type: 'fill' | 'rewrite_soften' | 'output_3sentences';
  prompt: string;
}

export interface LessonRubric {
  clarity: string;
  linking: string;
  tone: string;
}

export interface PersonalizedLesson {
  id: string;
  title: string;
  goal: string;
  tags: string[];
  templates: LessonTemplate[];
  tasks: LessonTask[];
  rubric: LessonRubric;
}

export interface AnalysisResult {
  clarityScore: number; // 0-100
  linkingScore: number;
  toneScore: number;
  feedback: string;
  refinedVersion: string;
}

// New Types for Daily Micro-Learning
export interface DailyVocabulary {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  pronunciation: string;
}

export interface GrammarQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LEARNING_HUB = 'LEARNING_HUB', // New centralized hub
  COURSES = 'COURSES', // Renamed to "Path" in UI
  COURSE_DETAILS = 'COURSE_DETAILS', // New view for Course Path
  LIBRARY = 'LIBRARY',
  AI_TUTOR = 'AI_TUTOR',
  PROFILE = 'PROFILE',
  LESSON = 'LESSON',
  BLENDER = 'BLENDER', // Overview
  BLENDER_PATH = 'BLENDER_PATH', // Detailed Project Path
  BLENDER_LESSON = 'BLENDER_LESSON', // Actual Video/Task Lesson
  // Programming Paths Deep Links
  PROGRAMMING_WEB = 'programming_web',
  PROGRAMMING_AI = 'programming_ai',
  PROGRAMMING_VIBE = 'programming_vibe',
  PROGRAMMING = 'PROGRAMMING', // Overview
  PROGRAMMING_PATH = 'PROGRAMMING_PATH', // Detailed Programming Course (Git Style)
  PYTHON_COURSE = 'PYTHON_COURSE', // Python Beginner Course (Notebook Style)
  HTML_CSS_PATH = 'HTML_CSS_PATH', // New: Learning Path Roadmap for HTML/CSS
  HTML_CSS_COURSE = 'HTML_CSS_COURSE', // Web Studio Part 1 (Flexbox)
  HTML_CSS_PART_TWO = 'HTML_CSS_PART_TWO', // Web Studio Part 2 (Grid)
  WEB_INSPECTOR = 'WEB_INSPECTOR', // New: Inspector Tool Simulation
  VIBE_PATH = 'VIBE_PATH', // New: The Hub for Vibe Coding
  VIBE_PROLOGUE = 'VIBE_PROLOGUE', // Prologue: Mindset
  VIBE_CHAPTER_1 = 'VIBE_CHAPTER_1', // Chapter 1: Prompt Engineering
  VIBE_CHAPTER_2 = 'VIBE_CHAPTER_2', // Chapter 2: The Cockpit
  VIBE_CHAPTER_3 = 'VIBE_CHAPTER_3', // Chapter 3: The Engine (Codex)
  VIBE_CHAPTER_5 = 'VIBE_CHAPTER_5', // Chapter 5: The World (GitHub)

  // Art Section
  ART_MUSEUM = 'ART_MUSEUM', // The Hub
  ART_HISTORY = 'ART_HISTORY', // Horizontal Timeline
  ART_CURRICULUM = 'ART_CURRICULUM', // New: Vertical Detailed Curriculum
  ART_INTRO = 'ART_INTRO', // New: Chapter 0 Introduction
  ART_PERIOD_DETAIL = 'ART_PERIOD_DETAIL', // Detailed learning page for a period
  ART_KINTSUGI = 'ART_KINTSUGI', // Specific Technique View (Interactive Kintsugi)
  ART_CRAFTS = 'ART_CRAFTS', // New: Hub for Japanese Crafts
  ART_CRAFT_DETAIL = 'ART_CRAFT_DETAIL', // New: Detail view for a specific craft
  ART_TRIBAL = 'ART_TRIBAL', // New: Hub for Tribal/Ethnic Art
  ART_TRIBAL_DETAIL = 'ART_TRIBAL_DETAIL', // New: Detail view for Tribal Art chapters

  // Sonic Lab Section
  SONIC_LAB = 'SONIC_LAB', // Hub
  SONIC_SYNTH = 'SONIC_SYNTH' // Synthesizer Lesson
}