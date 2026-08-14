import { resume } from '../data/resume';

export type ChatIntent = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  prompt: string;
};

export const SUGGESTED_INTENTS: ChatIntent[] = [
  {
    id: 'mentor',
    label: 'Mentorship',
    description: 'How to get guidance from Deepak',
    emoji: '',
    prompt: 'How can I get mentorship?',
  },
  {
    id: 'hire',
    label: 'Hiring',
    description: 'Senior engineering leader — paste JD or URL next',
    emoji: '',
    prompt: "I'm looking to hire a senior engineering leader",
  },
  {
    id: 'speak',
    label: 'Speaking',
    description: 'Invite Deepak to a meetup or event',
    emoji: '',
    prompt: "I'm looking for someone to speak at our meetup",
  },
];

/** @deprecated Prefer SUGGESTED_INTENTS */
export const SUGGESTED_QUESTIONS = SUGGESTED_INTENTS.map((i) => i.prompt);

function formatExperienceSummary(): string {
  return resume.experience
    .map(
      (job) =>
        `${job.title} at ${job.company} (${job.period})\n${job.highlights.slice(0, 3).map((h) => `• ${h}`).join('\n')}`
    )
    .join('\n\n');
}

export function findFallbackAnswer(question: string): string | null {
  const q = question.toLowerCase();

  if (q.includes('mentor')) {
    return `Deepak mentors through community work (Pune AI Collective) and engineering leadership conversations. The best next step is to reach him on LinkedIn (${resume.links.linkedin}) or email (${resume.email}) with what you're hoping to learn — he'll take it from there.`;
  }

  if (
    q.includes('hire') ||
    q.includes('hiring') ||
    q.includes('recruit') ||
    q.includes('senior engineering leader')
  ) {
    const hasJdPayload =
      /https?:\/\//.test(q) ||
      q.includes('www.') ||
      ((q.includes('responsibilities') ||
        q.includes('requirements') ||
        q.includes('job description') ||
        q.includes('role overview')) &&
        q.length > 200) ||
      q.length > 500;

    if (!hasJdPayload) {
      return `Love that — Deepak is a Senior Engineering Manager with 19+ years in software, including 12+ at Red Hat.\n\nPaste the job description here, or drop a URL to the JD, and I'll map how he fits.`;
    }
  }

  if (
    (q.includes('speak') || q.includes('meetup') || q.includes('keynote') || q.includes('workshop')) &&
    (q.includes('looking') || q.includes('invite') || q.includes('meetup') || q.includes('event') || q.includes('conference'))
  ) {
    return `Deepak's been an international speaker for 14+ years — Devconf, FOSSASIA, SeleniumConf, ATAGTR, MCP Dev Summit, and more.\n\nShare the meetup details (topic, date, format) and reach him on LinkedIn (${resume.links.linkedin}) or ${resume.email} to lock it in.`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return `You can connect with Deepak on LinkedIn (${resume.links.linkedin}) or email him at ${resume.email}. He's based in ${resume.location}.`;
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('tech stack') || q.includes('competenc')) {
    const competencies = resume.coreCompetencies
      .map((g) => `${g.category}:\n${g.items.map((i) => `• ${i}`).join('\n')}`)
      .join('\n\n');
    return `Deepak's core competencies:\n\n${competencies}`;
  }

  if (
    q.includes('book') ||
    q.includes('author') ||
    q.includes('published') ||
    q.includes('amazon')
  ) {
    const book = resume.achievements.find((a) => a.title === 'Published Author');
    if (book) {
      return `${book.title}: ${book.description}${book.link ? `\n\nAvailable on Amazon: ${book.link}` : ''}`;
    }
  }

  if (q.includes('npm') || q.includes('package') || q.includes('cognitivelint') || q.includes('testid')) {
    const npm = resume.achievements.find((a) => a.title === 'NPM Package Creator');
    if (npm) {
      return `${npm.title}: ${npm.description}${npm.link ? `\n\n${npm.link}` : ''}`;
    }
  }

  if (q.includes('achievement') || q.includes('accomplish') || q.includes('open source')) {
    return resume.achievements.map((a) => `• ${a.title}: ${a.description}`).join('\n\n');
  }

  if (q.includes('certif') || q.includes('linkedin learning')) {
    return `Certifications:\n\n${resume.certifications.map((c) => `• ${c}`).join('\n')}`;
  }

  if (q.includes('ptc') || q.includes('parametric')) {
    const ptc = resume.experience.find((e) => e.company.includes('PTC'));
    if (ptc) {
      return `${ptc.title} at ${ptc.company} (${ptc.period})\n\n${ptc.highlights.map((h) => `• ${h}`).join('\n')}`;
    }
  }

  if (
    q.includes('red hat') ||
    q.includes('redhat') ||
    q.includes('experience') ||
    q.includes('work') ||
    q.includes('job') ||
    q.includes('career')
  ) {
    return `Here's Deepak's professional experience (${resume.experience.length} roles over 19+ years):\n\n${formatExperienceSummary()}`;
  }

  if (
    q.includes('community') ||
    q.includes('pune ai') ||
    q.includes('ai collective') ||
    q.includes('founder')
  ) {
    const roles = resume.community
      .map((c) => `${c.role} – ${c.organization}\n${c.description}`)
      .join('\n\n');
    return `Community leadership:\n\n${roles}`;
  }

  if (q.includes('speak') || q.includes('conference') || q.includes('talk') || q.includes('keynote')) {
    return `Speaking & thought leadership:\n\n${resume.speaking.map((s) => `• ${s}`).join('\n')}`;
  }

  if (q.includes('who') || q.includes('about') || q.includes('introduce')) {
    return resume.summary;
  }

  if (q.includes('education') || q.includes('degree') || q.includes('study') || q.includes('masters')) {
    return resume.education.join('\n');
  }

  if (q.includes('location') || (q.includes('where') && q.includes('live'))) {
    return `Deepak is based in ${resume.location}, working as ${resume.title} at Red Hat with 19+ years in the software industry.`;
  }

  if (
    q.includes('ai') ||
    q.includes('mcp') ||
    q.includes('agentic') ||
    q.includes('llm') ||
    q.includes('rag')
  ) {
    const ai = resume.achievements.find((a) => a.title === 'AI Thought Leadership');
    return ai
      ? `${ai.title}: ${ai.description}`
      : 'Deepak leads AI adoption across engineering workflows at Red Hat and founded the Pune AI Collective.';
  }

  return null;
}

export function getDefaultFallback(): string {
  return `Hey, I'm Bubbly 🫧 — I know Deepak inside-out. Ask about mentorship, hiring him as a senior engineering leader, or inviting him to speak — or anything else about his career.\n\nTry asking:\n${SUGGESTED_INTENTS.map((i) => `• ${i.prompt}`).join('\n')}`;
}
