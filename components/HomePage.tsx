import { useEffect, useMemo, useState } from 'react';
import { resume } from '../data/resume';
import type { Section } from '../lib/sections';

const FAQS = [
  {
    q: 'How do I get mentorship from Deepak?',
    a: `Reach him on LinkedIn (${resume.links.linkedin}) or email (${resume.email}) with what you want to learn. He mentors through Pune AI Collective and engineering leadership conversations.`,
  },
  {
    q: 'Is he open to senior engineering leadership roles?',
    a: 'Yes. Paste a job description into Bubbly, or send the JD URL. He is a Senior Engineering Manager with 19+ years in software, including 12+ at Red Hat.',
  },
  {
    q: 'Can I invite him to speak?',
    a: 'He has spoken internationally for 14+ years — Devconf, FOSSASIA, SeleniumConf, ATAGTR, MCP Dev Summit. Share topic, date, and format, then reach him on LinkedIn or email.',
  },
];

export function HomePage({ onSelect }: { onSelect: (section: Section) => void }) {
  const [loaderOut, setLoaderOut] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ledgerSort, setLedgerSort] = useState<'recent' | 'company'>('recent');

  useEffect(() => {
    const a = setTimeout(() => setLoaderOut(true), 900);
    const b = setTimeout(() => setLoaderGone(true), 1400);
    const c = setTimeout(() => setRevealed(true), 500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, []);

  const latest = resume.experience[0];
  const maxSkill = resume.skills.length;
  const skillBars = resume.skills.slice(0, 5);
  const ledger = useMemo(() => {
    const rows = [...resume.experience];
    if (ledgerSort === 'company') {
      rows.sort((a, b) => a.company.localeCompare(b.company) || a.period.localeCompare(b.period));
    }
    return rows;
  }, [ledgerSort]);

  const quotes = resume.experience
    .flatMap((job) => job.highlights.slice(0, 1).map((h) => ({ job, note: h })))
    .slice(0, 3);

  const ticker = [
    ...resume.speaking.slice(0, 3),
    ...resume.achievements.slice(0, 4).map((a) => a.title),
  ];

  return (
    <>
      {!loaderGone && (
        <div className={`home-loader${loaderOut ? ' out' : ''}`} role="status" aria-label="Loading ask.deepak">
          <div>
            <div className="home-loader-word">
              ask<em>.deepak</em>
            </div>
            <div className="home-loader-bar" aria-hidden>
              <span />
            </div>
          </div>
        </div>
      )}

      <section className="np-hero">
        <div className="np-kicker">
          <div className="np-live-dot" />
          Live · {resume.title} · {resume.location}
        </div>
        <h1 className="np-h1">
          Name the <Redact on={revealed}>role</Redact>.
          <br />
          Name the <Redact on={revealed}>stack</Redact>.
          <br />
          Name the <Redact on={revealed}>fit</Redact>.
        </h1>
        <p className="np-sub">{resume.summary}</p>
        <div className="np-btns">
          <button className="np-btn-fill" type="button" onClick={() => onSelect('chat')}>
            Ask Bubbly →
          </button>
          <button className="np-btn-ghost" type="button" onClick={() => onSelect('experience')}>
            Browse experience
          </button>
        </div>
        <div className="hero-panel">
          <div className="h-col">
            <div className="h-col-label">Current role</div>
            <div className="h-amount">
              <span className="h-amount-hi">{latest.company}</span>
            </div>
            <div className="h-dept">{latest.title}</div>
            <div className="h-date">
              {latest.period} · {latest.location}
            </div>
            <p className="h-quote">“{trim(latest.highlights[0], 140)}”</p>
          </div>
          <div className="h-rule" />
          <div className="h-col">
            <div className="h-col-label">Years on the record</div>
            <div className="h-big-num">19+</div>
            <div className="h-big-label">across India & global teams</div>
            <div className="h-mini-stats">
              <div>
                <div className="h-mini-stat-num">{resume.experience.length}</div>
                <div className="h-mini-stat-label">roles listed</div>
              </div>
              <div>
                <div className="h-mini-stat-num">14</div>
                <div className="h-mini-stat-label">years speaking</div>
              </div>
            </div>
          </div>
          <div className="h-rule" />
          <div className="h-col">
            <div className="h-col-label">Top skills</div>
            <div className="bar-row">
              {skillBars.map((s, i) => (
                <div className="bar-item" key={s}>
                  <div className="bar-name">{s.split(' ')[0]}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${((maxSkill - i) / maxSkill) * 100}%` }} />
                  </div>
                  <div className="bar-pct">{String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band">
        <div className="cta-card">
          <div>
            <h3 className="cta-title">Hiring a senior engineering leader?</h3>
            <p className="cta-text">Paste a JD into Bubbly, or reach Deepak on LinkedIn. Mentorship and speaking invites welcome.</p>
          </div>
          <button className="cta-btn" type="button" onClick={() => onSelect('chat')}>
            Ask Bubbly →
          </button>
        </div>
      </div>

      <section className="sec" style={{ paddingBottom: 0, borderTop: 'none' }}>
        <div
          className="sec-head"
          style={{ borderBottom: '1px solid var(--ink)', paddingBottom: 24, marginBottom: 0 }}
        >
          <div>
            <h2 className="sec-h2">
              Live <em>record.</em>
            </h2>
          </div>
          <p className="sec-desc">Roles, talks, and public work. Every line is from the CV — no invented employers or dates.</p>
        </div>
      </section>

      <div className="live-ticker-bar">
        <span className="live-dot" />
        <div className="ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={`${t}-${i}`}>{t}</span>
          ))}
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-h2">
            CAREER <em>LEDGER</em>
          </h2>
          <p className="sec-desc">Click a role to open the full experience page. 12+ years at Red Hat, plus PTC before that.</p>
        </div>
        <div>
          <h3 className="ledger-head">Role registry</h3>
          <div className="ledger-sub">Active record · updated {resume.cvLastUpdated}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="ledger-sub" style={{ margin: 0 }}>
              Sort:
            </span>
            {(
              [
                ['recent', 'Most recent'],
                ['company', 'By company'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                className={`filter-pill${ledgerSort === k ? ' active' : ''}`}
                onClick={() => setLedgerSort(k)}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            {ledger.map((job, i) => (
              <button
                key={`${job.company}-${job.period}`}
                type="button"
                className="ledger-row"
                onClick={() => onSelect('experience')}
              >
                <div className="ledger-name">
                  <span className="ledger-idx">{String(i + 1).padStart(2, '0')}.</span>
                  {job.title}
                </div>
                <div className="ledger-meta">
                  <span>{job.company.toUpperCase()}</span>
                  <span>
                    <b>{job.period}</b>
                  </span>
                  <span>{job.location.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="feed-count">{resume.achievements.length} public notes on the record</div>
      <div className="feed-grid">
        {resume.achievements.map((a) => (
          <article className="feed-cell" key={a.title}>
            <div className="feed-top">
              <div className="feed-dept">
                <div className="feed-avatar">{initials(a.title)}</div>
                <div>
                  <div className="feed-dept-name">{a.title}</div>
                  <div className="feed-city">{resume.location}</div>
                </div>
              </div>
            </div>
            <p className="feed-note">“{trim(a.description, 160)}”</p>
            {a.link && (
              <div className="feed-meta">
                <a href={a.link} target="_blank" rel="noreferrer">
                  Source →
                </a>
              </div>
            )}
          </article>
        ))}
        <div className="feed-cell" style={{ cursor: 'default' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Have a role in mind?</h3>
          <p style={{ fontSize: 13, color: 'var(--mid)', marginBottom: 16 }}>
            Ask Bubbly about hiring fit, mentorship, or a speaking invite. No account needed.
          </p>
          <button className="np-btn-fill" type="button" onClick={() => onSelect('chat')}>
            Ask anonymously →
          </button>
        </div>
      </div>

      <section className="sec how-it-works-sec" style={{ paddingBottom: 0 }}>
        <div className="sec-head">
          <h2 className="sec-h2">
            How to reach him. <em>Three doors.</em>
          </h2>
          <p className="sec-desc">No pitch deck required. Ask Bubbly, or go straight to LinkedIn and email.</p>
        </div>
      </section>
      <div className="steps">
        <div className="step">
          <div className="step-n">01</div>
          <h3>Hire</h3>
          <p>Paste a job description into Bubbly. He will map fit from the CV only — no invented employers, dates, or skills.</p>
        </div>
        <div className="step">
          <div className="step-n">02</div>
          <h3>Mentor</h3>
          <p>Founder of Pune AI Collective. Send what you want to learn; he takes it from LinkedIn or email.</p>
        </div>
        <div className="step">
          <div className="step-n">03</div>
          <h3>Speak</h3>
          <p>14+ years of talks, keynotes, and workshops. Share topic, date, and format.</p>
        </div>
      </div>
      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-n">01</div>
          <div className="stat-big">19+</div>
          <div className="stat-label">Years in software</div>
          <p className="stat-copy">India-based teams delivering to global enterprises. PTC, then 12+ years at Red Hat.</p>
        </div>
        <div className="stat-block">
          <div className="stat-n">02</div>
          <div className="stat-big">12+</div>
          <div className="stat-label">Years at Red Hat</div>
          <p className="stat-copy">IC to senior management. Engineering and quality teams, AI-native SDLC, partner platforms.</p>
        </div>
        <div className="stat-block">
          <div className="stat-n">03</div>
          <div className="stat-big">14</div>
          <div className="stat-label">Years speaking</div>
          <p className="stat-copy">Devconf, FOSSASIA, SeleniumConf, ATAGTR, MCP Dev Summit, and more.</p>
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-h2">
            Real lines from <em>the CV.</em>
          </h2>
          <p className="sec-desc">Direct highlights. No names invented. Ever.</p>
        </div>
        <div className="quotes-grid">
          {quotes.map(({ job, note }) => (
            <button
              key={job.period + note.slice(0, 12)}
              type="button"
              className="quote-card"
              onClick={() => onSelect('experience')}
              style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
            >
              <div className="t-quote-mark">“</div>
              <p>{trim(note, 180)}</p>
              <small>
                {job.company} · {job.title}
              </small>
            </button>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <h2 className="sec-h2" style={{ marginBottom: 8 }}>
          Questions.
        </h2>
        {FAQS.map((f, i) => (
          <div key={f.q} className={`faq-item${openFaq === i ? ' open' : ''}`}>
            <button className="faq-q" type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q}
              <svg className="faq-chevron" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {openFaq === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </section>

      <section className="close-cta">
        <h2>
          Every question chips
          <br />
          away at the guesswork.
        </h2>
        <p>Takes 60 seconds. Stays on-topic. Matters if you are hiring, learning, or booking a talk.</p>
        <button className="np-btn-fill" type="button" onClick={() => onSelect('chat')}>
          Ask Bubbly →
        </button>
      </section>

      <div className="cta-band" style={{ marginBottom: 48 }}>
        <div className="cta-card">
          <div>
            <h3 className="cta-title">Keep the record public</h3>
            <p className="cta-text">
              No ads. CV last updated {resume.cvLastUpdated}. Full source:{' '}
              <a href={resume.cvUrl} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>
                puneaicollective.org
              </a>
            </p>
          </div>
          <a className="cta-btn" href={resume.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn →
          </a>
        </div>
      </div>
    </>
  );
}

function Redact({ children, on }: { children: React.ReactNode; on: boolean }) {
  return <span className={`np-redact${on ? ' np-revealed' : ''}`}>{children}</span>;
}

function trim(s: string, n: number) {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
