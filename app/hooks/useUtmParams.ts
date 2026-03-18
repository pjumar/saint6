"use client";

import { useEffect, useState } from "react";

const UTM_STORAGE_KEY = "saint6_utm_params";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gad_source",
  "gad_campaignid",
  "gbraid",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * Reads UTM and Google Ads params from sessionStorage.
 * The params are captured by an inline <script> in layout.tsx
 * that runs before React hydrates — this ensures params are
 * captured even if the browser strips them from the URL after redirect.
 */
export function useUtmParams(): UtmParams {
  const [params, setParams] = useState<UtmParams>({});

  useEffect(() => {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      try {
        setParams(JSON.parse(stored));
      } catch {
        // Corrupted data, ignore
      }
    }
  }, []);

  return params;
}

/**
 * Get the traffic source label from UTM params.
 */
export function getTrafficSource(params: UtmParams): string {
  if (params.gclid) return "google_ads";
  if (params.utm_source) return params.utm_source;
  return "organic";
}
