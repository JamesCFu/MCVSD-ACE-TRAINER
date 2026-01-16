// fileName: App.tsx

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Practice from './components/Practice';
import LearningCenter from './components/LearningCenter';
import ShortNotes from './components/ShortNotes';
import DailyVocab from './components/DailyVocab';
import Profile from './components/Profile';
import { Category, UserStats, VocabularyWord, Question } from './types';
import { generateVocabulary } from './geminiService';

// --- FIREBASE IMPORTS ---
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
  const [stats, setStats] = useState<UserStats>(getInitialStats());
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [isVocabLoading, setIsVocabLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // --- AUTH & DATA SYNC LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in. Fetch data from Firestore.
        const userRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            // Load existing data
            const loadedStats = docSnap.data() as UserStats;
            setStats({ ...loadedStats, isLoggedIn: true, email: user.email || '', username: user.displayName || loadedStats.username });
          } else {
            // New user: create document with initial stats
            const newStats = { 
              ...getInitialStats(), 
              isLoggedIn: true, 
              email: user.email || '', 
              username: user.displayName || 'Scholar' 
            };
            await setDoc(userRef, newStats);
            setStats(newStats);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // User is signed out. Load from LocalStorage or reset.
        const saved = localStorage.getItem('mcvsd_stats_v1');
        setStats(saved ? JSON.parse(saved) : getInitialStats());
      }
      setDataLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  // --- SAVE DATA TO FIREBASE OR LOCALSTORAGE ---
  useEffect(() => {
    if (!dataLoaded) return;

    const saveData = async () => {
      if (stats.isLoggedIn && auth.currentUser) {
        // Save to Firestore
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, { ...stats });
        } catch (error) {
          console.error("Error saving to cloud:", error);
        }
      } else {
        // Save to LocalStorage (Guest)
        localStorage.setItem('mcvsd_stats_v1', JSON.stringify(stats));
      }
    };

    // Debounce save (wait 1s after last change)
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [stats, dataLoaded]);

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
      if (prev.incorrectQuestions.some(q => q.id === question.id)) return prev;
      return {
        ...prev,
        incorrectQuestions: [...prev.incorrectQuestions, question]
      };
    });
  };

  const resetStats = async () => {
    const freshStats = getInitialStats();
    if (stats.isLoggedIn && auth.currentUser) {
      // Reset Cloud Data
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { ...freshStats, isLoggedIn: true, email: stats.email, username: stats.username });
      setStats({ ...freshStats, isLoggedIn: true, email: stats.email, username: stats.username });
    } else {
      // Reset Local Data
      setStats(freshStats);
      localStorage.removeItem('mcvsd_stats_v1');
    }
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- SESSION HANDLERS ---
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

  const handleRecordPracticeResults = (cat: Category, score: number, total: number, mistakes: Question[]) => {
     const xpEarned = score * 10;
     awardXP(xpEarned);
     
     setStats(prev => ({
         ...prev,
         completedQuizzes: prev.completedQuizzes + 1,
         questionsAnswered: prev.questionsAnswered + total,
         totalCorrect: prev.totalCorrect + score,
         categoryAttempted: {
           ...prev.categoryAttempted,
           [cat]: (prev.categoryAttempted[cat] || 0) + total
         },
         categoryCorrect: {
           ...prev.categoryCorrect,
           [cat]: (prev.categoryCorrect[cat] || 0) + score
         },
         incorrectQuestions: [...prev.incorrectQuestions, ...mistakes]
     }));
  };
  
  const handleSaveTime = (cat: Category, time: number) => {
    // Optional: could save time stats here
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveView={setActiveView} onStartPractice={(cat) => setActiveView(cat === Category.VOCABULARY ? 'vocab' : cat === Category.MATH ? 'math' : 'reading')} />;
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
            onLogin={() => {}} 
            onLogout={handleLogout}
          />
        );
      case 'reading':
      case 'vocab':
      case 'spelling':
      case 'grammar':
      case 'math':
      case 'mock':
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
        return <Dashboard stats={stats} setActiveView={setActiveView} onStartPractice={() => setActiveView('reading')} />;
    }
  };

  if (!dataLoaded) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse text-indigo-600 font-bold">Loading Profile...</div></div>;

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} mistakeCount={stats.incorrectQuestions.length}>
      {renderView()}
    </Layout>
  );
};

export default App;
