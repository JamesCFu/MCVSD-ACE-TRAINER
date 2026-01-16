import React, { useEffect, useRef, useState } from 'react';

interface LayoutProps {
  children: React.RootNode;
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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-full md:w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0'} bg-indigo-950 text-white flex flex-col sticky top-0 h-screen shadow-2xl z-20 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl shadow-lg">🚀</div>
              <h1 className="text-xl font-black tracking-tighter">Academic <span className="text-indigo-400">Trainer</span></h1>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
            {/* Dashboard */}
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'dashboard' ? 'bg-indigo-600 font-bold shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}
            >
              <span>Dashboard</span>
            </button>

            {/* Mistake Log */}
            <button 
              onClick={() => setActiveView('mistakes')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center justify-between ${activeView === 'mistakes' ? 'bg-rose-600 font-bold' : 'hover:bg-white/5 text-indigo-200'}`}
            >
              <span>Mistake Log</span>
              {mistakeCount > 0 && <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-black">{mistakeCount}</span>}
            </button>

            <div className="pt-6 pb-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest px-4">Study Tools</div>
            
            {/* Learning Center (Fixed name) */}
            <button 
              onClick={() => setActiveView('learning')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'learning' ? 'bg-indigo-600 font-bold shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}
            >
              <span>Learning Center</span>
            </button>

            {/* Daily Vocab (Fixed ID: 'daily') */}
            <button
              onClick={() => setActiveView('daily')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'daily' ? 'bg-indigo-600 font-bold shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}
            >
              <span>Daily Vocab</span>
            </button>

            {/* Quick Guides */}
            <button 
              onClick={() => setActiveView('notes')}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-3 ${activeView === 'notes' ? 'bg-indigo-600 font-bold shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}
            >
              <span>Quick Guides</span>
            </button>

            <div className="pt-6 pb-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest px-4">Exam Prep</div>
            
            {['Reading', 'Vocab', 'Spelling', 'Grammar', 'Math'].map(prep => (
              <button 
                key={prep}
                onClick={() => setActiveView(prep.toLowerCase())} 
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${activeView === prep.toLowerCase() ? 'bg-indigo-600 font-bold' : 'hover:bg-white/5 text-indigo-200'}`}
              >
                {prep} Lab
              </button>
            ))}

            <div className="pt-8 pb-4">
              <button onClick={() => setActiveView('mock')} className={`w-full text-left px-5 py-4 rounded-[1.5rem] transition-all flex items-center space-x-3 mb-1 shadow-xl ${activeView === 'mock' ? 'bg-emerald-600 font-black text-white' : 'bg-indigo-900 text-emerald-300 font-black uppercase text-xs tracking-widest'}`}>
                <span>Mock Simulator</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main ref={mainContentRef} className="flex-1 p-4 md:p-12 bg-slate-50 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
