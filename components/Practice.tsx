import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Category, Question, PracticeSession } from '../types';
import { 
  generateQuestions, 
  generateReadingTest 
} from '../geminiService';

interface PracticeProps {
  category: Category;
  session: PracticeSession | null;
  onStartSession: (category: Category, questions: Question[], passage?: string | null) => void;
  onUpdateSession: (category: Category, userAnswers: Record<string, number>) => void;
  onCompleteSession: (category: Category, score: number) => void;
  onClearSession: (category: Category) => void;
  onFinish: () => void;
  onRecordOnly: (category: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => void;
  onLogMistake: (question: Question) => void;
  onExit: () => void;
  onSaveTime: (category: Category, time: number) => void;
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
  
  // Timer State - Initialize from session.elapsedTime if available
  const [timer, setTimer] = useState(session?.elapsedTime || 0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref to keep track of timer for unmount cleanup
  const timerRef = useRef(timer);

  // Sync ref with state
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // Save time on unmount (Exit)
  useEffect(() => {
    return () => {
      // Check if session exists to avoid errors on full reset
      if (session && !session.isSubmitted) {
         onSaveTime(category, timerRef.current);
      }
    };
  }, []);

  // Highlighting State
  const [passageHtml, setPassageHtml] = useState<string>("");
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);

  // Splitter State
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) {
      setIsSubmitted(false);
      setScore(0);
      setPassageHtml("");
      setTimer(0);
      setIsPaused(false);
    } else if (session.isSubmitted) {
      setIsSubmitted(true);
      setScore(session.score);
    }
    
    if (session?.passage && !passageHtml) {
      setPassageHtml(session.passage);
    }
  }, [session, category]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && !loading && session && !isSubmitted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, loading, session, isSubmitted]);

  // Handle Tab Switching / Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session && !isSubmitted) {
        setIsPaused(true);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- SPLITTER LOGIC ---
  const startResizing = useCallback(() => {
    setIsDragging(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      // Enforce minimum width of 20% and maximum of 80%
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftPanelWidth(newLeftWidth);
      }
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isDragging, resize, stopResizing]);

  // --- HIGHLIGHT LOGIC ---

  const snapToWordBoundary = (range: Range) => {
    // Only expand start if it's a text node to avoid jumping to container start
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      // Expand start
      while (range.startOffset > 0) {
        const char = range.startContainer.textContent?.charAt(range.startOffset - 1);
        if (char && /\s/.test(char)) break;
        range.setStart(range.startContainer, range.startOffset - 1);
      }
    }
    
    // Only expand end if it's a text node
    if (range.endContainer.nodeType === Node.TEXT_NODE) {
      // Expand end
      const len = range.endContainer.textContent?.length || 0;
      while (range.endOffset < len) {
        const char = range.endContainer.textContent?.charAt(range.endOffset);
        if (char && /\s/.test(char)) break;
        range.setEnd(range.endContainer, range.endOffset + 1);
      }
    }
    
    return range;
  };

  const handleApplyHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    
    // Verify selection is inside the passage container
    if (passageRef.current && passageRef.current.contains(range.commonAncestorContainer)) {
      try {
        // Expand to word boundaries to avoid partial word highlights
        snapToWordBoundary(range);

        const span = document.createElement('span');
        // px-0 ensures no extra spacing is added. box-decoration-clone handles line breaks gracefully.
        span.className = "bg-yellow-300/50 text-slate-900 rounded-none px-0 box-decoration-clone border-b-2 border-yellow-500 cursor-pointer hover:bg-yellow-300/70 transition-colors highlight-span";
        span.dataset.highlight = "true";
        
        range.surroundContents(span);
        selection.removeAllRanges();
        
        // Update state to persist highlights
        setPassageHtml(passageRef.current.innerHTML);
      } catch (e) {
        console.warn("Cannot highlight across complex existing elements. Try selecting smaller chunks.", e);
      }
    }
  };

  const handleUnhighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Check if we are inside a highlight
    let node = selection.anchorNode;
    // Traverse up to find if we are inside a highlight span
    while (node && node !== passageRef.current) {
        if (node.nodeType === 1 && (node as HTMLElement).dataset.highlight === "true") {
             // We found a highlight span. Unwrap it.
             const parent = node.parentNode;
             if(parent) {
                 while(node.firstChild) {
                     parent.insertBefore(node.firstChild, node);
                 }
                 parent.removeChild(node);
                 setPassageHtml(passageRef.current?.innerHTML || "");
             }
             selection.removeAllRanges();
             return;
        }
        node = node.parentNode;
    }

    // Fallback: If strict selection unhighlight is needed (complex), 
    // simply removing the wrapping span is usually sufficient for this use case.
  };

  const handleTextMouseUp = () => {
      if (isHighlightMode) {
          handleApplyHighlight();
      }
  };

  // --- CORE LOGIC ---

  const handleStart = async () => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(0);
    setPassageHtml("");
    setTimer(0);
    setIsPaused(false);
    
    if (session) {
        onClearSession(category);
    }

    try {
      let data: Question[] = [];
      let passage: string | null = null;
      
      if (category === Category.READING) {
         const readingResponse = await generateReadingTest();
         const activePassage = Array.isArray(readingResponse) ? readingResponse[0] : readingResponse;
         
         if (activePassage) {
           passage = activePassage.passage; 
           data = activePassage.questions || [];
           setPassageHtml(passage); 
         }
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
    onUpdateSession(category, newAnswers);
  };

  const handleSubmit = () => {
    if (!session) return;
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
    
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
    window.scrollTo(0,0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-900 font-black tracking-[0.4em] uppercase text-[10px]">Synchronizing Lab Data...</p>
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
              ? "Full simulation mode. 45 Questions (15 Vocab, 15 Grammar, 15 Math). Timed environment simulation." 
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

  return (
    <>
      {/* PAUSE OVERLAY */}
      {isPaused && !isSubmitted && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl max-w-md w-full mx-4 border-4 border-white/20">
              <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                 ⏸
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Session Paused</h3>
              <p className="text-slate-500 font-medium mb-8">Timer stopped at <span className="text-indigo-600 font-black">{formatTime(timer)}</span></p>
              <button 
                onClick={() => setIsPaused(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
              >
                Resume Session
              </button>
           </div>
        </div>
      )}

      {/* READING LAYOUT */}
      {category === Category.READING && session.passage ? (
        <div className="h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 px-2 shrink-0">
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Reading Lab</h2>
                <p className="text-slate-500 text-xs font-medium">Analyze text source and query database.</p>
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
                {isSubmitted && (
                   <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border ${score >= questions.length * 0.7 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                      Score: {score} / {questions.length}
                   </div>
                )}
                <button 
                  onClick={handleStart}
                  className="bg-white border-2 border-slate-200 text-slate-500 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  Reset
                </button>
                <button onClick={onExit} className="px-4 py-2 text-slate-400 hover:text-slate-600 font-bold uppercase text-xs transition-colors">Exit</button>
             </div>
          </div>
    
          {/* Resizable Container */}
          <div ref={containerRef} className="flex-1 flex overflow-hidden pb-4 relative select-text">
            
            {/* Left Side: Passage */}
            <div 
              style={{ width: `${leftPanelWidth}%` }} 
              className="bg-white rounded-[2rem] border-2 border-indigo-50 shadow-xl overflow-hidden relative flex flex-col transition-width duration-75 ease-linear"
            >
                {/* Passage Toolbar */}
                <div className="sticky top-0 bg-white/95 backdrop-blur py-3 px-6 z-10 border-b border-indigo-50 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Source Material</span>
                 
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsHighlightMode(!isHighlightMode)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${isHighlightMode ? 'bg-yellow-300 text-yellow-900 ring-2 ring-yellow-400 ring-offset-1' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      title={isHighlightMode ? "Highlight Mode ON: Select text to highlight" : "Click to enable highlight mode"}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      {isHighlightMode ? 'Mode: ON' : 'Mode: OFF'}
                    </button>
                    
                    <button 
                      onClick={handleUnhighlight}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                      title="Select highlighted text and click to remove"
                    >
                       Remove
                    </button>

                    <button 
                      onClick={() => setPassageHtml(session.passage || "")}
                      className="px-3 py-1.5 text-slate-300 hover:text-slate-500 text-[10px] font-black uppercase tracking-wider"
                    >
                      Clear All
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-4 md:p-10 md:pt-4 cursor-text" onMouseUp={handleTextMouseUp}>
                <div className="prose prose-slate max-w-none prose-lg">
                    <div 
                      ref={passageRef}
                      className="leading-relaxed text-slate-800 font-medium whitespace-pre-wrap font-serif"
                      dangerouslySetInnerHTML={{ __html: passageHtml }}
                    />
                </div>
              </div>
            </div>
    
            {/* Draggable Handle */}
            <div 
              className="w-4 flex items-center justify-center cursor-col-resize hover:bg-indigo-100/50 group z-20"
              onMouseDown={startResizing}
            >
               <div className={`w-1 h-12 rounded-full transition-colors ${isDragging ? 'bg-indigo-400' : 'bg-slate-200 group-hover:bg-indigo-300'}`}></div>
            </div>

            {/* Right Side: Questions */}
            <div style={{ width: `${100 - leftPanelWidth}%` }} className="flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2 pb-20 pl-2">
                {questions.map((q, idx) => {
                    const isCorrect = userAnswers[q.id] === q.correctAnswer;
                    const isWrong = isSubmitted && !isCorrect;
                    
                    return (
                      <div key={q.id} className={`bg-white p-6 rounded-[2rem] border-2 shadow-sm transition-all ${isWrong ? 'border-rose-100 ring-4 ring-rose-50' : isSubmitted && isCorrect ? 'border-emerald-100 ring-4 ring-emerald-50' : 'border-slate-100'}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</span>
                          <p className="text-lg font-bold text-slate-900 leading-snug pt-1">{q.questionText}</p>
                        </div>
          
                        <div className="grid grid-cols-1 gap-2 pl-0 md:pl-12">
                          {q.options && q.options.map((opt, optIdx) => {
                            const isSelected = userAnswers[q.id] === optIdx;
                            const isActualCorrect = optIdx === q.correctAnswer;
                            let buttonStyle = "border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-600";
                            if (isSubmitted) {
                              if (isActualCorrect) buttonStyle = "bg-emerald-500 border-emerald-500 text-white";
                              else if (isSelected && !isActualCorrect) buttonStyle = "bg-rose-500 border-rose-500 text-white opacity-60";
                              else buttonStyle = "border-slate-100 text-slate-300 opacity-50";
                            } else if (isSelected) {
                              buttonStyle = "bg-indigo-600 border-indigo-600 text-white shadow-lg";
                            }
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleOptionSelect(q.id, optIdx)}
                                disabled={isSubmitted}
                                className={`w-full text-left p-3 rounded-xl border-2 font-bold transition-all text-sm flex items-center gap-3 ${buttonStyle}`}
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
                          <div className="mt-4 ml-0 md:ml-12 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-1">Correction Insight</p>
                            <p className="text-slate-700 font-medium italic text-xs">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                })}
                
                {!isSubmitted && (
                   <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-center mt-4">
                      <button 
                          onClick={handleSubmit}
                          disabled={Object.keys(userAnswers).length < questions.length}
                          className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all ${Object.keys(userAnswers).length < questions.length ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg hover:scale-[1.02]'}`}
                      >
                          Submit Diagnostics
                      </button>
                   </div>
                )}
            </div>
          </div>
        </div>
      ) : (
        // STANDARD LAYOUT (Vocab, Grammar, Math, Mock, etc.)
        <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500 pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{category} Lab</h2>
              <p className="text-slate-500 font-medium">Complete all queries to analyze performance.</p>
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
                <button 
                    onClick={handleStart}
                    className="bg-white border-2 border-slate-200 text-slate-500 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                    New {category === Category.MOCK ? 'Mock' : 'Lab'}
                </button>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              const isWrong = isSubmitted && !isCorrect;
              
              return (
                <div key={q.id} className={`bg-white p-8 rounded-[2rem] border-2 shadow-sm transition-all ${isWrong ? 'border-rose-100 ring-4 ring-rose-50' : isSubmitted && isCorrect ? 'border-emerald-100 ring-4 ring-emerald-50' : 'border-slate-100'}`}>
                  <div className="flex items-start gap-4 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</span>
                    <div className="flex-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">{q.category}</span>
                        <p className="text-xl font-bold text-slate-900 leading-snug">{q.questionText}</p>
                    </div>
                  </div>

                  {/* ANSWER CHOICES */}
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

                  {/* EXPLANATION (Only shows after submit) */}
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

          {/* FOOTER ACTIONS */}
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
                  >
                    Submit Diagnostics
                  </button>
                </>
              ) : (
                <>
                  <div className="px-6 text-center md:text-left">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Final Score</p>
                    <p className={`font-black text-2xl ${score >= questions.length * 0.7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {score} / {questions.length} <span className="text-sm text-slate-500 ml-1">({Math.round((score/questions.length)*100)}%)</span>
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
                      Generate New {category === Category.MOCK ? 'Mock' : 'Lab'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Practice;
