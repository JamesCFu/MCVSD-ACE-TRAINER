import React, { useMemo, useState, useEffect, useRef } from 'react';
import { UserStats, VocabularyWord, Category, Question } from '../types';
import { generateShortDefinitions } from '../geminiService';

interface DailyVocabProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  words: VocabularyWord[];
  isLoading: boolean;
  onAwardXP: (amount: number) => void;
  onRecordAnswer: (isCorrect: boolean, category: Category) => void;
  onLogMistake: (q: Question) => void;
}

// Simple string hash for pseudo-random stability
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const DailyVocab: React.FC<DailyVocabProps> = ({ stats, setStats, words, isLoading, onAwardXP, onRecordAnswer, onLogMistake }) => {
  const [mode, setMode] = useState<'list' | 'flashcards' | 'matching' | 'racecar' | 'test'>('list');
  const [showAdvanceConfirm, setShowAdvanceConfirm] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  
  // --- NEW STATE: Starred Review Mode ---
  const [isStarredReviewMode, setIsStarredReviewMode] = useState(false);
  
  // --- NEW STATE: Force Show All Flashcards ---
  const [forceShowAll, setForceShowAll] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Stats / Progression State
  const maxDay = stats.dailyVocabDay || 1;

  // Initialize from stats.lastViewedDay if it exists, otherwise use maxDay
  const [viewingDay, setViewingDay] = useState(stats.lastViewedDay || maxDay);

  const lastProgressRef = useRef(maxDay);
  
  // Sync viewing day if user levels up
  useEffect(() => {
    const currentMax = stats.dailyVocabDay || 1;
    
    if (currentMax > lastProgressRef.current) {
      setViewingDay(currentMax);
      // Save this new max as the last viewed day
      setStats(prev => ({ ...prev, lastViewedDay: currentMax }));
    }
    
    lastProgressRef.current = currentMax;
  }, [stats.dailyVocabDay]);

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardDeck, setFlashcardDeck] = useState<VocabularyWord[]>([]);
  
  // Match Game State
  const [selectedMatch, setSelectedMatch] = useState<{ id: string, type: 'word' | 'def' } | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [matchingGameWords, setMatchingGameWords] = useState<{ word: string, shortDef: string }[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Race Game State
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceIndex, setRaceIndex] = useState(0);
  const [raceProgress, setRaceProgress] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceFeedback, setRaceFeedback] = useState<string | null>(null);
  const [raceOptions, setRaceOptions] = useState<string[]>([]);
  const [raceQuestion, setRaceQuestion] = useState<string>('');
  const [raceTimeLeft, setRaceTimeLeft] = useState(5);
  const [raceBoost, setRaceBoost] = useState<'none' | 'speed' | 'turbo'>('none');
  const [elapsedRaceTime, setElapsedRaceTime] = useState(0);
  const [raceWords, setRaceWords] = useState<VocabularyWord[]>([]);
  
  // Cumulative Test State
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  const raceTimerRef = useRef<number | null>(null);
  const raceStartTimeRef = useRef<number>(0);
  const stopwatchRef = useRef<number | null>(null);

  const currentSeed = stats.dailyVocabSeed || 0;

  // Starred Words Logic
  const starredSet = useMemo(() => new Set(stats.starredWords || []), [stats.starredWords]);

  const toggleStar = (e: React.MouseEvent, word: string) => {
    e.stopPropagation(); // Prevent card click
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

  const dailyWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    
    // --- 1. STARRED REVIEW MODE ---
    if (isStarredReviewMode) {
        return words.filter(w => starredSet.has(w.word)).sort((a, b) => a.word.localeCompare(b.word));
    }

    // --- 2. STANDARD DAILY STAGE LOGIC ---
    const WORDS_PER_DAY = 25;
    const REVIEW_WORDS_COUNT = 5;
    
    // A. Sequential 25 words for the day
    const startIndex = ((viewingDay - 1) * WORDS_PER_DAY) % words.length;
    const mainBatch: VocabularyWord[] = [];
    
    for (let i = 0; i < Math.min(WORDS_PER_DAY, words.length); i++) {
        const idx = (startIndex + i) % words.length;
        if (words[idx]) mainBatch.push(words[idx]);
    }

    // B. Identify the pool of words NOT in the main batch
    const restOfPool = words.filter(w => !mainBatch.some(mb => mb.word === w.word));
    
    // C. Prioritize Starred Words
    // We filter the rest of the pool for starred words
    const starredInPool = restOfPool.filter(w => starredSet.has(w.word));
    const nonStarredInPool = restOfPool.filter(w => !starredSet.has(w.word));
    
    // Helper sort function - Uses viewingDay AND currentSeed to shuffle differently every stage.
    // This ensures that we get a RANDOM 5 starred words each stage from the available pool.
    const sortFn = (a: VocabularyWord, b: VocabularyWord) => {
       const hashA = hashString(a.word + `stage-${viewingDay}-seed-${currentSeed}`);
       const hashB = hashString(b.word + `stage-${viewingDay}-seed-${currentSeed}`);
       return hashA - hashB;
    };

    // Grab up to 5 starred words first (randomized by stage hash)
    const starredSelected = [...starredInPool].sort(sortFn).slice(0, REVIEW_WORDS_COUNT);
    
    // Fill remainder with random non-starred words (randomized by stage hash)
    const remainingSlots = REVIEW_WORDS_COUNT - starredSelected.length;
    let randomSelected: VocabularyWord[] = [];
    
    if (remainingSlots > 0) {
       randomSelected = [...nonStarredInPool].sort(sortFn).slice(0, remainingSlots);
    }
    
    const reviewBatch = [...starredSelected, ...randomSelected];
    
    return [...mainBatch, ...reviewBatch].sort((a, b) => a.word.localeCompare(b.word));
    
    // Included currentSeed in dependencies to refresh randomization on day advance
  }, [words, viewingDay, isStarredReviewMode, currentSeed]); 

  // Filtered List for Search
  const filteredDailyWords = useMemo(() => {
    return dailyWords.filter(w => 
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.definition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dailyWords, searchQuery]);

  // Determine Flashcard Deck (Starred vs All)
  // In Starred Review Mode, the deck is naturally all starred words.
  // In Daily Mode, we filter by starred if they exist, unless forceShowAll is true.
  useEffect(() => {
    let newDeck: VocabularyWord[] = [];
    
    if (isStarredReviewMode) {
        newDeck = dailyWords; // dailyWords is already just the starred words
    } else {
        const starredInDaily = dailyWords.filter(w => starredSet.has(w.word));
        
        // LOGIC UPDATE: If forceShowAll is true OR there are no starred words, show full deck
        if (forceShowAll || starredInDaily.length === 0) {
            newDeck = dailyWords;
        } else {
            newDeck = starredInDaily;
        }
    }

    setFlashcardDeck(newDeck);
    
    setCardIndex(prev => {
        if (prev >= newDeck.length) return 0;
        return prev;
    });

  }, [dailyWords, starredSet, isStarredReviewMode, forceShowAll]);
  
  const matchingPairs = useMemo(() => {
    if (mode !== 'matching' || matchingGameWords.length === 0) {
      return { words: [], defs: [] };
    }
    const wordsList = matchingGameWords.map(w => ({ id: w.word, text: w.word }));
    const defsList = matchingGameWords.map(w => ({ id: w.word, text: w.shortDef }));
    
    return {
      words: [...wordsList].sort(() => Math.random() - 0.5),
      defs: [...defsList].sort(() => Math.random() - 0.5)
    };
  }, [matchingGameWords, mode]);

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
    setMatches(new Set());
    setSelectedMatch(null);
    setMatchingError(null);
    setRaceStarted(false);
    setRaceFinished(false);
    setSearchQuery(''); 
    
    if (mode !== 'test') {
        setTestQuestions([]);
        setTestSubmitted(false);
        setTestIndex(0);
        setTestScore(0);
        setTestAnswers({});
    }

    const fetchShortDefs = async () => {
      if (dailyWords.length > 0 && mode === 'matching') {
        setIsMatchingLoading(true);
        try {
          const shortDefs = await generateShortDefinitions(dailyWords);
          setMatchingGameWords(shortDefs);
        } catch (error) {
          const fallbackDefs = dailyWords.map(w => ({
            word: w.word,
            shortDef: w.definition.split(' ').slice(0, 5).join(' ') + '...'
          }));
          setMatchingGameWords(fallbackDefs);
        } finally {
          setIsMatchingLoading(false);
        }
      }
    };

    fetchShortDefs();
  }, [mode, dailyWords]);

  useEffect(() => {
    if (raceFinished) {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current);
        stopwatchRef.current = null;
      }
      if (raceTimerRef.current) {
        clearInterval(raceTimerRef.current);
        raceTimerRef.current = null;
      }
    }
  }, [raceFinished]);

  useEffect(() => {
    return () => {
      if (raceTimerRef.current) clearInterval(raceTimerRef.current);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleFlashcardNav = (direction: 'next' | 'prev') => {
    if (flashcardDeck.length === 0) return;
    if (direction === 'next') setCardIndex((cardIndex + 1) % flashcardDeck.length);
    else setCardIndex((cardIndex - 1 + flashcardDeck.length) % flashcardDeck.length);
    setIsFlipped(false); 
  };

  const handleShuffleDeck = () => {
    const shuffled = [...flashcardDeck].sort(() => Math.random() - 0.5);
    setFlashcardDeck(shuffled);
    setCardIndex(0);
    setIsFlipped(false);
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
      onAwardXP(67);
      onRecordAnswer(true, Category.VOCABULARY);
      setSelectedMatch(null);
    } else if (selectedMatch.id !== id && selectedMatch.type !== type) {
      setMatchingError(`${selectedMatch.id}-${id}`);
      onRecordAnswer(false, Category.VOCABULARY);

      const wrongWordObj = dailyWords.find(w => w.word === (selectedMatch.type === 'word' ? selectedMatch.id : id));
      if (wrongWordObj) {
        onLogMistake({
          id: `daily-match-err-${Date.now()}`,
          category: Category.VOCABULARY,
          questionText: `Match the definition for: "${wrongWordObj.word}"`,
          options: [wrongWordObj.definition, 'Incorrect Match'],
          correctAnswer: 0,
          explanation: `In the Daily Matching session, you misidentified "${wrongWordObj.word}". Definition: ${wrongWordObj.definition}`
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

  // Race Logic
  const generateRaceStep = (idx: number, set: VocabularyWord[]) => {
    if (set.length === 0) return;
    const safeIndex = idx % set.length;
    const current = set[safeIndex];
    setRaceQuestion(current.definition);
    const correct = current.word;
    const others = set.filter(w => w.word !== correct).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
    setRaceOptions([correct, ...others].sort(() => Math.random() - 0.5));
    setRaceTimeLeft(5);
  };

  const startRace = () => {
    const shuffled = [...dailyWords].sort(() => Math.random() - 0.5);
    setRaceWords(shuffled);
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

    generateRaceStep(0, shuffled);
  };

  const handleRaceAnswer = (answer: string) => {
    if (raceFeedback || raceFinished) return;
    
    const safeIndex = raceIndex % raceWords.length;
    const correctWord = raceWords[safeIndex];
    const isCorrect = answer === correctWord.word;
    const timeTakenSeconds = 5 - raceTimeLeft;

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
        onAwardXP(20);
        
        setStats(prev => {
            const currentMastery = Number(prev.wordMastery?.[answer]) || 0;
            return {
                ...prev,
                wordMastery: {
                    ...(prev.wordMastery || {}),
                    [answer]: Math.min(100, Math.max(0, currentMastery + 5))
                }
            };
        });

        if (nextProgress >= 100) {
            const finalTime = Date.now() - raceStartTimeRef.current;
            if (stopwatchRef.current) {
                clearInterval(stopwatchRef.current);
                stopwatchRef.current = null;
            }
            
            const currentBest = stats.dailyRaceRecords?.[viewingDay];
            
            // Only update best time if NOT in starred review mode (to keep daily records clean)
            if (!isStarredReviewMode) {
                setStats(prev => ({
                    ...prev,
                    dailyRaceRecords: {
                        ...(prev.dailyRaceRecords || {}),
                        [viewingDay]: currentBest ? Math.min(currentBest, finalTime) : finalTime
                    }
                }));
            }

            setTimeout(() => setRaceFinished(true), 1000);
        } else {
            setTimeout(() => {
                setRaceFeedback(null);
                setRaceBoost('none');
                setRaceIndex(i => i + 1);
                generateRaceStep(raceIndex + 1, raceWords);
            }, 1000);
        }
    } else {
        setRaceFeedback(answer === "" ? 'timeout' : answer);
        setRaceBoost('none');
        
        onLogMistake({
            id: `daily-race-err-${Date.now()}`,
            category: Category.VOCABULARY,
            questionText: `Which word matches: "${correctWord.definition}"?`,
            options: raceOptions,
            correctAnswer: raceOptions.indexOf(correctWord.word),
            explanation: `Missed in Daily Raceway. Word: ${correctWord.word}. Definition: ${correctWord.definition}`
        });

        setTimeout(() => {
            setRaceFeedback(null);
            setRaceIndex(i => i + 1);
            generateRaceStep(raceIndex + 1, raceWords);
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
  }, [raceStarted, raceFinished, raceFeedback, raceIndex, raceWords]);

  // Cumulative Test Logic
  const startCumulativeTest = () => {
    // In Starred Mode, test only starred words
    const pool = isStarredReviewMode ? dailyWords : words.slice(0, Math.min(words.length, maxDay * 25));
    
    // Pick 20 random words from pool
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 20);
    
    if (selected.length < 4) {
        // Not enough words for a test
        alert("Need at least 4 words unlocked or starred to generate a test.");
        return;
    }

    const questions: Question[] = selected.map((word, idx) => {
        const isDef = Math.random() > 0.5;
        const distractors = [...pool].filter(w => w.word !== word.word).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = isDef 
            ? [word.definition, ...distractors.map(d => d.definition)].sort(() => Math.random() - 0.5)
            : [word.word, ...distractors.map(d => d.word)].sort(() => Math.random() - 0.5);
            
        return {
            id: `cumul-${Date.now()}-${idx}`,
            category: Category.VOCABULARY,
            questionText: isDef ? `What is the definition of "${word.word}"?` : `Which word means: "${word.definition}"?`,
            options,
            correctAnswer: options.indexOf(isDef ? word.definition : word.word),
            explanation: `"${word.word}" (${word.partOfSpeech}): ${word.definition}`
        };
    });

    setTestQuestions(questions);
    setTestIndex(0);
    setTestAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
  };

  const handleTestAnswer = (qId: string, optIdx: number) => {
      setTestAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitTest = () => {
      let score = 0;
      testQuestions.forEach(q => {
          if (testAnswers[q.id] === q.correctAnswer) {
              score++;
              onRecordAnswer(true, Category.VOCABULARY);
          } else {
              onRecordAnswer(false, Category.VOCABULARY);
              onLogMistake(q);
          }
      });
      setTestScore(score);
      setTestSubmitted(true);
      onAwardXP(score * 15);
  };

  const handleMarkAsDone = () => {
    if (stats.dailyVocabCompleted) return;
    onAwardXP(450);
    setStats(prev => ({
      ...prev,
      dailyVocabCompleted: true,
      lastDailyVocabDate: new Date().toISOString().split('T')[0]
    }));
  };

  const handleAdvanceDay = () => {
    setStats(prev => ({
      ...prev,
      dailyVocabDay: (prev.dailyVocabDay || 1) + 1,
      dailyVocabCompleted: false,
      dailyVocabSeed: Math.floor(Math.random() * 1000000)
    }));
    setShowAdvanceConfirm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevDay = () => {
    if (viewingDay > 1) {
      setViewingDay(prev => prev - 1);
      setCardIndex(0);
      setRaceStarted(false);
    }
  };

  const handleNextDay = () => {
    if (viewingDay < maxDay) {
      setViewingDay(prev => prev + 1);
      setCardIndex(0);
      setRaceStarted(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight text-center uppercase">Setting Up Wordlist</h3>
      </div>
    );
  }

  const isCurrentMaxDay = viewingDay === maxDay;
  const currentDailyBest = stats.dailyRaceRecords?.[viewingDay];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                {isStarredReviewMode ? `Starred Review (${dailyWords.length})` : `Daily Focus (${(dailyWords.length-5)*viewingDay}/${words.length})`}
            </h2>
            
            {/* NEW STAR REVIEW BUTTON */}
            <button 
                onClick={() => {
                    setIsStarredReviewMode(!isStarredReviewMode);
                    setCardIndex(0);
                    setMode('list');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isStarredReviewMode ? 'bg-yellow-400 text-yellow-900 border-yellow-500 ring-2 ring-yellow-200' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-yellow-100 hover:text-yellow-600'}`}
                title={isStarredReviewMode ? "Return to Daily Focus" : "Review All Starred Words"}
            >
                <svg className="w-4 h-4" fill={isStarredReviewMode ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                {isStarredReviewMode ? 'Exit Review' : 'Starred Only'}
            </button>

            {!isStarredReviewMode && isCurrentMaxDay && stats.dailyVocabCompleted && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">Cycle Logged</span>
            )}
            {!isStarredReviewMode && !isCurrentMaxDay && (
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">Review Mode</span>
            )}
          </div>
          <p className="text-slate-500 font-medium italic">
            {isStarredReviewMode 
                ? "Reviewing all vocabulary terms you have marked with a star." 
                : `Mastering 25 main and 5 review terms for Stage ${viewingDay}. (Review prioritizes ★ starred words)`}
          </p>
        </div>
        
        {/* Navigation Controls - Hidden in Starred Mode */}
        {!isStarredReviewMode && (
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {viewingDay > 1 && (
                <button 
                  onClick={handlePrevDay}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                  title="Previous Stage"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
              )}

              {isCurrentMaxDay ? (
                <div className="flex gap-4">
                  <button 
                    onClick={handleMarkAsDone}
                    disabled={stats.dailyVocabCompleted}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg min-w-[160px] flex items-center justify-center h-12 ${stats.dailyVocabCompleted ? 'bg-emerald-500 text-white cursor-default' : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95'}`}
                  >
                    {stats.dailyVocabCompleted ? 'Mastery Authenticated' : 'Confirm Mastery'}
                  </button>
                  
                  {stats.dailyVocabCompleted && (
                    <button 
                      onClick={() => setShowAdvanceConfirm(true)}
                      className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 ring-4 ring-indigo-600/10 h-12 flex items-center justify-center"
                    >
                      Advance
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleNextDay}
                  className="flex-1 md:flex-none w-full md:w-auto px-8 py-3 bg-white border border-slate-200 text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-sm hover:bg-indigo-50 hover:border-indigo-200 active:scale-95 h-12 flex items-center justify-center gap-2"
                >
                  <span>Next Stage</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
              )}
            </div>
            
            <div className="text-right flex-shrink-0 bg-white px-6 py-3.5 rounded-2xl shadow-sm border border-slate-100 min-w-[100px] w-full md:w-auto h-16 flex items-center justify-center">
                <div className="text-2xl font-black text-slate-800 text-center uppercase tracking-tighter">Day {viewingDay}</div>
            </div>
        </div>
        )}
      </header>
      
      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-[1.5rem] w-fit mb-12 shadow-inner border border-slate-300">
        <button onClick={() => setMode('list')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'list' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Word List</button>
        <button onClick={() => setMode('flashcards')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'flashcards' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Flashcards</button>
        <button onClick={() => setMode('matching')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'matching' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Match Grid</button>
        <button onClick={() => setMode('racecar')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'racecar' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Speed Circuit</button>
        <button onClick={() => { setMode('test'); startCumulativeTest(); }} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'test' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Cumulative Exam</button>
      </div>

      {mode === 'list' && (
        <div className="space-y-6">
          {/* SEARCH BAR & COUNT */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-100 p-2 rounded-2xl border border-slate-200">
             <div className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Showing {filteredDailyWords.length} of {dailyWords.length} Active Terms
             </div>
             <div className="relative w-full md:w-72">
               <input 
                 type="text" 
                 placeholder="Search current set..." 
                 className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)} 
               />
               <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDailyWords.map((word, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedWord(word)}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-md animate-in fade-in slide-in-from-bottom-2 group hover:border-indigo-300 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1 relative"
              >
                 <button 
                    onClick={(e) => toggleStar(e, word.word)}
                    className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                    title={starredSet.has(word.word) ? "Unstar Word" : "Star Word"}
                 >
                    <svg className={`w-6 h-6 transition-colors ${starredSet.has(word.word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 hover:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                 </button>

                <h3 className="text-2xl font-black text-indigo-800 tracking-tight mb-3 flex justify-between items-center uppercase pr-12">
                  {word.word}
                  <span className="text-[10px] font-black bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-lg">{word.partOfSpeech}</span>
                </h3>
                <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">{word.definition}</p>
                <div className="bg-slate-50 p-4 rounded-xl italic border border-slate-100 text-slate-500 text-xs">"{word.exampleSentence}"</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {mode === 'flashcards' && (
        <div className="flex flex-col items-center py-12">
           {/* UPDATED UI: Toggle Button or Status Badge */}
           {!isStarredReviewMode && dailyWords.some(w => starredSet.has(w.word)) ? (
               <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
                   <button 
                     onClick={() => setForceShowAll(false)}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!forceShowAll ? 'bg-white text-yellow-600 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <span className="mr-1">★</span> Starred Only ({dailyWords.filter(w => starredSet.has(w.word)).length})
                   </button>
                   <button 
                     onClick={() => setForceShowAll(true)}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${forceShowAll ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     All Words ({dailyWords.length})
                   </button>
               </div>
           ) : (
               <div className="mb-6 bg-slate-100 px-4 py-1.5 rounded-full text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  {isStarredReviewMode ? (
                      <>
                         <span className="text-yellow-500">★</span> 
                         <span>Reviewing Starred ({flashcardDeck.length})</span>
                      </>
                  ) : (
                      <span>Reviewing All ({flashcardDeck.length})</span>
                  )}
               </div>
           )}

           <div className="w-full max-w-2xl h-[28rem] relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                 <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center group">
                   <button 
                      onClick={(e) => flashcardDeck[cardIndex] && toggleStar(e, flashcardDeck[cardIndex].word)}
                      className="absolute top-10 right-10 p-3 rounded-full hover:bg-slate-50 transition-colors z-20"
                   >
                      <svg className={`w-8 h-8 transition-colors ${flashcardDeck[cardIndex] && starredSet.has(flashcardDeck[cardIndex].word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 group-hover:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                   </button>

                   <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">{flashcardDeck[cardIndex]?.word}</h2>
                   <div className="mt-16 text-slate-300 text-[10px] font-black uppercase animate-pulse tracking-[0.3em]">Flip for Definition</div>
                 </div>

                 <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                    <button 
                      onClick={(e) => flashcardDeck[cardIndex] && toggleStar(e, flashcardDeck[cardIndex].word)}
                      className="absolute top-10 right-10 p-3 rounded-full hover:bg-white/10 transition-colors z-20"
                   >
                      <svg className={`w-8 h-8 transition-colors ${flashcardDeck[cardIndex] && starredSet.has(flashcardDeck[cardIndex].word) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 hover:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                   </button>

                   <p className="text-2xl font-bold leading-relaxed px-4">{flashcardDeck[cardIndex]?.definition}</p>
                   <div className="mt-8 pt-8 border-t border-white/10 w-full text-xs italic text-indigo-200">"{flashcardDeck[cardIndex]?.exampleSentence}"</div>
                 </div>
              </div>
           </div>
           <div className="flex items-center space-x-10 mt-16">
              <button onClick={() => handleFlashcardNav('prev')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
              <button onClick={handleShuffleDeck} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all group" title="Shuffle Deck"><svg className="w-8 h-8 text-indigo-600 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg></button>
             <button onClick={() => handleFlashcardNav('next')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
           </div>
        </div>
      )}

      {mode === 'matching' && (
        <div className="max-w-5xl mx-auto py-4">
          {isMatchingLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Calibrating Grid...</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 {matchingPairs.words.map((item) => (
                   <button key={`word-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'word')} className={`w-full p-5 h-24 text-center rounded-2xl border-2 font-black text-sm transition-all duration-200 ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20 cursor-not-allowed' : (selectedMatch?.id === item.id && selectedMatch.type === 'word' ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                 ))}
              </div>
              <div className="space-y-3">
                 {matchingPairs.defs.map((item) => (
                   <button key={`def-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'def')} className={`w-full p-5 h-24 rounded-2xl border-2 font-medium text-xs text-center transition-all duration-200 flex items-center justify-center ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20 cursor-not-allowed' : (selectedMatch?.id === item.id && selectedMatch.type === 'def' ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                 ))}
                 </div>
            </div>
          )}
        </div>
      )}

      {mode === 'racecar' && (
        <div className="py-4">
           {!raceStarted ? (
             <div className="max-w-2xl mx-auto bg-slate-900 p-16 rounded-[4rem] text-center border-b-[12px] border-indigo-600 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10">
                  <div className="text-9xl mb-10 text-emerald-400 group-hover:scale-110 transition-transform duration-500">🏎️</div>
                  <h3 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Daily Circuit</h3>
                  <p className="text-slate-400 mb-8 text-lg font-medium">Test your daily word mastery against the clock.</p>
                  
                  {currentDailyBest && (
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-6 py-2 rounded-full border border-emerald-500/30 mb-10">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                      <span className="text-emerald-300 font-black uppercase text-xs tracking-widest">Day {viewingDay} Best: {formatTime(currentDailyBest)}</span>
                    </div>
                  )}

                  <button onClick={startRace} className="w-full py-8 bg-white text-indigo-900 rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all hover:bg-emerald-400 hover:text-emerald-950">Start Engine</button>
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
                       <button key={i} disabled={!!raceFeedback} onClick={() => handleRaceAnswer(opt)} className={`py-6 rounded-3xl font-black uppercase text-sm border-2 transition-all transform active:scale-95 ${raceFeedback === 'correct' && opt === raceWords[raceIndex % raceWords.length].word ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-105' : opt === raceFeedback ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-slate-700 hover:text-white'}`}>{opt}</button>
                     ))}
                  </div>
                </div>
             </div>
           ) : (
             <div className="max-w-2xl mx-auto text-center py-24 bg-slate-900 rounded-[5rem] shadow-2xl text-white border-b-[12px] border-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/20"></div>
                <div className="relative z-10">
                  <div className="text-9xl mb-8 animate-bounce">🏁</div>
                  <h4 className="text-5xl font-black mb-4 tracking-tighter uppercase text-white">Race Complete</h4>
                  <div className="text-8xl font-mono font-black text-emerald-400 mb-12 tracking-tighter drop-shadow-2xl">{formatTime(elapsedRaceTime)}</div>
                  
                  {currentDailyBest === elapsedRaceTime && (
                    <div className="inline-block px-8 py-3 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-300 font-black uppercase tracking-widest mb-10 animate-pulse">New Record for Day {viewingDay}!</div>
                  )}

                  <button onClick={() => setRaceStarted(false)} className="px-20 py-8 bg-white text-emerald-900 rounded-[3rem] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all">Return to Hub</button>
                
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'test' && (
        <div className="py-4">
          {!testSubmitted ? (
            testQuestions.length === 0 ? (
              <div className="max-w-2xl mx-auto bg-white p-16 rounded-[4rem] text-center border-4 border-slate-100 shadow-xl">
                 <div className="text-8xl mb-8">📝</div>
                 <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Cumulative Exam</h3>
                 <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                   This exam pulls from all {Math.min(words.length, maxDay * 25)} words you have unlocked so far across all stages. 
                   It will generate 20 random questions to test your retention.
                 </p>
                 <button onClick={startCumulativeTest} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Begin Assessment</button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-8">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cumulative Assessment</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{Object.keys(testAnswers).length} / {testQuestions.length} Answered</span>
                 </div>

                 {testQuestions.map((q, idx) => (
                   <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <div className="flex items-start gap-4 mb-6">
                         <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</div>
                         <h4 className="text-lg font-bold text-slate-900 pt-1">{q.questionText}</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-3 pl-12">
                         {q.options.map((opt, i) => (
                           <button 
                             key={i}
                             onClick={() => handleTestAnswer(q.id, i)}
                             className={`w-full text-left p-4 rounded-xl border-2 font-bold text-sm transition-all flex items-center gap-3 ${testAnswers[q.id] === i ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                           >
                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] ${testAnswers[q.id] === i ? 'border-indigo-600 text-indigo-600' : 'border-slate-300 text-slate-300'}`}>
                               {String.fromCharCode(65 + i)}
                             </div>
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                 ))}

                 <div className="text-center pt-8">
                    <button 
                      onClick={submitTest}
                      disabled={Object.keys(testAnswers).length < testQuestions.length}
                      className={`px-16 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all ${Object.keys(testAnswers).length < testQuestions.length ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 active:scale-95'}`}
                    >
                      Submit Exam
                    </button>
                 </div>
              </div>
            )
          ) : (
            <div className="max-w-2xl mx-auto bg-white p-16 rounded-[4rem] text-center border-4 border-slate-100 shadow-xl animate-in zoom-in">
               <div className="text-8xl mb-6">📊</div>
               <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Exam Complete</h3>
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-10">Cumulative Analysis</p>
               
               <div className="text-6xl font-black text-indigo-600 mb-4">{testScore} / {testQuestions.length}</div>
               <p className={`text-lg font-bold mb-10 ${testScore >= 16 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {testScore >= 16 ? 'Excellent Retention!' : 'Review Recommended.'}
               </p>

               <div className="flex justify-center gap-4">
                 <button onClick={() => setTestSubmitted(false)} className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Review Answers</button>
                 <button onClick={() => { setMode('list'); setTestQuestions([]); }} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg">Return to Hub</button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Word Expand Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-950/60 backdrop-blur-md animate-in fade-in duration-300">
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

      {/* Advance Day Confirmation Modal */}
      {showAdvanceConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-[3rem] p-10 shadow-2xl border-4 border-indigo-500 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
                🚀
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Advance Stage</h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8">
                Confirming advancement will lock in current mastery and load the next sequential batch of vocabulary. Are you ready for Stage {maxDay + 1}?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAdvanceConfirm(false)}
                  className="px-10 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdvanceDay}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
                >
                  Initiate Stage {maxDay + 1}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes speed-lines {
          0% { background-position: 0 0; }
          100% { background-position: -200% 0; }
        }
        .animate-speed-lines { animation: speed-lines 0.5s linear infinite; }
      `}</style>
    </div>
  );
};

export default DailyVocab;
