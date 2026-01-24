"use client";

import styles from "./QuoteIntro.module.css";

export interface QuoteIntroProps {
  label: string;
  quote: string;
}

export function QuoteIntro({ label, quote }: QuoteIntroProps) {
  return (
    <div className={styles.quoteContainer}>
      <p className={styles.label}>{label}</p>
      <p className={styles.quote}>{quote}</p>
    </div>
  );
}
