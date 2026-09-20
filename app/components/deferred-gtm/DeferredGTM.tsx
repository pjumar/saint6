"use client";

import { GoogleTagManager } from "@next/third-parties/google";

interface DeferredGTMProps {
  gtmId: string;
}

/**
 * Loads GTM after hydration so short visits and ad clicks are measured.
 * Keep initialization in Next.js's shared loader to avoid duplicate containers.
 */
export function DeferredGTM({ gtmId }: DeferredGTMProps) {
  return <GoogleTagManager gtmId={gtmId} />;
}
