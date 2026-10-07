"use client";

import type { MouseEvent } from "react";
import styles from "./StudioNavigation.module.css";

interface StudioNavigationProps {
  label: string;
  links: { label: string; target: string }[];
}

export function StudioNavigation({ label, links }: StudioNavigationProps) {
  function navigate(event: MouseEvent<HTMLAnchorElement>, target: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const element = document.getElementById(target);
    if (!element) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.history.pushState(null, "", `#${target}`);
    element.focus({ preventScroll: true });
    element.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });
  }

  return (
    <nav className={styles.links} aria-label={label}>
      {links.map((link) => (
        <a
          key={link.target}
          href={`#${link.target}`}
          onClick={(event) => navigate(event, link.target)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
