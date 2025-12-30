import React, { useState, useEffect } from 'react';
import { Category, Question } from '../types';
import { generateQuestions, generateVocabTest, generateGrammarTest, generateSpellingTest, generateMockTest, generateReadingTest } from '../geminiService';

interface PracticeProps {
  category: Category;
  onFinish: (labCategory: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => void;
  onRecordOnly: (labCategory: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => void;
  onLogMistake: (q: Question) => void;
  onExit: () => void;
}

const Practice: React.FC<PracticeProps> = ({ category, onFinish, onRecordOnly, onLogMistake, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Question[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        let data: Question[];
        
        if (category === Category.VOCABULARY) {
           data = await generateVocabTest(10);
        } else if (category === Category.GRAMMAR) {
           data = await generateGrammarTest(10);
        } else if (category === Category.SPELLING) {
           data = await generateSpellingTest(10);
        } else if (category === Category.MOCK) {
           data = await generateMockTest();
        } else if (category === Category.READING) {
           data = await generateReadingTest();
        } else {
           data = await generateQuestions(category, 10);
        }

        // Force subjects to have correct labels for registry updates
        const sanitizedData = data.map(q => ({
            ...q,
            category: category === Category.MOCK ? q.category : category
        }));

        setQuestions(sanitizedData);
      } catch (e) {
        console.error("Practice Load Error:", e);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [category]);

  const handleSelect = (questionId: string, idx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: idx }));
  };

  const handleSubmit = () => {
    let finalScore = 0;
    const currentMistakes: Question[] = [];
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (userAnswer === q.correctAnswer) {
        finalScore++;
      } else {
        currentMistakes.push(q);
        onLogMistake(q);
      }
    });
    
    // Update local state for display
    setScore(finalScore);
    setMistakes(currentMistakes);
    setIsSubmitted(true);
    
    // IMMEDIATE REGISTRY UPDATE: 
    // Ensure total answered/correct is added to stats RIGHT NOW.
    onRecordOnly(category, finalScore, questions.length, currentMistakes, questions);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Accessing Neural Core</h3>
        <p className="text-slate-500 mt-2 font-medium">Ace is drafting your diagnostic lab...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-700 flex items-center font-black uppercase text-[10px] tracking-widest transition group">
          <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Abort Session
        </button>
        <span className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
          {category} Lab
        </span>
      </div>

      {isSubmitted && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-100 mb-12 text-center animate-in zoom-in">
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Lab Result: {score}/{questions.length}</h2>
          <p className="text-indigo-600 font-bold mb-8 italic">Registry updated. Review analysis below.</p>
          <button onClick={() => onFinish(category, score, questions.length, mistakes, questions)} className="px-12 py-5 bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-all">Archive & Close</button>
        </div>
      )}

      <div className="space-y-12">
        {questions.length > 0 ? questions.map((q, qIdx) => (
          <div key={q.id} className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">{qIdx + 1}</span>
              <div className="flex flex-col">
                {category === Category.MOCK && (
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">{q.category}</span>
                )}
                <div className="h-[2px] w-24 bg-slate-200"></div>
              </div>
              <div className="h-[2px] flex-1 bg-slate-200"></div>
            </div>

            {q.passage && (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm leading-relaxed text-slate-800 font-serif text-lg italic bg-slate-50/50">
                <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-4 border-b border-indigo-50 pb-2">Manuscript Segment</div>
                <div className="whitespace-pre-wrap">{q.passage}</div>
              </div>
            )}

            <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all ${isSubmitted ? 'pointer-events-none' : 'hover:border-indigo-200'}`}>
              <h3 className="text-xl font-black text-slate-900 mb-8 leading-tight">{q.questionText}</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt, idx) => {
                  const isSelected = userAnswers[q.id] === idx;
                  const isCorrect = idx === q.correctAnswer;
                  let stateClass = "border-slate-100 bg-slate-50";

                  if (isSubmitted) {
                    if (isCorrect) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
                    else if (isSelected) stateClass = "border-rose-500 bg-rose-50 text-rose-700";
                    else stateClass = "opacity-40";
                  } else if (isSelected) {
                    stateClass = "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(q.id, idx)}
                      className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all flex items-center gap-4 ${stateClass}`}
                    >
                      <span className={`w-10 h-10 min-w-[2.5rem] rounded-lg flex items-center justify-center font-black text-sm border ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-300 border-slate-200'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top-4">
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">Coach Analysis</p>
                    <p className="text-sm italic font-medium leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-slate-400 font-bold">Registry synchronization failure. Please restart.</div>
        )}
      </div>

      {!isSubmitted && questions.length > 0 && (
        <div className="mt-20 flex justify-center sticky bottom-10">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length < questions.length}
            className={`px-16 py-6 rounded-[2.5rem] font-black text-lg shadow-2xl transition-all uppercase tracking-[0.4em] transform hover:scale-105 active:scale-95 ${Object.keys(userAnswers).length >= questions.length ? 'bg-indigo-700 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'}`}
          >
            Finalize Evaluation
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;