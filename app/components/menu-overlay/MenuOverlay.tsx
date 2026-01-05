"use client";

import Image from "next/image";
import { HamburgerMenu } from "../hamburger-menu/HamburgerMenu";
import { LanguageSelector } from "../language-selector/LanguageSelector";
import { SocialLinks } from "../social-links/SocialLinks";
import { useTranslation } from "../../contexts/TranslationContext";
import styles from "./MenuOverlay.module.css";

interface MenuOverlayProps {
  isClosing: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isClosing, onClose }: MenuOverlayProps) {
  const { t } = useTranslation();
  const menuItems = [
    t.NAVIGATION.STUDIO_RENTAL,
    t.NAVIGATION.SET_DESIGN,
    t.NAVIGATION.PRODUCTION,
    t.NAVIGATION.EVENT_PLANNING,
    t.NAVIGATION.DECOR,
    t.NAVIGATION.CREATIVE,
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
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className={styles.menuNavItem}
            onClick={onClose}
          >
            {item}
          </a>
        ))}
      </nav>
      <div className={styles.menuFooter}>
        <div className={styles.menuFooterLeft}>
          <a href="#contact" className="caption">
            {t.NAVIGATION.CONTACT}
          </a>
          <a href="#about" className="caption">
            {t.NAVIGATION.ABOUT_US}
          </a>
          <LanguageSelector variant="menu" />
        </div>
        <div className={styles.menuFooterRight}>
          <SocialLinks variant="menu" />
        </div>
      </div>
    </div>
  );
}

