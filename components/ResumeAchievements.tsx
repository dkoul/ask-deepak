import { resume } from '../data/resume';

export function ResumeAchievements() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[12px] font-medium text-ink-2">Key achievements</span>
        <span className="rounded-full bg-field px-2 py-0.5 text-[11px] font-medium text-ink-3">
          {resume.achievements.length}
        </span>
      </div>

      {resume.achievements.map((item) => (
        <div
          key={item.title}
          className="rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:bg-hover/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[13px] font-medium text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-2">{item.description}</p>
            </div>
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[12px] font-medium text-accent-ink hover:underline"
            >
              View link →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
