"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import { useScrollAnimation } from "@/app/hooks";
import { loadGsap } from "@/app/lib/gsap";
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
  {
    src: "/images/brands/harpers-bazaar.png",
    alt: "Harper's Bazaar",
    width: 89,
    height: 50,
  },
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

    const scrollSpeed = 30;
    let cancelled = false;

    const checkOverflow = () => {
      const contentWidth = logosContainer.scrollWidth / 2;
      const containerWidth = logosContainer.clientWidth;
      return contentWidth > containerWidth;
    };

    let gsapInstance: Awaited<ReturnType<typeof loadGsap>> | null = null;

    const animate = () => {
      if (!gsapInstance || !checkOverflow()) {
        logosContainer.classList.add(styles.noOverflow);
        return;
      }

      logosContainer.classList.remove(styles.noOverflow);
      const halfScrollWidth = logosContainer.scrollWidth / 2;

      gsapInstance.set(logosContainer, { scrollLeft: 0 });

      const timeline = gsapInstance.timeline({
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

    loadGsap().then((g) => {
      if (cancelled) return;
      gsapInstance = g;
      animate();
    });

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
      cancelled = true;
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
        <p className={styles.label} ref={labelRef}>
          {label}
        </p>

        {/* Content area with text and decorative graphic */}
        <div className={styles.contentArea}>
          <p className={styles.description} ref={descriptionRef}>
            {description}
          </p>
          <SpiralDecoration
            className={styles.spiralDecoration}
            imageClassName={styles.spiralImage}
          />
        </div>

        {/* Logos row */}
        <div className={styles.logosContainer} ref={logosRef}>
          {clientLogos.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 120}
              height={logo.height ?? 40}
              className={styles.logo}
            />
          ))}
          {/* Duplicate for mobile scroll animation */}
          <div className={styles.logosDuplicate}>
            {clientLogos.map((logo) => (
              <Image
                key={`dup-${logo.src}`}
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
