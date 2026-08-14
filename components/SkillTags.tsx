import React from 'react';
import { resume } from '../data/resume';

export const SkillTags: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
        Core Competencies
      </h2>
      <div className="flex flex-wrap gap-2">
        {resume.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 text-xs font-mono text-slate-300 bg-surface-elevated border border-slate-800 hover:border-accent/40 transition-colors duration-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
};
