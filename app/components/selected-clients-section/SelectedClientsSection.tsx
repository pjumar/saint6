"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useScrollAnimation } from "@/app/hooks";
import styles from "./SelectedClientsSection.module.css";

export interface ClientLogo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface SelectedClientsSectionProps {
  label?: string;
  description: string;
  logos?: ClientLogo[];
}

const DEFAULT_LOGOS: ClientLogo[] = [
  {
    src: "/images/brands/lofficiel.png",
    alt: "L'OFFICIEL",
    width: 170,
    height: 35,
  },
  {
    src: "/images/brands/lenskart.png",
    alt: "Lenskart",
    width: 138,
    height: 40,
  },
  {
    src: "/images/brands/vinamilk.png",
    alt: "Vinamilk",
    width: 98,
    height: 32,
  },
  { src: "/images/brands/sony.png", alt: "SONY", width: 114, height: 20 },
  {
    src: "/images/brands/vinfast.png",
    alt: "VinFast",
    width: 128,
    height: 32,
  },
  {
    src: "/images/brands/miss-cosmo.png",
    alt: "Miss Cosmo",
    width: 93,
    height: 46,
  },
  { src: "/images/brands/harpers-bazaar.png", alt: "Harper's Bazaar", width: 89, height: 50 },
  {
    src: "/images/brands/highlands-coffee.png",
    alt: "Highlands Coffee",
    width: 48,
    height: 36,
  },
  {
    src: "/images/brands/maybelline.png",
    alt: "Maybelline",
    width: 254,
    height: 24,
  },
];

export function SelectedClientsSection({
  label = "Selected Clients",
  description,
  logos,
}: SelectedClientsSectionProps) {
  const clientLogos = logos && logos.length > 0 ? logos : DEFAULT_LOGOS;
  const logosRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Scroll animations for header content
  const labelRef = useScrollAnimation<HTMLParagraphElement>({
    type: "fadeUp",
    duration: 0.6,
  });
  const descriptionRef = useScrollAnimation<HTMLParagraphElement>({
    type: "fadeUp",
    duration: 0.8,
    delay: 0.1,
  });

  useEffect(() => {
    const logosContainer = logosRef.current;
    if (!logosContainer) return;

    const checkMobile = () => window.innerWidth <= 48 * 16;

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

  return (
    <section className={styles.selectedClients}>
      <div className={styles.container}>
        {/* Label */}
        <p className={styles.label} ref={labelRef}>{label}</p>

        {/* Content area with text and decorative graphic */}
        <div className={styles.contentArea}>
          <p className={styles.description} ref={descriptionRef}>{description}</p>
          <div className={styles.spiralDecoration}>
            <Image
              src="/images/spiral_decoration.svg"
              alt=""
              width={710}
              height={710}
              className={styles.spiralImage}
            />
          </div>
        </div>

        {/* Logos row */}
        <div className={styles.logosContainer} ref={logosRef}>
          {clientLogos.map((logo, index) => (
            <Image
              key={`logo-${index}`}
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 120}
              height={logo.height ?? 40}
              className={styles.logo}
            />
          ))}
          {/* Duplicate for mobile scroll animation */}
          <div className={styles.logosDuplicate}>
            {clientLogos.map((logo, index) => (
              <Image
                key={`logo-dup-${index}`}
                src={logo.src}
                alt={logo.alt}
                width={logo.width ?? 120}
                height={logo.height ?? 40}
                className={styles.logo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
