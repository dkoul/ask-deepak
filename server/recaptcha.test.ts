import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  getRecaptchaConfig,
  isRecaptchaEnabled,
  recaptchaUserMessage,
  verifyRecaptchaToken,
} from './recaptcha';

const KEYS = [
  'RECAPTCHA_BYPASS',
  'RECAPTCHA_SECRET_KEY',
  'RECAPTCHA_SITE_KEY',
  'RECAPTCHA_VERSION',
] as const;

const previous = new Map<string, string | undefined>();

function setEnv(values: Partial<Record<(typeof KEYS)[number], string | undefined>>) {
  for (const key of KEYS) {
    if (!previous.has(key)) previous.set(key, process.env[key]);
    const value = values[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

afterEach(() => {
  for (const [key, value] of previous) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  previous.clear();
});

test('isRecaptchaEnabled is false when bypass is set', () => {
  setEnv({
    RECAPTCHA_BYPASS: '1',
    RECAPTCHA_SECRET_KEY: 'secret',
    RECAPTCHA_SITE_KEY: 'site',
  });
  assert.equal(isRecaptchaEnabled(), false);
});

test('isRecaptchaEnabled requires both site and secret keys', () => {
  setEnv({
    RECAPTCHA_BYPASS: undefined,
    RECAPTCHA_SECRET_KEY: 'secret',
    RECAPTCHA_SITE_KEY: undefined,
  });
  assert.equal(isRecaptchaEnabled(), false);

  setEnv({
    RECAPTCHA_SECRET_KEY: 'secret',
    RECAPTCHA_SITE_KEY: 'site',
  });
  assert.equal(isRecaptchaEnabled(), true);
});

test('getRecaptchaConfig exposes the public site key when enabled', () => {
  setEnv({
    RECAPTCHA_BYPASS: undefined,
    RECAPTCHA_SECRET_KEY: 'secret',
    RECAPTCHA_SITE_KEY: 'public-site-key',
    RECAPTCHA_VERSION: 'v2',
  });
  assert.deepEqual(getRecaptchaConfig(), {
    enabled: true,
    siteKey: 'public-site-key',
    version: 'v2',
  });
});

test('verifyRecaptchaToken rejects a missing token when a secret is configured', async () => {
  setEnv({
    RECAPTCHA_SECRET_KEY: 'secret',
    RECAPTCHA_SITE_KEY: 'site',
  });
  const result = await verifyRecaptchaToken('');
  assert.equal(result.ok, false);
  assert.equal(result.error, 'missing-token');
});

test('verifyRecaptchaToken allows requests when no secret is configured', async () => {
  setEnv({
    RECAPTCHA_SECRET_KEY: undefined,
    RECAPTCHA_SITE_KEY: undefined,
  });
  const result = await verifyRecaptchaToken('');
  assert.equal(result.ok, true);
});

test('recaptchaUserMessage explains expired tokens', () => {
  assert.match(recaptchaUserMessage('timeout-or-duplicate'), /expired/i);
});
