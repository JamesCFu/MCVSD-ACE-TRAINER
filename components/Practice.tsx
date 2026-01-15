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
  const [isPaused, setIsPaused] = useState(false);

  // --- RESIZING STATE ---
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stopwatch Ref
  const timeAccruedRef = useRef(session?.elapsedTime || 0);

  useEffect(() => {
    timeAccruedRef.current = session?.elapsedTime || 0;
  }, [session?.elapsedTime, category]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (session && !isSubmitted && !isPaused && !loading) {
      interval = setInterval(() => {
        const nextTime = timeAccruedRef.current + 1;
        timeAccruedRef.current = nextTime;
        onSaveTime(category, nextTime);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [category, isSubmitted, isPaused, loading, !!session]);

  // --- RESIZING HANDLERS ---
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constraints: 20% to 80%
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Highlighting State
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);

  const handlePassageMouseUp = () => {
    if (!isHighlightMode || !passageRef.current || !session?.passage) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(passageRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    
    let start = preSelectionRange.toString().length;
    let end = start + range.toString().length;
    const fullText = session.passage;

    while (start > 0 && /\w/.test(fullText[start - 1])) start--;
    while (end < fullText.length && /\w/.test(fullText[end])) end++;

    const text = fullText.slice(start, end);
    if (text.trim().length === 0) return;

    const cleanHighlights = highlights.filter(h => (h.end <= start) || (h.start >= end));
    setHighlights([...cleanHighlights, { id: Date.now().toString(), start, end, text }]);
    selection.removeAllRanges(); 
  };

  const renderPassageWithHighlights = (text: string) => {
    if (highlights.length === 0) return text;
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;

    sorted.forEach((h) => {
      if (h.start > lastIndex) elements.push(text.slice(lastIndex, h.start));
      elements.push(
        <span 
          key={h.id} 
          onClick={(e) => { e.stopPropagation(); setHighlights(prev => prev.filter(x => x.id !== h.id)); }}
          className="bg-yellow-200 cursor-pointer hover:bg-rose-200 transition-colors rounded-sm"
        >
          {text.slice(h.start, h.end)}
        </span>
      );
      lastIndex = h.end;
    });
    if (lastIndex < text.length) elements.push(text.slice(lastIndex));
    return elements;
  };

  const handleStart = async () => {
    setLoading(true);
    setIsPaused(false);
    setHighlights([]); 
    if (session) onClearSession(category);
    try {
      let data: Question[] = [];
      let passage: string | null = null;
      if (category === Category.READING) {
         const resp = await generateReadingTest();
         const active = Array.isArray(resp) ? resp[0] : resp;
         passage = active.passage; 
         data = active.questions;
      } else if (category === Category.MOCK) {
         data = await generateMockPart1_ELA();
      } else {
         data = await generateQuestions(category, 10);
      }
      onStartSession(category, data, passage);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!session) return;
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
  };

  if (loading) return <div className="py-20 text-center font-black uppercase tracking-widest text-indigo-600">Initialising...</div>;

  if (!session) return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center">
      <div className="bg-white rounded-[3rem] p-16 shadow-xl border border-slate-100">
        <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase">{category}</h2>
        <button onClick={handleStart} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all">Start session</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col p-6 animate-in fade-in overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-black text-slate-900 uppercase">{category}</h2>
        <div className="flex gap-4">
          <div className="bg-slate-900 text-white px-5 py-2 rounded-xl font-mono font-black text-lg shadow-lg">
            ⏱ {formatTime(session.elapsedTime)}
          </div>
          <button onClick={onExit} className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest">Exit Lab</button>
        </div>
      </div>

      {category === Category.READING && session.passage ? (
        <div ref={containerRef} className="flex-1 flex gap-0 bg-white rounded-3xl border border-slate-200 overflow-hidden relative">
          
          {/* LEFT PANEL: PASSAGE */}
          <div 
            style={{ width: `${leftPanelWidth}%` }} 
            className="h-full flex flex-col border-r border-slate-100"
          >
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center shrink-0">
              <button 
                onClick={() => setIsHighlightMode(!isHighlightMode)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isHighlightMode ? 'bg-yellow-400 text-yellow-950' : 'bg-white border text-slate-400'}`}
              >
                {isHighlightMode ? '🖍 Highlight Mode ON' : 'Highlighter'}
              </button>
              {highlights.length > 0 && (
                <button onClick={() => setHighlights([])} className="text-rose-500 font-black text-[10px] uppercase">Clear All</button>
              )}
            </div>
            <div 
              ref={passageRef}
              onMouseUp={handlePassageMouseUp}
              className="p-10 overflow-y-auto text-lg leading-relaxed font-serif whitespace-pre-wrap selection:bg-yellow-200 flex-1"
            >
              {renderPassageWithHighlights(session.passage)}
            </div>
          </div>

          {/* RESIZING BAR */}
          <div 
            onMouseDown={startResizing}
            className={`w-4 h-full cursor-col-resize flex items-center justify-center transition-colors group z-10 ${isDragging ? 'bg-indigo-100' : 'bg-slate-50 hover:bg-indigo-50'}`}
          >
            <div className={`w-1 h-12 rounded-full transition-colors ${isDragging ? 'bg-indigo-400' : 'bg-slate-300 group-hover:bg-indigo-300'}`}></div>
          </div>

          {/* RIGHT PANEL: QUESTIONS */}
          <div 
            style={{ width: `${100 - leftPanelWidth}%` }} 
            className="h-full overflow-y-auto bg-slate-50/30 p-8"
          >
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
              {session.questions.map((q, i) => (
                <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-lg font-bold text-slate-900 mb-6"><span className="text-indigo-600 mr-2">Q{i + 1}.</span> {q.questionText}</p>
                  <div className="space-y-3">
                    {q.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => onUpdateSession(category, { ...session.userAnswers, [q.id]: idx })}
                        className={`w-full text-left p-4 rounded-2xl text-sm font-bold border-2 transition-all ${session.userAnswers[q.id] === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleSubmit} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-indigo-900 transition-all">Submit Evaluation</button>
            </div>
          </div>
        </div>
      ) : (
        /* NON-READING LAYOUT */
        <div className="flex-1 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full pb-20">
           {session.questions.map((q, i) => (
              <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100">
                <p className="text-xl font-bold mb-8">{i + 1}. {q.questionText}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onUpdateSession(category, { ...session.userAnswers, [q.id]: idx })}
                      className={`text-left p-5 rounded-2xl border-2 font-bold transition-all ${session.userAnswers[q.id] === idx ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
           ))}
           <div className="sticky bottom-6 flex justify-center">
             <button onClick={handleSubmit} className="px-20 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Finish & Grade</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
