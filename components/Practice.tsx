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
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Question[] = [];
        
        // Routing logic based on category
        if (category === Category.VOCABULARY) {
          data = await generateVocabTest(10);
        } else if (category === Category.GRAMMAR) {
          data = await generateGrammarTest(10);
        } else if (category === Category.SPELLING) {
          data = await generateSpellingTest(10);
        } else if (category === Category.MOCK) {
          data = await generateMockTest();
        } else if (category === Category.READING) {
          const readingData = await generateReadingTest();
          data = readingData.questions || (Array.isArray(readingData) ? readingData[0].questions : []);
        } else {
          data = await generateQuestions(category, 10);
        }

        if (!data || data.length === 0) {
          throw new Error("No questions returned for this category.");
        }
        setQuestions(data);
      } catch (err) {
        console.error("Practice Load Error:", err);
        setError("Failed to synchronize with the lab database.");
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [category]);

  const handleSubmit = () => {
    let correctCount = 0;
    const mistakesFound: Question[] = [];
    
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      } else {
        mistakesFound.push(q);
        onLogMistake(q);
      }
    });

    setIsSubmitted(true);
    onFinish(category, correctCount, questions.length, mistakesFound, questions);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-indigo-900 uppercase tracking-widest text-sm">Initializing Lab...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="text-6xl mb-6">⚠️</div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Sync Failure</h3>
        <p className="text-slate-500 font-medium mb-8">{error || "The requested module is currently empty."}</p>
        <button onClick={onExit} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Return to Terminal</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{category}</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Diagnostic Session Active</p>
        </div>
        <button onClick={onExit} className="text-slate-400 hover:text-rose-500 font-bold text-xs uppercase tracking-widest transition-colors">Abort Mission</button>
      </header>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">{idx + 1}</span>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              
              <p className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-8">{q.questionText}</p>
              
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option, oIdx) => {
                  const isSelected = userAnswers[q.id] === oIdx;
                  const isCorrect = isSubmitted && oIdx === q.correctAnswer;
                  const isWrong = isSubmitted && isSelected && oIdx !== q.correctAnswer;

                  return (
                    <button
                      key={oIdx}
                      disabled={isSubmitted}
                      onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                      className={`group relative text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4
                        ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'}
                        ${isCorrect ? 'border-emerald-500 bg-emerald-50 !opacity-100' : ''}
                        ${isWrong ? 'border-rose-500 bg-rose-50 !opacity-100' : ''}
                        ${isSubmitted && !isSelected && !isCorrect ? 'opacity-40' : ''}
                      `}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black uppercase transition-all
                        ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 shadow-sm'}
                        ${isCorrect ? 'bg-emerald-500 text-white' : ''}
                        ${isWrong ? 'bg-rose-500 text-white' : ''}
                      `}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>{option}</span>
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-8 p-6 bg-slate-900 rounded-2xl">
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Technical Analysis</p>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed italic">{q.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isSubmitted && (
        <div className="mt-16 flex justify-center sticky bottom-8">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length < questions.length}
            className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95
              ${Object.keys(userAnswers).length === questions.length 
                ? 'bg-indigo-600 text-white cursor-pointer' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
            `}
          >
            Submit for Evaluation
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;
