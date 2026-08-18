import { resume } from '../data/resume';
import type { Section } from '../lib/sections';

export function ExperiencePage({ onSelect }: { onSelect: (section: Section) => void }) {
  return (
    <>
      <div className="page-hero">
        <button className="back-link" type="button" onClick={() => onSelect('home')}>
          ← Overview
        </button>
        <h1>
          Experience. <em>On the record.</em>
        </h1>
        <p>
          {resume.experience.length} roles. 12+ years at Red Hat. PTC before that. No invented employers or
          dates.
        </p>
      </div>
      {resume.experience.map((job) => (
        <article key={`${job.company}-${job.period}`} className="detail" style={{ paddingBottom: 40 }}>
          <div className="detail-kicker">
            {job.period} · {job.location}
          </div>
          <h1 style={{ fontSize: 32 }}>{job.title}</h1>
          <div className="detail-amt">{job.company}</div>
          <ul className="prose" style={{ padding: 0, maxWidth: 'none' }}>
            {job.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </article>
      ))}
    </>
  );
}
