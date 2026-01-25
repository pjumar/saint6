"use client";

import Image from "next/image";
import styles from "./ContactInfo.module.css";

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfoProps {
  label?: string;
  heading: string;
  address: {
    line1: string;
    line2?: string;
  };
  email: string;
  phone: string;
  socialLinks?: SocialLink[];
}

export function ContactInfo({
  label = "CONTACT US",
  heading,
  address,
  email,
  phone,
  socialLinks,
}: ContactInfoProps) {
  return (
    <div className={styles.contactInfo}>
      {/* Label */}
      <span className={styles.label}>{label}</span>

      {/* Heading */}
      <h2 className={styles.heading}>{heading}</h2>

      {/* Contact Details */}
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Address</span>
          <p className={styles.detailText}>
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
          </p>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Email</span>
          <a href={`mailto:${email}`} className={styles.detailLink}>
            {email}
          </a>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Phone</span>
          <p className={styles.detailText}>{phone}</p>
        </div>
      </div>

      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className={styles.socialLinks}>
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
            >
              <Image
                src={link.icon}
                alt={link.platform}
                width={24}
                height={24}
                className={styles.socialIcon}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
