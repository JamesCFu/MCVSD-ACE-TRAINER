import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Practice from './components/Practice';
import LearningCenter from './components/LearningCenter';
import ShortNotes from './components/ShortNotes';
import DailyVocab from './components/DailyVocab';
import Profile from './components/Profile';
import { Category, UserStats, VocabularyWord, Question, GrammarLesson, PracticeSession } from './types';
import { generateVocabulary, generateGrammarLesson, GRAMMAR_TOPICS, FALLBACK_GRAMMAR_DATA } from './geminiService';

// --- FIREBASE IMPORTS ---
import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

const getInitialStats = (): UserStats => ({
  username: 'Guest Candidate',
  email: '',
  isLoggedIn: false,
  
  completedQuizzes: 0,
  averageScore: 0,
  categoryScores: {
    [Category.READING]: 0,
    [Category.VOCABULARY]: 0,
    [Category.GRAMMAR]: 0,
    [Category.MATH]: 0,
    [Category.MOCK]: 0,
    [Category.SPELLING]: 0,
  },
  categoryCorrect: {
    [Category.READING]: 0,
    [Category.VOCABULARY]: 0,
    [Category.GRAMMAR]: 0,
    [Category.MATH]: 0,
    [Category.MOCK]: 0,
    [Category.SPELLING]: 0,
  },
  categoryAttempted: {
    [Category.READING]: 0,
    [Category.VOCABULARY]: 0,
    [Category.GRAMMAR]: 0,
    [Category.MATH]: 0,
    [Category.MOCK]: 0,
    [Category.SPELLING]: 0,
  },
  questionsAnswered: 0,
  totalCorrect: 0,
  xp: 0,
  wordMastery: {},
  activeSessionWords: [],
  incorrectQuestions: []
});

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('mcvsd_stats_v1');
    return saved ? JSON.parse(saved) : getInitialStats();
  });

  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [isVocabLoading, setIsVocabLoading] = useState(false);

  // --- AUTH LISTENER ---
  useEffect(() => {
    // This replaces the old window.auth logic
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStats(prev => ({
          ...prev,
          isLoggedIn: true,
          email: user.email || '',
          username: user.displayName || 'Scholar'
        }));
      } else {
        setStats(prev => ({
          ...prev,
          isLoggedIn: false,
          email: '',
          username: 'Guest Candidate'
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('mcvsd_stats_v1', JSON.stringify(stats));
  }, [stats]);

  // Load Vocab on Mount
  useEffect(() => {
    const loadVocab = async () => {
      setIsVocabLoading(true);
      try {
        const words = await generateVocabulary();
        setAllWords(words);
      } catch (error) {
        console.error("Failed to load vocab", error);
      } finally {
        setIsVocabLoading(false);
      }
    };
    loadVocab();
  }, []);

  // --- HANDLERS ---
  const awardXP = (amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const recordAnswer = (isCorrect: boolean, category: Category) => {
    setStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      categoryAttempted: {
        ...prev.categoryAttempted,
        [category]: (prev.categoryAttempted[category] || 0) + 1
      },
      categoryCorrect: {
        ...prev.categoryCorrect,
        [category]: isCorrect ? (prev.categoryCorrect[category] || 0) + 1 : (prev.categoryCorrect[category] || 0)
      }
    }));
  };

  const logMistake = (question: Question) => {
    setStats(prev => {
      // Avoid duplicates
      if (prev.incorrectQuestions.some(q => q.id === question.id)) return prev;
      return {
        ...prev,
        incorrectQuestions: [...prev.incorrectQuestions, question]
      };
    });
  };

  const resetStats = () => {
    setStats(getInitialStats());
    localStorage.removeItem('mcvsd_stats_v1');
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The useEffect listener will update the state automatically
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Mock handlers for session management (placeholder logic for now)
  const handleStartSession = (cat: Category, q: Question[], p?: string | null) => {
     setStats(prev => ({
       ...prev,
       activeSessions: {
         ...prev.activeSessions,
         [cat]: {
           questions: q,
           userAnswers: {},
           isSubmitted: false,
           score: 0,
           passage: p,
           startTime: Date.now(),
           elapsedTime: 0
         }
       }
     }));
  };
  
  const handleUpdateSession = (cat: Category, answers: Record<string, number>) => {
    setStats(prev => {
      const current = prev.activeSessions?.[cat];
      if (!current) return prev;
      return {
        ...prev,
        activeSessions: {
          ...prev.activeSessions,
          [cat]: { ...current, userAnswers: answers }
        }
      };
    });
  };

  const handleCompleteSession = (cat: Category, score: number) => {
    setStats(prev => {
      const current = prev.activeSessions?.[cat];
      if (!current) return prev;
      return {
        ...prev,
        activeSessions: {
          ...prev.activeSessions,
          [cat]: { ...current, isSubmitted: true, score }
        }
      };
    });
  };

  const handleClearSession = (cat: Category) => {
    setStats(prev => {
      const newSessions = { ...prev.activeSessions };
      delete newSessions[cat];
      return { ...prev, activeSessions: newSessions };
    });
  };

  const handleRecordPracticeResults = (cat: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => {
     // Calculate XP based on score
     const xpEarned = score * 10;
     awardXP(xpEarned);
     
     // Update category stats
     setStats(prev => {
        const correctCount = score; // Assuming score is raw count here
        return {
           ...prev,
           completedQuizzes: prev.completedQuizzes + 1,
           questionsAnswered: prev.questionsAnswered + total,
           totalCorrect: prev.totalCorrect + correctCount,
           categoryAttempted: {
             ...prev.categoryAttempted,
             [cat]: (prev.categoryAttempted[cat] || 0) + total
           },
           categoryCorrect: {
             ...prev.categoryCorrect,
             [cat]: (prev.categoryCorrect[cat] || 0) + correctCount
           },
           incorrectQuestions: [...prev.incorrectQuestions, ...mistakes]
        };
     });
  };
  
  const handleSaveTime = (cat: Category, time: number) => {
    // Optional: save elapsed time
  };

  const mapCategoryToView = (cat: Category): string => {
    switch(cat) {
      case Category.READING: return 'reading';
      case Category.VOCABULARY: return 'vocab';
      case Category.SPELLING: return 'spelling';
      case Category.GRAMMAR: return 'grammar';
      case Category.MATH: return 'math';
      case Category.MOCK: return 'mock';
      default: return 'dashboard';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveView={setActiveView} onStartPractice={(cat) => setActiveView(mapCategoryToView(cat))} />;
      case 'learning':
        return <LearningCenter />;
      case 'notes':
        return <ShortNotes />;
      case 'daily':
        return (
          <DailyVocab 
            stats={stats} 
            setStats={setStats}
            words={allWords}
            isLoading={isVocabLoading}
            onAwardXP={awardXP}
            onRecordAnswer={recordAnswer}
            onLogMistake={logMistake}
          />
        );
      case 'profile':
        return (
          <Profile 
            stats={stats} 
            onReset={resetStats} 
            onLogin={() => {}} // Profile handles its own login via Firebase now
            onLogout={handleLogout}
          />
        );
      case 'reading':
      case 'vocab':
      case 'spelling':
      case 'grammar':
      case 'math':
      case 'mock':
        // Determine category enum from view string
        let cat = Category.READING;
        if (activeView === 'vocab') cat = Category.VOCABULARY;
        if (activeView === 'spelling') cat = Category.SPELLING;
        if (activeView === 'grammar') cat = Category.GRAMMAR;
        if (activeView === 'math') cat = Category.MATH;
        if (activeView === 'mock') cat = Category.MOCK;

        return (
          <Practice 
            category={cat} 
            session={stats.activeSessions?.[cat] || null}
            onStartSession={handleStartSession}
            onUpdateSession={handleUpdateSession}
            onCompleteSession={handleCompleteSession}
            onClearSession={handleClearSession}
            onFinish={() => setActiveView('dashboard')}
            onRecordOnly={handleRecordPracticeResults}
            onLogMistake={logMistake}
            onExit={() => setActiveView('dashboard')}
            onSaveTime={handleSaveTime}
          />
        );
      default:
        return <Dashboard stats={stats} setActiveView={setActiveView} onStartPractice={(cat) => setActiveView(mapCategoryToView(cat))} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} mistakeCount={stats.incorrectQuestions.length}>
      {renderView()}
    </Layout>
  );
};

export default App;
