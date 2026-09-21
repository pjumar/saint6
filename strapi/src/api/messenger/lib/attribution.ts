export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "gad_campaignid",
  "fbclid",
  "landing_path",
  "referrer_host",
] as const;

/** Only accept acquisition metadata, never arbitrary form or message fields. */
export function sanitizeAttribution(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const output: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const field = input[key];
    if (
      typeof field !== "string" ||
      !field ||
      field.length > 500 ||
      [...field].some((character) => character.charCodeAt(0) < 32)
    )
      continue;
    if (key === "landing_path") {
      if (!field.startsWith("/") || field.startsWith("//")) continue;
      output[key] = field.split(/[?#]/, 1)[0];
    } else if (key === "referrer_host") {
      if (/^[a-z0-9.-]+$/i.test(field)) output[key] = field.toLowerCase();
    } else {
      output[key] = field;
    }
  }
  return output;
}

export function campaignLabel(attribution: Record<string, string>) {
  return {
    source:
      attribution.utm_source ||
      (attribution.gclid || attribution.gbraid || attribution.wbraid
        ? "google"
        : attribution.fbclid
          ? "facebook"
          : attribution.referrer_host || "unknown"),
    medium:
      attribution.utm_medium ||
      (attribution.gclid || attribution.gbraid || attribution.wbraid
        ? "paid"
        : "unknown"),
    campaign: attribution.utm_campaign || "unknown",
    campaignId: attribution.gad_campaignid || "",
  };
}
