"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { useScrollAnimation } from "@/app/hooks";
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
  { id: "1", src: "/images/brands/lenskart.png", alt: "Lenskart", width: 138, height: 40 },
  { id: "2", src: "/images/brands/lofficiel.png", alt: "L'Officiel", width: 170, height: 35 },
  { id: "3", src: "/images/brands/vinamilk.png", alt: "Vinamilk", width: 98, height: 32 },
  { id: "4", src: "/images/brands/sony.png", alt: "Sony", width: 114, height: 20 },
  { id: "5", src: "/images/brands/vinfast.png", alt: "VinFast", width: 128, height: 32 },
  { id: "6", src: "/images/brands/miss-cosmo.png", alt: "Miss Cosmo", width: 120, height: 35 },
  { id: "7", src: "/images/brands/harpers-bazaar.png", alt: "Harper's Bazaar", width: 140, height: 30 },
  { id: "8", src: "/images/brands/highlands-coffee.png", alt: "Highlands Coffee", width: 100, height: 40 },
  { id: "9", src: "/images/brands/maybelline.png", alt: "Maybelline New York", width: 130, height: 35 },
];

export function TrustedBySection({ logos = DEFAULT_LOGOS }: TrustedBySectionProps) {
  const { t } = useTranslation();
  const logosRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [hiddenLogos, setHiddenLogos] = useState<Set<string>>(new Set());
  const headingRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });

  useEffect(() => {
    const logosContainer = logosRef.current;
    if (!logosContainer) return;

    const scrollSpeed = 30;

    const checkOverflow = () => {
      // Check if content width exceeds container width
      const contentWidth = logosContainer.scrollWidth / 2; // Divide by 2 because duplicate is included
      const containerWidth = logosContainer.clientWidth;
      return contentWidth > containerWidth;
    };

    const animate = () => {
      if (!checkOverflow()) {
        // No overflow, no animation needed
        logosContainer.classList.add(styles.noOverflow);
        return;
      }

      logosContainer.classList.remove(styles.noOverflow);
      const halfScrollWidth = logosContainer.scrollWidth / 2;

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
      if (checkOverflow()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    logosContainer.addEventListener("wheel", preventScroll, { passive: false });
    logosContainer.addEventListener("touchmove", preventScroll, {
      passive: false,
    });
    logosContainer.addEventListener("scroll", preventScroll, {
      passive: false,
    });

    // Initial animation
    animate();

    const handleResize = () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }

      logosContainer.scrollLeft = 0;
      animate();
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
      <div ref={headingRef} className={styles.trustedByContent}>
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
            style={hiddenLogos.has(logo.id) ? { display: "none", height: "auto" } : { height: "auto" }}
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
              style={hiddenLogos.has(logo.id) ? { display: "none", height: "auto" } : { height: "auto" }}
              onError={() => handleLogoError(logo.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
