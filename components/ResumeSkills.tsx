import { resume } from '../data/resume';

export function ResumeSkills() {
  return (
    <div className="rounded-card bg-surface p-5 shadow-card">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-3 mb-4">
        Core competencies
      </p>
      <div className="flex flex-wrap gap-2">
        {resume.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-chip border border-line bg-inset px-2.5 py-1 text-[12px] text-ink-2"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {resume.coreCompetencies.map((group) => (
          <div key={group.category}>
            <p className="text-[11px] font-medium text-ink mb-2">{group.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-chip bg-field px-2 py-0.5 text-[11px] text-ink-3"
                >
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
