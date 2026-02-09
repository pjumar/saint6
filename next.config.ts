import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "*.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "*.saint6.studio",
      },
    ],
  },
};

export default nextConfig;
