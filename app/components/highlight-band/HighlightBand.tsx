"use client";

import { useScrollAnimation } from "@/app/hooks";
import styles from "./HighlightBand.module.css";

export interface HighlightBandProps {
  /** Label text (e.g., "VISION", "MISSION") */
  label: string;
  /** Main statement text */
  statement: string;
  /** Color variant: primary = red bg/white text, inverted = white bg/dark text */
  variant?: "primary" | "inverted";
}

export function HighlightBand({
  label,
  statement,
  variant = "primary",
}: HighlightBandProps) {
  const containerRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });

  return (
    <section
      className={`${styles.band} ${variant === "inverted" ? styles.inverted : ""}`}
    >
      <div ref={containerRef} className={styles.container}>
        <p className={styles.label}>{label}</p>
        <p className={styles.statement}>{statement}</p>
      </div>
    </section>
  );
}
