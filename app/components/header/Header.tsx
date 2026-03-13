"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { HamburgerMenu } from "@/app/components/hamburger-menu/HamburgerMenu";
import { LanguageSelector } from "@/app/components/language-selector/LanguageSelector";
import { SocialLinks } from "@/app/components/social-links/SocialLinks";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { loadGsap } from "@/app/lib/gsap";
import styles from "./Header.module.css";

interface HeaderProps {
  isMenuOpen: boolean;
  isClosing?: boolean;
  onMenuToggle: () => void;
}

export function Header({
  isMenuOpen,
  isClosing: _isClosing = false,
  onMenuToggle,
}: HeaderProps) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const thickLineRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const animationsRef = useRef<Map<string, gsap.core.Timeline>>(new Map());
  const gsapRef = useRef<Awaited<ReturnType<typeof loadGsap>> | null>(null);

  useEffect(() => {
    loadGsap().then((g) => {
      gsapRef.current = g;
    });
  }, []);

  const navItems = useMemo(
    () => [
      { label: t.NAVIGATION.STUDIO_RENTAL, href: `/${locale}/studio-rental` },
      { label: t.NAVIGATION.SET_DESIGN, href: `/${locale}/set-design` },
      { label: t.NAVIGATION.PRODUCTION, href: `/${locale}/production` },
      { label: t.NAVIGATION.EVENT_PLANNING, href: `/${locale}/event-planning` },
      { label: t.NAVIGATION.DECOR, href: `/${locale}/decor` },
      { label: t.NAVIGATION.CREATIVE, href: `/${locale}/creative` },
    ],
    [t, locale],
  );

  // Prefetch all nav routes after page load for faster navigation
  useEffect(() => {
    const onLoad = () => {
      navItems.forEach((item) => {
        router.prefetch(item.href);
      });
      router.prefetch(`/${locale}/contact`);
      router.prefetch(`/${locale}/about`);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, [navItems, router, locale]);

  const handleMouseEnter = useCallback(
    (href: string) => {
      if (pathname === href) return;
      const g = gsapRef.current;
      if (!g) return;

      const thickLine = thickLineRefs.current.get(href);
      if (!thickLine) return;

      const existingAnim = animationsRef.current.get(href);
      if (existingAnim) {
        existingAnim.kill();
      }

      const tl = g.timeline();
      animationsRef.current.set(href, tl);

      tl.fromTo(
        thickLine,
        { left: 0 },
        { left: "calc(100% - 1.0625rem)", duration: 0.35, ease: "power1.out" },
      );
    },
    [pathname],
  );

  const handleMouseLeave = useCallback(
    (href: string) => {
      if (pathname === href) return;
      const g = gsapRef.current;
      if (!g) return;

      const anim = animationsRef.current.get(href);
      if (anim) {
        anim.kill();
        animationsRef.current.delete(href);
      }

      const thickLine = thickLineRefs.current.get(href);
      if (thickLine) {
        g.to(thickLine, {
          left: 0,
          duration: 0.25,
          ease: "power1.in",
        });
      }
    },
    [pathname],
  );

  // Set active nav item thick line to end position (no animation)
  useEffect(() => {
    const timer = setTimeout(() => {
      const g = gsapRef.current;
      if (!g) return;

      const activeHref = navItems.find((item) => pathname === item.href)?.href;
      if (!activeHref) return;

      const thickLine = thickLineRefs.current.get(activeHref);
      if (!thickLine) return;

      g.set(thickLine, { left: "calc(100% - 1.0625rem)" });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, navItems]);

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
              onMouseEnter={() => handleMouseEnter(item.href)}
              onMouseLeave={() => handleMouseLeave(item.href)}
            >
              <span className={styles.navIndicator}>
                <span className={styles.navThinLine} />
                <span className={styles.navThickLineTrack}>
                  <span
                    ref={(el) => {
                      if (el) thickLineRefs.current.set(item.href, el);
                    }}
                    className={styles.navThickLine}
                  />
                </span>
              </span>
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
