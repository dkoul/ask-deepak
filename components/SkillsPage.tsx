import { resume } from '../data/resume';
import type { Section } from '../lib/sections';

export function SkillsPage({ onSelect }: { onSelect: (section: Section) => void }) {
  return (
    <>
      <div className="page-hero">
        <button className="back-link" type="button" onClick={() => onSelect('home')}>
          ← Overview
        </button>
        <h1>
          Skills. <em>Indexed.</em>
        </h1>
        <p>Core competencies and technical proficiency from the public CV.</p>
      </div>
      <div className="dept-grid">
        {resume.coreCompetencies.map((g) => (
          <div className="dept-card" key={g.category}>
            <div className="dept-card-top">
              <div className="dept-init">{g.category.slice(0, 2).toUpperCase()}</div>
              <div className="dept-count">{g.items.length}</div>
            </div>
            <h3>{g.category}</h3>
            {g.items.map((item) => (
              <div key={item} className="muted" style={{ marginTop: 6 }}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-h2">
            Technical <em>proficiency.</em>
          </h2>
          <p className="sec-desc">Languages, automation, AI, DevOps, platforms.</p>
        </div>
        <div className="dept-grid">
          {resume.technicalProficiency.map((g) => (
            <div className="dept-card" key={g.category}>
              <div className="dept-card-top">
                <div className="dept-init">{g.category.slice(0, 2).toUpperCase()}</div>
                <div className="dept-count">{g.items.length}</div>
              </div>
              <h3>{g.category}</h3>
              <div className="muted">{g.items.join(' · ')}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
