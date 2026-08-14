import { resume } from '../data/resume';

export function ResumeOverview({ onAskBubbly }: { onAskBubbly?: () => void }) {
  const stats = [
    { label: 'Years', value: '19+' },
    { label: 'Roles', value: '6' },
    { label: 'Speaking', value: '14 yrs' },
  ];

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
            Overview
          </p>
          <button
            type="button"
            onClick={onAskBubbly}
            className="text-[12px] font-medium text-accent-ink transition-opacity hover:opacity-80"
          >
            Ask Bubbly →
          </button>
        </div>
        <p className="text-[15px] leading-[1.65] tracking-[-0.01em] text-ink">
          {resume.summary}
        </p>
        <p className="text-[12px] text-ink-3">
          {resume.location}
          <span className="mx-1.5 text-line-strong">·</span>
          Red Hat
          <span className="mx-1.5 text-line-strong">·</span>
          Updated {resume.cvLastUpdated}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] bg-line">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface px-3 py-4 sm:px-4">
            <p className="text-[22px] font-semibold tracking-[-0.03em] tabular-nums text-ink">
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-ink-3">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5">
        <a
          href={resume.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-ink transition-colors hover:text-accent-ink"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${resume.email}`}
          className="text-[13px] font-medium text-ink transition-colors hover:text-accent-ink"
        >
          Email
        </a>
        <a
          href={resume.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-ink transition-colors hover:text-accent-ink"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
