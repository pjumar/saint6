"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/app/components/header/Header";
import { HeroLoading } from "@/app/components/hero-loading/HeroLoading";
import { LanguageSelector } from "@/app/components/language-selector/LanguageSelector";
import { MenuOverlay } from "@/app/components/menu-overlay/MenuOverlay";
import { SocialLinks } from "@/app/components/social-links/SocialLinks";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  /**
   * Main heading text for the hero section
   */
  heading: string;
  /**
   * Path to the background image
   */
  backgroundImage: string;
  /**
   * Alt text for the background image
   */
  backgroundAlt?: string;
  /**
   * Whether to show the scroll indicator (default: false)
   */
  showScrollIndicator?: boolean;
  /**
   * Whether to show the decorative line (default: false)
   */
  showDecorativeLine?: boolean;
}

export function HeroSection({
  heading,
  backgroundImage,
  backgroundAlt = "Hero background",
  showScrollIndicator = false,
  showDecorativeLine = false,
}: HeroSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useTranslation();
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const decorativeLineRef = useRef<HTMLDivElement>(null);
  const thickLineRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroMiddleRef = useRef<HTMLDivElement>(null);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);

    // Animate hero content in after loading overlay disappears
    const tl = gsap.timeline();
    if (heroContentRef.current) {
      tl.fromTo(
        heroContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
    if (heroMiddleRef.current) {
      tl.fromTo(
        heroMiddleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
    }
  }, []);

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

  useEffect(() => {
    if (!showScrollIndicator || !scrollIndicatorRef.current) return;

    const animation = gsap.to(scrollIndicatorRef.current, {
      y: -8,
      duration: 0.8,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      animation.kill();
    };
  }, [showScrollIndicator]);

  useEffect(() => {
    if (
      !showDecorativeLine ||
      !decorativeLineRef.current ||
      !thickLineRef.current
    )
      return;

    const trackWidth = decorativeLineRef.current.offsetWidth;
    const lineWidth = thickLineRef.current.offsetWidth;

    // Set initial state: hidden to the left
    gsap.set(thickLineRef.current, { x: -lineWidth });

    const tl = gsap.timeline({ repeat: -1 });

    // Lines appear, thick line slides from left to right
    tl.fromTo(
      decorativeLineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power1.out" },
    )
      .fromTo(
        thickLineRef.current,
        { x: -lineWidth },
        { x: trackWidth, duration: 2, ease: "power2.in" },
        "<",
      )
      // Pause at end
      .to({}, { duration: 0.3 })
      // Reverse: thick line slides back from right to left
      .to(thickLineRef.current, {
        x: -lineWidth,
        duration: 2,
        ease: "power2.out",
      })
      // Fade out
      .to(decorativeLineRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.in",
      })
      // Pause before restart
      .to({}, { duration: 0.5 });

    return () => {
      tl.kill();
    };
  }, [showDecorativeLine]);

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
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            className={styles.heroBackgroundImage}
            priority
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className={styles.heroOverlay} />
          {isLoading && (
            <HeroLoading
              isImageLoaded={isImageLoaded}
              onComplete={handleLoadingComplete}
            />
          )}
        </div>

        <Header
          isMenuOpen={isMenuOpen}
          isClosing={isClosing}
          onMenuToggle={handleMenuToggle}
        />

        <div
          ref={heroContentRef}
          className={styles.heroContentWrapper}
          style={{ opacity: isLoading ? 0 : undefined }}
        >
          {showScrollIndicator && (
            <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
              <Image
                src="/images/hero/scroll-icon.svg"
                alt=""
                width={16}
                height={16}
                className={styles.scrollIcon}
              />
              <p className="caption">{t.HERO.SCROLL_DOWN}</p>
            </div>
          )}
          <div className={styles.heroContent}>
            <h1
              className={`heading-mobile heading-desktop ${styles.heroHeading}`}
            >
              {heading}
            </h1>
          </div>
        </div>

        <div
          ref={heroMiddleRef}
          className={styles.heroMiddleSection}
          style={{ opacity: isLoading ? 0 : undefined }}
        >
          {showDecorativeLine && (
            <div ref={decorativeLineRef} className={styles.decorativeLine}>
              <div className={styles.thinLine} />
              <div className={styles.thickLineTrack}>
                <div ref={thickLineRef} className={styles.thickLine} />
              </div>
            </div>
          )}
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
      </section>
      {(isMenuOpen || isClosing) && (
        <MenuOverlay onClose={handleMenuToggle} isClosing={isClosing} />
      )}
    </>
  );
}
