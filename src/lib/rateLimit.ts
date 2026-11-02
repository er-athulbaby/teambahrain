// In-memory sliding-window limiter. Per-process only (matches this app's
// single-VM pm2 hosting — no Redis), resets on deploy; acceptable for this
// traffic level.
export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts = new Map<string, number[]>();

  function recent(key: string) {
    const now = Date.now();
    const list = (attempts.get(key) ?? []).filter((t) => now - t < windowMs);
    attempts.set(key, list);
    return list;
  }

  return {
    isLimited(key: string) {
      return recent(key).length >= maxAttempts;
    },
    record(key: string) {
      const list = recent(key);
      list.push(Date.now());
      attempts.set(key, list);
    },
    clear(key: string) {
      attempts.delete(key);
    },
  };
}
