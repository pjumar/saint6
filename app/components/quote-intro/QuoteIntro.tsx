"use client";

import { useScrollAnimation } from "@/app/hooks";
import styles from "./QuoteIntro.module.css";

export interface QuoteIntroProps {
  label: string;
  quote: string;
}

export function QuoteIntro({ label, quote }: QuoteIntroProps) {
  const containerRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });

  return (
    <div ref={containerRef} className={styles.quoteContainer}>
      <p className={styles.label}>{label}</p>
      <p className={styles.quote}>{quote}</p>
    </div>
  );
}
