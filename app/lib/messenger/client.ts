import { sanitizeAttribution } from "@/strapi/src/api/messenger/lib/attribution";

const STORAGE_KEY = "saint6_messenger_referral";
const BASE_URL = "https://m.me/saint6studios";
let pending: Promise<string> | undefined;

/** Prepare an opaque reference; the normal Messenger link survives every failure. */
export function prepareMessengerLink(): Promise<string> {
  if (pending) return pending;
  pending = prepare()
    .catch(() => BASE_URL)
    .finally(() => {
      pending = undefined;
    });
  return pending;
}

async function prepare(): Promise<string> {
  const query = new URLSearchParams(window.location.search);
  if (
    process.env.NEXT_PUBLIC_MESSENGER_TRACKING_ENABLED !== "true" &&
    query.get("messenger_tracking_test") !== "1"
  )
    return BASE_URL;
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem("saint6_utm_params") || "{}");
  } catch {
    /* Storage can be unavailable. */
  }
  const current = sanitizeAttribution(Object.fromEntries(query));
  // A new tagged landing replaces, rather than mixes with, a previous campaign.
  const source = Object.keys(current).length ? current : stored;
  const attribution = sanitizeAttribution({
    ...source,
    landing_path:
      (source as { _landing?: string })._landing || window.location.pathname,
    referrer_host: document.referrer ? new URL(document.referrer).hostname : "",
  });
  const fingerprint = JSON.stringify(attribution);
  try {
    const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    // Reuse across site navigation. New tagged landings start a new reference.
    if (
      existing &&
      /^s6_[a-f0-9]{32}$/.test(existing.ref) &&
      existing.reuseUntil > Date.now() &&
      (!Object.keys(current).length || existing.fingerprint === fingerprint)
    ) {
      return `${BASE_URL}?ref=${existing.ref}`;
    }
  } catch {
    /* Continue without cached state. */
  }
  const response = await fetch("/api/messenger/referral", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attribution,
      test: query.get("messenger_tracking_test") === "1",
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return BASE_URL;
  const data = await response.json();
  if (typeof data.ref !== "string" || !/^s6_[a-f0-9]{32}$/.test(data.ref))
    return BASE_URL;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ref: data.ref,
        fingerprint,
        reuseUntil: Math.min(
          Date.parse(data.expiresAt),
          Date.now() + 24 * 60 * 60 * 1000,
        ),
      }),
    );
  } catch {
    /* The current page can still use its reference. */
  }
  return `${BASE_URL}?ref=${data.ref}`;
}
