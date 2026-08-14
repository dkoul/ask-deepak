import React from 'react';
import { resume } from '../data/resume';
import { BentoCard } from './BentoCard';
import { ChatInterface } from './ChatInterface';

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col justify-between h-full min-h-[100px]">
    <span className="text-3xl md:text-4xl font-bold tracking-tight text-white">{value}</span>
    <span className="text-xs text-zinc-500 font-medium mt-2">{label}</span>
  </div>
);

export const BentoGrid: React.FC = () => {
  const latestRole = resume.experience[0];
  const featuredAchievements = resume.achievements.slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
      {/* Profile — hero tile */}
      <BentoCard
        variant="gradient"
        className="sm:col-span-2 lg:row-span-2 min-h-[280px] flex flex-col"
      >
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-orange-400/20 rounded-2xl blur-xl" />
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-2 ring-white/10">
              <img
                src="/deepak.jpg"
                alt={resume.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://ui-avatars.com/api/?name=DK&background=1a1a1e&color=f97316&size=256&font-size=0.4';
                }}
              />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-300/80">
              Resume · Portfolio
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              {resume.name}
            </h1>
            <p className="text-sm text-zinc-300 font-medium">{resume.title}</p>
            <p className="text-xs text-zinc-500">Red Hat · {resume.location}</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-zinc-400 leading-relaxed line-clamp-3">
          {resume.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={resume.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold rounded-full bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={resume.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold rounded-full bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${resume.email}`}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Email
          </a>
        </div>
      </BentoCard>

      {/* Stats row */}
      <BentoCard variant="accent" className="min-h-[120px]">
        <StatCard value="19+" label="Years in software" />
      </BentoCard>
      <BentoCard className="min-h-[120px]">
        <StatCard value="6" label="Roles · Red Hat & PTC" />
      </BentoCard>

      {/* Current role highlight */}
      <BentoCard variant="accent" className="sm:col-span-2 min-h-[140px]">
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
            Current role
          </span>
          <h3 className="text-lg font-bold text-white leading-snug">{latestRole.title}</h3>
          <p className="text-sm text-zinc-400">
            {latestRole.company} · {latestRole.period}
          </p>
          <p className="text-xs text-zinc-500 line-clamp-2">{latestRole.highlights[0]}</p>
        </div>
      </BentoCard>

      {/* Chat — large tile */}
      <BentoCard variant="chat" noPadding className="sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[480px] flex flex-col">
        <ChatInterface embedded />
      </BentoCard>

      {/* Skills */}
      <BentoCard label="Skills" className="sm:col-span-2 min-h-[200px]">
        <div className="mt-6 flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.06] hover:border-violet-500/30 hover:text-white transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </BentoCard>

      {/* Community */}
      <BentoCard variant="muted" className="min-h-[160px]">
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Community
          </span>
          <p className="text-sm font-bold text-white">{resume.community[0].organization}</p>
          <p className="text-xs text-zinc-400 leading-relaxed">{resume.community[0].description}</p>
        </div>
      </BentoCard>

      {/* Speaking */}
      <BentoCard className="min-h-[160px]">
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Speaking
          </span>
          <p className="text-2xl font-bold text-white">14+ yrs</p>
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
            {resume.speaking[0]}
          </p>
        </div>
      </BentoCard>

      {/* Experience timeline */}
      <BentoCard label="Experience" className="lg:col-span-2 min-h-[320px]">
        <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto chat-scroll pr-1">
          {resume.experience.map((job, i) => (
            <div
              key={`${job.company}-${job.period}`}
              className="flex gap-4 pb-4 border-b border-white/[0.04] last:border-0 last:pb-0"
            >
              <div
                className={`shrink-0 w-2 h-2 rounded-full mt-2 ${
                  i === 0 ? 'bg-violet-400' : 'bg-zinc-600'
                }`}
              />
              <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                <p className="text-xs text-violet-300/80">
                  {job.company} · {job.period}
                </p>
                <p className="text-xs text-zinc-500 line-clamp-2">{job.highlights[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Education */}
      <BentoCard variant="muted" className="min-h-[120px]">
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Education
          </span>
          <p className="text-sm font-semibold text-white">{resume.education[0]}</p>
        </div>
      </BentoCard>

      {/* Achievement bento tiles */}
      {featuredAchievements.map((item, i) => (
        <BentoCard
          key={item.title}
          variant={i === 0 ? 'gradient' : 'default'}
          className="min-h-[140px]"
        >
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{item.description}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300"
              >
                View →
              </a>
            )}
          </div>
        </BentoCard>
      ))}

      {/* Certifications strip */}
      <BentoCard className="lg:col-span-2 min-h-[100px]">
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Certifications
          </span>
          <div className="flex flex-wrap gap-2">
            {resume.certifications.slice(0, 5).map((cert) => (
              <span
                key={cert}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-400 border border-white/[0.04]"
              >
                {cert.split('—')[0].trim()}
              </span>
            ))}
            {resume.certifications.length > 5 && (
              <span className="text-[10px] text-zinc-500 px-2 py-1">
                +{resume.certifications.length - 5} more
              </span>
            )}
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
