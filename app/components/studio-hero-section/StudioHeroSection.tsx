"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/app/components/header/Header";
import { MenuOverlay } from "@/app/components/menu-overlay/MenuOverlay";
import { SocialLinks } from "@/app/components/social-links/SocialLinks";
import { LanguageSelector } from "@/app/components/language-selector/LanguageSelector";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./StudioHeroSection.module.css";

export function StudioHeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();

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
            src="/images/studio-rental/hero-background.jpg"
            alt="Studio Rental"
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

        <div className={styles.heroContent}>
          <h1 className={styles.heroTagline}>
            {t.STUDIO_RENTAL.HERO.TAGLINE}
          </h1>
        </div>

        <div className={styles.heroBottomSection}>
          <div className={styles.heroLinks}>
            <div className={styles.heroLinksLeft}>
              <SocialLinks />
            </div>
            <div className={styles.heroLinksRight}>
              <a href="#contact" className="caption">
                {t.NAVIGATION.CONTACT}
              </a>
              <a href="#about" className="caption">
                {t.NAVIGATION.ABOUT_US}
              </a>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </section>
      {(isMenuOpen || isClosing) && <MenuOverlay onClose={handleMenuToggle} isClosing={isClosing} />}
    </>
  );
}
