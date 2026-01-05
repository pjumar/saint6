"use client";

import Image from "next/image";
import { LanguageSelector } from "../language-selector/LanguageSelector";
import { SocialLinks } from "../social-links/SocialLinks";
import { HamburgerMenu } from "../hamburger-menu/HamburgerMenu";
import styles from "./Header.module.css";

interface HeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export function Header({
  isMenuOpen,
  onMenuToggle,
  selectedLanguage,
  onLanguageChange,
}: HeaderProps) {
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
          <a href="#studio-rental" className={styles.desktopNavItem}>
            STUDIO RENTAL
          </a>
          <a href="#set-design" className={styles.desktopNavItem}>
            SET DESIGN
          </a>
          <a href="#production" className={styles.desktopNavItem}>
            PRODUCTION
          </a>
          <a href="#event-planning" className={styles.desktopNavItem}>
            EVENT PLANNING
          </a>
          <a href="#decor" className={styles.desktopNavItem}>
            DECOR
          </a>
          <a href="#creative" className={styles.desktopNavItem}>
            CREATIVE
          </a>
        </nav>
        <div className={styles.desktopNavLine} />
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
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </div>

      <HamburgerMenu isOpen={isMenuOpen} onClick={onMenuToggle} />
    </header>
  );
}

