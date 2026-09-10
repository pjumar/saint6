import { GOOGLE_ADS_CONVERSION_SEND_TO } from "@/app/lib/constants";

const REPORTED_ENQUIRIES_KEY = "saint6_google_ads_reported_enquiries";

type Gtag = (
  ...args: [string, string | Date, Record<string, unknown>?]
) => void;

interface GoogleAdsWindow {
  dataLayer: unknown[];
  gtag?: Gtag;
  gtag_report_conversion?: (url?: string, transactionId?: string) => boolean;
  sessionStorage: Pick<Storage, "getItem" | "setItem">;
  location: Pick<Location, "assign">;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
    gtag_report_conversion?: (url?: string, transactionId?: string) => boolean;
  }
}

function getReportedEnquiries(target: GoogleAdsWindow): Set<string> {
  try {
    const stored = target.sessionStorage.getItem(REPORTED_ENQUIRIES_KEY);
    return new Set(stored ? (JSON.parse(stored) as string[]) : []);
  } catch {
    return new Set();
  }
}

function rememberReportedEnquiry(
  target: GoogleAdsWindow,
  enquiryId: string,
): void {
  try {
    const reported = getReportedEnquiries(target);
    reported.add(enquiryId);
    target.sessionStorage.setItem(
      REPORTED_ENQUIRIES_KEY,
      JSON.stringify([...reported]),
    );
  } catch {
    // Storage failures must not affect submission success.
  }
}

export function initializeGoogleAds(target: GoogleAdsWindow = window): void {
  target.dataLayer = target.dataLayer || [];
  target.gtag ??= (...args) => {
    target.dataLayer.push(args);
  };

  target.gtag_report_conversion = (url?: string, transactionId?: string) => {
    const callback = () => {
      if (typeof url !== "undefined") target.location.assign(url);
    };

    const params: Record<string, unknown> = {
      send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      value: 1.0,
      currency: "VND",
      event_callback: callback,
    };
    if (transactionId) params.transaction_id = transactionId;

    try {
      target.gtag?.("event", "conversion", params);
    } catch {
      // Tracking failures must never interrupt the booking flow.
    }
    return false;
  };
}

export function reportGoogleAdsConversion(
  enquiryId: string | number,
  target: GoogleAdsWindow = window,
): void {
  try {
    const transactionId = String(enquiryId);
    if (getReportedEnquiries(target).has(transactionId)) return;
    if (!target.gtag_report_conversion) return;

    target.gtag_report_conversion(undefined, transactionId);
    rememberReportedEnquiry(target, transactionId);
  } catch {
    // Tracking failures must never interrupt the booking flow.
  }
}
