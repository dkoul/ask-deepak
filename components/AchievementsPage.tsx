import { resume } from '../data/resume';
import type { Section } from '../lib/sections';

export function AchievementsPage({ onSelect }: { onSelect: (section: Section) => void }) {
  return (
    <>
      <div className="page-hero">
        <button className="back-link" type="button" onClick={() => onSelect('home')}>
          ← Overview
        </button>
        <h1>
          Public <em>work.</em>
        </h1>
        <p>Talks, packages, books, community. Same facts Bubbly is allowed to use.</p>
      </div>
      <div className="feed-grid">
        {resume.achievements.map((a) => (
          <article className="feed-cell" key={a.title} style={{ cursor: 'default' }}>
            <div className="feed-top">
              <div className="feed-dept">
                <div className="feed-avatar">
                  {a.title
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </div>
                <div>
                  <div className="feed-dept-name">{a.title}</div>
                  <div className="feed-city">{resume.location}</div>
                </div>
              </div>
            </div>
            <p className="feed-note">{a.description}</p>
            {a.link && (
              <a href={a.link} target="_blank" rel="noreferrer" className="feed-meta">
                Source →
              </a>
            )}
          </article>
        ))}
      </div>
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-h2">
            Community <em>& speaking.</em>
          </h2>
          <p className="sec-desc">{resume.community[0]?.description}</p>
        </div>
        <div className="steps">
          {resume.community.map((c) => (
            <div className="step" key={c.organization}>
              <div className="step-n">{c.role}</div>
              <h3>{c.organization}</h3>
              <p>{c.description}</p>
            </div>
          ))}
          {resume.speaking.slice(0, 2).map((s, i) => (
            <div className="step" key={s}>
              <div className="step-n">0{i + 2}</div>
              <h3>Speaking</h3>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="cta-band" style={{ marginBottom: 48 }}>
        <div className="cta-card">
          <div>
            <h3 className="cta-title">Invite a talk or a workshop</h3>
            <p className="cta-text">Share topic, date, and format with Bubbly, then follow up on LinkedIn.</p>
          </div>
          <button className="cta-btn" type="button" onClick={() => onSelect('chat')}>
            Ask Bubbly →
          </button>
        </div>
      </div>
    </>
  );
}
