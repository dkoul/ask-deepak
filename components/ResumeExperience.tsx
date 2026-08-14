import { resume } from '../data/resume';

export function ResumeExperience() {
  return (
    <div className="rounded-card bg-surface shadow-card overflow-hidden">
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-[13px] font-medium text-ink">Professional experience</h2>
        <p className="text-[11px] text-ink-3 mt-0.5">{resume.experience.length} roles · 19+ years</p>
      </div>
      <div className="divide-y divide-line max-h-[520px] overflow-y-auto">
        {resume.experience.map((job, i) => (
          <article key={`${job.company}-${job.period}`} className="px-4 py-4 hover:bg-hover/50 transition-colors">
            <div className="flex items-start gap-3">
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${i === 0 ? 'bg-accent' : 'bg-line-strong'}`}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-medium text-ink">{job.title}</h3>
                <p className="text-[12px] text-accent-ink mt-0.5">
                  {job.company} · {job.period}
                </p>
                <p className="text-[11px] text-ink-3">{job.location}</p>
                <ul className="mt-2 space-y-1">
                  {job.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-[12px] leading-relaxed text-ink-2">{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
