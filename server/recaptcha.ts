import type { RecaptchaConfig, RecaptchaVersion } from '../lib/recaptcha';
import { env } from './env';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_V3_SCORE = Number(env('RECAPTCHA_MIN_SCORE') || 0.5);

export type RecaptchaVerifyResult = {
  ok: boolean;
  error?: string;
};

export function isRecaptchaEnabled(): boolean {
  const bypass = env('RECAPTCHA_BYPASS').toLowerCase();
  if (bypass === '1' || bypass === 'true') {
    return false;
  }
  return Boolean(env('RECAPTCHA_SECRET_KEY') && env('RECAPTCHA_SITE_KEY'));
}

export function getRecaptchaConfig(): RecaptchaConfig {
  const siteKey = env('RECAPTCHA_SITE_KEY');
  const version = (env('RECAPTCHA_VERSION') || 'v2') as RecaptchaVersion;

  return {
    enabled: isRecaptchaEnabled() && siteKey.length > 0,
    siteKey,
    version: version === 'v3' ? 'v3' : 'v2',
  };
}

export async function verifyRecaptchaToken(
  token: string,
  remoteip?: string
): Promise<RecaptchaVerifyResult> {
  const secret = env('RECAPTCHA_SECRET_KEY');
  if (!secret) {
    return { ok: true };
  }

  if (!token || typeof token !== 'string' || token.length < 10) {
    return { ok: false, error: 'missing-token' };
  }

  const version = (env('RECAPTCHA_VERSION') || 'v2') as RecaptchaVersion;

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    });
    if (remoteip && remoteip !== 'unknown') {
      params.set('remoteip', remoteip);
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      console.error('reCAPTCHA siteverify HTTP error:', response.status);
      return { ok: false, error: 'verify-http' };
    }

    const data = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    };

    if (!data.success) {
      const codes = data['error-codes'] ?? [];
      console.error('reCAPTCHA verification failed:', codes.join(', ') || 'unknown');
      if (codes.includes('timeout-or-duplicate')) {
        return { ok: false, error: 'timeout-or-duplicate' };
      }
      return { ok: false, error: codes[0] || 'verify-failed' };
    }

    if (version === 'v3') {
      const ok = typeof data.score === 'number' && data.score >= MIN_V3_SCORE;
      if (!ok) {
        console.error('reCAPTCHA v3 score too low:', data.score);
        return { ok: false, error: 'low-score' };
      }
    }

    return { ok: true };
  } catch (err) {
    console.error('reCAPTCHA siteverify request failed:', err);
    return { ok: false, error: 'verify-network' };
  }
}

export function recaptchaUserMessage(error?: string): string {
  if (error === 'timeout-or-duplicate') {
    return 'Captcha expired. Please complete it again and retry.';
  }
  if (error === 'missing-token') {
    return 'Please complete the captcha and try again.';
  }
  return 'Captcha verification failed. Please complete the captcha and try again.';
}
