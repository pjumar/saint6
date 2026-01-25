import Image from "next/image";
import styles from "./ValuesGrid.module.css";

export interface ValueItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

export interface ValuesGridProps {
  values: ValueItem[];
}

export function ValuesGrid({ values }: ValuesGridProps) {
  // Desktop shows first 3, mobile shows all 6
  const desktopValues = values.slice(0, 3);

  return (
    <section className={styles.section}>
      {/* Desktop Layout: Large SAINT6 letters with 3 value cards */}
      <div className={styles.desktopLayout}>
        <div className={styles.lettersContainer}>
          <Image
            src="/images/about/saint6-letters.svg"
            alt="SAINT6"
            width={203}
            height={56}
            className={styles.lettersImage}
          />
        </div>
        <div className={styles.desktopCards}>
          {desktopValues.map((value) => (
            <div key={value.id} className={styles.desktopCard}>
              <div className={styles.desktopCardImage}>
                <Image
                  src={value.imageUrl}
                  alt={value.title}
                  width={212}
                  height={240}
                  className={styles.valueImage}
                />
              </div>
              <div className={styles.desktopCardText}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout: 6 value cards stacked */}
      <div className={styles.mobileLayout}>
        {values.map((value) => (
          <div key={value.id} className={styles.mobileCard}>
            <div className={styles.mobileCardImage}>
              <Image
                src={value.imageUrl}
                alt={value.title}
                width={106}
                height={120}
                className={styles.valueImage}
              />
            </div>
            <div className={styles.mobileCardText}>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
