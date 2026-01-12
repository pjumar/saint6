"use client";

import Image from "next/image";
import { LanguageSelector } from "@/app/components/language-selector/LanguageSelector";
import { SocialLinks } from "@/app/components/social-links/SocialLinks";
import { HamburgerMenu } from "@/app/components/hamburger-menu/HamburgerMenu";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Header.module.css";

interface HeaderProps {
  isMenuOpen: boolean;
  isClosing?: boolean;
  onMenuToggle: () => void;
}

export function Header({
  isMenuOpen,
  isClosing = false,
  onMenuToggle,
}: HeaderProps) {
  const { t, locale } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/assets/saint6-logo.svg"
          alt="Saint 6 Studio"
          width={171}
          height={36}
          priority
        />
      </div>

      <div className={styles.desktopNavWrapper}>
        <nav className={styles.desktopNav}>
          <a href={`/${locale}/studio-rental`} className={styles.desktopNavItem}>
            {t.NAVIGATION.STUDIO_RENTAL}
          </a>
          <a href="#set-design" className={styles.desktopNavItem}>
            {t.NAVIGATION.SET_DESIGN}
          </a>
          <a href="#production" className={styles.desktopNavItem}>
            {t.NAVIGATION.PRODUCTION}
          </a>
          <a href="#event-planning" className={styles.desktopNavItem}>
            {t.NAVIGATION.EVENT_PLANNING}
          </a>
          <a href="#decor" className={styles.desktopNavItem}>
            {t.NAVIGATION.DECOR}
          </a>
          <a href="#creative" className={styles.desktopNavItem}>
            {t.NAVIGATION.CREATIVE}
          </a>
        </nav>
        <div className={styles.desktopNavLine} />
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

      <HamburgerMenu isOpen={isMenuOpen} onClick={onMenuToggle} />
    </header>
  );
}

