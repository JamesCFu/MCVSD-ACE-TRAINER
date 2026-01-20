import React, { useState, useEffect, useMemo } from 'react';
import { UserStats, VocabularyWord, Question, Category } from '../types';

interface DailyVocabProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  words: VocabularyWord[];
  isLoading: boolean;
  onAwardXP: (amount: number) => void;
  onRecordAnswer: (isCorrect: boolean) => void;
  onLogMistake: (question: Question, userAnswer: string) => void;
}

type Mode = 'intro' | 'learn' | 'test' | 'complete';

const DailyVocab: React.FC<DailyVocabProps> = ({
  stats,
  setStats,
  words,
  isLoading,
  onAwardXP,
  onRecordAnswer,
  onLogMistake
}) => {
  const [mode, setMode] = useState<Mode>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // 1. Select Daily Words based on date/seed
  const dailyWords = useMemo(() => {
    if (!words.length) return [];
    // Simple seeded shuffle based on date to ensure same words for the whole day
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    // Create a copy and shuffle
    const shuffled = [...words].sort((a, b) => {
      const valA = a.word.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const valB = b.word.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return (valA + seed) % 100 - (valB + seed) % 100;
    });

    return shuffled.slice(0, 5);
  }, [words]);

  // 2. Helper to Toggle Star
  const toggleStar = (e: React.MouseEvent, wordToStar: string) => {
    e.stopPropagation(); // Prevent card flip or other clicks
    setStats(prev => {
      const currentStarred = prev.starredWords || [];
      const isStarred = currentStarred.includes(wordToStar);
      
      let newStarred;
      if (isStarred) {
        newStarred = currentStarred.filter(w => w !== wordToStar);
      } else {
        newStarred = [...currentStarred, wordToStar];
      }
      
      return { ...prev, starredWords: newStarred };
    });
  };

  const isWordStarred = (word: string) => (stats.starredWords || []).includes(word);

  // 3. Generate Options for Test Mode
  const currentOptions = useMemo(() => {
    if (mode !== 'test' || !dailyWords[currentIndex]) return [];
    
    const correctWord = dailyWords[currentIndex];
    const otherWords = words.filter(w => w.word !== correctWord.word);
    
    // Get 3 random distractors
    const distractors = [...otherWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.definition);
      
    const options = [correctWord.definition, ...distractors];
    return options.sort(() => 0.5 - Math.random());
  }, [mode, currentIndex, dailyWords, words]);

  const handleNext = () => {
    if (currentIndex < dailyWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      if (mode === 'learn') {
        setMode('test');
        setCurrentIndex(0);
      } else if (mode === 'test') {
        setMode('complete');
        onAwardXP(score * 10 + 50); // Bonus for completion
      }
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
    
    const correctWord = dailyWords[currentIndex];
    const isCorrect = currentOptions[optionIndex] === correctWord.definition;
    
    onRecordAnswer(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      // Create a Question object for logging the mistake
      const questionObj: Question = {
        id: `daily-${correctWord.word}`,
        category: Category.VOCABULARY,
        questionText: `What is the definition of "${correctWord.word}"?`,
        options: currentOptions,
        correctAnswer: currentOptions.indexOf(correctWord.definition),
        explanation: `The correct definition of ${correctWord.word} is "${correctWord.definition}"`
      };
      onLogMistake(questionObj, currentOptions[optionIndex]);
    }
  };

  // --- RENDERING ---

  if (isLoading || !dailyWords.length) {
    return <div className="p-8 text-center">Loading daily words...</div>;
  }

  // 1. INTRO VIEW
  if (mode === 'intro') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Daily Vocabulary</h2>
          <p className="text-slate-600 mb-8">
            Master 5 new words today. First, you'll review flashcards, then take a quick quiz to test your retention.
          </p>
          <button 
            onClick={() => setMode('learn')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm"
          >
            Start Learning
          </button>
        </div>
      </div>
    );
  }

  // 2. COMPLETE VIEW
  if (mode === 'complete') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Daily Goal Met!</h2>
          <p className="text-slate-600 mb-6">
            You scored {score} out of {dailyWords.length}.
          </p>
          <div className="grid gap-3 mb-8 text-left">
            {dailyWords.map((word, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">{word.word}</span>
                {/* Star Button in Summary */}
                <button 
                  onClick={(e) => toggleStar(e, word.word)}
                  className={`p-2 rounded-full transition-colors ${
                    isWordStarred(word.word) ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-400'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setMode('intro')} // Or redirect to dashboard
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 3. LEARN & TEST VIEWS (Shared Layout)
  const currentWord = dailyWords[currentIndex];
  const progress = ((currentIndex + (mode === 'test' ? dailyWords.length : 0)) / (dailyWords.length * 2)) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 capitalize">
          {mode === 'learn' ? 'Learn Words' : 'Quick Quiz'}
        </h2>
        <div className="text-sm font-medium text-slate-500">
          Word {currentIndex + 1} of {dailyWords.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content Card */}
      <div className="relative perspective-1000 min-h-[400px]">
        {mode === 'learn' ? (
          // --- LEARN MODE (Flashcard) ---
          <div 
            className="relative w-full h-96 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front of Card */}
              <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center p-8">
                <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-4">Word</span>
                <h3 className="text-4xl font-bold text-slate-900 mb-4">{currentWord.word}</h3>
                <span className="text-slate-400 italic">{currentWord.partOfSpeech}</span>
                <p className="text-slate-400 text-sm mt-8 animate-pulse">Click to flip</p>
                
                {/* Star Button (Front) */}
                <button
                  onClick={(e) => toggleStar(e, currentWord.word)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
                    isWordStarred(currentWord.word) ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>

              {/* Back of Card */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-white">
                <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Definition</span>
                <p className="text-xl text-center leading-relaxed font-medium mb-6">
                  {currentWord.definition}
                </p>
                <div className="bg-slate-800 p-4 rounded-lg w-full">
                  <p className="text-sm text-slate-300 italic text-center">"{currentWord.exampleSentence}"</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // --- TEST MODE (Quiz) ---
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 h-full flex flex-col relative">
            
            {/* Star Button (Test Mode) - ADDED HERE */}
            <button
              onClick={(e) => toggleStar(e, currentWord.word)}
              title={isWordStarred(currentWord.word) ? "Unstar word" : "Star word for later"}
              className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200 ${
                isWordStarred(currentWord.word) 
                  ? 'bg-amber-100 text-amber-500 hover:bg-amber-200 scale-110' 
                  : 'bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>

            <span className="text-sm font-bold text-blue-600 mb-2">Question {currentIndex + 1}</span>
            <h3 className="text-xl font-medium text-slate-900 mb-6">
              What is the definition of <span className="font-bold underline decoration-blue-300 decoration-2">{currentWord.word}</span>?
            </h3>

            <div className="space-y-3 flex-1">
              {currentOptions.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = option === currentWord.definition;
                
                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative ";
                
                if (showFeedback) {
                  if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-700";
                  else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-700";
                  else btnClass += "border-slate-100 opacity-50";
                } else {
                  btnClass += "border-slate-100 hover:border-blue-200 hover:bg-slate-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showFeedback}
                    className={btnClass}
                  >
                    <div className="pr-8">{option}</div>
                    {showFeedback && (isCorrect || (isSelected && !isCorrect)) && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isCorrect ? (
                          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex justify-end">
        {(mode === 'learn' || (mode === 'test' && showFeedback)) && (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl translate-y-0 hover:-translate-y-1"
          >
            <span>{currentIndex === dailyWords.length - 1 ? (mode === 'learn' ? 'Start Quiz' : 'Finish') : 'Next'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* CSS Utility for 3D Flip */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default DailyVocab;
