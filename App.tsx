import React, { useState } from 'react';
import { ResumeSidebar, type ResumeSection } from './components/ResumeSidebar';
import { ResumeChat } from './components/ResumeChat';
import { ResumeOverview } from './components/ResumeOverview';
import { ResumeExperience } from './components/ResumeExperience';
import { ResumeSkills } from './components/ResumeSkills';
import { ResumeAchievements } from './components/ResumeAchievements';

const App: React.FC = () => {
  const [section, setSection] = useState<ResumeSection>('overview');
  const chatFocused = section === 'chat';

  const mainContent = () => {
    switch (section) {
      case 'overview':
        return <ResumeOverview onAskBubbly={() => setSection('chat')} />;
      case 'experience':
        return <ResumeExperience />;
      case 'skills':
        return <ResumeSkills />;
      case 'achievements':
        return <ResumeAchievements />;
      case 'chat':
        return null;
      default:
        return <ResumeOverview onAskBubbly={() => setSection('chat')} />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-page text-ink font-sans antialiased">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 p-3 sm:p-4 lg:h-[100dvh] lg:flex-row lg:gap-0 lg:overflow-hidden lg:p-5">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-surface shadow-raised lg:flex-row">
          <ResumeSidebar active={section} onSelect={setSection} />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
            {!chatFocused && (
              <main className="min-w-0 flex-1 overflow-y-auto border-t border-line p-4 sm:p-5 lg:border-t-0 lg:border-l lg:border-line">
                {mainContent()}
              </main>
            )}

            <aside
              className={`flex min-h-0 shrink-0 flex-col border-t border-line lg:border-t-0 lg:border-l lg:border-line ${
                chatFocused
                  ? 'h-[min(84dvh,760px)] w-full lg:h-auto lg:flex-1'
                  : 'h-[min(62dvh,520px)] w-full lg:h-auto lg:w-[380px]'
              }`}
            >
              <ResumeChat
                className="h-full min-h-0"
                focused={chatFocused}
                onBack={() => setSection('overview')}
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
