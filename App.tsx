import React from 'react';
import { BentoGrid } from './components/BentoGrid';

const App: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-bento-bg text-zinc-200 selection:bg-violet-500/30 overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/6 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-rose-500/4 rounded-full blur-[80px]" />
      </div>

      <header className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <span className="text-lg font-bold text-white tracking-tight">dkoul</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Bento Resume
        </span>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <BentoGrid />
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-8 text-center text-zinc-600 text-xs">
        © {new Date().getFullYear()} Deepak Koul
      </footer>
    </div>
  );
};

export default App;
