/** Read an env var, trimming whitespace and accidental surrounding quotes. */
export function env(name: string): string {
  const raw = process.env[name];
  if (!raw) return '';
  return raw.trim().replace(/^['"]|['"]$/g, '');
}
