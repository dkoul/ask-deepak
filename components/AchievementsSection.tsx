import React from 'react';
import { resume } from '../data/resume';

export const AchievementsSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
        Key Achievements
      </h2>
      <div className="space-y-4">
        {resume.achievements.map((item) => (
          <article
            key={item.title}
            className="border border-slate-800 bg-surface-elevated/50 px-4 py-3"
          >
            <h3 className="text-white font-display text-sm md:text-base">{item.title}</h3>
            <p className="mt-1.5 text-slate-400 text-sm leading-relaxed">{item.description}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-mono text-accent hover:underline"
              >
                View link →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
