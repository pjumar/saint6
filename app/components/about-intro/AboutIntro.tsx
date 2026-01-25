import Image from "next/image";
import styles from "./AboutIntro.module.css";

export interface AboutIntroProps {
  /** Section label (e.g., "ABOUT US") */
  label: string;
  /** Main headline text */
  headline: string;
  /** Body text paragraphs */
  bodyText: string[];
  /** Side portrait image URL */
  imageUrl: string;
  /** Image alt text */
  imageAlt?: string;
}

export function AboutIntro({
  label,
  headline,
  bodyText,
  imageUrl,
  imageAlt = "Portrait",
}: AboutIntroProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.labelWrapper}>
          <p className={styles.label}>{label}</p>
        </div>

        <div className={styles.contentWrapper}>
          <h2 className={styles.headline}>{headline}</h2>

          <div className={styles.bodyRow}>
            <div className={styles.bodyContent}>
              {bodyText.map((paragraph, index) => (
                <p key={index} className={styles.bodyText}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 330px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
