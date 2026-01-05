"use client";

import Image from "next/image";
import { useTranslation } from "../../contexts/TranslationContext";
import styles from "./KeyProjectSection.module.css";

export function KeyProjectSection() {
  const { t } = useTranslation();
  return (
    <section className={styles.keyProjectSection}>
      <div className={styles.keyProjectContent}>
        <p className="caption" style={{ opacity: 0.4 }}>
          {t.KEY_PROJECT.CAPTION}
        </p>
        <h2 className={styles.keyProjectHeading}>{t.KEY_PROJECT.HEADING}</h2>
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

