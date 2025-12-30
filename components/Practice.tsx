import React, { useState, useEffect } from 'react';
import { Category, Question } from '../types';
import { 
  generateQuestions, 
  generateVocabTest, 
  generateMockTest, 
  generateReadingTest 
} from '../geminiService';

const Practice: React.FC<PracticeProps> = ({ category, onFinish, onLogMistake, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passage, setPassage] = useState<string | null>(null); // New state for full text
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        let data: Question[] = [];
        
        if (category === Category.READING) {
           const readingResponse = await generateReadingTest();
           // Check if it's an array (fullReadingData) or a single object
           const activePassage = Array.isArray(readingResponse) ? readingResponse[0] : readingResponse;
           
           if (activePassage) {
             setPassage(activePassage.passage); // Sets the full string
             data = activePassage.questions;
           }
        } else {
           // Clear passage for Math, Vocab, etc.
           setPassage(null);
           data = await generateQuestions(category, 10);
        }
        
        setQuestions(data || []);
      } catch (err) {
        console.error("Critical Lab Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [category]);

  // ... handleSubmit logic ...

  if (loading) return <div className="p-20 text-center font-black animate-pulse">SYNCHRONIZING...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-black mb-10">{category}</h2>

      {/* ENTIRE PASSAGE DISPLAY - Only for Reading */}
      {category === Category.READING && passage && (
        <div className="mb-12 bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-indigo-50 shadow-xl">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Source Material</div>
          <div className="prose prose-slate max-w-none">
            {/* whitespace-pre-wrap ensures the full text with line breaks is visible */}
            <p className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
              {passage}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-xl font-bold mb-6">{idx + 1}. {q.questionText}</p>
            {/* ... rendering options ... */}
          </div>
        ))}
      </div>

      {/* ... Footer / Submit Button ... */}
    </div>
  );
};
export default Practice;
