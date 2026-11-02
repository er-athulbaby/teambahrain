// Against password-guessing on /login.
import { createRateLimiter } from "@/lib/rateLimit";

const limiter = createRateLimiter(5, 15 * 60 * 1000);

export function isRateLimited(key: string) {
  return limiter.isLimited(key);
}

export function recordFailedAttempt(key: string) {
  limiter.record(key);
}

export function clearAttempts(key: string) {
  limiter.clear(key);
}
