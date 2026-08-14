import React from 'react';
import { Hero } from './components/Hero';
import { SkillTags } from './components/SkillTags';
import { ExperienceSection } from './components/ExperienceSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-surface text-slate-200 selection:bg-accent selection:text-surface overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.08),_transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_80%_80%,_rgba(56,189,248,0.06),_transparent_50%)]" />

      <header className="relative z-10 border-b border-slate-800/80 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-white text-lg tracking-wide">dkoul</span>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.15em]">
            Resume · Chat
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="space-y-10">
            <Hero />
            <SkillTags />
            <ExperienceSection />
            <AchievementsSection />
          </div>

          <div className="lg:sticky lg:top-8">
            <ChatInterface />
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-slate-600 text-xs font-mono">
          © {new Date().getFullYear()} Deepak Koul · Built with React
        </div>
      </footer>
    </div>
  );
};

export default App;
