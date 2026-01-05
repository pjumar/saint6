import Image from "next/image";
import styles from "./KeyProjectSection.module.css";

export function KeyProjectSection() {
  return (
    <section className={styles.keyProjectSection}>
      <div className={styles.keyProjectContent}>
        <p className="caption" style={{ opacity: 0.4 }}>
          Highlights from the journeys that shaped our craft.
        </p>
        <h2 className={styles.keyProjectHeading}>Key Project</h2>
        <div className={styles.keyProjectDecoration}>
          <Image
            src="/images/decoration-bg.svg"
            alt=""
            width={710}
            height={710}
            className={styles.keyProjectBg}
          />
          <Image
            src="/images/decoration-group.svg"
            alt=""
            width={710}
            height={710}
            className={styles.keyProjectGroup}
          />
        </div>
      </div>
    </section>
  );
}

