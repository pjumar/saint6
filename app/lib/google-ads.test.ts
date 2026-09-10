import assert from "node:assert/strict";
import test from "node:test";
import { initializeGoogleAds, reportGoogleAdsConversion } from "./google-ads";

function createTarget() {
  const values = new Map<string, string>();
  const redirects: string[] = [];
  return {
    target: {
      dataLayer: [] as unknown[],
      gtag: undefined as
        | ((
            command: string,
            action: string | Date,
            params?: Record<string, unknown>,
          ) => void)
        | undefined,
      gtag_report_conversion: undefined as
        | ((url?: string, transactionId?: string) => boolean)
        | undefined,
      sessionStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
      location: { assign: (url: string) => redirects.push(url) },
    },
    redirects,
  };
}

test("reports one conversion per backend enquiry ID without redirecting", () => {
  const { target, redirects } = createTarget();
  initializeGoogleAds(target);

  reportGoogleAdsConversion(123, target);
  reportGoogleAdsConversion(123, target);

  assert.equal(target.dataLayer.length, 1);
  const [command, action, params] = target.dataLayer[0] as [
    string,
    string,
    Record<string, unknown>,
  ];
  assert.equal(command, "event");
  assert.equal(action, "conversion");
  assert.equal(params.send_to, "AW-18437392228/qRKzCMCsvPEcEOSO0ddE");
  assert.equal(params.transaction_id, "123");
  assert.equal(params.value, 1.0);
  assert.equal(params.currency, "VND");

  (params.event_callback as () => void)();
  assert.deepEqual(redirects, []);
});

test("tracking errors never escape into booking flow", () => {
  const { target } = createTarget();
  target.gtag = () => {
    throw new Error("blocked tracker");
  };
  initializeGoogleAds(target);

  assert.doesNotThrow(() => reportGoogleAdsConversion("enquiry-456", target));
});
