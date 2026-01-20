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

const getInitialStats = (): UserStats => ({
  // Initialize Identity
  username: 'Guest Candidate',
  email: '',
  isLoggedIn: false,
  starredWords: [],
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
  incorrectQuestions: [],
  dailyVocabDay: 1,
  dailyVocabCompleted: false,
  lastDailyVocabDate: undefined,
  dailyVocabSeed: Math.floor(Math.random() * 1000000),
  fastestRaceTime: undefined,
  dailyRaceRecords: {},
  sessionRaceRecords: {},
  activeSessions: {}, 
});

const normalizeCategory = (catName: any): Category => {
  const c = String(catName || '').toLowerCase().trim();
  if (c.includes('reading') || c.includes('comprehension') || c.includes('lit')) return Category.READING;
  if (c.includes('vocab') || c.includes('vocabulary')) return Category.VOCABULARY;
  if (c.includes('gramm') || c.includes('writ')) return Category.GRAMMAR;
  if (c.includes('math')) return Category.MATH;
  if (c.includes('spell')) return Category.SPELLING;
  if (c.includes('mock') || c.includes('simul')) return Category.MOCK;
  return Category.MOCK;
};

const mapCategoryToView = (cat: Category): string => {
  switch (cat) {
    case Category.READING: return 'reading';
    case Category.VOCABULARY: return 'vocab';
    case Category.GRAMMAR: return 'grammar';
    case Category.MATH: return 'math';
    case Category.MOCK: return 'mock';
    case Category.SPELLING: return 'spelling';
    default: return 'dashboard';
  }
};

const mapViewToCategory = (view: string): Category => {
  switch (view) {
    case 'reading': return Category.READING;
    case 'vocab': return Category.VOCABULARY;
    case 'grammar': return Category.GRAMMAR;
    case 'math': return Category.MATH;
    case 'mock': return Category.MOCK;
    case 'spelling': return Category.SPELLING;
    default: return Category.MOCK;
  }
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState<UserStats>(getInitialStats());
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [isVocabLoading, setIsVocabLoading] = useState(false);
  
  // Correction State for Mistake Log
  const [correctingId, setCorrectingId] = useState<string | null>(null);
  const [correctionAnswer, setCorrectionAnswer] = useState<number | null>(null);
  const [correctionState, setCorrectionState] = useState<'idle' | 'wrong' | 'correct'>('idle');

  // Registry State
  const [grammarRegistry, setGrammarRegistry] = useState<Record<string, GrammarLesson>>({});
  
  const isInitialized = useRef(false);
  const syncInitiated = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('mcvsd-stats');
    const savedRegistry = localStorage.getItem('mcvsd-grammar-registry');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats({ ...getInitialStats(), ...parsed });
      } catch(e) {
        console.error("Failed to parse saved stats", e);
      }
    }

    if (savedRegistry) {
      try {
        const parsedReg = JSON.parse(savedRegistry);
        setGrammarRegistry(parsedReg);
      } catch(e) {
        console.error("Failed to parse registry", e);
      }
    }
    
    isInitialized.current = true;

    const loadAllVocab = async () => {
      setIsVocabLoading(true);
      try {
        const words = await generateVocabulary();
        setAllWords(words);
      } catch (err) {
        console.error("Error loading vocab:", err);
      } finally {
        setIsVocabLoading(false);
      }
    };
    loadAllVocab();
  }, []);

  // Background Sync for Grammar
  useEffect(() => {
    if (isInitialized.current && !syncInitiated.current) {
      syncInitiated.current = true;
      const syncRemaining = async () => {
        for (const topic of GRAMMAR_TOPICS) {
          if (grammarRegistry[topic]) continue;
          try {
            const lesson = await generateGrammarLesson(topic);
            if (lesson) {
              setGrammarRegistry(prev => {
                const next = { ...prev, [topic]: lesson };
                localStorage.setItem('mcvsd-grammar-registry', JSON.stringify(next));
                return next;
              });
            }
          } catch (e) {
            console.warn(`Sync failed for ${topic}, will retry on next boot.`);
          }
        }
      };
      syncRemaining();
    }
  }, [grammarRegistry]);

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('mcvsd-stats', JSON.stringify(stats));
    }
  }, [stats]);

  const awardXP = useCallback((amount: number) => {
    setStats(prev => ({ ...prev, xp: (Number(prev.xp) || 0) + Number(amount) }));
  }, []);

  const resolveMistake = useCallback((questionId: string) => {
    setStats(prev => ({
      ...prev,
      incorrectQuestions: prev.incorrectQuestions.filter(q => q.id !== questionId)
    }));
  }, []);

  const recordAnswer = useCallback((isCorrect: boolean, category: Category) => {
    setStats(prev => {
      const c = normalizeCategory(category);
      const currentAttempted = Number(prev.categoryAttempted[c]) || 0;
      const currentCorrect = Number(prev.categoryCorrect[c]) || 0;
      const nextAttempted = currentAttempted + 1;
      const nextCorrect = currentCorrect + (isCorrect ? 1 : 0);
      const nextAccuracy = Math.round((nextCorrect / nextAttempted) * 100);
      return {
        ...prev,
        questionsAnswered: (Number(prev.questionsAnswered) || 0) + 1,
        totalCorrect: (Number(prev.totalCorrect) || 0) + (isCorrect ? 1 : 0),
        categoryAttempted: { ...prev.categoryAttempted, [c]: nextAttempted },
        categoryCorrect: { ...prev.categoryCorrect, [c]: nextCorrect },
        categoryScores: { ...prev.categoryScores, [c]: nextAccuracy }
      };
    });
  }, []);

  const updateWordMastery = useCallback((word: string, increment: number) => {
    setStats(prev => {
      const currentMastery = Number(prev.wordMastery?.[word]) || 0;
      return {
        ...prev,
        wordMastery: {
          ...(prev.wordMastery || {}),
          [word]: Math.min(100, Math.max(0, currentMastery + Number(increment)))
        }
      };
    });
  }, []);

  const logMistake = useCallback((q: Question) => {
    setStats(prev => {
      const existingIds = new Set(prev.incorrectQuestions.map(iq => iq.id));
      if (existingIds.has(q.id)) return prev;
      return {
        ...prev,
        incorrectQuestions: [q, ...prev.incorrectQuestions].slice(0, 100)
      };
    });
  }, []);

  const updateSessionRecord = useCallback((sessionHash: string, time: number) => {
    setStats(prev => ({
      ...prev,
      sessionRaceRecords: {
        ...(prev.sessionRaceRecords || {}),
        [sessionHash]: prev.sessionRaceRecords?.[sessionHash] 
          ? Math.min(prev.sessionRaceRecords[sessionHash], time) 
          : time
      }
    }));
  }, []);

  // --- Session Management Functions ---

  const handleStartSession = useCallback((category: Category, questions: Question[], passage?: string | null) => {
    setStats(prev => ({
      ...prev,
      activeSessions: {
        ...(prev.activeSessions || {}),
        [category]: {
          questions,
          userAnswers: {},
          isSubmitted: false,
          score: 0,
          passage: passage || null,
          startTime: Date.now(),
          elapsedTime: 0 // Initialize elapsed time
        }
      }
    }));
  }, []);

  const handleUpdateSession = useCallback((category: Category, userAnswers: Record<string, number>, highlights?: Highlight[]) => {
  setStats(prev => {
    const session = prev.activeSessions?.[category];
    if (!session) return prev;

    const newSessions = {
      ...prev.activeSessions,
      [category]: { 
        ...session, 
        userAnswers, 
        highlights: highlights || session.highlights || [] 
      }
    };

    const newStats = { ...prev, activeSessions: newSessions };
    localStorage.setItem('mcvsd_stats', JSON.stringify(newStats));
    return newStats;
  });
}, []);

  const handleSaveTime = useCallback((category: Category, time: number) => {
    setStats(prev => {
      const currentSession = prev.activeSessions?.[category];
      if (!currentSession) return prev;
      return {
        ...prev,
        activeSessions: {
          ...prev.activeSessions,
          [category]: {
            ...currentSession,
            elapsedTime: time
          }
        }
      };
    });
  }, []);

  const handleCompleteSession = useCallback((category: Category, score: number) => {
    setStats(prev => {
      const currentSession = prev.activeSessions?.[category];
      if (!currentSession) return prev;
      return {
        ...prev,
        activeSessions: {
          ...prev.activeSessions,
          [category]: {
            ...currentSession,
            isSubmitted: true,
            score
          }
        }
      };
    });
  }, []);

  const handleClearSession = useCallback((category: Category) => {
    setStats(prev => {
      const newSessions = { ...prev.activeSessions };
      delete newSessions[category];
      return {
        ...prev,
        activeSessions: newSessions
      };
    });
  }, []);

  // --- Profile Identity Management ---

  const handleLogin = useCallback((username: string, email: string) => {
    setStats(prev => ({
      ...prev,
      isLoggedIn: true,
      username,
      email
    }));
  }, []);

  const handleLogout = useCallback(() => {
    setStats(prev => ({
      ...prev,
      isLoggedIn: false,
      username: 'Guest Candidate',
      email: ''
    }));
  }, []);

  const resetStats = useCallback(() => {
    const initial = getInitialStats();
    setStats(initial);
    localStorage.removeItem('mcvsd-stats');
    localStorage.removeItem('mcvsd-grammar-registry');
    setGrammarRegistry({});
    setActiveView('dashboard');
  }, []);

  const handleRecordPracticeResults = (labCategory: Category, sessionScore: number, sessionTotal: number, mistakes: Question[], questions: Question[]) => {
    const safeScore = Math.floor(Number(sessionScore) || 0);
    const safeTotal = Math.floor(Number(sessionTotal) || 0);
    if (safeTotal === 0) return;
    
    setStats(prev => {
      const updatedAttempted = { ...prev.categoryAttempted };
      const updatedCorrect = { ...prev.categoryCorrect };
      const updatedScores = { ...prev.categoryScores };
      
      questions.forEach(q => {
        const qCat = normalizeCategory(q.category);
        updatedAttempted[qCat] = (Number(updatedAttempted[qCat]) || 0) + 1;
        const isMistake = mistakes.some(m => m.id === q.id);
        if (!isMistake) {
          updatedCorrect[qCat] = (Number(updatedCorrect[qCat]) || 0) + 1;
        }
        updatedScores[qCat] = Math.round(((Number(updatedCorrect[qCat]) || 0) / (Number(updatedAttempted[qCat]) || 1)) * 100);
      });

      if (labCategory === Category.MOCK) {
          updatedAttempted[Category.MOCK] = (Number(updatedAttempted[Category.MOCK]) || 0) + 1;
          const mockAccuracy = Math.round((safeScore / safeTotal) * 100);
          updatedScores[Category.MOCK] = mockAccuracy; 
      }

      const xpGained = (safeScore * 50) + (safeTotal * 10);
      
      return {
        ...prev,
        completedQuizzes: (Number(prev.completedQuizzes) || 0) + 1,
        questionsAnswered: (Number(prev.questionsAnswered) || 0) + safeTotal,
        totalCorrect: (Number(prev.totalCorrect) || 0) + safeScore,
        categoryAttempted: updatedAttempted,
        categoryCorrect: updatedCorrect,
        categoryScores: updatedScores,
        xp: (Number(prev.xp) || 0) + xpGained
      };
    });
  };

  const hashId = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().substring(0, 6);
  };

  const renderView = () => {
    const category = mapViewToCategory(activeView);
    
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            setActiveView={setActiveView} 
            onStartPractice={(cat) => setActiveView(mapCategoryToView(cat))}
          />
        );
      case 'mistakes':
        return (
          <div className="max-w-4xl mx-auto pb-20">
             <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Mistake Review Log</h2>
                <p className="text-slate-500 font-medium italic">Review and correct you missed questions. Grow from your mistakes.</p>
             </header>
             <div className="space-y-8">
                {stats.incorrectQuestions.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
                    <div className="text-6xl mb-6 opacity-30">📚</div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em]">Registry Clear: 100%</p>
                    <p className="text-slate-300 text-sm mt-2">No mistakes currently logged in the system.</p>
                  </div>
                ) : (
                  stats.incorrectQuestions.map((q, i) => {
                    const isBeingCorrected = correctingId === q.id;
                    return (
                      <div key={q.id} className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all overflow-hidden ${isBeingCorrected ? 'ring-4 ring-indigo-600/10 shadow-xl' : 'hover:border-indigo-200'}`}>
                        <div className="p-8 md:p-10">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-lg">{q.category}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Entry ID: #{hashId(q.id)}</span>
                          </div>

                          {q.passage && (
                            <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-sm font-serif italic text-slate-600 border border-slate-100 leading-relaxed max-h-32 overflow-y-auto no-scrollbar">
                              "{q.passage}"
                            </div>
                          )}

                          <h4 className="text-xl font-black text-slate-900 mb-8 leading-snug">{q.questionText}</h4>

                          {!isBeingCorrected ? (
                            <div className="flex flex-col md:flex-row gap-4">
                              <button 
                                onClick={() => {
                                  setCorrectingId(q.id);
                                  setCorrectionAnswer(null);
                                  setCorrectionState('idle');
                                }}
                                className="px-16 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                              >
                                Initiate Correction Sequence
                              </button>
                              <div className="bg-slate-900 text-slate-400 p-4 rounded-2xl flex-1 text-xs italic font-medium">
                                25 xp granted on correction. 
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-in slide-in-from-top-4">
                              <div className="grid grid-cols-1 gap-3">
                                {q.options.map((opt, idx) => {
                                  const isSelected = correctionAnswer === idx;
                                  const isCorrect = idx === q.correctAnswer;
                                  let colorClass = "bg-slate-50 border-slate-100 text-slate-700";
                                  
                                  if (correctionState !== 'idle') {
                                    if (isCorrect) colorClass = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-100";
                                    else if (isSelected) colorClass = "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-100";
                                    else colorClass = "opacity-40 border-slate-50";
                                  } else if (isSelected) {
                                    colorClass = "bg-indigo-50 border-indigo-600 text-indigo-900";
                                  }

                                  return (
                                    <button 
                                      key={idx} 
                                      disabled={correctionState !== 'idle'}
                                      onClick={() => {
                                        setCorrectionAnswer(idx);
                                        const pass = idx === q.correctAnswer;
                                        if (pass) {
                                          setCorrectionState('correct');
                                          awardXP(25);
                                          setTimeout(() => {
                                            resolveMistake(q.id);
                                            setCorrectingId(null);
                                          }, 1500);
                                        } else {
                                          setCorrectionState('wrong');
                                          setTimeout(() => {
                                            setCorrectionState('idle');
                                            setCorrectionAnswer(null);
                                          }, 2000);
                                        }
                                      }}
                                      className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all flex items-center gap-4 ${colorClass}`}
                                    >
                                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-300 border-slate-200'}`}>{String.fromCharCode(65 + idx)}</span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                              
                              {correctionState === 'wrong' && (
                                <div className="mt-6 p-6 bg-slate-900 rounded-[2rem] animate-in shake duration-300">
                                  <p className="text-[10px] font-black uppercase text-rose-400 mb-2">Diagnostic Data Refined</p>
                                  <p className="text-sm font-medium italic text-slate-300 leading-relaxed">{q.explanation}</p>
                                </div>
                              )}
                              
                              {correctionState === 'correct' && (
                                <div className="mt-6 py-4 bg-emerald-600 text-white rounded-2xl text-center font-black uppercase text-xs tracking-[0.3em] animate-pulse">
                                  Registry Synchronized (+25 XP)
                                </div>
                              )}

                              <button 
                                onClick={() => setCorrectingId(null)}
                                className="w-full py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                Exit Correction
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        );
      case 'learning':
        return (
          <LearningCenter 
            onAwardXP={awardXP} 
            onUpdateMastery={updateWordMastery}
            onLogMistake={logMistake}
            onRecordAnswer={recordAnswer}
            wordMastery={stats.wordMastery}
            activeSessionWords={stats.activeSessionWords}
            setActiveSessionWords={(words) => setStats(prev => ({ ...prev, activeSessionWords: words }))}
            words={allWords}
            isLoading={isVocabLoading}
            sessionRecords={stats.sessionRaceRecords || {}}
            onRecordSessionBest={updateSessionRecord}
          />
        );
      case 'notes':
        return <ShortNotes />;
      case 'dailyvocab':
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
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        );
      case 'reading':
      case 'vocab':
      case 'spelling':
      case 'grammar':
      case 'math':
      case 'mock':
        return (
          <Practice 
            category={category} 
            session={stats.activeSessions?.[category] || null}
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
