"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { prepareMessengerLink } from "@/app/lib/messenger/client";
import type { StylingLocale } from "@/app/lib/styling/types";
import styles from "./Styling.module.css";

export function StylingContactLinks({ locale }: { locale: StylingLocale }) {
  const pathname = usePathname();
  const [messengerUrl, setMessengerUrl] = useState(
    "https://m.me/saint6studios",
  );
  useEffect(() => {
    if (!pathname) return;
    let active = true;
    void prepareMessengerLink().then((url) => {
      if (active) setMessengerUrl(url);
    });
    return () => {
      active = false;
    };
  }, [pathname]);
  return (
    <>
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.textLink}
      >
        Messenger ↗
      </a>
      <a
        href="https://zalo.me/2477208361282261352"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.textLink}
        onClick={() => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "zalo_click",
            contact_channel: "zalo",
            contact_placement: "styling_enquiry",
            link_url: "https://zalo.me/2477208361282261352",
            page_path: pathname,
            language: locale,
          });
        }}
      >
        Zalo ↗
      </a>
    </>
  );
}
