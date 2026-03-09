"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface DeferredGTMProps {
  gtmId: string;
}

/**
 * Loads GTM after the page is idle (or after 3.5s fallback),
 * keeping it out of the critical rendering path.
 */
export function DeferredGTM({ gtmId }: DeferredGTMProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initialize dataLayer immediately so events can queue before GTM loads
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    const activate = () => setReady(true);

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(activate, { timeout: 3500 });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(activate, 3500);
      return () => clearTimeout(id);
    }
  }, []);

  if (!ready) return null;

  return (
    <Script
      id="_deferred-gtm"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
    />
  );
}
