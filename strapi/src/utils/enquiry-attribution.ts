/** Keep ad references on the private enquiry record, never in analytics events. */
export function normalizeAdAttribution(
  input: unknown,
): Record<string, string> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const key of ["gclid", "gbraid", "wbraid", "gad_campaignid"]) {
    const value = source[key];
    if (typeof value === "string" && /^[A-Za-z0-9_-]{1,512}$/.test(value)) {
      result[key] = value;
    }
  }
  return Object.keys(result).length ? result : null;
}
