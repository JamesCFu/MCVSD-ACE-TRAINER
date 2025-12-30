import React, { useState, useEffect } from 'react';
import { Category, Question } from '../types';
import { 
  generateQuestions, 
  generateVocabTest, 
  generateGrammarTest, 
  generateSpellingTest, 
  generateMockTest, 
  generateReadingTest 
} from '../geminiService';

interface PracticeProps {
  category: Category;
  onFinish: (labCategory: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => void;
  onRecordOnly: (labCategory: Category, score: number, total: number, mistakes: Question[], questions: Question[]) => void;
  onLogMistake: (q: Question) => void;
  onExit: () => void;
}

const Practice: React.FC<PracticeProps> = ({ category, onFinish, onRecordOnly, onLogMistake, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passage, setPassage] = useState<string | null>(null); // State for the text
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        let data: Question[] = [];
        
        // 1. Specific Logic for Reading Lab
        if (category === Category.READING) {
           const readingData = await generateReadingTest();
           // Expecting an array of passages from readingData.ts
           if (Array.isArray(readingData) && readingData.length > 0) {
             setPassage(readingData[0].passage); // Set the full passage text
             data = readingData[0].questions;    // Set the questions for that passage
           } else if (readingData && readingData.passage) {
             // Fallback if service returns a single object instead of array
             setPassage(readingData.passage);
             data = readingData.questions;
           }
        } 
        // 2. Logic for other Labs
        else if (category === Category.VOCABULARY) {
           data = await generateVocabTest(10);
           setPassage(null); // Ensure no passage carries over
        } else if (category === Category.MOCK) {
           data = await generateMockTest();
           setPassage(null);
        } else {
           data = await generateQuestions(category, 10);
           setPassage(null);
        }
        
        setQuestions(data || []);
      } catch (err) {
        console.error("Lab Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [category]);

  const handleSubmit = () => {
    let score = 0;
    const mistakes: Question[] = [];
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
      else {
        mistakes.push(q);
        onLogMistake(q);
      }
    });
    setIsSubmitted(true);
    onFinish(category, score, questions.length, mistakes, questions);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-indigo-900 uppercase tracking-widest text-xs">Synchronizing Lab Data...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{category}</h2>
          <p className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.2em]">Diagnostic Session</p>
        </div>
        <button onClick={onExit} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Exit Lab</button>
      </header>

      {/* CONDITIONAL PASSAGE: Only shows for Reading Lab and if passage exists */}
      {category === Category.READING && passage && (
        <div className="mb-12 bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-indigo-50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg">Passage</span>
            <div className="h-px flex-1 bg-indigo-50"></div>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
              {passage}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.length > 0 ? questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</span>
              <p className="text-xl font-bold text-slate-900 leading-tight">{q.questionText}</p>
            </div>
            
            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                const isSelected = userAnswers[q.id] === i;
                const isCorrect = isSubmitted && i === q.correctAnswer;
                const isWrong = isSubmitted && isSelected && i !== q.correctAnswer;
                
                return (
                  <button
                    key={i}
                    disabled={isSubmitted}
                    onClick={() => setUserAnswers({ ...userAnswers, [q.id]: i })}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold flex items-center gap-4
                      ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}
                      ${isCorrect ? '!border-emerald-500 !bg-emerald-50 !text-emerald-700' : ''}
                      ${isWrong ? '!border-rose-500 !bg-rose-50 !text-rose-700' : ''}
                      ${isSubmitted && !isSelected && !isCorrect ? 'opacity-50' : ''}
                    `}
                  >
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div className="mt-6 p-6 bg-slate-900 rounded-2xl">
                <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Analysis</p>
                <p className="text-slate-300 text-sm italic leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">No diagnostic data found for this module.</p>
          </div>
        )}
      </div>

      {!isSubmitted && questions.length > 0 && (
        <div className="mt-12 sticky bottom-8">
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length < questions.length}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            Finalize Session
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;
