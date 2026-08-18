import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { env } from './env';

afterEach(() => {
  delete process.env.TEST_ENV_TRIM;
});

test('env trims whitespace and surrounding quotes', () => {
  process.env.TEST_ENV_TRIM = '  "abc123"  ';
  assert.equal(env('TEST_ENV_TRIM'), 'abc123');
});

test('env returns empty string when unset', () => {
  delete process.env.TEST_ENV_TRIM;
  assert.equal(env('TEST_ENV_TRIM'), '');
});
