export enum Category {
  READING = 'Reading Comprehension',
  VOCABULARY = 'Vocabulary',
  GRAMMAR = 'Grammar & Writing',
  MATH = 'Mathematics',
  MOCK = 'Full Mock Test',
  SPELLING = 'Spelling'
}

export interface VocabularyWord {
  word: string;
  partOfSpeech: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
}

export interface RootWord {
  root: string;
  meaning: string;
  examples: string[];
}

export interface GrammarLesson {
  topic: string;
  explanation: string;
  examples: string[];
  quickCheck: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface Question {
  id: string;
  category: Category;
  passage?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface Highlight {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface PracticeSession {
  questions: Question[];
  userAnswers: Record<string, number>;
  isSubmitted: boolean;
  score: number;
  passage?: string | null;
  startTime: number;
  elapsedTime: number;
  highlights?: Highlight[];
  questions: Question[];
  userAnswers: Record<string, number>;
  isSubmitted: boolean;
  score: number;
  passage?: string | null;
  startTime: number;
  elapsedTime: number;
  // --- NEW MOCK FIELDS ---
  mockStage?: 'ELA' | 'MATH'; 
  elaScore?: number;
  elaTotalQuestions?: number;
}

export interface UserStats {
  // --- NEW IDENTITY FIELDS ---
  username?: string;
  email?: string;
  isLoggedIn?: boolean;

  // Existing Stats
  completedQuizzes: number;
  averageScore: number;
  categoryScores: Record<Category, number>;
  categoryCorrect: Record<string, number>;
  categoryAttempted: Record<string, number>;
  questionsAnswered: number;
  totalCorrect: number;
  xp: number;
  wordMastery: Record<string, number>;
  activeSessionWords: VocabularyWord[];
  incorrectQuestions: Question[];
  dailyVocabDay?: number;
  dailyVocabCompleted?: boolean;
  lastDailyVocabDate?: string;
  dailyVocabSeed?: number;
  fastestRaceTime?: number; // milliseconds
  starredWords?: string[];
  dailyRaceRecords?: Record<string, number>; // date -> time
  
  // Active Sessions
  activeSessions?: Partial<Record<Category, PracticeSession>>;
}
