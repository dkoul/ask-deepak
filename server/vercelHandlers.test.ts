import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GET as getConfig } from '../api/config.js';
import { GET as getHealth } from '../api/health.js';
import { POST as postChat } from '../api/chat.js';

test('Vercel GET /api/health handler returns ok', async () => {
  const response = getHealth();
  assert.equal(response.status, 200);
  const body = (await response.json()) as { ok: boolean };
  assert.equal(body.ok, true);
});

test('Vercel GET /api/config handler returns recaptcha config', async () => {
  const response = getConfig();
  assert.equal(response.status, 200);
  const body = (await response.json()) as {
    recaptcha: { enabled: boolean; version: string };
  };
  assert.equal(typeof body.recaptcha.enabled, 'boolean');
  assert.ok(body.recaptcha.version === 'v2' || body.recaptcha.version === 'v3');
});

test('Vercel POST /api/chat handler rejects missing captcha when enabled', async () => {
  const previous = {
    bypass: process.env.RECAPTCHA_BYPASS,
    secret: process.env.RECAPTCHA_SECRET_KEY,
    site: process.env.RECAPTCHA_SITE_KEY,
  };
  process.env.RECAPTCHA_BYPASS = '';
  process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
  process.env.RECAPTCHA_SITE_KEY = 'test-site';

  try {
    const response = await postChat(
      new Request('https://ask-deepak.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Who is Deepak?',
          sessionId: 'test-session-123',
        }),
      })
    );
    assert.equal(response.status, 403);
    const body = (await response.json()) as { error: string };
    assert.match(body.error, /captcha/i);
  } finally {
    if (previous.bypass === undefined) delete process.env.RECAPTCHA_BYPASS;
    else process.env.RECAPTCHA_BYPASS = previous.bypass;
    if (previous.secret === undefined) delete process.env.RECAPTCHA_SECRET_KEY;
    else process.env.RECAPTCHA_SECRET_KEY = previous.secret;
    if (previous.site === undefined) delete process.env.RECAPTCHA_SITE_KEY;
    else process.env.RECAPTCHA_SITE_KEY = previous.site;
  }
});
