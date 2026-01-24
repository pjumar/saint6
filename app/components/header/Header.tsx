"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const navItems = [
    { label: t.NAVIGATION.STUDIO_RENTAL, href: `/${locale}/studio-rental` },
    { label: t.NAVIGATION.SET_DESIGN, href: `/${locale}/set-design` },
    { label: t.NAVIGATION.PRODUCTION, href: `/${locale}/production` },
    { label: t.NAVIGATION.EVENT_PLANNING, href: `/${locale}/event-planning` },
    { label: t.NAVIGATION.DECOR, href: `/${locale}/decor` },
    { label: t.NAVIGATION.CREATIVE, href: `/${locale}/creative` },
  ];

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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.desktopNavItem} ${pathname === item.href ? styles.desktopNavItemActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
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

