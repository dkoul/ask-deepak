function env(name) {
  const raw = process.env[name];
  if (!raw) return '';
  return String(raw).trim().replace(/^['"]|['"]$/g, '');
}

export function GET() {
  const bypass = env('RECAPTCHA_BYPASS').toLowerCase();
  const siteKey = env('RECAPTCHA_SITE_KEY');
  const secret = env('RECAPTCHA_SECRET_KEY');
  const recaptchaEnabled =
    bypass !== '1' && bypass !== 'true' && Boolean(siteKey && secret);

  return Response.json({
    ok: true,
    aiConfigured: Boolean(env('DEEPSEEK_API_KEY')),
    recaptchaEnabled,
    limits: {
      maxQuestionLength: Number(env('MAX_QUESTION_LENGTH') || 2500),
      maxAnswerLength: Number(env('MAX_ANSWER_LENGTH') || 600),
      maxTokens: Number(env('DEEPSEEK_MAX_TOKENS') || 300),
      maxHistoryMessages: Number(env('MAX_HISTORY_MESSAGES') || 6),
    },
    topicGuard: 'strict — Deepak Koul profile only',
  });
}
