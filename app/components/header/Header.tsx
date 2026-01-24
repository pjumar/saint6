"use client";

import Image from "next/image";
import Link from "next/link";
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
      <Link href={`/${locale}`} className={styles.logo}>
        <Image
          src="/assets/saint6-logo.svg"
          alt="Saint 6 Studio"
          width={171}
          height={36}
          priority
        />
      </Link>

      <div className={styles.desktopNavWrapper}>
        <nav className={styles.desktopNav}>
          <Link href={`/${locale}/studio-rental`} className={styles.desktopNavItem}>
            {t.NAVIGATION.STUDIO_RENTAL}
          </Link>
          <Link href={`/${locale}/set-design`} className={styles.desktopNavItem}>
            {t.NAVIGATION.SET_DESIGN}
          </Link>
          <Link href={`/${locale}/production`} className={styles.desktopNavItem}>
            {t.NAVIGATION.PRODUCTION}
          </Link>
          <Link href={`/${locale}/event-planning`} className={styles.desktopNavItem}>
            {t.NAVIGATION.EVENT_PLANNING}
          </Link>
          <Link href={`/${locale}/decor`} className={styles.desktopNavItem}>
            {t.NAVIGATION.DECOR}
          </Link>
          <Link href={`/${locale}/creative`} className={styles.desktopNavItem}>
            {t.NAVIGATION.CREATIVE}
          </Link>
        </nav>
        <div className={styles.desktopNavLine} />
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

      <HamburgerMenu isOpen={isMenuOpen} onClick={onMenuToggle} />
    </header>
  );
}

