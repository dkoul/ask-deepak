import {
  findFallbackAnswer,
  getDefaultFallback,
  SUGGESTED_QUESTIONS,
} from '../lib/chatFallback';

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  return sessionId;
}

export class ChatApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryAfterSeconds?: number
  ) {
    super(message);
    this.name = 'ChatApiError';
  }
}

export async function askAboutDeepak(
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  captchaToken?: string | null
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        history: history.slice(-6),
        sessionId: getSessionId(),
        captchaToken: captchaToken ?? undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ChatApiError(
        data.error || 'Request failed',
        response.status,
        data.retryAfterSeconds
      );
    }

    if (typeof data.answer === 'string' && data.answer.trim()) {
      return data.answer;
    }

    throw new Error('Invalid response');
  } catch (err) {
    if (err instanceof ChatApiError) {
      throw err;
    }

    const fallback = findFallbackAnswer(question);
    if (fallback) {
      return fallback;
    }

    return getDefaultFallback();
  }
}

export function getSuggestedQuestions(): string[] {
  return SUGGESTED_QUESTIONS;
}
