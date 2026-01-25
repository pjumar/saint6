import Image from "next/image";
import styles from "./FounderQuote.module.css";

export interface FounderQuoteProps {
  /** Portrait image URL */
  imageUrl: string;
  /** Quote text */
  quote: string;
  /** Founder name */
  name: string;
  /** Founder title/role */
  title: string;
}

export function FounderQuote({
  imageUrl,
  quote,
  name,
  title,
}: FounderQuoteProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Desktop: Image left, Quote card right */}
        {/* Mobile: Quote card top, Image bottom */}
        <div className={styles.quoteCard}>
          <div className={styles.quoteContent}>
            <p className={styles.quote}>
              <span className={styles.openQuote}>&ldquo;</span>
              {quote}&rdquo;
            </p>
            <div className={styles.attribution}>
              <p className={styles.name}>{name}</p>
              <p className={styles.founderTitle}>{title}</p>
            </div>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={`${name}, ${title}`}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
