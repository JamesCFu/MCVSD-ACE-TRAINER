import React, { useEffect, useRef, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  mistakeCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, mistakeCount }) => {
  // Ref to control the scrolling element
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Scroll to top whenever the active view changes
  useEffect(() => {
    // Reset scroll on the main container
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    // Also reset window scroll just in case
    window.scrollTo(0, 0);
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Toggle (visible when sidebar is closed or on mobile) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 z-30 p-3 bg-indigo-950 text-white rounded-xl shadow-xl hover:bg-indigo-800 transition-all duration-300 ${isSidebarOpen ? 'md:hidden' : 'block'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-full md:w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 px-0'} bg-indigo-950 text-white flex flex-col sticky top-0 h-screen shadow-2xl z-20 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-indigo-500/20">🚀</div>
              <h1 className="text-xl font-black tracking-tighter">Academic <span className="text-indigo-400">Trainer</span></h1>
            </div>
            {/* Collapse Arrow for Desktop */}
            <button onClick={() => setIsSidebarOpen(false)} className="hidden md:block text-indigo-400 hover:text-white transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
            </button>
          </div>
          
          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'dashboard' ? 'bg-indigo-600 font-bold shadow-lg shadow-indigo-900/50' : 'hover:bg-white/5 text-indigo-200 font-medium'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveView('mistakes')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center justify-between ${activeView === 'mistakes' ? 'bg-rose-600 font-bold shadow-lg shadow-rose-900/50' : 'hover:bg-white/5 text-indigo-200 font-medium'}`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Mistake Log</span>
              </div>
              {mistakeCount > 0 && <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-black">{mistakeCount}</span>}
            </button>

            <div className="pt-6 pb-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] px-4">Study Tools</div>
            
            <button 
              onClick={() => setActiveView('learning')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'learning' ? 'bg-indigo-600 font-bold shadow-lg shadow-indigo-900/50' : 'hover:bg-white/5 text-indigo-200 font-medium'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              <span>Academy Library</span>
            </button>

            <button
              onClick={() => setActiveView('dailyvocab')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'dailyvocab' ? 'bg-indigo-600 font-bold shadow-lg shadow-indigo-900/50' : 'hover:bg-white/5 text-indigo-200 font-medium'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Daily Vocab</span>
            </button>

            <button 
              onClick={() => setActiveView('notes')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'notes' ? 'bg-indigo-600 font-bold shadow-lg shadow-indigo-900/50' : 'hover:bg-white/5 text-indigo-200 font-medium'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>Quick Guides</span>
            </button>

            <div className="pt-6 pb-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] px-4">Exam Prep</div>
            
            {['Reading', 'Vocab', 'Spelling', 'Grammar', 'Math'].map(prep => (
              <button 
                key={prep}
                onClick={() => setActiveView(prep.toLowerCase())} 
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${activeView === prep.toLowerCase() ? 'bg-indigo-600 font-bold' : 'hover:bg-white/5 text-indigo-200 font-medium'}`}
              >
                {prep} Lab
              </button>
            ))}

            <div className="pt-8 pb-4">
              <button onClick={() => setActiveView('mock')} className={`w-full text-left px-5 py-4 rounded-[1.5rem] transition-all flex items-center space-x-3 mb-1 shadow-xl ${activeView === 'mock' ? 'bg-emerald-600 font-black text-white' : 'bg-indigo-900 border border-indigo-800 text-emerald-300 font-black uppercase text-xs tracking-widest hover:bg-indigo-800'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <span>Mock Simulator</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 p-4 md:p-12 bg-slate-50 overflow-y-auto no-scrollbar h-screen">
        {children}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
