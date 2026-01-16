// fileName: Layout.tsx

import React, { useEffect, useRef, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  mistakeCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, mistakeCount }) => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans text-slate-900">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 z-50 p-2 bg-indigo-900 text-white rounded-md shadow-lg ${isSidebarOpen ? 'md:hidden' : 'block'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 px-0'} bg-indigo-950 text-white flex flex-col fixed md:sticky top-0 h-screen shadow-2xl z-40 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Academic <span className="text-indigo-400">Trainer</span></h1>
            {/* Desktop Collapse Button */}
            <button onClick={() => setIsSidebarOpen(false)} className="hidden md:block text-indigo-400 hover:text-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
            </button>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${activeView === 'dashboard' ? 'bg-indigo-800 font-semibold' : 'hover:bg-indigo-900/50 text-indigo-100'}`}
            >
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveView('mistakes')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${activeView === 'mistakes' ? 'bg-rose-700 font-semibold' : 'hover:bg-rose-900/30 text-indigo-100'}`}
            >
              <span>Mistake Log</span>
              {mistakeCount > 0 && <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-xs font-bold">{mistakeCount}</span>}
            </button>

            <div className="pt-4 pb-2 text-xs font-bold text-indigo-500 uppercase tracking-widest px-4">Study</div>
            
            <button 
              onClick={() => setActiveView('learning')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${activeView === 'learning' ? 'bg-indigo-800 font-semibold' : 'hover:bg-indigo-900/50 text-indigo-100'}`}
            >
              <span>Academy Library</span>
            </button>

            <button
              onClick={() => setActiveView('daily')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${activeView === 'daily' ? 'bg-indigo-800 font-semibold' : 'hover:bg-indigo-900/50 text-indigo-100'}`}
            >
              <span>Daily Vocab</span>
            </button>

            <button 
              onClick={() => setActiveView('notes')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${activeView === 'notes' ? 'bg-indigo-800 font-semibold' : 'hover:bg-indigo-900/50 text-indigo-100'}`}
            >
              <span>Short Notes</span>
            </button>

            <div className="pt-4 pb-2 text-xs font-bold text-indigo-500 uppercase tracking-widest px-4">Practice Labs</div>
            
            {['Reading', 'Vocab', 'Spelling', 'Grammar', 'Math'].map(prep => (
              <button 
                key={prep}
                onClick={() => setActiveView(prep.toLowerCase())} 
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeView === prep.toLowerCase() ? 'bg-indigo-800 font-semibold' : 'hover:bg-indigo-900/50 text-indigo-100'}`}
              >
                {prep}
              </button>
            ))}

            <div className="pt-6">
              <button onClick={() => setActiveView('mock')} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${activeView === 'mock' ? 'bg-emerald-600 font-bold text-white' : 'bg-indigo-900 text-emerald-300 border border-indigo-800 hover:bg-indigo-800'}`}>
                <span>Mock Exam</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className={`flex-1 p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
