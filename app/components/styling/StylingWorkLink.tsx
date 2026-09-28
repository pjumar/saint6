"use client";

import type { MouseEvent, ReactNode } from "react";
import styles from "./Styling.module.css";

export function StylingWorkLink({ children }: { children: ReactNode }) {
  function scrollToWork(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const target = document.getElementById("styling-projects");
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }

  return (
    // biome-ignore lint/a11y/useValidAnchor: This is fragment navigation with a native no-JavaScript fallback.
    <a
      href="#styling-projects"
      className={styles.button}
      onClick={scrollToWork}
    >
      {children}
      <span aria-hidden="true">↓</span>
    </a>
  );
}
