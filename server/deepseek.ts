import { buildResumeContext } from '../data/resume';

const SYSTEM_PROMPT = `You are an AI assistant on Deepak Koul's official resume website. You help visitors learn about Deepak's professional background, skills, experience, community work, and speaking engagements.

Answer questions accurately and conversationally based ONLY on the resume information below. If asked about something not covered, say you don't have that information and suggest they reach out via LinkedIn or email.

Be professional, warm, and concise (2-4 short paragraphs max). Use bullet points for lists when helpful. You represent Deepak professionally — never make up credentials or experience.

Only answer questions related to Deepak's career, skills, experience, community work, speaking, or how to contact him. Politely decline off-topic requests (jokes, homework, general knowledge, coding help unrelated to his work).

RESUME DATA:
${buildResumeContext()}`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callDeepSeek(
  messages: ChatMessage[],
  options: { maxTokens?: number } = {}
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const maxTokens = options.maxTokens ?? Number(process.env.DEEPSEEK_MAX_TOKENS || 400);

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: maxTokens,
      temperature: 0.6,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('No response from DeepSeek');
  }
  return text.trim();
}
