
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
  // Fix: Removed redundant example_sentence as the app uses exampleSentence
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

export interface UserStats {
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
}
