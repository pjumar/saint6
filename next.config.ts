import type { NextConfig } from "next";
import seed from "./app/lib/styling/seed.json";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/styling/social": [
      "./public/fonts/saira-condensed/*.ttf",
      ...new Set([
        ...seed.projects.en.map((p) => `./public${p.cover.url}`),
        ...Object.values(seed.pages).map((p) => `./public${p.hero_image.url}`),
      ]),
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_ENVIRONMENT: process.env.VERCEL_ENV || "development",
    NEXT_PUBLIC_PREVIEW_FORM_TESTS_ENABLED:
      process.env.VERCEL_ENV === "production"
        ? "false"
        : process.env.PREVIEW_FORM_TESTS_ENABLED || "false",
    NEXT_PUBLIC_STYLING_ENABLED:
      process.env.VERCEL_ENV !== "production" ||
      process.env.STYLING_PUBLIC_ENABLED === "true"
        ? "true"
        : "false",
  },
  async headers() {
    return process.env.VERCEL_ENV === "preview"
      ? [
          {
            source: "/:path*",
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
          },
        ]
      : [];
  },
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
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "http" as const, hostname: "127.0.0.1", port: "1346" }]
        : []),
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
