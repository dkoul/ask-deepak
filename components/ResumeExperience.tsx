import { resume } from '../data/resume';

export function ResumeExperience() {
  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
          Experience
        </p>
        <p className="mt-1 text-[12px] text-ink-3">
          {resume.experience.length} roles · 19+ years
        </p>
      </header>
      <div className="space-y-0">
        {resume.experience.map((job, i) => (
          <article
            key={`${job.company}-${job.period}`}
            className="border-t border-line py-4 first:border-t-0 first:pt-0"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                  i === 0 ? 'bg-accent' : 'bg-line-strong'
                }`}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-medium tracking-[-0.01em] text-ink">
                  {job.title}
                </h3>
                <p className="mt-0.5 text-[12px] text-ink-2">
                  {job.company}
                  <span className="mx-1.5 text-ink-3">·</span>
                  {job.period}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {job.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-[12.5px] leading-relaxed text-ink-2">
                      {h}
                    </li>
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
