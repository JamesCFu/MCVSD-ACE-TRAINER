import React, { useMemo } from 'react';
import { UserStats, Category } from '../types';

interface DashboardProps {
  stats: UserStats;
  setActiveView: (view: string) => void;
  onStartPractice: (cat: Category) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveView, onStartPractice }) => {
  const xpInfo = useMemo(() => {
    const xp = Math.floor(Number(stats.xp) || 0);
    const levelSize = 1000;
    const level = Math.floor(xp / levelSize) + 1;
    const progress = (xp % levelSize) / levelSize * 100;
    
    let rank = "Junior Applicant";
    if (level >= 3) rank = "Honor Student";
    if (level >= 7) rank = "Ace Candidate";
    if (level >= 12) rank = "Vocational Master";
    if (level >= 20) rank = "Academy Legend";
    if (level >= 30) rank = "Professional Learner";

    return { level, progress, rank, currentXp: xp % levelSize, targetXp: levelSize };
  }, [stats.xp]);

  const globalAccuracy = useMemo(() => {
    const total = Math.floor(Number(stats.questionsAnswered) || 0);
    const correct = Math.floor(Number(stats.totalCorrect) || 0);
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }, [stats.totalCorrect, stats.questionsAnswered]);

  const moduleStats = useMemo(() => {
    const coreCategories = [
      Category.READING,
      Category.VOCABULARY,
      Category.GRAMMAR,
      Category.MATH,
      Category.SPELLING,
      Category.MOCK
    ];

    return coreCategories
      .map(cat => {
        const catKey = cat as string;
        const attempted = Math.floor(Number(stats.categoryAttempted?.[catKey]) || 0);
        const correct = Math.floor(Number(stats.categoryCorrect?.[catKey]) || 0);
        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
        return { cat, accuracy, attempted };
      })
      .filter(m => m.cat !== Category.MOCK || m.attempted > 0);
  }, [stats.categoryAttempted, stats.categoryCorrect]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Blast Off Training Academy</h2>
          <p className="text-slate-500 mt-2 font-medium">Elevating knowledge in ALL areas. Preparing you for YOUR future. </p>
        </div>
        <button 
          onClick={() => setActiveView('profile')}
          className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4 min-w-[240px] text-left group hover:border-indigo-600 transition-all hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
            {xpInfo.level}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{xpInfo.rank}</span>
              <span className="text-[10px] font-bold text-slate-400">{xpInfo.currentXp}/{xpInfo.targetXp} XP</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-1000" 
                style={{ width: `${xpInfo.progress}%` }}
              ></div>
            </div>
          </div>
        </button>
      </header>

      {/* Simulation Engine Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[3rem] p-10 mb-12 shadow-2xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/10">Simulation Mode</div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">Elite Mock Simulator</h3>
            <p className="text-indigo-100 mb-8 leading-relaxed text-lg">Experience the full rigor of the official admissions exam. Results are archived to your Academic Registry.</p>
            <button onClick={() => onStartPractice(Category.MOCK)} className="bg-white text-indigo-700 font-black py-4 px-10 rounded-2xl hover:bg-indigo-50 transition transform hover:-translate-y-1 shadow-xl text-lg">Launch Mock Test</button>
          </div>
          <div className="hidden lg:block">
            <div className="w-40 h-40 bg-white/10 rounded-[2.5rem] flex items-center justify-center border-2 border-white/20 backdrop-blur-sm">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Global Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Answered</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{Math.floor(Number(stats.questionsAnswered) || 0)}</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Global Accuracy</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{globalAccuracy}%</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Academy XP</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{Math.floor(Number(stats.xp) || 0)}</div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
        <span className="w-2.5 h-8 bg-indigo-600 rounded-full mr-4 shadow-lg shadow-indigo-100"></span>
        Core Practice Modules
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleStats.map((module) => (
          <div key={module.cat} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-indigo-300 transition-all hover:shadow-xl group cursor-pointer" onClick={() => onStartPractice(module.cat)}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-black text-xl text-slate-900 tracking-tight leading-tight mb-1">{module.cat}</h4>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Performance Registry</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-[9px] font-black uppercase text-slate-400 tracking-tighter mb-1">Total Answered</div>
                <div className="text-2xl font-black text-slate-900">{module.attempted}</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <div className="text-[9px] font-black uppercase text-indigo-400 tracking-tighter mb-1">Accuracy</div>
                <div className="text-2xl font-black text-indigo-700">{module.accuracy}%</div>
              </div>
            </div>

            <button className="text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center">
              Enter Diagnostic Lab
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;