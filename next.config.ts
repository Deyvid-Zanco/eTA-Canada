import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jotform.com",
      },
    ],
    // Allow local images from public directory to work without optimization issues
    unoptimized: true,
  },
};

export default nextConfig;
