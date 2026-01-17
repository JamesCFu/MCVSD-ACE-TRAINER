import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import { Category, Question, PracticeSession } from '../types';
import { 
  generateQuestions, 
  generateReadingTest,
  generateMockPart1_ELA,
  generateMockPart2_Math
} from '../geminiService';

interface PracticeProps {
  category: Category;
  session: PracticeSession | null;
  onStartSession: (category: Category, questions: Question[], passage?: string | null) => void;
  onUpdateSession: (category: Category, userAnswers: Record<string, number>, highlights?: Highlight[]) => void;
  onCompleteSession: (category: Category, score: number) => void;
  onClearSession: (category: Category) => void;
  onFinish: () => void;
  onRecordOnly: (category: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => void;
  onLogMistake: (question: Question) => void;
  onExit: () => void;
  onSaveTime: (category: Category, time: number) => void;
}

interface Highlight {
  id: string;
  start: number;
  end: number;
  text: string;
}

const Practice: React.FC<PracticeProps> = ({ 
  category, 
  session, 
  onStartSession, 
  onUpdateSession, 
  onCompleteSession,
  onClearSession,
  onFinish, 
  onRecordOnly, 
  onLogMistake, 
  onExit,
  onSaveTime
}) => {
  // State
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Reading Specific State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // For split view
  const [expandedPassageId, setExpandedPassageId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Scroll Position Reference
  const listScrollPos = useRef<number>(0);

  // Constants
  const isReadingLab = category === Category.READING;
  const isMock = category === Category.MOCK;

  // --- Scroll Restoration Logic ---
  useLayoutEffect(() => {
    // If we just closed the expanded view (expandedPassageId is null) AND we are in Mock mode
    if (category === Category.MOCK && !expandedPassageId) {
       window.scrollTo({ top: listScrollPos.current, behavior: 'auto' });
    }
  }, [expandedPassageId, category]);

  // --- Initialization ---
  const handleStart = useCallback(async () => {
    setLoading(true);
    setShowResults(false);
    setUserAnswers({});
    setHighlights([]);
    setCurrentQuestionIndex(0);
    setExpandedPassageId(null);
    onClearSession(category);

    try {
      // Logic for quantity based on category
      let count = 10;
      if (category === Category.SPELLING) count = 15;
      if (category === Category.VOCABULARY) count = 20;
      if (category === Category.MATH) count = 15;
      if (category === Category.GRAMMAR) count = 15;

      const newQuestions = await generateQuestions(category, count);
      setQuestions(newQuestions);
      
      // Timer setup
      let time = 0;
      if (category === Category.MOCK) time = 90 * 60; // 90 mins for mock
      else if (category === Category.READING) time = 15 * 60;
      else time = 10 * 60; // 10 mins default
      
      setTimeLeft(time);
      setIsTimerActive(true);

      // Save initial session
      const passageText = newQuestions[0]?.passage || null;
      onStartSession(category, newQuestions, passageText);

    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  }, [category, onStartSession, onClearSession]);

  // Restore session if exists
  useEffect(() => {
    if (session && session.questions.length > 0 && !showResults) {
       setQuestions(session.questions);
       setUserAnswers(session.userAnswers || {});
       setHighlights(session.highlights || []);
       setTimeLeft(session.timeLeft || 600);
       setIsTimerActive(true);
    } else if (!session && !loading && questions.length === 0) {
       // Auto-start if no session
       handleStart();
    }
  }, []); // Run once on mount

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newItem = prev - 1;
          // Auto-save time every 5 seconds or so? Ideally done less frequently
          if (newItem % 5 === 0) onSaveTime(category, newItem);
          return newItem;
        });
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, showResults]);

  const handleAnswerSelect = (qId: string, optionIndex: number) => {
    const newAnswers = { ...userAnswers, [qId]: string: optionIndex };
    setUserAnswers(newAnswers);
    onUpdateSession(category, newAnswers, highlights);
  };

  const handleSubmit = () => {
    setIsTimerActive(false);
    setShowResults(true);
    
    // Calculate Score
    let correctCount = 0;
    const mistakes: Question[] = [];
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      } else {
        mistakes.push(q);
        onLogMistake(q);
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    
    // For MOCK, we just record data, we don't clear it immediately usually, 
    // but here we follow standard flow
    if (category === Category.MOCK) {
       onRecordOnly(category, score, questions.length, mistakes, questions);
    } else {
       onCompleteSession(category, score);
    }
  };

  // --- Handlers for Text Highlighting ---
  const handleHighlight = () => {
     const selection = window.getSelection();
     if (!selection || selection.rangeCount === 0) return;
     
     const range = selection.getRangeAt(0);
     const text = selection.toString().trim();
     if (!text) return;

     const newHighlight: Highlight = {
        id: Date.now().toString(),
        start: 0, // Simplified for demo; real implementation needs offset mapping
        end: 0,
        text: text
     };
     
     const updatedHighlights = [...highlights, newHighlight];
     setHighlights(updatedHighlights);
     onUpdateSession(category, userAnswers, updatedHighlights);
     selection.removeAllRanges();
  };

  const handleExpandPassage = (passageId: string) => {
    if (category === Category.MOCK) {
       // Save the current scroll position before expanding
       listScrollPos.current = window.scrollY;
    }
    setExpandedPassageId(passageId);
  };

  // --- Render Helpers ---

  // 1. Reading Lab View (Split Screen)
  const renderReadingLab = () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return null;

    return (
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Left: Passage */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto max-h-[70vh] text-lg leading-relaxed text-slate-700 font-serif" onMouseUp={handleHighlight}>
           <div className="mb-4 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Reading Passage</span>
              <span className="text-xs text-slate-400">Select text to highlight</span>
           </div>
           {currentQ.passage ? (
             <div dangerouslySetInnerHTML={{ __html: currentQ.passage.replace(/\n/g, '<br/>') }} />
           ) : (
             <p className="italic text-slate-400">Passage text missing...</p>
           )}
        </div>

        {/* Right: Question */}
        <div className="md:w-1/2 flex flex-col">
           <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex-1">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-slate-400 text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                 {isTimerActive && <span className="text-indigo-600 font-mono font-bold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQ.questionText}</h3>
              
              <div className="space-y-3">
                 {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(currentQ.id, idx)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        userAnswers[currentQ.id] === idx 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                          : 'border-slate-100 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="inline-block w-6 font-bold text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                 ))}
              </div>
           </div>

           {/* Navigation */}
           <div className="flex justify-between mt-6">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-slate-500 disabled:opacity-30"
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button 
                   onClick={handleSubmit}
                   className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold shadow-md hover:bg-emerald-400"
                >
                  Finish
                </button>
              )}
           </div>
        </div>
      </div>
    );
  };

  // 2. Standard List View (Mock, Vocab, Grammar)
  const renderListView = () => {
    // Group questions by passage for Mock View aesthetics if needed, 
    // but standard list is fine for now as per previous iterations.
    
    return (
      <div className="max-w-4xl mx-auto space-y-8">
         <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-10">
            <div>
               <h2 className="text-lg font-bold text-slate-800">{category} Practice</h2>
               <p className="text-xs text-slate-500">{questions.length} Questions</p>
            </div>
            <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-rose-500' : 'text-indigo-600'}`}>
               {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
         </div>

         {questions.map((q, index) => {
            // Check if this question starts a new passage context
            const isFirstOfPassage = index > 0 && q.passage && questions[index - 1].passage !== q.passage;
            const isVeryFirstPassage = index === 0 && q.passage;
            
            return (
               <div key={q.id} className="space-y-4">
                  {/* Passage Header / Expand Button for MOCK */}
                  {(isVeryFirstPassage || isFirstOfPassage) && q.passage && (
                     <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Reading Passage</span>
                        <button 
                          onClick={() => handleExpandPassage(q.passage!)} // Using passage text as ID for simplicity or generate specific ID
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-bold underline decoration-2 underline-offset-2"
                        >
                          Read Full Passage
                        </button>
                     </div>
                  )}

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <div className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-sm">
                           {index + 1}
                        </span>
                        <div className="flex-1">
                           <p className="text-lg font-medium text-slate-800 mb-4">{q.questionText}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIdx) => (
                                 <button
                                    key={optIdx}
                                    onClick={() => handleAnswerSelect(q.id, optIdx)}
                                    className={`text-left p-3 rounded-lg border transition-all text-sm ${
                                       userAnswers[q.id] === optIdx
                                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium'
                                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                                 >
                                    <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + optIdx)}.</span>
                                    {opt}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
         
         <div className="flex justify-end py-8">
            <button 
               onClick={handleSubmit}
               className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400 shadow-lg hover:scale-105 transition-all"
            >
               Submit Exam
            </button>
         </div>
      </div>
    );
  };

  // --- Main Render ---

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Generating your custom test...</p>
       </div>
    );
  }

  // Expanded Passage Modal (For Mock)
  if (expandedPassageId) {
     return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
           <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm">
              <span className="font-bold text-slate-700">Reading Passage</span>
              <button 
                onClick={() => setExpandedPassageId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-sm"
              >
                Close & Return to Questions
              </button>
           </div>
           <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
              <div className="prose prose-lg prose-slate mx-auto font-serif">
                 {/* Using the text itself as ID in this simple implementation */}
                 <div dangerouslySetInnerHTML={{ __html: expandedPassageId.replace(/\n/g, '<br/><br/>') }} />
              </div>
              <div className="h-20"></div>
           </div>
        </div>
     );
  }

  // Results View
  if (showResults) {
     const score = Math.round((Object.keys(userAnswers).reduce((acc, qId) => {
        const q = questions.find(qu => qu.id === qId);
        return q && q.correctAnswer === userAnswers[qId] ? acc + 1 : acc;
     }, 0) / questions.length) * 100) || 0;

     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-slate-200">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border-4 border-white shadow-inner">
                 <span className="text-4xl">
                    {score >= 70 ? '🎉' : '📚'}
                 </span>
              </div>
              
              <h2 className="text-3xl font-black text-slate-800 mb-2">
                 {score >= 70 ? 'Excellent Job!' : 'Keep Practicing!'}
              </h2>
              <p className="text-slate-500 mb-8">You've completed the {category.toLowerCase()} session.</p>
              
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-6 mb-8 text-center md:text-left">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {category === Category.MOCK ? "Exam Total" : "Final Score"}
                </p>
                <p className={`font-black text-2xl ${score >= (category === Category.MOCK ? 70 : questions.length * 0.7) ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {score}% <span className="text-sm text-slate-500 ml-1">
                       {category === Category.MOCK ? "(Cumulative)" : ""}
                   </span>
                </p>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={onExit}
                  className="px-6 py-4 text-slate-300 font-black uppercase text-xs tracking-widest hover:text-white transition-colors flex-1 md:flex-none"
                >
                  Close
                </button>
                <button 
                  onClick={handleStart}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg hover:bg-indigo-500 hover:scale-105 active:scale-95 flex-1 md:flex-none whitespace-nowrap"
                >
                  New {category === Category.MOCK ? 'Exam' : 'Lab'}
                </button>
              </div>
           </div>
        </div>
     );
  }

  // Active Test View
  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-20 px-4">
       {isReadingLab ? renderReadingLab() : renderListView()}
    </div>
  );
};

export default Practice;
