import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module":
        "./app/lib/modern-polyfill.js",
    },
  },
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
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;
