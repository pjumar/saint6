"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { prepareMessengerLink } from "@/app/lib/messenger/client";
import styles from "./FloatingMessengerButton.module.css";

const MESSENGER_URL = "https://m.me/saint6studios";
// Decoded from the owner's OA QR and verified against the Saint 6 profile.
const ZALO_URL = "https://zalo.me/2477208361282261352";

/**
 * Direct contact links are present in the initial HTML. Attribution prepares
 * after hydration without delaying access to either messaging service.
 */
export function FloatingMessengerButton() {
  const [messengerUrl, setMessengerUrl] = useState(MESSENGER_URL);
  const pathname = usePathname();
  const { locale } = useTranslation();
  const isVi = locale === "vi";

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

  const trackZaloClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "zalo_click",
      contact_channel: "zalo",
      contact_placement: "floating_button",
      link_url: ZALO_URL,
      page_path: pathname,
      language: locale,
    });
  };

  return (
    <nav
      className={styles.container}
      aria-label={isVi ? "Nhắn tin cho Saint 6" : "Message Saint 6"}
    >
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label={
          isVi ? "Nhắn tin qua Messenger" : "Chat with us on Messenger"
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.icon}
          aria-hidden="true"
        >
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.25 1.87.38 2.88.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.75-1.47.94-2.17.41l-2.34-1.75a.6.6 0 00-.72 0l-3.16 2.4c-.42.32-.97-.16-.69-.6l2.93-4.67c.47-.75 1.47-.94 2.17-.41l2.34 1.75a.6.6 0 00.72 0l3.16-2.4c.42-.32.97.16.69.6z" />
        </svg>
        <span>Messenger</span>
      </a>
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.zaloButton}`}
        aria-label={isVi ? "Nhắn tin qua Zalo" : "Chat with us on Zalo"}
        onClick={trackZaloClick}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={styles.icon}
          aria-hidden="true"
        >
          <path
            d="M20 11.5a8 8 0 0 1-8 8c-1.2 0-2.35-.26-3.38-.73L4 20l1.23-4.62A8 8 0 1 1 20 11.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 8.5h6l-6 6h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Zalo</span>
      </a>
    </nav>
  );
}
