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
  // Now accepts highlights as the 3rd argument
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
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Timer State
  const [timer, setTimer] = useState(session?.elapsedTime || 0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(timer);

  // Splitter State
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- HIGHLIGHTING STATE ---
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);

  // --- READING NAV STATE (For multiple passages) ---
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);

  // --- MOCK READING POP-OUT STATE ---
  const [mockReadingMode, setMockReadingMode] = useState<{passage: string, questions: Question[]} | null>(null);
  
  // Scroll Position and Targeting
  const savedScrollPos = useRef(0);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);

  // Auto-scroll logic when expanded view opens
  useLayoutEffect(() => {
    if (mockReadingMode && targetQuestionId) {
      const element = document.getElementById(`q-split-${targetQuestionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
        setTargetQuestionId(null); // Reset after scrolling
      }
    }
  }, [mockReadingMode, targetQuestionId]);

  // Keep ref in sync for cleanup/saving
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // --- TIMER SYNCHRONIZATION ---
  useEffect(() => {
    if (session) {
      setTimer(session.elapsedTime || 0);
    } else {
      setTimer(0);
    }
    setIsPaused(false);

    return () => {
      const timeToSave = timerRef.current;
      if (session && !session.isSubmitted) {
         onSaveTime(category, timeToSave);
      }
    };
  }, [category]); 

  // --- SESSION STATE SYNCHRONIZATION ---
  useEffect(() => {
    if (!session) {
      setIsSubmitted(false);
      setScore(0);
      setHighlights([]); 
      setMockReadingMode(null);
      setCurrentPassageIndex(0);
    } else {
      setIsSubmitted(session.isSubmitted);
      setScore(session.score);
      if (session.highlights) {
        setHighlights(session.highlights);
      }
    }
  }, [session, category]);

  // --- TIMER TICK LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && !loading && session && !isSubmitted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, loading, session, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- SPLITTER LOGIC ---
  const startResizing = useCallback(() => setIsDragging(true), []);
  const stopResizing = useCallback(() => setIsDragging(false), []);
  const resize = useCallback((e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newLeftWidth > 20 && newLeftWidth < 80) setLeftPanelWidth(newLeftWidth);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
    };
  }, [isDragging, resize, stopResizing]);

  const saveSessionState = (newHighlights: Highlight[]) => {
    if (!session) return;
    onUpdateSession(category, session.userAnswers, newHighlights);
  };

  const handlePassageMouseUp = (passageText: string) => {
    if (!isHighlightMode || !passageRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!passageRef.current.contains(range.commonAncestorContainer)) return;
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(passageRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    let start = preSelectionRange.toString().length;
    let end = start + range.toString().length;
    const fullText = passageText;
    if (start < 0) start = 0;
    if (end > fullText.length) end = fullText.length;
    while (start < end && /\s/.test(fullText[start])) start++;
    while (end > start && /\s/.test(fullText[end - 1])) end--;
    if (start >= end) {
      selection.removeAllRanges();
      return; 
    }
    while (start > 0 && /\S/.test(fullText[start - 1])) start--;
    while (end < fullText.length && /\S/.test(fullText[end])) end++;
    const text = fullText.slice(start, end);
    const cleanHighlights = highlights.filter(h => (h.end <= start) || (h.start >= end));
    const newHighlight: Highlight = { id: Date.now().toString(), start, end, text };
    const updatedHighlights = [...cleanHighlights, newHighlight];
    setHighlights(updatedHighlights);
    saveSessionState(updatedHighlights);
    selection.removeAllRanges();
  };

  const removeHighlight = (id: string) => {
    const updatedHighlights = highlights.filter(h => h.id !== id);
    setHighlights(updatedHighlights);
    saveSessionState(updatedHighlights); 
  };

  const clearAllHighlights = () => {
    setHighlights([]);
    saveSessionState([]); 
  };

  const renderPassageWithHighlights = (text: string) => {
    if (highlights.length === 0) return text;
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;
    sorted.forEach((h) => {
      if (h.start > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, h.start)}</span>);
      }
      const safeEnd = Math.min(h.end, text.length);
      if (h.start < text.length) {
         elements.push(
            <span 
              key={h.id} 
              onClick={() => removeHighlight(h.id)}
              className="bg-yellow-200 cursor-pointer hover:bg-rose-200 transition-colors rounded-sm px-0.5 box-decoration-clone"
              title="Click to remove highlight"
            >
              {text.slice(h.start, safeEnd)}
            </span>
         );
      }
      lastIndex = safeEnd;
    });
    if (lastIndex < text.length) {
      elements.push(<span key={`text-end`}>{text.slice(lastIndex)}</span>);
    }
    return elements;
  };

  const handleStart = async () => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(0);
    setTimer(0);
    setIsPaused(false);
    setHighlights([]); 
    setMockReadingMode(null);
    setCurrentPassageIndex(0);
    if (session) onClearSession(category);
    try {
      let data: Question[] = [];
      let passage: string | null = null;
      if (category === Category.READING) {
         data = await generateReadingTest();
      } else if (category === Category.MOCK) {
         data = await generateMockPart1_ELA();
      } else {
         data = await generateQuestions(category, 10);
      }
      onStartSession(category, data, passage);
    } catch (err) {
      console.error("Critical Lab Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted || !session) return;
    const newAnswers = { ...session.userAnswers, [questionId]: optionIndex };
    onUpdateSession(category, newAnswers, highlights);
  };

  const handleSubmit = async () => {
    if (!session) return;
    if (category === Category.MOCK) {
       const currentStage = localStorage.getItem('mock_stage') || 'ELA';
       if (currentStage === 'ELA' || !session.mockStage) {
           let elaScore = 0;
           session.questions.forEach(q => {
             if (session.userAnswers[q.id] === q.correctAnswer) elaScore++;
           });
           setLoading(true);
           try {
               const mathQuestions = await generateMockPart2_Math();
               const elaTotal = session.questions.length;
               localStorage.setItem('mock_ela_result', JSON.stringify({ score: elaScore, total: elaTotal }));
               localStorage.setItem('mock_stage', 'MATH');
               onStartSession(category, mathQuestions, null); 
           } catch(e) {
               console.error("Failed to load Math", e);
           } finally {
               setLoading(false);
               window.scrollTo(0,0);
           }
           return;
       }
       if (currentStage === 'MATH') {
            let mathScore = 0;
            const mistakes: Question[] = [];
            session.questions.forEach(q => {
              if (session.userAnswers[q.id] === q.correctAnswer) {
                mathScore++;
              } else {
                mistakes.push(q);
                onLogMistake(q);
              }
            });
            const elaData = JSON.parse(localStorage.getItem('mock_ela_result') || '{"score":0, "total":0}');
            const finalScore = mathScore + elaData.score;
            const finalTotal = session.questions.length + elaData.total;
            setScore(finalScore);
            setIsSubmitted(true);
            localStorage.removeItem('mock_ela_result');
            localStorage.removeItem('mock_stage');
            onRecordOnly(category, finalScore, finalTotal, mistakes, session.questions); 
            onCompleteSession(category, finalScore);
            window.scrollTo(0,0);
            return;
       }
    }
    let calculatedScore = 0;
    const mistakes: Question[] = [];
    session.questions.forEach(q => {
      if (session.userAnswers[q.id] === q.correctAnswer) {
        calculatedScore++;
      } else {
        mistakes.push(q);
        onLogMistake(q);
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
    onRecordOnly(category, calculatedScore, session.questions.length, mistakes, session.questions);
    onCompleteSession(category, calculatedScore);
    window.scrollTo(0,0);
  };
  
  const getSubmitButtonText = () => {
      if (category === Category.MOCK) {
          const stage = localStorage.getItem('mock_stage') || 'ELA';
          if (stage === 'ELA') return "Submit ELA & Proceed to Math";
          return "Submit Final Exam";
      }
      return "Submit Diagnostics";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-900 font-black tracking-[0.4em] uppercase text-[10px]">Processing Exam Data...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <div className="bg-white rounded-[3rem] p-16 shadow-xl border border-slate-100">
          <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner">
            {category === Category.MOCK ? '🎓' : '🚀'}
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">{category} Lab</h2>
          <p className="text-slate-500 font-medium mb-12 text-lg max-w-xl mx-auto">
            {category === Category.MOCK 
              ? "Two-Part Simulation: ELA (Spelling, Vocab, Grammar, Reading) followed by Math. Comprehensive scoring." 
              : "Ready to initiate a new diagnostic sequence? Progress will be saved automatically until you submit."}
          </p>
          <button 
            onClick={handleStart}
            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95"
          >
            Initialize {category === Category.MOCK ? 'Mock Exam' : 'Test'}
          </button>
        </div>
      </div>
    );
  }

  const { questions, userAnswers } = session;
  const mockStage = localStorage.getItem('mock_stage') || 'ELA';

  const renderSplitView = (
      passageText: string, 
      activeQuestions: Question[], 
      isPopOut: boolean, 
      uniquePassagesCount: number = 1
  ) => {
    const allAnswered = questions.every(q => userAnswers[q.id] !== undefined);

    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500 fixed inset-0 z-50 bg-slate-50 md:relative md:h-[calc(100vh-6rem)] md:z-0">
        <div className="flex justify-between items-center mb-4 px-4 py-2 shrink-0 bg-white md:bg-transparent shadow-sm md:shadow-none border-b md:border-none border-slate-100">
           <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                  {isPopOut ? "Mock Reading Lab" : "Reading Lab"}
                  {isPopOut && <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">Expanded View</span>}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                 {uniquePassagesCount > 1 && (
                     <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                        Passage {currentPassageIndex + 1} of {uniquePassagesCount}
                     </span>
                 )}
                 <span className="text-[10px] font-bold text-slate-400">⏱ {formatTime(timer)}</span>
              </div>
           </div>
           <div className="flex gap-3">
              {isPopOut ? (
                  <button 
                    onClick={() => {
                        setMockReadingMode(null);
                        setHighlights([]);
                        setIsHighlightMode(false);
                        setTimeout(() => {
                           const mainContainer = document.querySelector('main');
                           if (mainContainer) mainContainer.scrollTop = savedScrollPos.current;
                        }, 10);
                    }} 
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
                  >
                    Return to Exam
                  </button>
              ) : (
                  <>
                    <button onClick={onExit} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 text-xs uppercase tracking-wider">Exit</button>
                    {!isSubmitted ? (
                        uniquePassagesCount > 1 && currentPassageIndex < uniquePassagesCount - 1 ? (
                           <button 
                              onClick={() => {
                                  setHighlights([]); 
                                  setCurrentPassageIndex(prev => prev + 1);
                              }}
                              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-700 transition-all"
                           >
                             Next Passage &rarr;
                           </button>
                        ) : (
                           <button 
                              onClick={handleSubmit} 
                              disabled={!allAnswered}
                              className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg transition-all ${
                                 !allAnswered 
                                 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                              title={!allAnswered ? "Please answer all questions before submitting." : "Submit"}
                           >
                             Submit
                           </button>
                        )
                    ) : (
                        <button onClick={handleStart} className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all">Start New Lab</button>
                    )}
                  </>
              )}
           </div>
        </div>

        <div ref={containerRef} className="flex-1 flex overflow-hidden pb-4 relative bg-white rounded-3xl shadow-sm border border-slate-200 mx-2 mb-2 md:mx-0 md:mb-0">
           <div style={{ width: `${leftPanelWidth}%` }} className="h-full overflow-y-auto border-r border-slate-100 flex flex-col relative group">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsHighlightMode(!isHighlightMode)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isHighlightMode ? 'bg-yellow-300 text-yellow-900 shadow-md transform scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <span className="text-lg">🖍</span> {isHighlightMode ? 'Highlight ON' : 'Highlight Mode'}
                  </button>
                  {highlights.length > 0 && (
                     <span className="text-[10px] font-bold text-slate-400">{highlights.length} Highlight{highlights.length !== 1 && 's'}</span>
                  )}
                </div>
                {highlights.length > 0 && (
                   <button 
                      onClick={clearAllHighlights}
                      className="text-rose-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest"
                   >
                     Clear All
                   </button>
                )}
              </div>
              <div className="p-8 prose prose-indigo max-w-none flex-1 selection:bg-yellow-100">
                 <div 
                   ref={passageRef}
                   onMouseUp={() => handlePassageMouseUp(passageText)}
                   className={`text-lg leading-loose text-slate-800 font-serif whitespace-pre-wrap ${isHighlightMode ? 'cursor-text' : ''}`}
                 >
                    {renderPassageWithHighlights(passageText)}
                 </div>
              </div>
           </div>
           <div
              onMouseDown={startResizing}
              className="w-4 bg-slate-50 hover:bg-indigo-50 cursor-col-resize flex items-center justify-center border-l border-r border-slate-100 transition-colors z-10"
           >
              <div className="w-1 h-8 bg-slate-300 rounded-full"></div>
           </div>
           <div style={{ width: `${100 - leftPanelWidth}%` }} className="h-full overflow-y-auto p-8 bg-slate-50/50">
              {!isPopOut && (
                  <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-10">
                      <div className="flex justify-between items-end mb-3">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Lab Progress</span>
                          <span className="text-xs font-bold text-slate-700">{Object.keys(userAnswers).length} / {questions.length} Completed</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full transition-all duration-500 ease-out rounded-full" 
                            style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}
                          ></div>
                      </div>
                  </div>
              )}
              <div className="space-y-8 pb-20">
                 {activeQuestions.map((q, idx) => {
                    const isCorrect = userAnswers[q.id] === q.correctAnswer;
                    return (
                       <div key={q.id} id={`q-split-${q.id}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                          <div className="flex gap-4 mb-4">
                             <span className="w-6 h-6 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold text-xs shrink-0">
                                 {questions.findIndex(quest => quest.id === q.id) + 1}
                             </span>
                             <p className="font-bold text-slate-800">{q.questionText}</p>
                          </div>
                          <div className="space-y-2 pl-10">
                             {q.options.map((opt, i) => (
                                <button
                                   key={i}
                                   disabled={isSubmitted}
                                   onClick={() => handleOptionSelect(q.id, i)}
                                   className={`w-full text-left p-3 rounded-lg text-sm font-medium border transition-all ${
                                      isSubmitted
                                         ? i === q.correctAnswer
                                            ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                            : userAnswers[q.id] === i
                                            ? 'bg-rose-100 border-rose-300 text-rose-800'
                                            : 'bg-white border-slate-100 opacity-60'
                                         : userAnswers[q.id] === i
                                         ? 'bg-indigo-600 border-indigo-600 text-white'
                                         : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-600'
                                   }`}
                                >
                                   <span className="mr-3 font-bold opacity-50">{String.fromCharCode(65 + i)}</span>
                                   {opt}
                                </button>
                             ))}
                          </div>
                          {isSubmitted && !isCorrect && (
                             <div className="mt-4 ml-10 p-4 bg-indigo-50 rounded-xl text-xs text-indigo-800 font-medium border border-indigo-100">
                                {q.explanation}
                             </div>
                          )}
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>
    );
  };

  if (mockReadingMode) {
      return renderSplitView(mockReadingMode.passage, mockReadingMode.questions, true);
  }

  if (category === Category.READING && questions.length > 0) {
      const uniquePassages = Array.from(new Set(questions.map(q => q.passage || ""))).filter(p => p !== "");
      if (uniquePassages.length > 0) {
          const activePassageText = uniquePassages[currentPassageIndex];
          const activeQuestions = questions.filter(q => q.passage === activePassageText);
          return renderSplitView(activePassageText, activeQuestions, false, uniquePassages.length);
      }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{category} Lab</h2>
          <p className="text-slate-500 font-medium">
              {category === Category.MOCK 
                ? `Phase: ${mockStage === 'MATH' ? 'Mathematics' : 'English Language Arts'}`
                : "Complete all queries to analyze performance."}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-slate-100 px-4 py-2 rounded-xl font-mono font-black text-slate-600 border border-slate-200 flex items-center gap-2">
               <span>⏱ {formatTime(timer)}</span>
               {!isSubmitted && (
                 <button onClick={() => setIsPaused(true)} className="ml-2 w-6 h-6 flex items-center justify-center bg-white rounded-full text-xs hover:bg-slate-200 transition-colors" title="Pause">⏸</button>
               )}
            </div>
            {!isSubmitted && (
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-indigo-100">
                {Object.keys(userAnswers).length} / {questions.length} Answered
              </div>
            )}
            <button onClick={handleStart} className="bg-white border-2 border-slate-200 text-slate-500 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-colors">Restart</button>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const isCorrect = userAnswers[q.id] === q.correctAnswer;
          const isWrong = isSubmitted && !isCorrect;
          
          return (
            <div key={q.id} className={`bg-white p-8 rounded-[2rem] border-2 shadow-sm transition-all ${isWrong ? 'border-rose-100 ring-4 ring-rose-50' : isSubmitted && isCorrect ? 'border-emerald-100 ring-4 ring-emerald-50' : 'border-slate-100'}`}>
              
              {q.passage && (
                  <div className="mb-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-slate-800 font-serif leading-relaxed text-sm">
                      <div className="flex justify-between items-center mb-4 border-b border-indigo-100 pb-2">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Reference Passage</span>
                          <button 
                             onClick={() => {
                                 const mainContainer = document.querySelector('main');
                                 if (mainContainer) savedScrollPos.current = mainContainer.scrollTop;
                                 setTargetQuestionId(q.id);
                                 const relevantQs = questions.filter(quest => quest.passage === q.passage);
                                 setHighlights(session?.highlights || []); 
                                 setIsHighlightMode(false);
                                 setMockReadingMode({ passage: q.passage!, questions: relevantQs });
                             }}
                             className="group flex items-center gap-2 bg-white border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                          >
                             <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                             Expand to Reading Lab
                          </button>
                      </div>
                      <div className="line-clamp-4 opacity-70">{q.passage}</div>
                      <div className="mt-2 text-center">
                          <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">Click expand to view full text & use tools</span>
                      </div>
                  </div>
              )}

              <div className="flex items-start gap-4 mb-6">
                <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</span>
                <div className="flex-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">{q.category}</span>
                    <p className="text-xl font-bold text-slate-900 leading-snug">{q.questionText}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pl-0 md:pl-12">
                {q.options && q.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[q.id] === optIdx;
                  const isActualCorrect = optIdx === q.correctAnswer;
                  let buttonStyle = "border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-600";
                  if (isSubmitted) {
                    if (isActualCorrect) buttonStyle = "bg-emerald-500 border-emerald-500 text-white shadow-md ring-2 ring-emerald-200";
                    else if (isSelected && !isActualCorrect) buttonStyle = "bg-rose-500 border-rose-500 text-white shadow-md ring-2 ring-rose-200 opacity-60";
                    else buttonStyle = "border-slate-100 text-slate-300 opacity-50";
                  } else if (isSelected) {
                    buttonStyle = "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.01]";
                  }
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all duration-200 flex items-center gap-3 ${buttonStyle}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] ${isSubmitted && isActualCorrect ? 'border-white text-white' : isSelected ? 'border-white text-white' : 'border-slate-300 text-slate-400'}`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {isSubmitted && !isCorrect && (
                <div className="mt-6 ml-0 md:ml-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-2">
                  <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-2">Correction Insight</p>
                  <p className="text-slate-700 font-medium italic text-sm leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 sticky bottom-6 z-10">
        <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-center max-w-4xl mx-auto border border-white/10">
          {!isSubmitted ? (
            <>
              <div className="px-6">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Progress</p>
                <p className="text-white font-black text-xl">{Object.keys(userAnswers).length} / {questions.length}</p>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length < questions.length}
                className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg w-full md:w-auto ${Object.keys(userAnswers).length < questions.length ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-105 active:scale-95'}`}
                title={Object.keys(userAnswers).length < questions.length ? "Complete all questions to submit" : "Submit Exam"}
              >
                {getSubmitButtonText()}
              </button>
            </>
          ) : (
            <>
              <div className="px-6 text-center md:text-left">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {category === Category.MOCK ? "Exam Total" : "Final Score"}
                </p>
                <p className={`font-black text-2xl ${score >= (category === Category.MOCK ? 70 : questions.length * 0.7) ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {score} <span className="text-sm text-slate-500 ml-1">
                       {category === Category.MOCK ? "(Cumulative)" : `/ ${questions.length}`}
                   </span>
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button onClick={onExit} className="px-6 py-4 text-slate-300 font-black uppercase text-xs tracking-widest hover:text-white transition-colors flex-1 md:flex-none">Close</button>
                <button onClick={handleStart} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg hover:bg-indigo-500 hover:scale-105 active:scale-95 flex-1 md:flex-none whitespace-nowrap">New {category === Category.MOCK ? 'Exam' : 'Lab'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
