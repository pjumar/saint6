"use client";

type AdsConsent = "granted" | "denied" | null;
type SDKCommand =
  | ["consent", boolean]
  | ["init", { pixelId: string }]
  | [
      "measure",
      "lead_created",
      { type: "customer_action" },
      { event_id: string; opt_out: true },
    ];

interface OpenAIAdsSDK {
  (...command: SDKCommand): void;
  q?: SDKCommand[];
}

interface OpenAIAdsQueue extends OpenAIAdsSDK {
  q: SDKCommand[];
}

type AdsWindow = Window & { oaiq?: OpenAIAdsSDK };
type PrivacyNavigator = Navigator & { globalPrivacyControl?: boolean };

const CONSENT_KEY = "saint6:openai-ads-consent:v1";
const SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
const EVENT_KEY_PREFIX = "saint6:openai-ads-events:v1:";
const VALID_EVENT_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const sentEvents = new Map<string, Set<string>>();

let sessionConsent: AdsConsent = null;
let consentStorageUnavailable = false;
let queue: OpenAIAdsQueue | undefined;
let scriptRequested = false;
let scriptLoaded = false;
let scriptFailed = false;
let initializedPixel: string | null = null;
let sdkConsent: boolean | null = null;

function pixelId(): string {
  return process.env.NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID?.trim() ?? "";
}

function privacyControlEnabled(): boolean {
  try {
    return (window.navigator as PrivacyNavigator).globalPrivacyControl === true;
  } catch {
    return true;
  }
}

function getSDK(): OpenAIAdsSDK | undefined {
  const sdk = (window as AdsWindow).oaiq;
  return typeof sdk === "function" ? sdk : undefined;
}

/** Enable measurement only on the configured, public production site. */
export function isOpenAIAdsEnabled(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_SITE_ENVIRONMENT === "production" &&
      pixelId().length > 0 &&
      ["saint6.studio", "www.saint6.studio"].includes(window.location.hostname)
    );
  } catch {
    return false;
  }
}

/** Return the visitor's choice, with Global Privacy Control taking precedence. */
export function getOpenAIAdsConsent(): AdsConsent {
  if (typeof window === "undefined") return null;
  if (privacyControlEnabled()) return "denied";
  if (!consentStorageUnavailable) {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      sessionConsent =
        stored === "granted" || stored === "denied" ? stored : null;
    } catch {
      consentStorageUnavailable = true;
    }
  }
  return sessionConsent;
}

function revokeSDKConsent(): void {
  const sdk = getSDK();
  if (!sdk || (!queue && initializedPixel === null)) return;

  if (!scriptLoaded && sdk === queue) {
    // A delayed download must not replay events or initialize after revocation.
    queue.q.length = 0;
    initializedPixel = null;
    sdkConsent = null;
  }

  if (sdkConsent !== false) {
    sdkConsent = null;
    sdk("consent", false);
    sdkConsent = false;
  }
}

function failSDKLoad(): void {
  scriptFailed = true;
  if (queue) queue.q.length = 0;
  initializedPixel = null;
  sdkConsent = null;
}

function loadSDK(sdk: OpenAIAdsSDK): void {
  if (scriptRequested || sdk !== queue) return;
  const script = document.createElement("script");
  script.id = "saint6-openai-ads-sdk";
  script.async = true;
  script.src = SDK_URL;
  script.onload = (): void => {
    scriptLoaded = true;
    try {
      if (getOpenAIAdsConsent() !== "granted") revokeSDKConsent();
    } catch {
      // SDK failures must never interrupt the site or a saved enquiry.
    }
  };
  script.onerror = failSDKLoad;
  scriptRequested = true;
  try {
    document.head.appendChild(script);
  } catch {
    failSDKLoad();
  }
}

/** Load and initialize the browser Pixel only after an explicit opt-in. */
export function initializeOpenAIAds(): void {
  try {
    if (!isOpenAIAdsEnabled()) return;
    if (getOpenAIAdsConsent() !== "granted") {
      revokeSDKConsent();
      return;
    }
    if (scriptFailed) return;

    let sdk = getSDK();
    if (!sdk) {
      const bootstrap: OpenAIAdsQueue = Object.assign(
        (...command: SDKCommand): void => {
          bootstrap.q.push(command);
        },
        { q: [] as SDKCommand[] },
      );
      queue = bootstrap;
      sdk = bootstrap;
      (window as AdsWindow).oaiq = sdk;
    }

    if (initializedPixel !== pixelId()) {
      sdk("consent", false);
      sdkConsent = false;
      sdk("init", { pixelId: pixelId() });
      initializedPixel = pixelId();
    }
    if (sdkConsent !== true) {
      sdk("consent", true);
      sdkConsent = true;
    }
    loadSDK(sdk);
  } catch {
    // Measurement is optional and must not affect enquiry submission.
  }
}

/** Persist this Pixel's consent choice without changing other analytics. */
export function setOpenAIAdsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  sessionConsent = granted && !privacyControlEnabled() ? "granted" : "denied";
  try {
    window.localStorage.setItem(CONSENT_KEY, sessionConsent);
  } catch {
    consentStorageUnavailable = true;
  }

  try {
    if (sessionConsent === "granted") initializeOpenAIAds();
    else revokeSDKConsent();
  } catch {
    // Keep the local choice effective even if the SDK is unavailable.
  }

  try {
    window.dispatchEvent(
      new CustomEvent("saint6:openai-ads-consent", {
        detail: { consent: sessionConsent },
      }),
    );
  } catch {
    // Consent still applies if a browser extension blocks custom events.
  }
}

function seenEventIds(id: string): Set<string> {
  const cached = sentEvents.get(id);
  if (cached) return cached;
  const ids = new Set<string>();
  try {
    const stored: unknown = JSON.parse(
      window.sessionStorage.getItem(`${EVENT_KEY_PREFIX}${id}`) ?? "[]",
    );
    if (Array.isArray(stored)) {
      for (const value of stored) {
        if (typeof value === "string" && VALID_EVENT_ID.test(value)) {
          ids.add(value);
        }
      }
    }
  } catch {
    // A memory set preserves deduplication when session storage is blocked.
  }
  sentEvents.set(id, ids);
  return ids;
}

/** Measure only a saved rental enquiry, using its stable non-personal ID. */
export function trackRentalEnquiry(eventId: string): void {
  try {
    if (
      !isOpenAIAdsEnabled() ||
      typeof eventId !== "string" ||
      !VALID_EVENT_ID.test(eventId)
    ) {
      return;
    }
    if (getOpenAIAdsConsent() !== "granted") {
      revokeSDKConsent();
      return;
    }
    const id = pixelId();
    const seen = seenEventIds(id);
    if (seen.has(eventId)) return;
    initializeOpenAIAds();
    const sdk = getSDK();
    if (
      !sdk ||
      initializedPixel !== id ||
      sdkConsent !== true ||
      scriptFailed
    ) {
      return;
    }
    sdk(
      "measure",
      "lead_created",
      { type: "customer_action" },
      { event_id: eventId, opt_out: true },
    );
    seen.add(eventId);
    try {
      window.sessionStorage.setItem(
        `${EVENT_KEY_PREFIX}${id}`,
        JSON.stringify([...seen]),
      );
    } catch {
      // The in-memory set remains effective for this page session.
    }
  } catch {
    // Ad blockers, SDK errors, and storage failures must never break the form.
  }
}
