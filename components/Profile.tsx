import React, { useMemo, useState } from 'react';
import { UserStats } from '../types';

interface ProfileProps {
  stats: UserStats;
  onReset: () => void;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onReset, onLogin, onLogout }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const globalAccuracy = useMemo(() => {
    if (!stats.questionsAnswered) return 0;
    return Math.round((stats.totalCorrect / stats.questionsAnswered) * 100);
  }, [stats.totalCorrect, stats.questionsAnswered]);

  const level = Math.floor(stats.xp / 1000) + 1;

  // Determine Rank Name based on Level
  let rank = "Junior Applicant";
  if (level >= 3) rank = "Honor Student";
  if (level >= 7) rank = "Ace Candidate";
  if (level >= 12) rank = "Vocational Master";
  if (level >= 20) rank = "Academy Legend";
  if (level >= 30) rank = "Professional Learner";

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20 px-4">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Registry</h2>
        <p className="text-slate-500 font-medium">Record for: <span className="text-indigo-600">{stats.username || 'Guest'}</span></p>
      </header>

      {/* --- IDENTITY SECTION --- */}
      <div className="bg-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
         </div>
         
         <div className="relative z-10">
           <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-indigo-500/20">🆔</div>
             <h3 className="text-2xl font-black tracking-tight">Student Identification</h3>
           </div>

           {!stats.isLoggedIn ? (
             <div className="max-w-md">
               <p className="text-indigo-200 mb-6 text-sm font-medium leading-relaxed">
                 Sign in to claim your diagnostic history and personalize your certificate.
               </p>
               <div className="space-y-4">
                 <div>
                   <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">Full Name</label>
                   <input 
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter Student Name"
                      className="w-full bg-indigo-900/50 border border-indigo-700 rounded-xl px-4 py-3 text-white placeholder-indigo-400/50 focus:outline-none focus:border-indigo-400 transition-colors font-bold"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">Email Address</label>
                   <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-indigo-900/50 border border-indigo-700 rounded-xl px-4 py-3 text-white placeholder-indigo-400/50 focus:outline-none focus:border-indigo-400 transition-colors font-medium"
                   />
                 </div>
                 <button 
                   onClick={() => {
                     if(nameInput.trim()) onLogin(nameInput, emailInput);
                   }}
                   className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all shadow-lg mt-2"
                 >
                   Activate Session
                 </button>
               </div>
             </div>
           ) : (
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                   <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Active Scholar</div>
                   <div className="text-3xl font-black mb-1">{stats.username}</div>
                   <div className="text-indigo-300 font-medium text-sm">{stats.email}</div>
                </div>
                <button 
                   onClick={onLogout}
                   className="px-8 py-3 border border-indigo-700 text-indigo-300 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-900 hover:text-white transition-all"
                >
                   Sign Out
                </button>
             </div>
           )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
           <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                {level}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{rank}</h3>
                <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest">{stats.xp} Total XP</p>
              </div>
           </div>
           
           <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">Next Milestone Progress</div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(stats.xp % 1000) / 10}%` }}></div>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xl font-black uppercase tracking-[0.2em] text-indigo-400 mb-8">Lifetime Diagnostics</h3>
           <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Answered</div>
                <div className="text-3xl font-black">{stats.questionsAnswered}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Correct Hits</div>
                <div className="text-3xl font-black text-emerald-400">{stats.totalCorrect}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Global Accuracy</div>
                <div className="text-3xl font-black text-indigo-400">{globalAccuracy}%</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Quizzes Done</div>
                <div className="text-3xl font-black">{stats.completedQuizzes}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">App Configuration</h3>
        <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-rose-50 rounded-[2.5rem] border border-rose-200 gap-6">
           <div className="flex-1 text-center md:text-left">
              <h4 className="font-black text-rose-950 text-xl mb-1">Repository Purge</h4>
              <p className="text-rose-800 text-sm font-medium">Instantly wipe all local storage data and reset the app to its original factory state.</p>
           </div>
           <button 
             type="button"
             onClick={() => setShowConfirmModal(true)}
             className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-700 transition-all shadow-xl active:scale-95 whitespace-nowrap ring-4 ring-rose-600/10"
           >
             Nuclear Reset: Delete All
           </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-[3rem] p-10 shadow-2xl border-4 border-rose-500 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
                ⚠️
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Confirm Repository Purge</h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8">
                This is a critical, irreversible action. All progress, XP, and diagnostic data will be permanently deleted. Are you absolutely sure you wish to proceed?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-10 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onReset}
                  className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/30"
                >
                  Confirm & Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
