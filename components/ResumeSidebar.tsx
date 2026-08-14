import { useLayoutEffect, useRef, useState } from 'react';
import { resume } from '../data/resume';

export type ResumeSection = 'overview' | 'experience' | 'skills' | 'achievements' | 'chat';

const ITEMS: {
  key: ResumeSection;
  label: string;
  section: string;
  icon: string;
}[] = [
  { key: 'overview', label: 'Overview', section: 'Profile', icon: 'activity' },
  { key: 'experience', label: 'Experience', section: 'Profile', icon: 'tasks' },
  { key: 'skills', label: 'Skills', section: 'Profile', icon: 'analytics' },
  { key: 'achievements', label: 'Achievements', section: 'Profile', icon: 'spaces' },
  { key: 'chat', label: 'Ask Deepak', section: 'Assistant', icon: 'dashboard' },
];

function Icon({ kind }: { kind: string }) {
  const p: Record<string, React.ReactNode> = {
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    tasks: (
      <g>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </g>
    ),
    spaces: (
      <g>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </g>
    ),
    dashboard: (
      <g>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </g>
    ),
    analytics: (
      <g>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </g>
    ),
  };
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {p[kind]}
    </svg>
  );
}

interface ResumeSidebarProps {
  active: ResumeSection;
  onSelect: (section: ResumeSection) => void;
}

export function ResumeSidebar({ active, onSelect }: ResumeSidebarProps) {
  const [photoError, setPhotoError] = useState(false);
  const [hovered, setHovered] = useState<ResumeSection | null>(null);
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sections = ['Profile', 'Assistant'];

  useLayoutEffect(() => {
    const container = navRef.current;
    const target = itemRefs.current[hovered ?? active];
    if (!container || !target) return;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setBox({
      top: targetRect.top - containerRect.top,
      height: targetRect.height,
    });
  }, [hovered, active]);

  return (
    <aside className="w-full lg:w-60 shrink-0 rounded-card bg-surface p-2 shadow-raised">
      <a
        href={resume.links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 flex w-full items-center gap-2.5 rounded-control p-1.5 text-left transition-[background-color,transform] duration-100 hover:bg-hover active:scale-[0.96]"
      >
        <span className="relative flex size-8 shrink-0 overflow-hidden rounded-[8px] bg-ink">
          {photoError ? (
            <span className="flex size-full items-center justify-center text-[13px] font-semibold text-surface">
              DK
            </span>
          ) : (
            <img
              src="/deepak.jpg"
              alt={resume.name}
              className="size-full object-cover object-top"
              onError={() => setPhotoError(true)}
            />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium leading-tight text-ink">
            {resume.name}
          </span>
          <span className="block truncate text-[11px] leading-tight text-ink-3">
            {resume.title}
          </span>
        </span>
      </a>

      <button
        type="button"
        onClick={() => onSelect('chat')}
        className="mb-2 flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-[13px] font-medium text-accent transition-[background-color,transform] duration-100 hover:bg-accent-tint active:scale-[0.96]"
      >
        <span className="min-w-0 flex-1 truncate text-left">Ask about my work</span>
        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <div
        ref={navRef}
        onMouseLeave={() => setHovered(null)}
        className="relative flex flex-col gap-2"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 rounded-[7px] bg-hover"
          style={{
            top: box?.top ?? 0,
            height: box?.height ?? 0,
            opacity: box ? 1 : 0,
            transition:
              'top 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1), opacity 150ms ease',
          }}
        />
        {sections.map((section) => (
          <div key={section}>
            <div className="px-2 pb-1 pt-1 text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-3">
              {section}
            </div>
            <div className="flex flex-col gap-px">
              {ITEMS.filter((item) => item.section === section).map((item) => {
                const isActive = item.key === active;
                return (
                  <button
                    key={item.key}
                    ref={(el) => {
                      itemRefs.current[item.key] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setHovered(item.key)}
                    onFocus={() => setHovered(item.key)}
                    onBlur={() => setHovered(null)}
                    onClick={() => onSelect(item.key)}
                    aria-current={isActive ? 'page' : undefined}
                    className="group relative z-10 flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left transition-[color,transform] duration-150 active:scale-[0.96]"
                  >
                    <span className={isActive ? 'text-ink' : 'text-ink-3'}>
                      <Icon kind={item.icon} />
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-[13px] transition-colors duration-150 ${
                        isActive ? 'font-medium text-ink' : 'text-ink-2'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 px-1">
        <a
          href={resume.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-accent-ink hover:underline"
        >
          GitHub
        </a>
        <a
          href={`mailto:${resume.email}`}
          className="text-[11px] font-medium text-accent-ink hover:underline"
        >
          Email
        </a>
      </div>
    </aside>
  );
}
