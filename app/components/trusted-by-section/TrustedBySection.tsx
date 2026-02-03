"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./TrustedBySection.module.css";

export interface BrandLogo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface TrustedBySectionProps {
  logos?: BrandLogo[];
}

// Default fallback logos
const DEFAULT_LOGOS: BrandLogo[] = [
  { id: "1", src: "/images/brands/brand-01.png", alt: "L'OFFICIEL", width: 170, height: 35 },
  { id: "2", src: "/images/brands/brand-02.png", alt: "Lenskart", width: 138, height: 40 },
  { id: "3", src: "/images/brands/brand-03.png", alt: "Vinamilk", width: 98, height: 32 },
  { id: "4", src: "/images/brands/brand-04.png", alt: "SONY", width: 114, height: 20 },
  { id: "5", src: "/images/brands/brand-05.png", alt: "VinFast", width: 128, height: 32 },
];

export function TrustedBySection({ logos = DEFAULT_LOGOS }: TrustedBySectionProps) {
  const { t } = useTranslation();
  const logosRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [hiddenLogos, setHiddenLogos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const logosContainer = logosRef.current;
    if (!logosContainer) return;

    const checkMobile = () => {
      return window.innerWidth <= 48 * 16;
    };

    if (!checkMobile()) return;

    const scrollWidth = logosContainer.scrollWidth;
    const halfScrollWidth = scrollWidth / 2;
    const scrollSpeed = 30;

    const animate = () => {
      gsap.set(logosContainer, { scrollLeft: 0 });

      const timeline = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          logosContainer.scrollLeft = 0;
        },
      });

      timeline.to(logosContainer, {
        scrollLeft: halfScrollWidth,
        duration: halfScrollWidth / scrollSpeed,
        ease: "none",
      });

      animationRef.current = timeline;
    };

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    logosContainer.addEventListener("wheel", preventScroll, { passive: false });
    logosContainer.addEventListener("touchmove", preventScroll, {
      passive: false,
    });
    logosContainer.addEventListener("scroll", preventScroll, {
      passive: false,
    });

    animate();

    const handleResize = () => {
      const isMobile = checkMobile();

      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }

      if (!isMobile) {
        logosContainer.scrollLeft = 0;
        return;
      }

      const newScrollWidth = logosContainer.scrollWidth;
      const newHalfScrollWidth = newScrollWidth / 2;
      gsap.set(logosContainer, { scrollLeft: 0 });
      const timeline = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          logosContainer.scrollLeft = 0;
        },
      });
      timeline.to(logosContainer, {
        scrollLeft: newHalfScrollWidth,
        duration: newHalfScrollWidth / scrollSpeed,
        ease: "none",
      });
      animationRef.current = timeline;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      logosContainer.removeEventListener("wheel", preventScroll);
      logosContainer.removeEventListener("touchmove", preventScroll);
      logosContainer.removeEventListener("scroll", preventScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogoError = (logoId: string) => {
    setHiddenLogos((prev) => new Set(prev).add(logoId));
  };

  return (
    <section className={styles.trustedBy}>
      <div className={styles.trustedByContent}>
        <p className="caption" style={{ color: "var(--color-primary)" }}>
          {t.TRUSTED_BY.CAPTION}
        </p>
        <h2 className="heading-desktop">{t.TRUSTED_BY.HEADING}</h2>
      </div>
      <div className={styles.brandLogos} ref={logosRef}>
        {logos.map((logo) => (
          <Image
            key={`logo-${logo.id}`}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={styles.brandLogo}
            style={hiddenLogos.has(logo.id) ? { display: "none" } : undefined}
            onError={() => handleLogoError(logo.id)}
          />
        ))}
        <div className={styles.brandLogosDuplicate}>
          {logos.map((logo) => (
            <Image
              key={`logo-duplicate-${logo.id}`}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={styles.brandLogo}
              style={hiddenLogos.has(logo.id) ? { display: "none" } : undefined}
              onError={() => handleLogoError(logo.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
