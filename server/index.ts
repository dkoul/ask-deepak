import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callDeepSeek, ChatMessage } from './deepseek';
import { RateLimiter, DEFAULT_LIMITS } from './rateLimiter';
import { findFallbackAnswer, getDefaultFallback } from '../lib/chatFallback';
import {
  getTopicRefusalOrGreeting,
  isOnTopicQuestion,
  truncateAnswer,
  OFF_TOPIC_REFUSAL,
} from '../lib/topicGuard';
import { getRecaptchaConfig, isRecaptchaEnabled, verifyRecaptchaToken } from './recaptcha';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const rateLimiter = new RateLimiter();

app.set('trust proxy', 1);

const PORT = Number(process.env.PORT || 3000);
const MAX_QUESTION_LENGTH = Number(process.env.MAX_QUESTION_LENGTH || 400);
const MAX_HISTORY_MESSAGES = Number(process.env.MAX_HISTORY_MESSAGES || 6);
const MAX_ANSWER_LENGTH = Number(process.env.MAX_ANSWER_LENGTH || 600);
const DEEPSEEK_MAX_TOKENS = Number(process.env.DEEPSEEK_MAX_TOKENS || 300);

// Prune rate-limit store every 10 minutes
setInterval(() => rateLimiter.prune(), 10 * 60 * 1000);

app.use(express.json({ limit: '16kb' }));

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
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

app.post('/api/chat', async (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const { question, history, sessionId, captchaToken } = req.body ?? {};

  if (!isValidSessionId(sessionId)) {
    res.status(400).json({ error: 'Invalid session' });
    return;
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    res.status(400).json({ error: 'Question is required' });
    return;
  }

  const trimmedQuestion = question.trim();

  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({
      error: `Question too long (max ${MAX_QUESTION_LENGTH} characters)`,
    });
    return;
  }

  if (isRecaptchaEnabled()) {
    const captchaValid = await verifyRecaptchaToken(
      typeof captchaToken === 'string' ? captchaToken : ''
    );
    if (!captchaValid) {
      res.status(403).json({
        error: 'Captcha verification failed. Please complete the captcha and try again.',
      });
      return;
    }
  }

  const limitResult = rateLimiter.check(ip, sessionId);
  if (!limitResult.allowed) {
    const message =
      limitResult.reason === 'too_fast'
        ? 'Please wait a moment before sending another message.'
        : 'Rate limit reached. Try again later or contact Deepak directly via LinkedIn.';

    res.status(429).json({
      error: message,
      retryAfterSeconds: limitResult.retryAfterSeconds,
    });
    return;
  }

  const topicResponse = getTopicRefusalOrGreeting(trimmedQuestion);
  if (topicResponse) {
    res.json({ answer: finalizeAnswer(topicResponse), source: 'topic_guard' });
    return;
  }

  const sanitizedHistory = sanitizeMessages(history);
  const messages: ChatMessage[] = [
    ...sanitizedHistory,
    { role: 'user', content: trimmedQuestion },
  ];

  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      const fallback = findFallbackAnswer(trimmedQuestion) ?? getDefaultFallback();
      res.json({ answer: finalizeAnswer(fallback), source: 'fallback' });
      return;
    }

    const answer = await callDeepSeek(messages, { maxTokens: DEEPSEEK_MAX_TOKENS });
    const finalized = finalizeAnswer(answer);

    if (!isOnTopicQuestion(finalized) && !finalized.toLowerCase().includes('deepak')) {
      res.json({ answer: finalizeAnswer(OFF_TOPIC_REFUSAL), source: 'topic_guard' });
      return;
    }

    res.json({ answer: finalized, source: 'deepseek' });
  } catch (err) {
    console.error('Chat API error:', err);
    const fallback = findFallbackAnswer(trimmedQuestion);
    if (fallback) {
      res.json({ answer: finalizeAnswer(fallback), source: 'fallback' });
      return;
    }
    res.status(503).json({
      error: 'Assistant is temporarily unavailable. Please try again later.',
    });
  }
});

app.get('/api/config', (_req, res) => {
  res.json({
    recaptcha: getRecaptchaConfig(),
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    recaptchaEnabled: isRecaptchaEnabled(),
    limits: {
      rate: DEFAULT_LIMITS,
      maxQuestionLength: MAX_QUESTION_LENGTH,
      maxAnswerLength: MAX_ANSWER_LENGTH,
      maxTokens: DEEPSEEK_MAX_TOKENS,
      maxHistoryMessages: MAX_HISTORY_MESSAGES,
    },
    topicGuard: 'strict — Deepak Koul profile only',
  });
});

// Serve static frontend in production (when dist/ exists)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(
    `DeepSeek API: ${process.env.DEEPSEEK_API_KEY ? 'configured' : 'NOT configured (set DEEPSEEK_API_KEY)'}`
  );
  console.log(
    `reCAPTCHA: ${isRecaptchaEnabled() ? 'enabled' : 'NOT configured (set RECAPTCHA_SITE_KEY + RECAPTCHA_SECRET_KEY)'}`
  );
});
