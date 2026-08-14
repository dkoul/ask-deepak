import React, { useState } from 'react';
import { ResumeSidebar, type ResumeSection } from './components/ResumeSidebar';
import { ResumeChat } from './components/ResumeChat';
import { ResumeOverview } from './components/ResumeOverview';
import { ResumeExperience } from './components/ResumeExperience';
import { ResumeSkills } from './components/ResumeSkills';
import { ResumeAchievements } from './components/ResumeAchievements';

const App: React.FC = () => {
  const [section, setSection] = useState<ResumeSection>('overview');

  const mainContent = () => {
    switch (section) {
      case 'overview':
        return <ResumeOverview />;
      case 'experience':
        return <ResumeExperience />;
      case 'skills':
        return <ResumeSkills />;
      case 'achievements':
        return <ResumeAchievements />;
      case 'chat':
        return null;
      default:
        return <ResumeOverview />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-page text-ink font-sans antialiased">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 lg:flex-row lg:p-6 lg:gap-5">
        <ResumeSidebar active={section} onSelect={setSection} />

        <div className="flex flex-1 min-w-0 gap-4 lg:gap-5">
          {section !== 'chat' && (
            <main className="flex-1 min-w-0 max-w-2xl">{mainContent()}</main>
          )}

          <aside
            className={`shrink-0 ${
              section === 'chat'
                ? 'w-full lg:max-w-xl lg:mx-auto'
                : 'hidden lg:block w-[min(100%,400px)]'
            }`}
          >
            <ResumeChat className={section === 'chat' ? 'min-h-[70vh]' : 'h-[min(70vh,640px)]'} />
          </aside>
        </div>
      </div>

      <footer className="py-6 text-center text-[11px] text-ink-3">
        Deepak Koul · UI from{' '}
        <a
          href="https://www.beautifului.dev/"
          className="text-accent-ink hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Beautiful UI
        </a>
      </footer>
    </div>
  );
};

export default App;
