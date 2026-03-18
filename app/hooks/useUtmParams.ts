"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "saint6_utm_params";

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

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  _landing?: string;
};

function parseCookie(name: string): UtmParams | null {
  try {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]*)")
    );
    if (match) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {
    // Invalid cookie data
  }
  return null;
}

/**
 * Reads UTM and Google Ads params from cookie set by middleware.
 * The middleware captures params server-side at the edge before
 * browsers can strip them (Safari ITP, Firefox ETP, Chrome privacy).
 */
export function useUtmParams(): UtmParams {
  const [params, setParams] = useState<UtmParams>({});

  useEffect(() => {
    const fromCookie = parseCookie(COOKIE_NAME);
    if (fromCookie) {
      setParams(fromCookie);
    }
  }, []);

  return params;
}

/**
 * Clear the UTM cookie after a successful form submission
 * so future visits get fresh attribution.
 */
export function clearUtmCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Get the traffic source label from UTM params.
 */
export function getTrafficSource(params: UtmParams): string {
  if (params.gclid) return "google_ads";
  if (params.utm_source) return params.utm_source;
  return "organic";
}
