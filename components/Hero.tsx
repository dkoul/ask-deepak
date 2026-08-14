import React from 'react';
import { resume } from '../data/resume';

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-center space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-accent rounded-full blur-[24px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-[2px] bg-gradient-to-b from-accent to-accent/20">
          <div className="w-full h-full rounded-full overflow-hidden bg-surface">
            <img
              src="/deepak.jpg"
              alt={resume.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.src =
                  'https://ui-avatars.com/api/?name=DK&background=1e293b&color=38bdf8&size=256&font-size=0.4';
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
          {resume.name}
        </h1>
        <p className="text-accent font-mono text-sm md:text-base tracking-wide">
          {resume.title} · Red Hat
        </p>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          {resume.location} · 19+ Years · Engineering Leadership · AI · Test Automation
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={resume.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 text-sm font-mono border border-slate-700 text-slate-300 hover:border-accent hover:text-accent transition-colors duration-300"
        >
          LinkedIn
        </a>
        <a
          href={resume.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 text-sm font-mono border border-slate-700 text-slate-300 hover:border-accent hover:text-accent transition-colors duration-300"
        >
          GitHub
        </a>
        <a
          href={`mailto:${resume.email}`}
          className="px-5 py-2 text-sm font-mono bg-accent text-surface font-semibold hover:bg-accent/90 transition-colors duration-300"
        >
          Email
        </a>
      </div>
    </section>
  );
};
