"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/header/Header";
import { MenuOverlay } from "@/app/components/menu-overlay/MenuOverlay";
import { SocialLinks } from "@/app/components/social-links/SocialLinks";
import { LanguageSelector } from "@/app/components/language-selector/LanguageSelector";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  /**
   * Main heading text for the hero section
   */
  heading: string;
  /**
   * Path to the background image
   */
  backgroundImage: string;
  /**
   * Alt text for the background image
   */
  backgroundAlt?: string;
  /**
   * Whether to show the scroll indicator (default: false)
   */
  showScrollIndicator?: boolean;
  /**
   * Whether to show the decorative line (default: false)
   */
  showDecorativeLine?: boolean;
}

export function HeroSection({
  heading,
  backgroundImage,
  backgroundAlt = "Hero background",
  showScrollIndicator = false,
  showDecorativeLine = false,
}: HeroSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            className={styles.heroBackgroundImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>

        <Header
          isMenuOpen={isMenuOpen}
          isClosing={isClosing}
          onMenuToggle={handleMenuToggle}
        />

        <div className={styles.heroContentWrapper}>
          {showScrollIndicator && (
            <div className={styles.scrollIndicator}>
              <Image
                src="/images/hero/scroll-icon.svg"
                alt=""
                width={16}
                height={16}
                className={styles.scrollIcon}
              />
              <p className="caption">{t.HERO.SCROLL_DOWN}</p>
            </div>
          )}
          <div className={styles.heroContent}>
            <h1 className={`heading-mobile heading-desktop ${styles.heroHeading}`}>
              {heading}
            </h1>
          </div>
        </div>

        <div className={styles.heroMiddleSection}>
          {showDecorativeLine && (
            <div className={styles.decorativeLine}>
              <Image
                src="/images/hero/decorative-line.svg"
                alt=""
                fill
                className={styles.decorativeLineImage}
              />
            </div>
          )}
          <div className={styles.heroLinks}>
            <div className={styles.heroLinksLeft}>
              <SocialLinks />
            </div>
            <div className={styles.heroLinksRight}>
              <Link href={`/${locale}/contact`} className="caption">
                {t.NAVIGATION.CONTACT}
              </Link>
              <Link href={`/${locale}/about`} className="caption">
                {t.NAVIGATION.ABOUT_US}
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </section>
      {(isMenuOpen || isClosing) && (
        <MenuOverlay onClose={handleMenuToggle} isClosing={isClosing} />
      )}
    </>
  );
}
