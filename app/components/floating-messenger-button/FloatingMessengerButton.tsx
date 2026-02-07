"use client";

import { getSocialLink } from "@/app/constants/social-links";
import styles from "./FloatingMessengerButton.module.css";

/**
 * Floating Messenger button - appears on all pages
 * Opens Facebook Messenger chat with Saint 6 in a new tab
 */
export function FloatingMessengerButton() {
  const messengerLink = getSocialLink("Messenger");

  if (!messengerLink) {
    return null;
  }

  return (
    <a
      href={messengerLink.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Chat with us on Messenger"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={styles.icon}
        aria-hidden="true"
      >
        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.25 1.87.38 2.88.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.75-1.47.94-2.17.41l-2.34-1.75a.6.6 0 00-.72 0l-3.16 2.4c-.42.32-.97-.16-.69-.6l2.93-4.67c.47-.75 1.47-.94 2.17-.41l2.34 1.75a.6.6 0 00.72 0l3.16-2.4c.42-.32.97.16.69.6z" />
      </svg>
    </a>
  );
}
