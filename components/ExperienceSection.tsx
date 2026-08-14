import React from 'react';
import { resume } from '../data/resume';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
        Experience
      </h2>
      <div className="space-y-6">
        {resume.experience.map((job, index) => (
          <article
            key={`${job.company}-${job.period}`}
            className="relative pl-6 border-l border-slate-800"
          >
            <div
              className={`absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-[5px] ${
                index === 0 ? 'bg-accent' : 'bg-slate-600'
              }`}
            />
            <div className="space-y-1">
              <h3 className="text-white font-display text-lg">{job.title}</h3>
              <p className="text-accent text-sm font-mono">
                {job.company} · {job.period}
              </p>
              <p className="text-slate-500 text-xs font-mono">{job.location}</p>
            </div>
            <ul className="mt-3 space-y-1.5">
              {job.highlights.map((highlight) => (
                <li key={highlight} className="text-slate-400 text-sm leading-relaxed">
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
