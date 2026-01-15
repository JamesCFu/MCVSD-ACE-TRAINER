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

  // Splitter State
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Highlighting State
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);

  // --- FIXED STOPWATCH LOGIC ---
  // We use a ref to track the current time to avoid closure staleness in the interval
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
        onSaveTime(category, nextTime); // Directly update parent/storage
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [category, isSubmitted, isPaused, loading, !!session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- WORD-BASED HIGHLIGHTING ---
  const handlePassageMouseUp = () => {
    if (!isHighlightMode || !passageRef.current || !session?.passage) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    if (!passageRef.current.contains(range.commonAncestorContainer)) return;

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(passageRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    
    let start = preSelectionRange.toString().length;
    let end = start + range.toString().length;
    const fullText = session.passage;

    // Word boundary snapping
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
      if (h.start > lastIndex) {
        elements.push(text.slice(lastIndex, h.start));
      }
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

  // --- HANDLERS ---
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-6xl mx-auto py-10 px-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase">{category}</h2>
        <div className="flex gap-4">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-mono font-black text-xl shadow-lg">
            ⏱ {formatTime(session.elapsedTime)}
          </div>
          <button onClick={onExit} className="px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black uppercase text-xs">Exit</button>
        </div>
      </div>

      {category === Category.READING && session.passage ? (
        <div className="flex h-[70vh] gap-6">
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
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
              className="p-8 overflow-y-auto text-lg leading-relaxed font-serif whitespace-pre-wrap selection:bg-yellow-200"
            >
              {renderPassageWithHighlights(session.passage)}
            </div>
          </div>
          <div className="w-1/3 overflow-y-auto space-y-4 pr-2">
            {session.questions.map((q, i) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="font-bold text-slate-800 mb-4">{i + 1}. {q.questionText}</p>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onUpdateSession(category, { ...session.userAnswers, [q.id]: idx })}
                      className={`w-full text-left p-3 rounded-xl text-sm font-bold border transition-all ${session.userAnswers[q.id] === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Submit Passage</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           {session.questions.map((q, i) => (
              <div key={q.id} className="bg-white p-8 rounded-3xl border-2 border-slate-100">
                <p className="text-xl font-bold mb-6">{i + 1}. {q.questionText}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onUpdateSession(category, { ...session.userAnswers, [q.id]: idx })}
                      className={`text-left p-4 rounded-2xl border-2 font-bold transition-all ${session.userAnswers[q.id] === idx ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'border-slate-100 hover:border-indigo-200'}`}
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
