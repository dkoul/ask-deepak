function env(name) {
  const raw = process.env[name];
  if (!raw) return '';
  return String(raw).trim().replace(/^['"]|['"]$/g, '');
}

export function GET() {
  const bypass = env('RECAPTCHA_BYPASS').toLowerCase();
  const siteKey = env('RECAPTCHA_SITE_KEY');
  const secret = env('RECAPTCHA_SECRET_KEY');
  const enabled =
    bypass !== '1' && bypass !== 'true' && Boolean(siteKey && secret);

  return Response.json({
    recaptcha: {
      enabled,
      siteKey: enabled ? siteKey : '',
      version: env('RECAPTCHA_VERSION') === 'v3' ? 'v3' : 'v2',
    },
  });
}
