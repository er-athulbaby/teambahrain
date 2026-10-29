// In-memory sliding-window limiter against password-guessing on /login.
// Per-process only (matches this app's single-VM pm2 hosting — no Redis),
// resets on deploy; that's an acceptable tradeoff for a low-traffic admin
// panel, not a public API.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const attempts = new Map<string, number[]>();

export function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, recent);
  return recent.length >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
