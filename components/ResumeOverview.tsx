import { resume } from '../data/resume';

export function ResumeOverview() {
  const stats = [
    { label: 'Years in software', value: '19+' },
    { label: 'Roles', value: '6' },
    { label: 'Conference talks', value: '14+ yrs' },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-card bg-surface p-5 shadow-card">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-3">
          Executive summary
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{resume.summary}</p>
        <p className="mt-3 text-[12px] text-ink-3">
          {resume.location} · Red Hat · CV updated {resume.cvLastUpdated}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card bg-surface p-4 shadow-card">
            <p className="text-2xl font-semibold tabular-nums text-ink">{s.value}</p>
            <p className="mt-1 text-[12px] text-ink-3">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-card bg-surface p-5 shadow-card">
        <p className="text-[13px] font-medium text-ink">Want to connect?</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          Reach out for engineering leadership roles, speaking, or collaboration on AI and
          quality engineering.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={resume.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 rounded-control px-3 text-[12.5px] font-medium bg-accent text-white shadow-btn transition-transform active:scale-[0.96]"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${resume.email}`}
            className="h-7 rounded-control px-3 text-[12.5px] font-medium bg-surface text-ink shadow-btn hover:bg-hover transition-transform active:scale-[0.96]"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
