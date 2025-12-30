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
  const [passage, setPassage] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        let data: Question[] = [];
        
        if (category === Category.READING) {
           const readingData = await generateReadingTest();
           // In readingData.ts, data is an array of objects: { passage: "...", questions: [] }
           if (readingData && readingData.length > 0) {
             setPassage(readingData[0].passage);
             data = readingData[0].questions;
           }
        } else if (category === Category.VOCABULARY) {
           data = await generateVocabTest(10);
        } else if (category === Category.MOCK) {
           data = await generateMockTest();
        } else {
           data = await generateQuestions(category, 10);
        }
        
        setQuestions(data || []);
      } catch (err) {
        console.error("Failed to load lab data:", err);
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

  if (loading) return <div className="p-20 text-center font-black animate-pulse">SYNCHRONIZING WITH DATABASE...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black tracking-tighter text-slate-900">{category}</h2>
        <button onClick={onExit} className="text-xs font-bold uppercase tracking-widest text-rose-500">Abort Session</button>
      </div>

      {/* READING PASSAGE SECTION */}
      {passage && (
        <div className="mb-12 bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-indigo-100 shadow-xl shadow-indigo-500/5">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Source Material</div>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
              {passage}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-xl font-bold mb-8 text-slate-900">
              <span className="text-indigo-600 mr-3">{idx + 1}.</span> {q.questionText}
            </p>
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
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold 
                      ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}
                      ${isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''}
                      ${isWrong ? 'border-rose-500 bg-rose-50 text-rose-700' : ''}
                    `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {isSubmitted && (
              <div className="mt-6 p-5 bg-slate-900 rounded-2xl text-slate-200 text-sm italic font-medium">
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isSubmitted && (
        <button 
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length < questions.length}
          className="mt-12 w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg tracking-widest disabled:opacity-50 transition-all hover:scale-[1.01]"
        >
          FINALIZE EVALUATION
        </button>
      )}
    </div>
  );
};

export default Practice;
