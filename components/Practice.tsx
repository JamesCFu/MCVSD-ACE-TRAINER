import React, { useState, useEffect } from 'react';
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
  onExit 
}) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!session) {
      setIsSubmitted(false);
      setScore(0);
    } else if (session.isSubmitted) {
      setIsSubmitted(true);
      setScore(session.score);
    }
  }, [session, category]);

  const handleStart = async () => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(0);
    
    // Ensure any previous session is cleared before starting fresh
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
      } else {
         // Generate 10 questions for regular labs, Mock uses its own internal count (45) inside service
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
    
    // Scroll to top to see score
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
    window.scrollTo(0,0);
  };

  const handleEndSession = () => {
    onClearSession(category);
    setIsSubmitted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-900 font-black tracking-[0.4em] uppercase text-[10px]">Synchronizing Lab Data...</p>
      </div>
    );
  }

  // If no active session, show Start Screen
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

  const { questions, passage, userAnswers } = session;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{category} Lab</h2>
          <p className="text-slate-500 font-medium">Complete all queries to analyze performance.</p>
        </div>
        <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-indigo-100">
                {Object.keys(userAnswers).length} / {questions.length} Answered
              </div>
            )}
            {/* New Button to Restart/New Lab while active */}
            <button 
                onClick={handleStart}
                className="bg-white border-2 border-slate-200 text-slate-500 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
                New {category === Category.MOCK ? 'Mock' : 'Lab'}
            </button>
        </div>
      </div>

      {/* READING PASSAGE DISPLAY */}
      {category === Category.READING && passage && (
        <div className="mb-12 bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-indigo-50 shadow-xl">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Source Material</div>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap font-serif">
              {passage}
            </p>
          </div>
        </div>
      )}

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
  );
};

export default Practice;
