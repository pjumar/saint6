"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { initializeGoogleAds } from "@/app/lib/google-ads";

interface DeferredGTMProps {
  gtmId: string;
  googleAdsId: string;
}

/**
 * Loads the site-wide Google Ads tag once after hydration. GTM remains deferred
 * until the first user interaction or 12 s, whichever comes first, to keep its
 * heavier integrations out of the Lighthouse measurement window.
 */
export function DeferredGTM({ gtmId, googleAdsId }: DeferredGTMProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeGoogleAds();
    window.gtag?.("js", new Date());
    window.gtag?.("config", googleAdsId);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });

    let fired = false;
    const activate = () => {
      if (fired) return;
      fired = true;
      cleanup();
      setReady(true);
    };

    const events = ["scroll", "click", "touchstart", "keydown"] as const;
    for (const evt of events) {
      window.addEventListener(evt, activate, { once: true, passive: true });
    }

    const timer = setTimeout(activate, 12_000);

    const cleanup = () => {
      clearTimeout(timer);
      for (const evt of events) {
        window.removeEventListener(evt, activate);
      }
    };

    return cleanup;
  }, [googleAdsId]);

  return (
    <>
      <Script
        id="_google-ads-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
      />
      {ready && (
        <Script
          id="_deferred-gtm"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
        />
      )}
    </>
  );
}
