import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
