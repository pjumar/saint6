"use client";

import { useScrollAnimation } from "@/app/hooks";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import styles from "./ContactInfo.module.css";

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface ContactInfoProps {
  heading: string;
  subheading: string;
  address: string;
  email: string;
  phone: string;
  socialLinks?: SocialLink[];
}

/**
 * ContactInfo component - Two-column layout
 * Left: Heading + subheading
 * Right: Contact details + text social links
 */
export function ContactInfo({
  heading,
  subheading,
  address,
  email,
  phone,
  socialLinks,
}: ContactInfoProps) {
  const leftColumnRef = useScrollAnimation<HTMLDivElement>({ type: "fadeLeft" });
  const rightColumnRef = useScrollAnimation<HTMLDivElement>({
    type: "fadeRight",
    delay: 0.15,
  });

  return (
    <section className={styles.section}>
      {/* Spiral Decoration - Top Center */}
      <SpiralDecoration
        className={styles.spiralContainer}
        imageClassName={styles.spiralImage}
        width={400}
        height={400}
      />

      <div className={styles.container}>
        {/* Left Column: Heading + Subheading */}
        <div ref={leftColumnRef} className={styles.leftColumn}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.subheading}>{subheading}</p>
        </div>

        {/* Right Column: Contact Details */}
        <div ref={rightColumnRef} className={styles.rightColumn}>
          <div className={styles.details}>
            <p className={styles.detailText}>{address}</p>
            <a href={`mailto:${email}`} className={styles.detailLink}>
              {email}
            </a>
            <p className={styles.detailText}>{phone}</p>
          </div>

          {/* Social Links as Text */}
          {socialLinks && socialLinks.length > 0 && (
            <div className={styles.socialLinks}>
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className={styles.socialTextLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
