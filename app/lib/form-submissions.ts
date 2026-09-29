// Vercel injects this at build time. Preview visits never enter the live ad funnel.
export const isProductionSite =
  process.env.NEXT_PUBLIC_SITE_ENVIRONMENT === "production";
export const formSubmissionsEnabled =
  isProductionSite ||
  process.env.NEXT_PUBLIC_PREVIEW_FORM_TESTS_ENABLED === "true";

export function submissionData<
  T extends { name: string; trafficSource: string },
>(data: T): T {
  if (isProductionSite) return data;
  if (!formSubmissionsEnabled)
    throw new Error("Preview form sending is disabled");
  return {
    ...data,
    name: `[SAINT6 PREVIEW TEST — DO NOT ACTION] ${data.name}`,
    trafficSource: "test",
    utmSource: "test",
    utmMedium: "qa",
    utmCampaign: "styling-preview-readiness",
  };
}

const tracked = new Set<string>();
export function trackFormConversion(
  event: Record<string, unknown> & { transaction_id?: string },
) {
  if (!isProductionSite || typeof window === "undefined") return;
  if (event.transaction_id && tracked.has(event.transaction_id)) return;
  if (event.transaction_id) tracked.add(event.transaction_id);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function previewFormNotice(locale: string) {
  if (isProductionSite) return null;
  return locale === "vi"
    ? formSubmissionsEnabled
      ? "Chế độ kiểm thử: yêu cầu sẽ được đánh dấu là thử nghiệm."
      : "Bản xem trước: biểu mẫu tạm thời không gửi yêu cầu."
    : formSubmissionsEnabled
      ? "Test mode: submissions are labelled as test enquiries."
      : "Preview: enquiry sending is disabled.";
}
