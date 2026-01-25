"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HamburgerMenu } from "@/app/components/hamburger-menu/HamburgerMenu";
import { LanguageSelector } from "@/app/components/language-selector/LanguageSelector";
import { SocialLinks } from "@/app/components/social-links/SocialLinks";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./MenuOverlay.module.css";

interface MenuOverlayProps {
  isClosing: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isClosing, onClose }: MenuOverlayProps) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const menuItems = [
    { label: t.NAVIGATION.STUDIO_RENTAL, href: `/${locale}/studio-rental` },
    { label: t.NAVIGATION.SET_DESIGN, href: `/${locale}/set-design` },
    { label: t.NAVIGATION.PRODUCTION, href: `/${locale}/production` },
    { label: t.NAVIGATION.EVENT_PLANNING, href: `/${locale}/event-planning` },
    { label: t.NAVIGATION.DECOR, href: `/${locale}/decor` },
    { label: t.NAVIGATION.CREATIVE, href: `/${locale}/creative` },
  ];

  return (
    <div className={`${styles.menuOverlay} ${isClosing ? styles.menuOverlayClosing : ""}`}>
      <div className={styles.menuBackground} />
      <div className={styles.menuDecoration}>
        <Image
          src="/images/decoration-bg.svg"
          alt=""
          width={600}
          height={600}
          className={styles.menuDecorationImage}
        />
        <div className={styles.menuDecorationOverlay}>
          <Image
            src="/images/decoration-group.svg"
            alt=""
            width={600}
            height={600}
            className={styles.menuDecorationOverlayImage}
          />
        </div>
      </div>
      <div className={styles.menuHeader}>
        <div className={styles.menuLogo}>
          <Image
            src="/assets/saint6-logo.svg"
            alt="Saint 6 Studio"
            width={171}
            height={36}
            priority
          />
        </div>
        <HamburgerMenu isOpen={!isClosing} onClick={onClose} ariaLabel="Close menu" />
      </div>
      <nav className={styles.menuNav}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`${styles.menuNavItem} ${pathname === item.href ? styles.menuNavItemActive : ""}`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.menuFooter}>
        <div className={styles.menuFooterLeft}>
          <Link
            href={`/${locale}/contact`}
            className={`caption ${pathname === `/${locale}/contact` ? styles.footerLinkActive : ""}`}
            onClick={onClose}
          >
            {t.NAVIGATION.CONTACT}
          </Link>
          <Link
            href={`/${locale}/about`}
            className={`caption ${pathname === `/${locale}/about` ? styles.footerLinkActive : ""}`}
            onClick={onClose}
          >
            {t.NAVIGATION.ABOUT_US}
          </Link>
          <LanguageSelector variant="menu" />
        </div>
        <div className={styles.menuFooterRight}>
          <SocialLinks variant="menu" />
        </div>
      </div>
    </div>
  );
}

