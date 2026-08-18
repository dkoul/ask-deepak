import { callDeepSeek, ChatMessage } from './deepseek';
import { RateLimiter, DEFAULT_LIMITS } from './rateLimiter';
import { findFallbackAnswer, getDefaultFallback } from '../lib/chatFallback';
import {
  getTopicRefusalOrGreeting,
  isOnTopicQuestion,
  truncateAnswer,
  OFF_TOPIC_REFUSAL,
} from '../lib/topicGuard';
import {
  getRecaptchaConfig,
  isRecaptchaEnabled,
  recaptchaUserMessage,
  verifyRecaptchaToken,
} from './recaptcha';
import { env } from './env';

export type ApiResult = {
  status: number;
  body: Record<string, unknown>;
};

export const MAX_QUESTION_LENGTH = Number(env('MAX_QUESTION_LENGTH') || 2500);
export const MAX_HISTORY_MESSAGES = Number(env('MAX_HISTORY_MESSAGES') || 6);
export const MAX_ANSWER_LENGTH = Number(env('MAX_ANSWER_LENGTH') || 600);
export const DEEPSEEK_MAX_TOKENS = Number(env('DEEPSEEK_MAX_TOKENS') || 300);

export const rateLimiter = new RateLimiter();

export function jsonResponse(result: ApiResult): Response {
  return Response.json(result.body, { status: result.status });
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function getConfigResult(): ApiResult {
  return {
    status: 200,
    body: {
      recaptcha: getRecaptchaConfig(),
    },
  };
}

export function getHealthResult(): ApiResult {
  return {
    status: 200,
    body: {
      ok: true,
      aiConfigured: Boolean(env('DEEPSEEK_API_KEY')),
      recaptchaEnabled: isRecaptchaEnabled(),
      limits: {
        rate: DEFAULT_LIMITS,
        maxQuestionLength: MAX_QUESTION_LENGTH,
        maxAnswerLength: MAX_ANSWER_LENGTH,
        maxTokens: DEEPSEEK_MAX_TOKENS,
        maxHistoryMessages: MAX_HISTORY_MESSAGES,
      },
      topicGuard: 'strict — Deepak Koul profile only',
    },
  };
}

function isValidSessionId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(id);
}

function sanitizeMessages(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0 &&
        m.content.length <= MAX_QUESTION_LENGTH
    )
    .slice(-MAX_HISTORY_MESSAGES);
}

function finalizeAnswer(raw: string): string {
  return truncateAnswer(raw, MAX_ANSWER_LENGTH);
}

export async function processChat(body: unknown, ip: string): Promise<ApiResult> {
  const payload =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const { question, history, sessionId, captchaToken } = payload;

  if (!isValidSessionId(sessionId)) {
    return { status: 400, body: { error: 'Invalid session' } };
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return { status: 400, body: { error: 'Question is required' } };
  }

  const trimmedQuestion = question.trim();

  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    return {
      status: 400,
      body: { error: `Question too long (max ${MAX_QUESTION_LENGTH} characters)` },
    };
  }

  if (isRecaptchaEnabled()) {
    const captcha = await verifyRecaptchaToken(
      typeof captchaToken === 'string' ? captchaToken : '',
      ip
    );
    if (!captcha.ok) {
      return {
        status: 403,
        body: { error: recaptchaUserMessage(captcha.error) },
      };
    }
  }

  const limitResult = rateLimiter.check(ip, sessionId);
  if (!limitResult.allowed) {
    const message =
      limitResult.reason === 'too_fast'
        ? 'Please wait a moment before sending another message.'
        : 'Rate limit reached. Try again later or contact Deepak directly via LinkedIn.';

    return {
      status: 429,
      body: {
        error: message,
        retryAfterSeconds: limitResult.retryAfterSeconds,
      },
    };
  }

  const topicResponse = getTopicRefusalOrGreeting(trimmedQuestion);
  if (topicResponse) {
    return {
      status: 200,
      body: { answer: finalizeAnswer(topicResponse), source: 'topic_guard' },
    };
  }

  const sanitizedHistory = sanitizeMessages(history);
  const messages: ChatMessage[] = [
    ...sanitizedHistory,
    { role: 'user', content: trimmedQuestion },
  ];

  try {
    if (!env('DEEPSEEK_API_KEY')) {
      const fallback = findFallbackAnswer(trimmedQuestion) ?? getDefaultFallback();
      return {
        status: 200,
        body: { answer: finalizeAnswer(fallback), source: 'fallback' },
      };
    }

    const answer = await callDeepSeek(messages, { maxTokens: DEEPSEEK_MAX_TOKENS });
    const finalized = finalizeAnswer(answer);

    if (!isOnTopicQuestion(finalized) && !finalized.toLowerCase().includes('deepak')) {
      return {
        status: 200,
        body: { answer: finalizeAnswer(OFF_TOPIC_REFUSAL), source: 'topic_guard' },
      };
    }

    return { status: 200, body: { answer: finalized, source: 'deepseek' } };
  } catch (err) {
    console.error('Chat API error:', err);
    const fallback = findFallbackAnswer(trimmedQuestion) ?? getDefaultFallback();
    return {
      status: 200,
      body: { answer: finalizeAnswer(fallback), source: 'fallback' },
    };
  }
}
