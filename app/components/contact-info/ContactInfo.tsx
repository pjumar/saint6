"use client";

import Image from "next/image";
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
  return (
    <section className={styles.section}>
      {/* Spiral Decoration - Top Center */}
      <div className={styles.spiralContainer}>
        <Image
          src="/images/spiral_decoration.svg"
          alt=""
          width={400}
          height={400}
          className={styles.spiralImage}
        />
      </div>

      <div className={styles.container}>
        {/* Left Column: Heading + Subheading */}
        <div className={styles.leftColumn}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.subheading}>{subheading}</p>
        </div>

        {/* Right Column: Contact Details */}
        <div className={styles.rightColumn}>
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
