import { PersonalizedLesson, LessonTemplate, Course, DailyVocabulary, GrammarQuiz } from '../types';

export const CORE_TEMPLATES: LessonTemplate[] = [
  { id: 't1', category: 'core', text: "I’m interested in exploring how [A] relates to [B].", example: "I’m interested in exploring how AI relates to education." },
  { id: 't2', category: 'core', text: "From a cultural perspective, [X] is often seen as [Y].", example: "From a cultural perspective, silence is often seen as respect." },
  { id: 't3', category: 'core', text: "What I mean is [Statement].", example: "What I mean is we need more time." },
];

export const BRIDGING_TEMPLATES: LessonTemplate[] = [
  { id: 'b1', category: 'bridging', text: "... at the same time ...", example: "It's expensive, but at the same time, it's high quality." },
  { id: 'b2', category: 'bridging', text: "This leads to...", example: "This leads to a better user experience." },
];

export const SOFTENING_TEMPLATES: LessonTemplate[] = [
  { id: 's1', category: 'softening', text: "It seems that...", example: "It seems that there is a bug." },
  { id: 's2', category: 'softening', text: "I might suggest...", example: "I might suggest a different approach." },
];

export const TODAY_LESSON: PersonalizedLesson = {
  id: "L001",
  title: "Week 1: Connecting Ideas",
  goal: "Talk about your current interest clearly in 3-5 sentences using a core template.",
  tags: ["core", "output"],
  templates: [CORE_TEMPLATES[0], CORE_TEMPLATES[1], SOFTENING_TEMPLATES[0]],
  tasks: [
    { type: "output_3sentences", prompt: "Write 3-5 sentences about a topic you are currently exploring. Use at least one template and one linking word." }
  ],
  rubric: {
    clarity: "Message is understandable without extra context.",
    linking: "Uses at least one linking word correctly (however, therefore, etc.).",
    tone: "Uses safe/soft language (not too absolute)."
  }
};

export const DAILY_VOCAB: DailyVocabulary = {
  word: "Serendipity",
  partOfSpeech: "Noun",
  definition: "The occurrence of events by chance in a happy or beneficial way.",
  pronunciation: "/ˌser.ənˈdɪp.ə.ti/",
  exampleSentence: "We found the restaurant by pure serendipity, and it was the best meal of the trip."
};

export const DAILY_GRAMMAR: GrammarQuiz = {
  id: "g1",
  question: "I _____ to the conference if I finish this report on time.",
  options: ["will go", "would go", "went"],
  correctAnswer: 0,
  explanation: "This is the First Conditional. We use 'will' for real possibilities in the future."
};

export const COURSES_DATA: Course[] = [
  {
    id: '1',
    title: 'Survival English for Travel',
    description: 'Essential phrases for airports, hotels, and restaurants.',
    category: 'Beginner A1',
    progress: 80,
    totalLessons: 15,
    completedLessons: 12,
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    color: 'bg-green-500'
  },
  {
    id: '2',
    title: 'Daily Conversation Mastery',
    description: 'Small talk, hobbies, and making friends.',
    category: 'Elementary A2',
    progress: 45,
    totalLessons: 20,
    completedLessons: 9,
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    color: 'bg-blue-500'
  },
  {
    id: '3',
    title: 'Business Communication',
    description: 'Emails, presentations, and professional etiquette.',
    category: 'Intermediate B1',
    progress: 10,
    totalLessons: 25,
    completedLessons: 2,
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800',
    color: 'bg-indigo-500'
  },
  {
    id: '4',
    title: 'Advanced Grammar Deep Dive',
    description: 'Master complex tenses and subjunctive mood.',
    category: 'Upper Int B2',
    progress: 0,
    totalLessons: 30,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    color: 'bg-purple-500'
  },
  {
    id: '5',
    title: 'American Slang & Idioms',
    description: 'Speak like a native with popular expressions.',
    category: 'Culture',
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80&w=800',
    color: 'bg-pink-500'
  },
  {
    id: '6',
    title: 'TOEIC Exam Preparation',
    description: 'Practice tests and strategies for high scores.',
    category: 'Test Prep',
    progress: 0,
    totalLessons: 40,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    color: 'bg-orange-500'
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return COURSES_DATA.find(c => c.id === id);
};