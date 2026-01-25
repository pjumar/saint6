"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { SOCIAL_LINKS } from "@/app/constants/social-links";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerDecoration}>
          <Image
            src="/images/decoration-bg.svg"
            alt=""
            width={600}
            height={600}
            className={styles.footerDecorationBg}
          />
          <div className={styles.footerDecorationOverlay}>
            <Image
              src="/images/decoration-group.svg"
              alt=""
              width={600}
              height={600}
              className={styles.footerDecorationGroup}
            />
          </div>
        </div>

        <p className={styles.contactLabel}>{t.FOOTER.CONTACT_US}</p>

        <div className={styles.logoWrapper}>
          <Image
            src="/assets/saint6-logo.svg"
            alt="Saint 6 Studio"
            width={297}
            height={63}
            className={styles.logo}
          />
        </div>

        <div className={styles.contactInfo}>
          <p className={styles.contactText}>{t.FOOTER.ADDRESS}</p>
          <p className={styles.contactText}>{t.FOOTER.EMAIL}</p>
          <p className={styles.contactText}>{t.FOOTER.PHONE}</p>
        </div>

        <div className={styles.footerLine} />

        <div className={styles.socialLinks}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

