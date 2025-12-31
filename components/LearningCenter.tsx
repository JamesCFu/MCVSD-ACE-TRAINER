import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { generateGrammarLesson, generateSpellingTest, generateShortDefinitions } from '../geminiService';
import { VocabularyWord, GrammarLesson, Question, RootWord, Category, UserStats } from '../types';

const GRAMMAR_TOPICS = [
  "Comma Mastery: Essential vs Non-Essential",
  "Semicolons, Colons, and Dashes",
  "Modifier Placement (Dangling/Misplaced)",
  "Subject-Verb Agreement Pitfalls",
  "Parallel Structure in Lists",
  "Active vs Passive Voice Strategies",
  "Pronoun Case and Agreement",
  "Verb Tense Consistency",
  "Sentence Combining and Flow",
  "Transition Words and Rhetorical Purpose",
  "Commonly Confused Words (Academic)",
  "Capitalization and Punctuation Nuance"
];

// ... [Keep all FALLBACK_GRAMMAR_DATA, FALLBACK_SPELLING_POOL, and ROOT_DATA exactly as they were] ...
// To save space in the response, I am omitting the large data arrays. 
// Assume FALLBACK_GRAMMAR_DATA, FALLBACK_SPELLING_POOL, and ROOT_DATA are present here.

const FALLBACK_GRAMMAR_DATA: Record<string, GrammarLesson> = {
    // ... (Use existing data)
};
const FALLBACK_SPELLING_POOL: Question[] = [
    // ... (Use existing data)
];
const ROOT_DATA: RootWord[] = [
    // ... (Use existing data)
    { root: "a/n", meaning: "not, without", examples: ["abyss", "achromatic", "anhydrous"] },
    { root: "benefic", meaning: "good", examples: ["beneficial", "benefactor"] },
    // ... (Rest of existing ROOT_DATA)
];
// (Ideally, ensure the full ROOT_DATA array from your original file is here)

const SESSION_WORD_COUNT = 20;
const QUESTION_TIMER_SECONDS = 5;

interface LearningCenterProps {
  // Added stats and setStats to Props
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onAwardXP: (amount: number) => void;
  onUpdateMastery: (word: string, increment: number) => void;
  onLogMistake: (q: Question) => void;
  onRecordAnswer: (isCorrect: boolean, category: Category) => void;
  wordMastery: Record<string, number>;
  activeSessionWords: VocabularyWord[];
  setActiveSessionWords: (words: VocabularyWord[]) => void;
  words: VocabularyWord[];
  isLoading: boolean;
  fastestRaceTime?: number;
  onUpdateFastestRaceTime?: (time: number) => void;
}

const LearningCenter: React.FC<LearningCenterProps> = ({ 
  stats,
  setStats,
  onAwardXP, 
  onUpdateMastery, 
  onLogMistake,
  onRecordAnswer,
  wordMastery,
  activeSessionWords,
  setActiveSessionWords,
  words: initialWords,
  isLoading,
  fastestRaceTime,
  onUpdateFastestRaceTime
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'grammar' | 'spelling' | 'roots'>('learn');
  const [learnSubTab, setLearnSubTab] = useState<'list' | 'flashcards' | 'session'>('list');
  const [sessionMode, setSessionMode] = useState<'flashcards' | 'matching' | 'racecar'>('flashcards');
  
  const [currentWords, setCurrentWords] = useState<VocabularyWord[]>([]);
  const [spellingQuestions, setSpellingQuestions] = useState<Question[]>([]);
  
  // Grammar Registry Logic
  const [grammarRegistry, setGrammarRegistry] = useState<Record<string, GrammarLesson>>({});
  const [registryLoadingCount, setRegistryLoadingCount] = useState(0);
  const registryInitiated = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [rootsSearchQuery, setRootsSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rootCardIndex, setRootCardIndex] = useState(0);
  const [rootIsFlipped, setRootIsFlipped] = useState(false);
  const [rootsMode, setRootsMode] = useState<'list' | 'flashcards'>('list');
  const [shuffledRoots, setShuffledRoots] = useState<RootWord[]>(ROOT_DATA);

  // Match State
  const [selectedMatch, setSelectedMatch] = useState<{ id: string, type: 'word' | 'def' } | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [matchingGameWords, setMatchingGameWords] = useState<{ word: string, shortDef: string }[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Race State
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceIndex, setRaceIndex] = useState(0);
  const [raceProgress, setRaceProgress] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceFeedback, setRaceFeedback] = useState<string | null>(null);
  const [raceOptions, setRaceOptions] = useState<string[]>([]);
  const [raceQuestion, setRaceQuestion] = useState<string>('');
  const [raceTimeLeft, setRaceTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const [raceBoost, setRaceBoost] = useState<'none' | 'speed' | 'turbo'>('none');
  const [elapsedRaceTime, setElapsedRaceTime] = useState(0);
  const raceTimerRef = useRef<number | null>(null);
  const raceStartTimeRef = useRef<number>(0);
  const stopwatchRef = useRef<number | null>(null);

  const [currentLesson, setCurrentLesson] = useState<GrammarLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingAnswer, setSpellingAnswer] = useState<number | null>(null);
  const [showSpellingResult, setShowSpellingResult] = useState(false);
  const [spellingFinished, setSpellingFinished] = useState(false);
  const [spellingScore, setSpellingScore] = useState(0);

  // --- Starring Logic ---
  const starredSet = useMemo(() => new Set(stats.starredWords || []), [stats.starredWords]);
  
  // Note: Assuming 'starredRoots' exists on UserStats. If you want to share the list, change this to stats.starredWords
  const starredRootsSet = useMemo(() => new Set((stats as any).starredRoots || []), [(stats as any).starredRoots]);

  const toggleStar = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    setStats(prev => {
      const current = new Set(prev.starredWords || []);
      if (current.has(word)) {
        current.delete(word);
      } else {
        current.add(word);
      }
      return { ...prev, starredWords: Array.from(current) };
    });
  };

  const toggleRootStar = (e: React.MouseEvent, root: string) => {
    e.stopPropagation();
    setStats(prev => {
      const current = new Set((prev as any).starredRoots || []);
      if (current.has(root)) {
        current.delete(root);
      } else {
        current.add(root);
      }
      return { ...prev, starredRoots: Array.from(current) } as UserStats;
    });
  };
  // ----------------------

  // Preload Grammar Registry in background
  useEffect(() => {
    if (activeTab === 'grammar' && !registryInitiated.current) {
      registryInitiated.current = true;
      const bootAllLessons = async () => {
        for (const topic of GRAMMAR_TOPICS) {
          if (grammarRegistry[topic]) {
            setRegistryLoadingCount(prev => prev + 1);
            continue;
          }
          try {
            const lesson = await generateGrammarLesson(topic);
            setGrammarRegistry(prev => ({ ...prev, [topic]: lesson || FALLBACK_GRAMMAR_DATA[topic] }));
          } catch (e) {
            setGrammarRegistry(prev => ({ ...prev, [topic]: FALLBACK_GRAMMAR_DATA[topic] }));
          }
          setRegistryLoadingCount(prev => prev + 1);
        }
      };
      bootAllLessons();
    }
  }, [activeTab]);

  useEffect(() => {
    if (initialWords.length > 0 && currentWords.length === 0) {
      setCurrentWords(initialWords);
    }
  }, [initialWords, currentWords.length]);

  const selectGrammarLesson = (topic: string) => {
    const lesson = grammarRegistry[topic] || FALLBACK_GRAMMAR_DATA[topic];
    if (lesson) {
      setQuizAnswer(null);
      setShowQuizResult(false);
      setCurrentLesson(lesson);
    }
  };

  const loadSpelling = async () => {
    try {
      const questions = await generateSpellingTest(10);
      if (questions && questions.length > 0) {
        setSpellingQuestions(questions);
      } else {
        const shuffledPool = [...FALLBACK_SPELLING_POOL].sort(() => Math.random() - 0.5);
        setSpellingQuestions(shuffledPool.slice(0, 25)); 
      }
      setSpellingIndex(0);
      setSpellingFinished(false);
      setSpellingScore(0);
      setShowSpellingResult(false);
      setSpellingAnswer(null);
    } catch (e) { 
      const shuffledPool = [...FALLBACK_SPELLING_POOL].sort(() => Math.random() - 0.5);
      setSpellingQuestions(shuffledPool.slice(0, 25));
      setSpellingIndex(0);
      setSpellingFinished(false);
      setSpellingScore(0);
      setShowSpellingResult(false);
      setSpellingAnswer(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'spelling' && spellingQuestions.length === 0) loadSpelling();
    if (activeTab === 'learn' && initialWords.length > 0 && activeSessionWords.length === 0) {
        pickNewSessionBatch(initialWords);
    }
  }, [activeTab, initialWords, activeSessionWords.length, spellingQuestions.length]);

  useEffect(() => {
    if (sessionMode !== 'racecar') {
      setRaceStarted(false);
      setRaceFinished(false);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    }
  }, [sessionMode]);

  const pickNewSessionBatch = (source: VocabularyWord[]) => {
    const subset = [...source].sort(() => Math.random() - 0.5).slice(0, SESSION_WORD_COUNT);
    setActiveSessionWords(subset);
    setCardIndex(0);
    setMatches(new Set());
    setRaceStarted(false);
    setIsFlipped(false);
    setSelectedMatch(null);
  };

  const shuffleFlashcards = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setCurrentWords(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const shuffleSessionFlashcards = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setActiveSessionWords([...activeSessionWords].sort(() => Math.random() - 0.5));
  };

  const shuffleRoots = () => {
    setRootCardIndex(0);
    setRootIsFlipped(false);
    setShuffledRoots([...ROOT_DATA].sort(() => Math.random() - 0.5));
  };

  const filteredWords = useMemo(() => {
    return initialWords.filter(w => 
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.word.localeCompare(b.word));
  }, [initialWords, searchQuery]);

  const filteredRoots = useMemo(() => {
    return ROOT_DATA.filter(r => 
      r.root.toLowerCase().includes(rootsSearchQuery.toLowerCase()) ||
      r.meaning.toLowerCase().includes(rootsSearchQuery.toLowerCase())
    );
  }, [rootsSearchQuery]);

  const matchingPairs = useMemo(() => {
    if (matchingGameWords.length === 0) return { words: [], defs: [] };
    const wordsList = matchingGameWords.map(w => ({ id: w.word, text: w.word }));
    const defsList = matchingGameWords.map(w => ({ id: w.word, text: w.shortDef }));
    return {
      words: [...wordsList].sort(() => Math.random() - 0.5),
      defs: [...defsList].sort(() => Math.random() - 0.5)
    };
  }, [matchingGameWords]);

  useEffect(() => {
    const fetchShortDefs = async () => {
      if (activeSessionWords.length > 0 && sessionMode === 'matching') {
        setIsMatchingLoading(true);
        try {
          const shortDefs = await generateShortDefinitions(activeSessionWords);
          setMatchingGameWords(shortDefs);
        } catch (error) {
          setMatchingGameWords(activeSessionWords.map(w => ({ word: w.word, shortDef: w.definition.split(' ').slice(0, 5).join(' ') + '...' })));
        } finally {
          setIsMatchingLoading(false);
        }
      }
    };
    fetchShortDefs();
  }, [sessionMode, activeSessionWords]);

  const handleFlashcardNav = (direction: 'next' | 'prev') => {
    const list = learnSubTab === 'session' ? activeSessionWords : currentWords;
    if (list.length === 0) return;
    if (direction === 'next') setCardIndex((cardIndex + 1) % list.length);
    else setCardIndex((cardIndex - 1 + list.length) % list.length);
    setIsFlipped(false); 
  };

  const handleRootNav = (direction: 'next' | 'prev') => {
    if (direction === 'next') setRootCardIndex((rootCardIndex + 1) % shuffledRoots.length);
    else setRootCardIndex((rootCardIndex - 1 + shuffledRoots.length) % shuffledRoots.length);
    setRootIsFlipped(false);
  };

  const handleMatch = (id: string, type: 'word' | 'def') => {
    if (matches.has(id) || matchingError) return;
    if (!selectedMatch) {
      setSelectedMatch({ id, type });
      return;
    }
    if (selectedMatch.id === id && selectedMatch.type !== type) {
      const newMatches = new Set(matches);
      newMatches.add(id);
      setMatches(newMatches);
      onAwardXP(10);
      onRecordAnswer(true, Category.VOCABULARY);
      setSelectedMatch(null);
    } else if (selectedMatch.id !== id && selectedMatch.type !== type) {
      setMatchingError(`${selectedMatch.id}-${id}`);
      onRecordAnswer(false, Category.VOCABULARY);
      const wrongWordObj = activeSessionWords.find(w => w.word === (selectedMatch.type === 'word' ? selectedMatch.id : id));
      if (wrongWordObj) {
          onLogMistake({
              id: `match-err-${Date.now()}-${wrongWordObj.word}`,
              category: Category.VOCABULARY,
              questionText: `Identify the correct definition for "${wrongWordObj.word}":`,
              options: [wrongWordObj.definition, 'Incorrect match.'],
              correctAnswer: 0,
              explanation: `Mismatched in Matching Grid. Definition of ${wrongWordObj.word}: ${wrongWordObj.definition}`
          });
      }
      setTimeout(() => {
        setMatchingError(null);
        setSelectedMatch(null);
      }, 500);
    } else {
      setSelectedMatch({ id, type });
    }
  };

  const generateRaceStep = useCallback((idx: number, set: VocabularyWord[]) => {
    if (set.length === 0) return;
    const safeIndex = idx % set.length;
    const current = set[safeIndex];
    setRaceQuestion(current.definition);
    const correct = current.word;
    const others = set.filter(w => w.word !== correct).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
    setRaceOptions([correct, ...others].sort(() => Math.random() - 0.5));
    setRaceTimeLeft(QUESTION_TIMER_SECONDS);
  }, []);

  const startRace = () => {
    const shuffledForRace = [...activeSessionWords].sort(() => Math.random() - 0.5);
    setActiveSessionWords(shuffledForRace);
    setRaceStarted(true);
    setRaceFinished(false);
    setRaceProgress(0);
    setRaceIndex(0);
    setRaceFeedback(null);
    setRaceBoost('none');
    
    raceStartTimeRef.current = Date.now();
    setElapsedRaceTime(0);
    stopwatchRef.current = window.setInterval(() => {
      setElapsedRaceTime(Date.now() - raceStartTimeRef.current);
    }, 50);

    generateRaceStep(0, shuffledForRace);
  };

  const handleRaceAnswer = (answer: string) => {
    if (raceFeedback || raceFinished) return;
    const safeIndex = raceIndex % activeSessionWords.length;
    const correctWord = activeSessionWords[safeIndex];
    const isCorrect = answer === correctWord.word;
    const timeTakenSeconds = QUESTION_TIMER_SECONDS - raceTimeLeft;

    if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    onRecordAnswer(isCorrect, Category.VOCABULARY);

    if (isCorrect) {
      let distanceGain = 5; 
      let boostType: 'none' | 'speed' | 'turbo' = 'none';

      if (timeTakenSeconds < 1.5) {
        distanceGain += 3;
        boostType = 'turbo';
      } else if (timeTakenSeconds < 3) {
        distanceGain += 1.5;
        boostType = 'speed';
      }

      setRaceFeedback('correct');
      setRaceBoost(boostType);
      
      const nextProgress = Math.min(100, raceProgress + distanceGain);
      setRaceProgress(nextProgress);
      onAwardXP(50);
      onUpdateMastery(answer, 5);
      if (nextProgress >= 100) {
        const finalTime = Date.now() - raceStartTimeRef.current;
        if (stopwatchRef.current) clearInterval(stopwatchRef.current);
        if (onUpdateFastestRaceTime) onUpdateFastestRaceTime(finalTime);
        setTimeout(() => {
          setRaceFinished(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setRaceFeedback(null);
          setRaceBoost('none');
          setRaceIndex(i => i + 1);
          generateRaceStep(raceIndex + 1, activeSessionWords);
        }, 1000);
      }
    } else {
      setRaceFeedback(answer === "" ? 'timeout' : answer);
      setRaceBoost('none');
      onLogMistake({
          id: `race-err-${Date.now()}-${correctWord.word}`,
          category: Category.VOCABULARY,
          questionText: `Which word matches the definition: "${correctWord.definition}"?`,
          options: raceOptions,
          correctAnswer: raceOptions.indexOf(correctWord.word),
          explanation: `Missed in Raceway. Word: ${correctWord.word}. Definition: ${correctWord.definition}`
      });
      setTimeout(() => {
        setRaceFeedback(null);
        setRaceIndex(i => i + 1);
        generateRaceStep(raceIndex + 1, activeSessionWords);
      }, 1000);
    }
  };

  useEffect(() => {
    if (raceStarted && !raceFinished && !raceFeedback) {
      raceTimerRef.current = window.setInterval(() => {
        setRaceTimeLeft(prev => {
          if (prev <= 0.1) {
            handleRaceAnswer("");
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => { if (raceTimerRef.current) clearInterval(raceTimerRef.current); };
  }, [raceStarted, raceFinished, raceFeedback, raceIndex, activeSessionWords]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Academy Laboratory</h2>
        <p className="text-slate-500 mt-2 font-medium italic">High-performance training sequence initiated.</p>
      </header>
      
      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-[1.5rem] w-fit mb-12 shadow-inner border border-slate-300">
        <button onClick={() => setActiveTab('learn')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'learn' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Vocabulary</button>
        <button onClick={() => setActiveTab('grammar')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'grammar' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Grammar</button>
        <button onClick={() => setActiveTab('spelling')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'spelling' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Spelling</button>
        <button onClick={() => setActiveTab('roots')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'roots' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Roots & Prefixes</button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-48">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8"></div>
          <p className="text-indigo-900 font-black tracking-[0.4em] uppercase text-[10px]">Processing Academic Core...</p>
        </div>
      ) : activeTab === 'learn' ? (
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex space-x-10">
              {['list', 'flashcards', 'session'].map((t) => (
                <button key={t} onClick={() => { setLearnSubTab(t as any); setCardIndex(0); setIsFlipped(false); }} className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${learnSubTab === t ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {t === 'list' ? 'Full Lexicon' : t === 'flashcards' ? 'Flashcard Deck' : 'Session Trainer'}
                </button>
              ))}
            </div>
            {learnSubTab === 'list' && (
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({filteredWords.length}/{initialWords.length}) Results</div>
                <div className="relative">
                  <input type="text" placeholder="Search registry..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm w-72 focus:ring-2 focus:ring-indigo-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                  <svg className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
            )}
          </div>

          {learnSubTab === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWords.map((w, i) => (
                <div key={i} onClick={() => setSelectedWord(w)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all hover:shadow-xl group cursor-pointer transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-indigo-800 tracking-tighter uppercase">
                        <span className="text-slate-300 mr-2 text-lg">{(i + 1).toString().padStart(2, '0')}</span>{w.word}
                    </h4>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">{w.partOfSpeech}</span>
                  </div>
                  <p className="text-slate-700 text-sm font-bold mb-4 leading-relaxed line-clamp-3">{w.definition}</p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] font-medium italic text-slate-400">"{w.exampleSentence}"</div>
                </div>
              ))}
            </div>
          )}

          {learnSubTab === 'flashcards' && (
            <div className="flex flex-col items-center py-12">
               <div className="w-full max-w-lg h-96 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                     <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center group">
                       
                       {/* Flashcard Star Button - Front */}
                       <button 
                          onClick={(e) => currentWords[cardIndex] && toggleStar(e, currentWords[cardIndex].word)}
                          className="absolute top-10 right-10 p-3 rounded-full hover:bg-slate-50 transition-colors z-20"
                       >
                          <svg className={`w-8 h-8 transition-colors ${currentWords[cardIndex] && starredSet.has(currentWords[cardIndex].word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 group-hover:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                       </button>

                       <span className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Terminology</span>
                       <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{currentWords[cardIndex]?.word}</h2>
                       <p className="mt-4 text-indigo-600 font-black text-xs uppercase">{currentWords[cardIndex]?.partOfSpeech}</p>
                     </div>
                     <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                        
                        {/* Flashcard Star Button - Back */}
                        <button 
                          onClick={(e) => currentWords[cardIndex] && toggleStar(e, currentWords[cardIndex].word)}
                          className="absolute top-10 right-10 p-3 rounded-full hover:bg-white/10 transition-colors z-20"
                       >
                          <svg className={`w-8 h-8 transition-colors ${currentWords[cardIndex] && starredSet.has(currentWords[cardIndex].word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 hover:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                       </button>

                        <p className="text-xl font-bold leading-relaxed">{currentWords[cardIndex]?.definition}</p>
                        <div className="mt-6 pt-6 border-t border-white/10 w-full text-xs italic text-indigo-200">"{currentWords[cardIndex]?.exampleSentence}"</div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-10 mt-16">
                  <button onClick={() => handleFlashcardNav('prev')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                  <button onClick={shuffleFlashcards} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                  <button onClick={() => handleFlashcardNav('next')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
               </div>
            </div>
          )}

          {learnSubTab === 'session' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4">
               <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-[1.25rem]">
                  <div className="flex space-x-2">
                    {['flashcards', 'matching', 'racecar'].map((m) => (
                      <button key={m} onClick={() => setSessionMode(m as any)} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${sessionMode === m ? 'bg-indigo-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{m}</button>
                    ))}
                  </div>
                  <button onClick={() => pickNewSessionBatch(initialWords)} className="px-6 py-3 bg-white text-indigo-700 rounded-2xl text-[10px] font-black uppercase shadow-sm hover:bg-indigo-50 border border-slate-200">Reset Session (20 Random)</button>
               </div>
               
               <div className="min-h-[500px]">
                  {sessionMode === 'flashcards' && (
                    <div className="flex flex-col items-center py-8">
                       <div className="w-full max-w-lg h-80 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                             <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex items-center justify-center p-12 text-center group">
                               
                               {/* Session Trainer Star - Front */}
                               <button 
                                  onClick={(e) => activeSessionWords[cardIndex] && toggleStar(e, activeSessionWords[cardIndex].word)}
                                  className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-50 transition-colors z-20"
                               >
                                  <svg className={`w-8 h-8 transition-colors ${activeSessionWords[cardIndex] && starredSet.has(activeSessionWords[cardIndex].word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 group-hover:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                               </button>

                               <div className="flex flex-col items-center">
                                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{activeSessionWords[cardIndex]?.word}</h2>
                                 <span className="text-[10px] font-black uppercase mt-2 text-indigo-500">{activeSessionWords[cardIndex]?.partOfSpeech}</span>
                               </div>
                             </div>
                             <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                                
                                {/* Session Trainer Star - Back */}
                                <button 
                                  onClick={(e) => activeSessionWords[cardIndex] && toggleStar(e, activeSessionWords[cardIndex].word)}
                                  className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/10 transition-colors z-20"
                               >
                                  <svg className={`w-8 h-8 transition-colors ${activeSessionWords[cardIndex] && starredSet.has(activeSessionWords[cardIndex].word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 hover:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                               </button>

                                <p className="text-lg font-bold leading-relaxed">{activeSessionWords[cardIndex]?.definition}</p>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center space-x-8 mt-12">
                          <button onClick={() => handleFlashcardNav('prev')} className="p-4 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                          <button onClick={shuffleSessionFlashcards} className="p-4 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                          <button onClick={() => handleFlashcardNav('next')} className="p-4 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
                       </div>
                    </div>
                  )}

                  {sessionMode === 'matching' && (
                    <div className="max-w-5xl mx-auto py-4">
                      {isMatchingLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh]">
                          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Calibrating Match Matrix...</h3>
                        </div>
                      ) : matches.size === SESSION_WORD_COUNT ? (
                        <div className="col-span-full py-16 text-center bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-[4rem]">
                          <div className="text-8xl mb-6">🏆</div>
                          <h4 className="text-4xl font-black text-emerald-900 tracking-tighter uppercase mb-4">Synchronize Set</h4>
                          <button onClick={() => { onAwardXP(400); pickNewSessionBatch(initialWords); }} className="px-12 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm">Next Training Cycle</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                               {matchingPairs.words.map((item) => (
                                 <button key={`word-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'word')} className={`w-full p-6 h-28 flex items-center justify-center rounded-3xl border-2 font-black text-sm uppercase transition-all ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20' : (selectedMatch?.id === item.id && selectedMatch.type === 'word' ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                               ))}
                            </div>
                            <div className="space-y-4">
                               {matchingPairs.defs.map((item) => (
                                 <button key={`def-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'def')} className={`w-full p-6 h-28 flex items-center justify-center text-center rounded-3xl border-2 font-black text-xs transition-all ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20' : (selectedMatch?.id === item.id && selectedMatch.type === 'def' ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                               ))}
                            </div>
                        </div>
                      )}
                    </div>
                  )}

                  {sessionMode === 'racecar' && (
                    <div className="py-4">
                       {!raceStarted ? (
                         <div className="max-w-2xl mx-auto bg-slate-900 p-16 rounded-[4rem] text-center border-b-[12px] border-indigo-600 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div className="relative z-10">
                              <div className="text-9xl mb-10 text-emerald-400 group-hover:scale-110 transition-transform duration-500">🏎️</div>
                              <h3 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Circuit Mastery</h3>
                              <p className="text-slate-400 mb-8 text-lg font-medium">Defeat the clock. Answer faster to gain distance velocity.</p>
                              
                              {fastestRaceTime && (
                                <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-6 py-2 rounded-full border border-emerald-500/30 mb-10">
                                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                  <span className="text-emerald-300 font-black uppercase text-xs tracking-widest">Personal Best: {formatTime(fastestRaceTime)}</span>
                                </div>
                              )}

                              <button onClick={startRace} className="w-full py-8 bg-white text-indigo-900 rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all hover:bg-emerald-400 hover:text-emerald-950">Launch Sequence</button>
                            </div>
                         </div>
                       ) : !raceFinished ? (
                         <div className="max-w-3xl mx-auto bg-slate-900 p-12 rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden relative">
                            {/* Speed Lines Animation */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] bg-[length:200%_100%] animate-speed-lines"></div>
                            </div>

                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-10">
                                 <div className="text-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="text-4xl font-black text-white font-mono tabular-nums tracking-widest">{formatTime(elapsedRaceTime)}</div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Total Time</div>
                                 </div>
                                 
                                 {/* Progress Track */}
                                 <div className="flex-1 px-8 pt-4">
                                    <div className="relative h-6 bg-slate-800 rounded-full border border-slate-700">
                                       <div 
                                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(52,211,153,0.5)]" 
                                          style={{ width: `${raceProgress}%` }}
                                       >
                                          {/* Car Icon */}
                                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-2xl filter drop-shadow-lg transform scale-x-[-1]">🏎️</div>
                                       </div>
                                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-full"></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">
                                       <span>Start</span>
                                       <span>Finish Line</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="text-center mb-8 relative h-12">
                                 {raceBoost === 'turbo' && (
                                    <div className="absolute inset-x-0 top-0 text-emerald-400 font-black uppercase tracking-[0.5em] text-xl animate-bounce drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">Turbo Boost! +8%</div>
                                 )}
                                 {raceBoost === 'speed' && (
                                    <div className="absolute inset-x-0 top-0 text-indigo-400 font-black uppercase tracking-[0.3em] text-lg animate-pulse">Speed Bonus! +6.5%</div>
                                 )}
                              </div>

                              <h4 className="text-2xl font-black text-white mb-10 leading-tight text-center italic bg-white/5 p-6 rounded-3xl border border-white/5">"{raceQuestion}"</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                 {raceOptions.map((opt, i) => (
                                   <button key={i} disabled={!!raceFeedback} onClick={() => handleRaceAnswer(opt)} className={`py-6 rounded-3xl font-black uppercase text-sm border-2 transition-all transform active:scale-95 ${raceFeedback === 'correct' && opt === activeSessionWords[raceIndex % activeSessionWords.length].word ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-105' : opt === raceFeedback ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-slate-700 hover:text-white'}`}>{opt}</button>
                                 ))}
                              </div>
                            </div>
                         </div>
                       ) : (
                         <div className="max-w-2xl mx-auto text-center py-24 bg-slate-900 rounded-[5rem] shadow-2xl text-white border-b-[12px] border-emerald-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-900/20"></div>
                            <div className="relative z-10">
                              <div className="text-9xl mb-8 animate-bounce">🏁</div>
                              <h4 className="text-5xl font-black mb-4 tracking-tighter uppercase text-white">Race Complete!</h4>
                              <div className="text-8xl font-mono font-black text-emerald-400 mb-12 tracking-tighter drop-shadow-2xl">{formatTime(elapsedRaceTime)}</div>
                              
                              {fastestRaceTime === elapsedRaceTime && (
                                <div className="inline-block px-8 py-3 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-300 font-black uppercase tracking-widest mb-10 animate-pulse">New Personal Record!</div>
                              )}

                              <button onClick={() => setRaceStarted(false)} className="px-20 py-8 bg-white text-emerald-900 rounded-[3rem] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all">Return to Racing Center</button>
                            </div>
                          </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      ) : activeTab === 'grammar' ? (
        <div className="space-y-12">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6">
               <button onClick={() => setCurrentLesson(null)} className="mb-8 text-slate-400 hover:text-slate-700 flex items-center font-black uppercase text-[10px] tracking-widest transition group">
                 <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                 Exit Module
               </button>
               
               <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-4 block">Preparation Logic</span>
                  <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">{currentLesson.topic}</h3>
                  
                  <div className="prose prose-indigo max-w-none mb-12">
                    <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed text-lg">
                      {currentLesson.explanation}
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Case Studies</p>
                    <div className="grid grid-cols-1 gap-4">
                      {currentLesson.examples.map((ex, i) => (
                        <div key={i} className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900 font-bold italic">
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-12">
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                       <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-6">Neural Verification</p>
                       <h4 className="text-xl font-bold mb-8 leading-tight">{currentLesson.quickCheck.question}</h4>
                       
                       <div className="grid grid-cols-1 gap-3">
                          {currentLesson.quickCheck.options.map((opt, i) => (
                            <button 
                              key={i} 
                              disabled={showQuizResult}
                              onClick={() => { 
                                setQuizAnswer(i); 
                                setShowQuizResult(true); 
                                const isCorrect = i === currentLesson.quickCheck.correctAnswer;
                                onRecordAnswer(isCorrect, Category.GRAMMAR); 
                                if(isCorrect) {
                                  onAwardXP(40);
                                } else {
                                  onLogMistake({
                                    id: `grammar-lesson-${currentLesson.topic}-${Date.now()}`,
                                    category: Category.GRAMMAR,
                                    questionText: currentLesson.quickCheck.question,
                                    options: currentLesson.quickCheck.options,
                                    correctAnswer: currentLesson.quickCheck.correctAnswer,
                                    explanation: currentLesson.quickCheck.explanation
                                  });
                                }
                              }}
                              className={`w-full text-left p-5 rounded-2xl font-bold transition-all border-2 ${showQuizResult ? (i === currentLesson.quickCheck.correctAnswer ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : (i === quizAnswer ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-white/5 opacity-40')) : 'border-white/10 hover:border-indigo-500 bg-white/5'}`}
                            >
                              {opt}
                            </button>
                          ))}
                       </div>

                       {showQuizResult && (
                         <div className="mt-8 p-6 bg-white/5 rounded-2xl animate-in fade-in slide-in-from-top-2 border border-white/5">
                            <p className="text-xs font-black uppercase text-indigo-400 mb-2">Diagnostic Data</p>
                            <p className="text-sm font-medium leading-relaxed italic text-slate-300">{currentLesson.quickCheck.explanation}</p>
                         </div>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${registryLoadingCount === GRAMMAR_TOPICS.length ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    {registryLoadingCount === GRAMMAR_TOPICS.length ? 'System Optimized' : `Syncing Core Content... (${registryLoadingCount}/${GRAMMAR_TOPICS.length})`}
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GRAMMAR_TOPICS.map((topic, i) => {
                  const isPremium = !!grammarRegistry[topic];
                  return (
                    <div key={topic} onClick={() => selectGrammarLesson(topic)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden">
                      {isPremium && <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50 rounded-bl-[2rem] flex items-center justify-center"><svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>}
                      <div>
                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4 block">Module {i + 1}</span>
                        <h4 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">{topic}</h4>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'spelling' ? (
        <div className="max-w-3xl mx-auto space-y-12">
          {spellingFinished ? (
            <div className="text-center py-24 bg-white rounded-[4rem] shadow-xl border border-slate-100 animate-in zoom-in">
               <div className="text-8xl mb-8">🎖️</div>
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Ortho-Log Synchronized</h3>
               <p className="text-slate-500 font-bold mb-10">Diagnostic Result: <span className="text-indigo-600">{spellingScore} / {spellingQuestions.length}</span> Accuracy</p>
               <button onClick={loadSpelling} className="px-16 py-6 bg-indigo-700 text-white rounded-3xl font-black uppercase text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">Next Cycle</button>
            </div>
          ) : spellingQuestions.length > 0 ? (
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 h-1.5 bg-indigo-600 transition-all duration-500" style={{ width: `${(spellingIndex / spellingQuestions.length) * 100}%` }}></div>
               <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em]">Spelling Unit</span>
                  <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{spellingIndex + 1} / {spellingQuestions.length} Evaluating</span>
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight leading-tight">{spellingQuestions[spellingIndex].questionText}</h3>
               
               <div className="grid grid-cols-1 gap-4">
                  {spellingQuestions[spellingIndex].options.map((opt, i) => (
                    <button 
                      key={i} 
                      disabled={showSpellingResult}
                      onClick={() => { 
                        setSpellingAnswer(i); 
                        setShowSpellingResult(true); 
                        const isCorrect = i === spellingQuestions[spellingIndex].correctAnswer;
                        onRecordAnswer(isCorrect, Category.SPELLING); 
                         if (isCorrect) {
                          onAwardXP(20);
                        }
                        if (!isCorrect) {
                          onLogMistake(spellingQuestions[spellingIndex]);
                          onAwardXP(20);
                        }
                      }}
                      className={`w-full text-left p-6 rounded-2xl font-bold border-2 transition-all ${showSpellingResult ? (i === spellingQuestions[spellingIndex].correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : (i === spellingAnswer ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 opacity-40')) : 'border-slate-100 hover:border-indigo-400 bg-slate-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
               </div>

               {showSpellingResult && (
                 <div className="mt-12 pt-10 border-t border-slate-100">
                    <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                       <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Coach Insight</p>
                       <p className="text-sm italic font-medium leading-relaxed text-slate-300">{spellingQuestions[spellingIndex].explanation}</p>
                       <button onClick={() => { 
                         if(spellingAnswer === spellingQuestions[spellingIndex].correctAnswer) setSpellingScore(s => s + 1);
                         if(spellingIndex + 1 < spellingQuestions.length) { setSpellingIndex(i => i + 1); setShowSpellingResult(false); setSpellingAnswer(null); }
                         else setSpellingFinished(true);
                       }} className="w-full mt-10 py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Advance Sequence</button>
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
               <p className="text-indigo-900 font-black uppercase tracking-widest text-[10px]">Booting Word List Engine...</p>
            </div>
          )}
        </div>
      ) : activeTab === 'roots' ? (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button onClick={() => setRootsMode('list')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${rootsMode === 'list' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400'}`}>List View</button>
              <button onClick={() => setRootsMode('flashcards')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${rootsMode === 'flashcards' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400'}`}>Flashcards</button>
            </div>
            {rootsMode === 'list' && (
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({filteredRoots.length}/{ROOT_DATA.length}) Results</div>
                <div className="relative w-full md:w-64">
                  <input type="text" placeholder="Search Roots..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={rootsSearchQuery} onChange={(e) => setRootsSearchQuery(e.target.value)} />
                  <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
            )}
          </div>

          {rootsMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRoots.map((root, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="text-4xl font-black text-indigo-600 mb-4 tracking-tighter group-hover:scale-110 origin-left transition-transform">{root.root}</div>
                  <p className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-50 pb-6">{root.meaning}</p>
                  <div className="flex flex-wrap gap-2">
                      {root.examples.map((ex, j) => (
                        <span key={j} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-100 uppercase">{ex}</span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
               <div className="w-full max-w-lg h-96 relative perspective-1000 cursor-pointer" onClick={() => setRootIsFlipped(!rootIsFlipped)}>
                  <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${rootIsFlipped ? 'rotate-y-180' : ''}`}>
                     <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center group">
                        
                        {/* Roots Star - Front */}
                        <button 
                          onClick={(e) => shuffledRoots[rootCardIndex] && toggleRootStar(e, shuffledRoots[rootCardIndex].root)}
                          className="absolute top-10 right-10 p-3 rounded-full hover:bg-slate-50 transition-colors z-20"
                       >
                          <svg className={`w-8 h-8 transition-colors ${shuffledRoots[rootCardIndex] && starredRootsSet.has(shuffledRoots[rootCardIndex].root) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 group-hover:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                       </button>

                        <span className="text-[10px] font-black text-indigo-400 uppercase mb-10 tracking-[0.3em]">Root/Prefix Term</span>
                        <h2 className="text-7xl font-black text-indigo-950 tracking-tighter">{shuffledRoots[rootCardIndex]?.root}</h2>
                        <div className="mt-20 text-slate-300 text-[10px] font-black uppercase animate-pulse">Flip for Definition</div>
                     </div>
                     <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                        
                        {/* Roots Star - Back */}
                        <button 
                          onClick={(e) => shuffledRoots[rootCardIndex] && toggleRootStar(e, shuffledRoots[rootCardIndex].root)}
                          className="absolute top-10 right-10 p-3 rounded-full hover:bg-white/10 transition-colors z-20"
                       >
                          <svg className={`w-8 h-8 transition-colors ${shuffledRoots[rootCardIndex] && starredRootsSet.has(shuffledRoots[rootCardIndex].root) ? 'text-yellow-400 fill-yellow-400' : 'text-indigo-400 hover:text-indigo-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                       </button>

                        <h2 className="text-4xl font-black mb-8 leading-tight">{shuffledRoots[rootCardIndex]?.meaning}</h2>
                        <div className="flex flex-wrap justify-center gap-2">
                           {shuffledRoots[rootCardIndex]?.examples.map((ex, i) => (
                             <span key={i} className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/5 text-indigo-100 uppercase">{ex}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-12 mt-16">
                  <button onClick={() => handleRootNav('prev')} className="p-6 bg-white border rounded-[2rem] shadow-lg hover:border-indigo-400 transition-all"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                  <button onClick={shuffleRoots} className="p-6 bg-white border rounded-[2rem] shadow-lg hover:border-indigo-400 transition-all"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                  <button onClick={() => handleRootNav('next')} className="p-6 bg-white border rounded-[2rem] shadow-lg hover:border-indigo-400 transition-all"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
               </div>
               <span className="mt-8 text-slate-400 font-black text-xs uppercase tracking-[0.2em]">{rootCardIndex + 1} / {shuffledRoots.length} Registry Terms</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Word Expand Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
              <div className="h-4 bg-indigo-600 shrink-0"></div>
              <button onClick={() => setSelectedWord(null)} className="absolute top-10 right-10 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 no-scrollbar">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-8">
                  <h3 className="text-5xl font-black text-indigo-950 tracking-tighter uppercase">{selectedWord.word}</h3>
                  <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 text-indigo-700 font-black uppercase text-sm">{selectedWord.partOfSpeech}</div>
                </div>

                <div className="space-y-10">
                   <div>
                      <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Registry Definition</p>
                      <p className="text-3xl font-bold text-slate-800 leading-tight italic">"{selectedWord.definition}"</p>
                   </div>

                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Contextual Application</p>
                      <p className="text-xl font-medium leading-relaxed text-slate-600 bg-slate-50 p-8 rounded-3xl border border-slate-100">"{selectedWord.exampleSentence}"</p>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-4">Synonyms</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedWord.synonyms.map((s, i) => (
                             <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-black uppercase">{s}</span>
                           ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] mb-4">Antonyms</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedWord.antonyms.map((a, i) => (
                             <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-black uppercase">{a}</span>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-center">
                 <button onClick={() => setSelectedWord(null)} className="px-16 py-6 bg-indigo-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95">Commit to Memory</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes speed-lines {
          0% { background-position: 0 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .animate-speed-lines { animation: speed-lines 0.5s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LearningCenter;
