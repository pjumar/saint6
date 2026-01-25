import styles from "./OurStory.module.css";

export interface OurStoryProps {
  /** Section label (e.g., "Our Story") */
  label: string;
  /** Story paragraphs */
  paragraphs: string[];
}

export function OurStory({ label, paragraphs }: OurStoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.labelWrapper}>
          <p className={styles.label}>{label}</p>
        </div>

        <div className={styles.textWrapper}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
