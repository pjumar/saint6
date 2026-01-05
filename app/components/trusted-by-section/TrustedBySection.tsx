"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./TrustedBySection.module.css";

export function TrustedBySection() {
  const logosRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

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

    const timeline = gsap.timeline({ repeat: -1 });

    timeline.to(logosContainer, {
      scrollLeft: halfScrollWidth,
      duration: halfScrollWidth / scrollSpeed,
      ease: "none",
      onComplete: () => {
        gsap.set(logosContainer, { scrollLeft: 0 });
      },
    });

    animationRef.current = timeline;

    const handleMouseEnter = () => {
      timeline.pause();
    };
    const handleMouseLeave = () => {
      timeline.resume();
    };

    logosContainer.addEventListener("mouseenter", handleMouseEnter);
    logosContainer.addEventListener("mouseleave", handleMouseLeave);
    logosContainer.addEventListener("touchstart", handleMouseEnter);
    logosContainer.addEventListener("touchend", handleMouseLeave);

    return () => {
      timeline.kill();
      logosContainer.removeEventListener("mouseenter", handleMouseEnter);
      logosContainer.removeEventListener("mouseleave", handleMouseLeave);
      logosContainer.removeEventListener("touchstart", handleMouseEnter);
      logosContainer.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  const brandLogos = [
    { src: "/images/brands/brand-01.png", alt: "L'OFFICIEL", width: 170, height: 35 },
    { src: "/images/brands/brand-02.png", alt: "Lenskart", width: 138, height: 40 },
    { src: "/images/brands/brand-03.png", alt: "Vinamilk", width: 98, height: 32 },
    { src: "/images/brands/brand-04.png", alt: "SONY", width: 114, height: 20 },
    { src: "/images/brands/brand-05.png", alt: "VinFast", width: 128, height: 32 },
  ];

  return (
    <section className={styles.trustedBy}>
      <div className={styles.trustedByContent}>
        <p className="caption" style={{ color: "var(--color-primary)" }}>
          TRUSTED BY TOP BRANDS AND ARTISTS
        </p>
        <h2 className="heading-desktop">
          An exclusive destination for elevated productions, private events, and visionary
          experiences tailored to your every need
        </h2>
      </div>
      <div className={styles.brandLogos} ref={logosRef}>
        {brandLogos.map((logo, index) => (
          <Image
            key={`logo-${index}`}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={styles.brandLogo}
          />
        ))}
        {brandLogos.map((logo, index) => (
          <Image
            key={`logo-duplicate-${index}`}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={styles.brandLogo}
          />
        ))}
      </div>
    </section>
  );
}

