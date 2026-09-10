"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "saint6_utm_params";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  dclid?: string;
  gbraid?: string;
  wbraid?: string;
  gad_source?: string;
  gad_campaignid?: string;
  _landing?: string;
};

/**
 * Reads UTM params from sessionStorage.
 * Params are captured by an inline script in <head> on landing.
 * UTM params (utm_source, utm_medium, etc.) are NOT stripped by browsers,
 * so client-side capture is reliable.
 */
export function useUtmParams(): UtmParams {
  const [params, setParams] = useState<UtmParams>({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setParams(JSON.parse(stored));
      }
    } catch {
      // Invalid data
    }
  }, []);

  return params;
}

/**
 * Clear UTM data after a successful form submission
 * so future visits get fresh attribution.
 */
export function clearUtmParams(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

/**
 * Get the traffic source label from UTM params.
 */
export function getTrafficSource(params: UtmParams): string {
  if (params.gclid || params.dclid || params.gbraid || params.wbraid) {
    return "google_ads";
  }
  if (params.utm_source) return params.utm_source;
  return "organic";
}
