import React, { useMemo, useState, useEffect } from 'react';
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
  const [mode, setMode] = useState<'list' | 'flashcards' | 'matching'>('list');
  const [showAdvanceConfirm, setShowAdvanceConfirm] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Match Game State
  const [selectedMatch, setSelectedMatch] = useState<{ id: string, type: 'word' | 'def' } | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [matchingGameWords, setMatchingGameWords] = useState<{ word: string, shortDef: string }[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const currentDay = stats.dailyVocabDay || 1;
  const currentSeed = stats.dailyVocabSeed || 0;

  const dailyWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    
    const WORDS_PER_DAY = 20;
    const REVIEW_WORDS_COUNT = 5;
    
    // 1. Sequential 20 words for the day
    const startIndex = ((currentDay - 1) * WORDS_PER_DAY) % words.length;
    const mainBatch: VocabularyWord[] = [];
    
    for (let i = 0; i < Math.min(WORDS_PER_DAY, words.length); i++) {
        const idx = (startIndex + i) % words.length;
        if (words[idx]) mainBatch.push(words[idx]);
    }

    // 2. 5 Random words from the rest of the pool (not just the next 5)
    const restOfPool = words.filter(w => !mainBatch.some(mb => mb.word === w.word));
    
    // Sort the rest of the pool by the persistent daily seed to get 5 "random" words
    // that stay the same for this specific day/seed combination
    const reviewBatch = [...restOfPool]
      .sort((a, b) => {
        const hashA = hashString(a.word + currentSeed);
        const hashB = hashString(b.word + currentSeed);
        return hashA - hashB;
      })
      .slice(0, REVIEW_WORDS_COUNT);
    
    return [...mainBatch, ...reviewBatch].sort((a, b) => a.word.localeCompare(b.word));
  }, [words, currentDay, currentSeed]);

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

  const handleFlashcardNav = (direction: 'next' | 'prev') => {
    if (dailyWords.length === 0) return;
    if (direction === 'next') setCardIndex((cardIndex + 1) % dailyWords.length);
    else setCardIndex((cardIndex - 1 + dailyWords.length) % dailyWords.length);
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
      onAwardXP(15);
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

  const handleMarkAsDone = () => {
    if (stats.dailyVocabCompleted) return;
    onAwardXP(500);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight text-center uppercase">Calibrating Lexicon</h3>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Daily Focus ({dailyWords.length}/{words.length})</h2>
            {stats.dailyVocabCompleted && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">Cycle Logged</span>
            )}
          </div>
          <p className="text-slate-500 font-medium italic">Mastering 20 sequential and 5 random review terms for Stage {currentDay}.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={handleMarkAsDone}
                disabled={stats.dailyVocabCompleted}
                className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg ${stats.dailyVocabCompleted ? 'bg-emerald-500 text-white cursor-default' : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95'}`}
              >
                {stats.dailyVocabCompleted ? 'Mastery Authenticated' : 'Confirm Mastery'}
              </button>
              
              {stats.dailyVocabCompleted && (
                <button 
                  onClick={() => setShowAdvanceConfirm(true)}
                  className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 ring-4 ring-indigo-600/10"
                >
                  Advance to Next Stage
                </button>
              )}
            </div>
            
            <div className="text-right flex-shrink-0 bg-white px-6 py-3.5 rounded-2xl shadow-sm border border-slate-100 min-w-[100px] w-full md:w-auto">
                <div className="text-2xl font-black text-slate-800 text-center md:text-right uppercase tracking-tighter">Day {currentDay}</div>
            </div>
        </div>
      </header>
      
      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-[1.5rem] w-fit mb-12 shadow-inner border border-slate-300">
        <button onClick={() => setMode('list')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'list' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Word List</button>
        <button onClick={() => setMode('flashcards')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'flashcards' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Flashcards</button>
        <button onClick={() => setMode('matching')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${mode === 'matching' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Match Grid</button>
      </div>

      {mode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dailyWords.map((word, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedWord(word)}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-md animate-in fade-in slide-in-from-bottom-2 group hover:border-indigo-300 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-black text-indigo-800 tracking-tight mb-3 flex justify-between items-center uppercase">
                {word.word}
                <span className="text-[10px] font-black bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-lg">{word.partOfSpeech}</span>
              </h3>
              <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">{word.definition}</p>
              <div className="bg-slate-50 p-4 rounded-xl italic border border-slate-100 text-slate-500 text-xs">"{word.exampleSentence}"</div>
            </div>
          ))}
        </div>
      )}

      {mode === 'flashcards' && (
        <div className="flex flex-col items-center py-12">
           <div className="w-full max-w-2xl h-[28rem] relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                 <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center">
                   <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">{dailyWords[cardIndex]?.word}</h2>
                   <div className="mt-16 text-slate-300 text-[10px] font-black uppercase animate-pulse tracking-[0.3em]">Engage Reactor</div>
                 </div>
                 <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                   <p className="text-2xl font-bold leading-relaxed px-4">{dailyWords[cardIndex]?.definition}</p>
                   <div className="mt-8 pt-8 border-t border-white/10 w-full text-xs italic text-indigo-200">"{dailyWords[cardIndex]?.exampleSentence}"</div>
                 </div>
              </div>
           </div>
           <div className="flex items-center space-x-10 mt-16">
              <button onClick={() => handleFlashcardNav('prev')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-[3rem] p-10 shadow-2xl border-4 border-indigo-500 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
                🚀
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Advance Stage</h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8">
                Confirming advancement will lock in current mastery and load the next sequential batch of vocabulary. Are you ready for Stage {currentDay + 1}?
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
                  Initiate Stage {currentDay + 1}
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
      `}</style>
    </div>
  );
};

export default DailyVocab;