import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  onUpdateSession: (category: Category, userAnswers: Record<string, number>) => void;
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
  
  // --- CATEGORY-SPECIFIC TIMER ---
  const [timer, setTimer] = useState(session?.elapsedTime || 0);
  const [isPaused, setIsPaused] = useState(false);

  // Sync timer when session category changes
  useEffect(() => {
    setTimer(session?.elapsedTime || 0);
  }, [category, session?.elapsedTime]);

  // Persist timer to parent state/storage as it ticks
  useEffect(() => {
    if (session && !isSubmitted && !isPaused) {
      onSaveTime(category, timer);
    }
  }, [timer, category, isSubmitted, isPaused]);

  // Splitter State
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- HIGHLIGHTING STATE ---
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);

  // --- TIMER TICK ---
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
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isDragging, resize, stopResizing]);

  // --- WORD-BASED HIGHLIGHTING LOGIC ---
  const handlePassageMouseUp = () => {
    if (!isHighlightMode || !passageRef.current || !session?.passage) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    if (!passageRef.current.contains(range.commonAncestorContainer)) return;

    // Get Raw offsets
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(passageRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    let start = preSelectionRange.toString().length;
    let end = start + range.toString().length;

    const fullText = session.passage;

    // --- SNAP TO WORD BOUNDARIES ---
    // Expand Start
    while (start > 0 && /\w/.test(fullText[start - 1])) {
      start--;
    }
    // Expand End
    while (end < fullText.length && /\w/.test(fullText[end])) {
      end++;
    }

    const text = fullText.slice(start, end);
    if (text.trim().length === 0) return;

    // Filter overlaps
    const cleanHighlights = highlights.filter(h => 
      (h.end <= start) || (h.start >= end)
    );

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      start,
      end,
      text
    };

    setHighlights([...cleanHighlights, newHighlight]);
    selection.removeAllRanges(); 
  };

  const removeHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const clearAllHighlights = () => {
    setHighlights([]);
  };

  const renderPassageWithHighlights = (text: string) => {
    if (highlights.length === 0) return text;

    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;

    sorted.forEach((h) => {
      if (h.start > lastIndex) {
        elements.push(text.slice(lastIndex, h.start));
      }
      
      const safeEnd = Math.min(h.end, text.length);
      elements.push(
        <span 
          key={h.id} 
          onClick={(e) => {
            e.stopPropagation();
            removeHighlight(h.id);
          }}
          className="bg-yellow-200 cursor-pointer hover:bg-rose-200 transition-colors rounded-sm"
        >
          {text.slice(h.start, safeEnd)}
        </span>
      );
      lastIndex = safeEnd;
    });

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
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
         }
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
    onUpdateSession(category, newAnswers);
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
               localStorage.setItem('mock_ela_result', JSON.stringify({ score: elaScore, total: session.questions.length }));
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
              if (session.userAnswers[q.id] === q.correctAnswer) mathScore++;
              else { mistakes.push(q); onLogMistake(q); }
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
            return;
       }
    }

    let calculatedScore = 0;
    const mistakes: Question[] = [];
    session.questions.forEach(q => {
      if (session.userAnswers[q.id] === q.correctAnswer) calculatedScore++;
      else { mistakes.push(q); onLogMistake(q); }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
    onRecordOnly(category, calculatedScore, session.questions.length, mistakes, session.questions);
    onCompleteSession(category, calculatedScore);
    window.scrollTo(0,0);
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
            Ready to initiate a new diagnostic sequence? Progress will be saved automatically until you submit.
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

  const { questions, userAnswers, passage } = session;

  if (category === Category.READING && passage) {
    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6 px-2 shrink-0">
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Reading Lab</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">Passage Analysis</span>
                 <span className="text-[10px] font-bold text-slate-400">⏱ {formatTime(timer)}</span>
              </div>
           </div>
           <div className="flex gap-3">
              <button onClick={onExit} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 text-xs uppercase tracking-wider">Exit</button>
              {!isSubmitted ? (
                 <button onClick={handleSubmit} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Submit</button>
              ) : (
                 <button onClick={handleStart} className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all">Next Passage</button>
              )}
           </div>
        </div>

        <div ref={containerRef} className="flex-1 flex overflow-hidden pb-4 relative bg-white rounded-3xl shadow-sm border border-slate-200">
           <div style={{ width: `${leftPanelWidth}%` }} className="h-full overflow-y-auto border-r border-slate-100 flex flex-col">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsHighlightMode(!isHighlightMode)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isHighlightMode ? 'bg-yellow-300 text-yellow-900 shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <span className="text-lg">🖍</span> {isHighlightMode ? 'Highlight ON' : 'Highlight Mode'}
                  </button>
                  {highlights.length > 0 && (
                     <span className="text-[10px] font-bold text-slate-400">{highlights.length} Highlight{highlights.length !== 1 && 's'}</span>
                  )}
                </div>
                {highlights.length > 0 && (
                   <button onClick={clearAllHighlights} className="text-rose-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest">Clear All</button>
                )}
              </div>

              <div className="p-8 prose prose-indigo max-w-none flex-1">
                 <div 
                   ref={passageRef}
                   onMouseUp={handlePassageMouseUp}
                   className={`text-lg leading-loose text-slate-800 font-serif whitespace-pre-wrap ${isHighlightMode ? 'cursor-text' : ''}`}
                 >
                    {renderPassageWithHighlights(passage)}
                 </div>
              </div>
           </div>

           <div onMouseDown={startResizing} className="w-4 bg-slate-50 hover:bg-indigo-50 cursor-col-resize flex items-center justify-center border-l border-r border-slate-100 transition-colors z-10">
              <div className="w-1 h-8 bg-slate-300 rounded-full"></div>
           </div>

           <div style={{ width: `${100 - leftPanelWidth}%` }} className="h-full overflow-y-auto p-8 bg-slate-50/50">
              <div className="space-y-8 pb-20">
                 {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                       <div className="flex gap-4 mb-4">
                          <span className="w-6 h-6 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold text-xs shrink-0">{idx + 1}</span>
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
                                      ? i === q.correctAnswer ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : userAnswers[q.id] === i ? 'bg-rose-100 border-rose-300 text-rose-800' : 'bg-white opacity-60'
                                      : userAnswers[q.id] === i ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 hover:border-indigo-300'
                                }`}
                             >
                                {opt}
                             </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{category} Lab</h2>
          <p className="text-slate-500 font-medium">Session metrics tracked per category.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-slate-100 px-4 py-2 rounded-xl font-mono font-black text-slate-600 border border-slate-200">
               ⏱ {formatTime(timer)}
            </div>
            <button onClick={handleStart} className="bg-white border-2 border-slate-200 text-slate-500 px-4 py-2 rounded-xl font-black text-xs uppercase hover:text-indigo-600 transition-colors">Restart</button>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-[2rem] border-2 border-slate-100">
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</span>
              <p className="text-xl font-bold text-slate-900">{q.questionText}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 pl-0 md:pl-12">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(q.id, i)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all ${
                    userAnswers[q.id] === i ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Submission Bar */}
      <div className="mt-12 sticky bottom-6 z-10">
        <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl flex justify-between items-center max-w-4xl mx-auto border border-white/10 px-8">
          <div className="text-white">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Progress</p>
            <p className="font-black text-xl">{Object.keys(userAnswers).length} / {questions.length}</p>
          </div>
          {!isSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < questions.length}
              className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${Object.keys(userAnswers).length < questions.length ? 'bg-slate-700 text-slate-500' : 'bg-white text-indigo-900 hover:scale-105'}`}
            >
              Submit Diagnostic
            </button>
          ) : (
             <div className="text-emerald-400 font-black">Score: {score} / {questions.length}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
