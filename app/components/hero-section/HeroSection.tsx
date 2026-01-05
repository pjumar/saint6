"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "../header/Header";
import { MenuOverlay } from "../menu-overlay/MenuOverlay";
import { SocialLinks } from "../social-links/SocialLinks";
import { LanguageSelector } from "../language-selector/LanguageSelector";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

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
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
      }, 350);
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/images/hero/hero-background.jpg"
            alt="Hero background"
            fill
            className={styles.heroBackgroundImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>

        <Header
          isMenuOpen={isMenuOpen}
          onMenuToggle={handleMenuToggle}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />

        <div className={styles.heroContentWrapper}>
          <div className={styles.scrollIndicator}>
            <Image
              src="/images/hero/scroll-icon.svg"
              alt=""
              width={16}
              height={16}
              className={styles.scrollIcon}
            />
            <p className="caption">scroll down to explore</p>
          </div>
          <div className={styles.heroContent}>
            <h1 className={`heading-mobile heading-desktop ${styles.heroHeading}`}>
              The place where all your concepts and artistic ideas can come true
            </h1>
          </div>
        </div>

        <div className={styles.heroMiddleSection}>
          <div className={styles.decorativeLine}>
            <Image
              src="/images/hero/decorative-line.svg"
              alt=""
              fill
              className={styles.decorativeLineImage}
            />
          </div>
          <div className={styles.heroLinks}>
            <div className={styles.heroLinksLeft}>
              <SocialLinks />
            </div>
            <div className={styles.heroLinksRight}>
              <a href="#contact" className="caption">
                CONTACT
              </a>
              <a href="#about" className="caption">
                ABOUT US
              </a>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </div>
      </section>
      {isMenuOpen && <MenuOverlay onClose={handleMenuToggle} isClosing={isClosing} />}
    </>
  );
}

