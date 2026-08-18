import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import app from './app';

async function withServer<T>(
  run: (baseUrl: string) => Promise<T>
): Promise<T> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    return await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  }
}

test('GET /api/health returns ok', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { ok: boolean };
    assert.equal(body.ok, true);
  });
});

test('GET /api/config returns recaptcha config', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/config`);
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      recaptcha: { enabled: boolean; version: string; siteKey: string };
    };
    assert.equal(typeof body.recaptcha.enabled, 'boolean');
    assert.ok(body.recaptcha.version === 'v2' || body.recaptcha.version === 'v3');
  });
});

test('POST /api/chat without a captcha token is rejected when recaptcha is enabled', async () => {
  const previous = {
    bypass: process.env.RECAPTCHA_BYPASS,
    secret: process.env.RECAPTCHA_SECRET_KEY,
    site: process.env.RECAPTCHA_SITE_KEY,
  };
  process.env.RECAPTCHA_BYPASS = '';
  process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
  process.env.RECAPTCHA_SITE_KEY = 'test-site';

  try {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Who is Deepak?',
          sessionId: 'test-session-123',
        }),
      });
      assert.equal(response.status, 403);
      const body = (await response.json()) as { error: string };
      assert.match(body.error, /captcha/i);
    });
  } finally {
    if (previous.bypass === undefined) delete process.env.RECAPTCHA_BYPASS;
    else process.env.RECAPTCHA_BYPASS = previous.bypass;
    if (previous.secret === undefined) delete process.env.RECAPTCHA_SECRET_KEY;
    else process.env.RECAPTCHA_SECRET_KEY = previous.secret;
    if (previous.site === undefined) delete process.env.RECAPTCHA_SITE_KEY;
    else process.env.RECAPTCHA_SITE_KEY = previous.site;
  }
});
