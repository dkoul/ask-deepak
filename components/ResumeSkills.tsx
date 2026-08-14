import { resume } from '../data/resume';

export function ResumeSkills() {
  return (
    <div className="mx-auto max-w-xl space-y-7">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
          Skills
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {resume.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-field px-2.5 py-1 text-[12px] text-ink-2"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="space-y-5 border-t border-line pt-6">
        {resume.coreCompetencies.map((group) => (
          <div key={group.category}>
            <p className="mb-2 text-[12px] font-medium tracking-[-0.01em] text-ink">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {group.items.map((item, idx) => (
                <span key={item} className="text-[12px] text-ink-3">
                  {idx > 0 && <span className="mr-2 text-line-strong">·</span>}
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
