import { resume } from '../data/resume';

export function ResumeAchievements() {
  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-5 flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
          Achievements
        </p>
        <span className="text-[11px] text-ink-3">{resume.achievements.length}</span>
      </header>

      <div className="space-y-0">
        {resume.achievements.map((item) => (
          <article
            key={item.title}
            className="border-t border-line py-4 first:border-t-0 first:pt-0"
          >
            <h3 className="text-[13px] font-medium tracking-[-0.01em] text-ink">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
              {item.description}
            </p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[12px] font-medium text-accent-ink transition-opacity hover:opacity-80"
              >
                View →
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
