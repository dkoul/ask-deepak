import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { resume } from '../data/resume';
import { ThemeToggle } from './ThemeToggle';

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
  { key: 'chat', label: 'Bubbly', section: 'Assistant', icon: 'chat' },
];

function Icon({ kind }: { kind: string }) {
  const p: Record<string, ReactNode> = {
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
    chat: (
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    ),
    analytics: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  };
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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
    <aside className="flex w-full shrink-0 flex-col p-3 lg:w-[220px] lg:overflow-y-auto">
      <div className="mb-3 flex items-center gap-1">
        <a
          href={resume.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-control px-1.5 py-1.5 transition-colors hover:bg-hover"
        >
          <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full bg-ink ring-1 ring-line">
            {photoError ? (
              <span className="flex size-full items-center justify-center text-[11px] font-semibold text-surface">
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
            <span className="block truncate text-[13px] font-medium tracking-[-0.01em] text-ink">
              {resume.name}
            </span>
            <span className="block truncate text-[11px] text-ink-3">Engineering leader</span>
          </span>
        </a>
        <ThemeToggle className="shrink-0" />
      </div>

      <div
        ref={navRef}
        onMouseLeave={() => setHovered(null)}
        className="relative flex flex-1 flex-col gap-3"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 rounded-[8px] bg-hover"
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
            <div className="px-2.5 pb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
              {section}
            </div>
            <div className="flex flex-col gap-0.5">
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
                    className="relative z-10 flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-left transition-transform duration-150 active:scale-[0.98]"
                  >
                    <span className={isActive ? 'text-ink' : 'text-ink-3'}>
                      <Icon kind={item.icon} />
                    </span>
                    <span
                      className={`truncate text-[13px] ${
                        isActive ? 'font-medium text-ink' : 'text-ink-2'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.key === 'chat' && (
                      <span className="ml-auto size-1.5 rounded-full bg-accent" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3 border-t border-line px-2.5 pt-3">
        <a
          href={resume.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-ink-3 transition-colors hover:text-ink"
        >
          LinkedIn
        </a>
        <a
          href={resume.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-ink-3 transition-colors hover:text-ink"
        >
          GitHub
        </a>
        <a
          href={`mailto:${resume.email}`}
          className="text-[11px] text-ink-3 transition-colors hover:text-ink"
        >
          Email
        </a>
      </div>
    </aside>
  );
}
