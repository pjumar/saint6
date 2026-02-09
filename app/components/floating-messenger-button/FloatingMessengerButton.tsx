"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./FloatingMessengerButton.module.css";

const MESSENGER_URL = "https://m.me/saint6studios";
const AUTO_HIDE_MS = 3000;
const MOBILE_BREAKPOINT = 769;

/**
 * Floating Messenger button - appears on all pages
 * Opens Facebook Messenger chat with Saint 6 in a new tab
 */
export function FloatingMessengerButton() {
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const startHideTimer = useCallback(() => {
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setHidden(true), AUTO_HIDE_MS);
  }, []);

  const clearHideTimer = useCallback(() => {
    clearTimeout(hideTimerRef.current);
  }, []);

  const hide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(hideTimerRef.current);
    setHidden(true);
  }, []);

  const unhide = useCallback(() => {
    setHidden(false);
    startHideTimer();
  }, [startHideTimer]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (hidden) {
        e.preventDefault();
        e.stopPropagation();
        unhide();
      }
    },
    [hidden, unhide],
  );

  const handleMouseEnter = useCallback(() => {
    if (hidden) {
      unhide();
    } else {
      clearHideTimer();
    }
  }, [hidden, unhide, clearHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (!hidden) {
      startHideTimer();
    }
  }, [hidden, startHideTimer]);

  // Auto-hide on mobile after 3s
  useEffect(() => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) return;
    const timer = setTimeout(() => setHidden(true), AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => clearTimeout(hideTimerRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${hidden ? styles.hidden : ""}`}
      onClick={handleContainerClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={styles.close}
        onClick={hide}
        aria-label="Hide messenger button"
      >
        <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      </button>
      <a
        href={MESSENGER_URL}
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
    </div>
  );
}
