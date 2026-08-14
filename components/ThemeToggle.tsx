import { useTheme } from '../hooks/useTheme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex size-7 items-center justify-center rounded-[8px] text-ink-3 transition-colors hover:bg-hover hover:text-ink ${className}`}
    >
      {isDark ? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 14.5A8.5 8.5 0 1 1 12.5 3 7 7 0 0 0 21 14.5z" />
        </svg>
      )}
      <span className="sr-only">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
