import { resume } from '../data/resume';
import type { Section } from '../lib/sections';

export function Footer({ onSelect }: { onSelect: (section: Section) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <button className="foot-logo" type="button" onClick={() => onSelect('home')}>
          ask<em>.deepak</em>
        </button>
        <div className="foot-tagline">Built in public. Career data belongs on the record.</div>
      </div>
      <nav className="foot-links" aria-label="Footer navigation">
        <button type="button" onClick={() => onSelect('home')}>
          Overview
        </button>
        <button type="button" onClick={() => onSelect('experience')}>
          Experience
        </button>
        <button type="button" onClick={() => onSelect('skills')}>
          Skills
        </button>
        <button type="button" onClick={() => onSelect('achievements')}>
          Work
        </button>
        <button type="button" onClick={() => onSelect('chat')}>
          Ask Bubbly
        </button>
        <a href={resume.cvUrl} target="_blank" rel="noreferrer">
          CV
        </a>
        <RestoreBanner />
      </nav>
      <div className="foot-icons">
        <a href={resume.links.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a href={resume.links.github} aria-label="GitHub" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
          </svg>
        </a>
        <a href={`mailto:${resume.email}`} aria-label="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16v16H4z" />
            <path d="m4 4 8 8 8-8" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

function RestoreBanner() {
  return (
    <button
      type="button"
      className="support-restore"
      onClick={() => {
        localStorage.removeItem('supportBannerHidden');
        document.documentElement.removeAttribute('data-support-banner');
      }}
    >
      Show support bar
    </button>
  );
}
