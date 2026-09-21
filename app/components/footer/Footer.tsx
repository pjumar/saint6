"use client";

import Image from "next/image";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import { SOCIAL_LINKS } from "@/app/constants/social-links";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Footer.module.css";

interface FooterProps {
  contactLabel?: string;
  address?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    platform: string;
    url: string;
    label: string;
  }[];
}

export function Footer({
  contactLabel,
  address,
  email,
  phone,
  socialLinks,
}: FooterProps) {
  const { t, locale } = useTranslation();

  const links =
    socialLinks && socialLinks.length > 0 ? socialLinks : SOCIAL_LINKS;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <SpiralDecoration className={styles.footerDecoration}>
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
        </SpiralDecoration>

        <p className={styles.contactLabel}>
          {contactLabel || t.FOOTER.CONTACT_US}
        </p>

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
          <p className={styles.contactText}>{address || t.FOOTER.ADDRESS}</p>
          <p className={styles.contactText}>{email || t.FOOTER.EMAIL}</p>
          <p className={styles.contactText}>{phone || t.FOOTER.PHONE}</p>
        </div>

        <div className={styles.footerLine} />

        <div className={styles.socialLinks}>
          {links.map((link) => (
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
        <div className={styles.privacyLinks}>
          <a
            href={`/messenger-privacy.html${locale === "vi" ? "#vietnamese" : ""}`}
          >
            {locale === "vi" ? "Quyền riêng tư Messenger" : "Messenger privacy"}
          </a>
          <a
            href={`/messenger-data-deletion.html${locale === "vi" ? "#vietnamese" : ""}`}
          >
            {locale === "vi" ? "Xóa dữ liệu theo dõi" : "Delete tracking data"}
          </a>
        </div>
      </div>
    </footer>
  );
}
