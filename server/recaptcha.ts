import type { RecaptchaConfig, RecaptchaVersion } from '../lib/recaptcha';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_V3_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

export function isRecaptchaEnabled(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export function getRecaptchaConfig(): RecaptchaConfig {
  const siteKey = process.env.RECAPTCHA_SITE_KEY || '';
  const version = (process.env.RECAPTCHA_VERSION || 'v2') as RecaptchaVersion;

  return {
    enabled: isRecaptchaEnabled() && siteKey.length > 0,
    siteKey,
    version: version === 'v3' ? 'v3' : 'v2',
  };
}

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return true;
  }

  if (!token || typeof token !== 'string' || token.length < 10) {
    return false;
  }

  const version = (process.env.RECAPTCHA_VERSION || 'v2') as RecaptchaVersion;

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
  };

  if (!data.success) {
    return false;
  }

  if (version === 'v3') {
    return typeof data.score === 'number' && data.score >= MIN_V3_SCORE;
  }

  return true;
}
