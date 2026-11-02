// Behind nginx, the real client IP arrives in X-Forwarded-For (set by the
// proxy_pass config) — the socket address Next.js sees is always nginx's own.
export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
