import { resume } from '../data/resume';

export const SUGGESTED_QUESTIONS = [
  'What does Deepak do at Red Hat?',
  'What are his key skills?',
  'Tell me about his community leadership',
  'Has he spoken at conferences?',
  'How can I contact him?',
];

export function findFallbackAnswer(question: string): string | null {
  const q = question.toLowerCase();

  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return `You can connect with Deepak on LinkedIn (${resume.links.linkedin}) or email him at ${resume.email}. He's based in ${resume.location}.`;
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('tech stack')) {
    return `Deepak's key skills include:\n\n${resume.skills.map((s) => `• ${s}`).join('\n')}\n\nHe specializes in engineering leadership, quality engineering, and AI-infused product workflows at Red Hat.`;
  }

  if (
    q.includes('red hat') ||
    q.includes('experience') ||
    q.includes('work') ||
    q.includes('job') ||
    q.includes('career')
  ) {
    const jobs = resume.experience
      .map(
        (job) =>
          `**${job.title}** at ${job.company} (${job.period})\n${job.highlights.map((h) => `• ${h}`).join('\n')}`
      )
      .join('\n\n');
    return `Here's Deepak's experience at Red Hat:\n\n${jobs}`;
  }

  if (q.includes('community') || q.includes('lead') || q.includes('chapter')) {
    const roles = resume.community
      .map((c) => `**${c.role}** – ${c.organization}\n${c.description}`)
      .join('\n\n');
    return `Deepak is active in the tech community:\n\n${roles}`;
  }

  if (q.includes('speak') || q.includes('conference') || q.includes('talk')) {
    return `Deepak has spoken at 30+ international conferences on topics including quality engineering, AI, agile delivery, and organizational behavior:\n\n${resume.speaking.map((s) => `• ${s}`).join('\n')}`;
  }

  if (q.includes('who') || q.includes('about') || q.includes('introduce')) {
    return resume.summary;
  }

  if (q.includes('education') || q.includes('degree') || q.includes('study')) {
    return resume.education.join('\n');
  }

  if (q.includes('location') || (q.includes('where') && q.includes('live'))) {
    return `Deepak is based in ${resume.location}, working as ${resume.title} at Red Hat.`;
  }

  if (q.includes('ai') || q.includes('artificial intelligence')) {
    return `Deepak leads teams building AI-infused certification workflows on connect.redhat.com and is Chapter Lead of the Pune AI Collective, where he shares knowledge on AI adoption and best practices with the local engineering community.`;
  }

  return null;
}

export function getDefaultFallback(): string {
  return `I'm Deepak's resume assistant. I can help you learn about his experience at Red Hat, his skills in engineering leadership and quality engineering, his community work, and how to contact him.\n\nTry asking:\n${SUGGESTED_QUESTIONS.map((q) => `• ${q}`).join('\n')}`;
}
