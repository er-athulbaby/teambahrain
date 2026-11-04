import type { NextConfig } from "next";

// 'unsafe-inline' on script-src/style-src is required because Next.js
// injects its own hydration/bootstrap scripts inline and we don't run a
// nonce-issuing middleware — this still blocks loading external scripts,
// cross-origin framing, and exfiltration via fetch/XHR to third parties.
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https://*.amazonaws.com",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://olympics.com https://www.instagram.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        // Matches the virtual-hosted-style S3 URL <bucket>.s3.<region>.amazonaws.com
        // built in src/lib/s3.ts. Narrow this to the exact bucket hostname once
        // the production bucket name is known.
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
