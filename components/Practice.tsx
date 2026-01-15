import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Category, Question, PracticeSession } from '../types';
import { 
  generateQuestions, 
  generateReadingTest,
  generateMockPart1_ELA,
  generateMockPart2_Math
} from '../geminiService';

interface Highlight {
  id: string;
  start: number;
  end: number;
  text: string;
}

interface PracticeProps {
  category: Category;
  session: PracticeSession | null;
  onStartSession: (category: Category, questions: Question[], passage?: string | null) => void;
  // Updated to support persistence:
  onUpdateSession: (category: Category, userAnswers: Record<string, number>, highlights?: Highlight[]) => void;
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);

  // Sync highlights when the session loads or changes
  useEffect(() => {
    if (session?.highlights && Array.isArray(session.highlights)) {
      setHighlights(session.highlights);
    } else {
      setHighlights([]);
    }
  }, [session?.highlights, session?.passage]);

  const handleStart = async () => {
    setLoading(true);
    try {
      let questions: Question[] = [];
      let passage: string | null = null;

      if (category === Category.READING) {
        const data = await generateReadingTest();
        questions = data;
        passage = data[0]?.passage || null;
      } else if (category === Category.MOCK) {
        questions = await generateMockPart1_ELA();
        passage = questions[0]?.passage || null;
      } else {
        questions = await generateQuestions(category);
      }

      onStartSession(category, questions, passage);
      setCurrentQuestionIndex(0);
      setHighlights([]);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!session || session.isSubmitted) return;
    const newAnswers = { ...session.userAnswers, [questions[currentQuestionIndex].id]: optionIndex };
    onUpdateSession(category, newAnswers, highlights);
  };

  const clearHighlights = () => {
    setHighlights([]);
    onUpdateSession(category, session?.userAnswers || {}, []);
  };

  const handlePassageMouseUp = () => {
    const selection = window.getSelection();
    const passageText = session?.passage;

    if (!selection || selection.isCollapsed || !passageRef.current || !passageText) return;

    const range = selection.getRangeAt(0);
    let start = range.startOffset;
    let end = range.endOffset;

    // Word Snapping Logic: Expand boundaries to the nearest whitespace
    while (start > 0 && /\S/.test(passageText[start - 1])) {
      start--;
    }
    while (end < passageText.length && /\S/.test(passageText[end])) {
      end++;
    }

    const selectedText = passageText.slice(start, end).trim();
    if (!selectedText) return;

    // Check for overlaps to prevent messy rendering
    const isOverlapping = highlights.some(h => 
      (start >= h.start && start < h.end) || (end > h.start && end <= h.end)
    );

    if (isOverlapping) {
      selection.removeAllRanges();
      return;
    }

    const newHighlight: Highlight = {
      id: `hl-${Date.now()}`,
      start,
      end,
      text: selectedText
    };

    const updated = [...highlights, newHighlight];
    setHighlights(updated);
    onUpdateSession(category, session?.userAnswers || {}, updated);
    selection.removeAllRanges();
  };

  const renderPassageWithHighlights = () => {
    const text = session?.passage;
    if (!text) return null;
    if (!highlights || highlights.length === 0) return text;

    try {
      // Create a copy before sorting to avoid mutating state directly (prevents white screen)
      const sorted = [...highlights].sort((a, b) => a.start - b.start);
      const elements: (string | JSX.Element)[] = [];
      let lastIndex = 0;

      sorted.forEach((h) => {
        if (h.start < lastIndex) return; // Skip invalid/overlapping highlights

        if (h.start > lastIndex) {
          elements.push(text.substring(lastIndex, h.start));
        }
        elements.push(
          <span 
            key={h.id} 
            className="bg-yellow-200/80 rounded-sm px-0.5 border-b-2 border-yellow-400/40"
          >
            {text.substring(h.start, h.end)}
          </span>
        );
        lastIndex = h.end;
      });

      if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
      }

      return elements;
    } catch (e) {
      return text;
    }
  };

  const handleSubmit = () => {
    if (!session) return;
    let correctCount = 0;
    const mistakes: Question[] = [];

    session.questions.forEach(q => {
      if (session.userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      } else {
        mistakes.push(q);
        onLogMistake(q);
      }
    });

    onCompleteSession(category, correctCount);
    onRecordOnly(category, correctCount, session.questions.length, mistakes, session.questions);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-full mx-auto"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Session...</p>
          </div>
        ) : (
          <div className="max-w-md animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-4">{category} Lab</h2>
            <p className="text-slate-600 mb-8 font-medium">Ready to begin your diagnostic training? These sessions are timed to simulate exam conditions.</p>
            <button 
              onClick={handleStart}
              className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
            >
              Start Practice
            </button>
          </div>
        )}
      </div>
    );
  }

  const questions = session.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const score = session.score;

  if (session.isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-700">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Performance Rank</div>
            <div className="text-3xl font-black text-slate-900">
              {score / questions.length >= 0.8 ? 'A+' : score / questions.length >= 0.6 ? 'B' : 'C'}
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 mb-2">Lab Report</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">{category}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Accuracy</div>
              <div className="text-3xl font-black text-indigo-600">{Math.round((score / questions.length) * 100)}%</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Correct</div>
              <div className="text-3xl font-black text-emerald-500">{score} / {questions.length}</div>
            </div>
            <div className="bg-indigo-900 p-6 rounded-3xl shadow-lg shadow-indigo-900/20">
              <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Time Expended</div>
              <div className="text-3xl font-black text-white">{Math.floor(session.elapsedTime / 60)}m {session.elapsedTime % 60}s</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={onExit}
            className="px-10 py-5 bg-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-300 transition-all"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={handleStart}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-700 transition-all"
          >
            Retake Lab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Passage or Info */}
        {(category === Category.READING || (category === Category.MOCK && session.passage)) && (
          <div className="lg:w-1/2 flex flex-col h-[75vh]">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter">Reading Material</h3>
                </div>
                
                {highlights.length > 0 && (
                  <button 
                    onClick={clearHighlights}
                    className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Clear Highlights ({highlights.length})
                  </button>
                )}
              </div>
              
              <div 
                ref={passageRef}
                onMouseUp={handlePassageMouseUp}
                className="overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200"
              >
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg font-medium select-text whitespace-pre-wrap">
                  {renderPassageWithHighlights()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Question */}
        <div className={`${(category === Category.READING || (category === Category.MOCK && session.passage)) ? 'lg:w-1/2' : 'w-full max-w-3xl mx-auto'}`}>
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Item {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Diagnostic active
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-8 leading-tight">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-4 mb-10 flex-1">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center group ${
                    session.userAnswers[currentQuestion.id] === idx
                      ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-600/5'
                      : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-4 transition-all ${
                    session.userAnswers[currentQuestion.id] === idx
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-white'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`font-bold transition-all ${
                    session.userAnswers[currentQuestion.id] === idx ? 'text-indigo-900' : 'text-slate-600'
                  }`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <div className="flex gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="p-4 bg-slate-100 text-slate-500 rounded-xl disabled:opacity-30 hover:bg-slate-200 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="p-4 bg-slate-100 text-slate-500 rounded-xl disabled:opacity-30 hover:bg-slate-200 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all transform hover:-translate-y-1"
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-10 py-4 bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
