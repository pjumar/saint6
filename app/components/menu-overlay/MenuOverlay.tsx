"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isClosing) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    dialog.addEventListener("keydown", handleKey);
    return () => {
      dialog.removeEventListener("keydown", handleKey);
      previous?.focus({ preventScroll: true });
    };
  }, [onClose, isClosing]);
  const menuItems = [
    { label: t.NAVIGATION.STUDIO_RENTAL, href: `/${locale}/studio-rental` },
    { label: t.NAVIGATION.SET_DESIGN, href: `/${locale}/set-design` },
    { label: t.NAVIGATION.PRODUCTION, href: `/${locale}/production` },
    { label: t.NAVIGATION.EVENT_PLANNING, href: `/${locale}/event-planning` },
    { label: t.NAVIGATION.DECOR, href: `/${locale}/decor` },
    { label: t.NAVIGATION.CREATIVE, href: `/${locale}/creative` },
    ...(process.env.NEXT_PUBLIC_STYLING_ENABLED === "true"
      ? [{ label: t.NAVIGATION.STYLING, href: `/${locale}/styling` }]
      : []),
  ];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={locale === "vi" ? "Menu điều hướng" : "Navigation menu"}
      className={`${styles.menuOverlay} ${process.env.NEXT_PUBLIC_STYLING_ENABLED === "true" ? styles.expandedMenu : ""} ${isClosing ? styles.menuOverlayClosing : ""}`}
    >
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
          />
        </div>
        <HamburgerMenu
          isOpen={!isClosing}
          onClick={onClose}
          ariaLabel="Close menu"
        />
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
