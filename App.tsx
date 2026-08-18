import React, { useState } from 'react';
import { AchievementsPage } from './components/AchievementsPage';
import { BottomTabs } from './components/BottomTabs';
import { ExperiencePage } from './components/ExperiencePage';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { Nav } from './components/Nav';
import { ResumeChat } from './components/ResumeChat';
import { SkillsPage } from './components/SkillsPage';
import { SupportBanner } from './components/SupportBanner';
import { useTheme } from './hooks/useTheme';
import type { Section } from './lib/sections';

const App: React.FC = () => {
  const [section, setSection] = useState<Section>('home');
  const { theme, toggleTheme } = useTheme();

  const go = (next: Section) => {
    setSection(next);
    window.scrollTo(0, 0);
  };

  return (
    <div className="page-wrap">
      <Nav active={section} onSelect={go} theme={theme} onToggleTheme={toggleTheme} />
      <SupportBanner onAsk={() => go('chat')} />
      <main className="main-content">
        <div className="page-container">
          {section === 'home' && <HomePage onSelect={go} />}
          {section === 'experience' && <ExperiencePage onSelect={go} />}
          {section === 'skills' && <SkillsPage onSelect={go} />}
          {section === 'achievements' && <AchievementsPage onSelect={go} />}
          {section === 'chat' && <ResumeChat focused onBack={() => go('home')} />}
        </div>
      </main>
      {section !== 'chat' && <Footer onSelect={go} />}
      <BottomTabs active={section} onSelect={go} />
    </div>
  );
};

export default App;
