import { resume } from '../data/resume';

export const SUGGESTED_QUESTIONS = [
  'What does Deepak do at Red Hat?',
  'Tell me about his AI and MCP work',
  'What book did he publish?',
  'Has he spoken at conferences?',
  'How can I contact him?',
];

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
  return `I'm Deepak's resume assistant. I can help you learn about his 19+ years of experience at Red Hat and PTC, his skills in engineering leadership and test automation, his AI thought leadership, published book, open source work, and how to contact him.\n\nTry asking:\n${SUGGESTED_QUESTIONS.map((q) => `• ${q}`).join('\n')}`;
}
