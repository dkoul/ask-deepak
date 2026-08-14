import { buildResumeContext, resume } from '../data/resume';

const SYSTEM_PROMPT = `You are an AI assistant on Deepak Koul's official resume website. You help visitors learn about Deepak's professional background, skills, experience, community work, and speaking engagements.

Answer questions accurately and conversationally based ONLY on the resume information below. If asked about something not covered, say you don't have that information and suggest they reach out via LinkedIn or email.

Be professional, warm, and concise. Use bullet points for lists when helpful. You represent Deepak professionally — never make up credentials or experience.

RESUME DATA:
${buildResumeContext()}`;

const SUGGESTED_QUESTIONS = [
  'What does Deepak do at Red Hat?',
  'What are his key skills?',
  'Tell me about his community leadership',
  'Has he spoken at conferences?',
  'How can I contact him?',
];

function findRelevantAnswer(question: string): string | null {
  const q = question.toLowerCase();

  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return `You can connect with Deepak on LinkedIn (${resume.links.linkedin}) or email him at ${resume.email}. He's based in ${resume.location}.`;
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('tech stack')) {
    return `Deepak's key skills include:\n\n${resume.skills.map((s) => `• ${s}`).join('\n')}\n\nHe specializes in engineering leadership, quality engineering, and AI-infused product workflows at Red Hat.`;
  }

  if (q.includes('red hat') || q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('career')) {
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

  if (q.includes('location') || q.includes('where') && q.includes('live')) {
    return `Deepak is based in ${resume.location}, working as ${resume.title} at Red Hat.`;
  }

  if (q.includes('ai') || q.includes('artificial intelligence')) {
    return `Deepak leads teams building AI-infused certification workflows on connect.redhat.com and is Chapter Lead of the Pune AI Collective, where he shares knowledge on AI adoption and best practices with the local engineering community.`;
  }

  return null;
}

async function callGemini(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('No API key configured');
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response from Gemini');
  }
  return text;
}

export async function askAboutDeepak(
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  const messages = [
    ...history.slice(-6),
    { role: 'user' as const, content: question },
  ];

  try {
    return await callGemini(messages);
  } catch {
    const fallback = findRelevantAnswer(question);
    if (fallback) {
      return fallback;
    }

    return `I'm Deepak's resume assistant. I can help you learn about his experience at Red Hat, his skills in engineering leadership and quality engineering, his community work, and how to contact him.\n\nTry asking:\n${SUGGESTED_QUESTIONS.map((q) => `• ${q}`).join('\n')}`;
  }
}

export function getSuggestedQuestions(): string[] {
  return SUGGESTED_QUESTIONS;
}
