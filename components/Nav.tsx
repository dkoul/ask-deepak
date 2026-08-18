import type { Section } from '../lib/sections';

const LINKS: { id: Section; label: string }[] = [
  { id: 'home', label: 'Overview' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Work' },
  { id: 'chat', label: 'Ask Bubbly' },
];

export function Nav({
  active,
  onSelect,
  theme,
  onToggleTheme,
}: {
  active: Section;
  onSelect: (section: Section) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}) {
  return (
    <nav className="news-nav" aria-label="Main navigation">
      <button className="news-nav-logo" type="button" onClick={() => onSelect('home')}>
        ask<em>.deepak</em>
      </button>
      <div className="news-nav-center">
        <ul className="news-nav-links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className={active === l.id ? 'active' : ''}
                onClick={() => onSelect(l.id)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="news-nav-right">
        <button
          className="theme-toggle-btn"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-label="Toggle theme"
          onClick={onToggleTheme}
        >
          {theme === 'light' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
        <button className="news-nav-cta" type="button" onClick={() => onSelect('chat')}>
          Ask Bubbly →
        </button>
      </div>
    </nav>
  );
}
