"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./ValuesGrid.module.css";

export interface ValueItem {
  id: string;
  letter: string;
  title: string;
  description: string;
}

export interface StoryContent {
  label: string;
  paragraphs: string[];
}

export interface ValuesGridProps {
  values: ValueItem[];
  story?: StoryContent;
}

// Map value IDs to their letter SVG paths
const letterMap: Record<string, string> = {
  simplicity: "/images/about-us/letter-s.svg",
  authenticity: "/images/about-us/letter-a.svg",
  intention: "/images/about-us/letter-i.svg",
  narrative: "/images/about-us/letter-n.svg",
  trust: "/images/about-us/letter-t.svg",
  "sixth-sense": "/images/about-us/letter-6.svg",
};

export function ValuesGrid({ values, story }: ValuesGridProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "right",
  );
  const [isDesktop, setIsDesktop] = useState(false);
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Track desktop breakpoint
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 769); // 48.0625rem = 769px
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Auto-scroll on hover (desktop only, pauses during manual scroll)
  useEffect(() => {
    if (!isDesktop || !isHovering || isManualScrolling || !carouselRef.current)
      return;

    const carousel = carouselRef.current;
    const scrollSpeed = 1.5;

    const animate = () => {
      if (!carousel) return;

      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      if (scrollDirection === "right") {
        carousel.scrollLeft += scrollSpeed;
        if (carousel.scrollLeft >= maxScroll) {
          setScrollDirection("left");
        }
      } else {
        carousel.scrollLeft -= scrollSpeed;
        if (carousel.scrollLeft <= 0) {
          setScrollDirection("right");
        }
      }
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [isDesktop, isHovering, isManualScrolling, scrollDirection]);

  // Native wheel event listener to prevent page scroll (desktop only)
  useEffect(() => {
    if (!isDesktop) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent page scroll
      e.preventDefault();

      // Pause auto-scroll during manual scroll
      setIsManualScrolling(true);

      // Clear previous timeout
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
      }

      // Convert vertical scroll to horizontal with smooth scroll
      const scrollAmount =
        (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 2;
      carousel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Resume auto-scroll after 2 seconds of no manual scrolling
      manualScrollTimeout.current = setTimeout(() => {
        setIsManualScrolling(false);
      }, 2000);
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      carousel.removeEventListener("wheel", handleWheel);
      // Cleanup timeout on unmount
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
      }
    };
  }, [isDesktop]);

  return (
    <section className={styles.section}>
      {/* Header with spiral decoration and SAINT6 logo */}
      <div className={styles.header}>
        <div className={styles.spiralContainer}>
          <Image
            src="/images/spiral_decoration.svg"
            alt=""
            width={400}
            height={400}
            className={styles.spiralImage}
          />
        </div>
        <div className={styles.logoContainer}>
          <Image
            src="/assets/saint6-logo-2.svg"
            alt="SAINT6"
            width={200}
            height={40}
            className={styles.logoImage}
          />
        </div>
      </div>

      {/* Desktop: Horizontal scrolling carousel */}
      <div
        ref={carouselRef}
        className={styles.desktopCarousel}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsManualScrolling(false);
        }}
      >
        {values.map((value) => (
          <div key={value.id} className={styles.desktopCard}>
            <div className={styles.desktopCardLetter}>
              <Image
                src={letterMap[value.id] || letterMap.simplicity}
                alt={value.letter}
                width={212}
                height={240}
                className={styles.letterImage}
              />
            </div>
            <div className={styles.desktopCardText}>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Vertical stacked list */}
      <div className={styles.mobileLayout}>
        {values.map((value) => (
          <div key={value.id} className={styles.mobileCard}>
            <div className={styles.mobileCardLetter}>
              <Image
                src={letterMap[value.id] || letterMap.simplicity}
                alt={value.letter}
                width={106}
                height={120}
                className={styles.letterImage}
              />
            </div>
            <div className={styles.mobileCardText}>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Our Story section */}
      {story && (
        <div className={styles.storyContainer}>
          <div className={styles.storyLabelWrapper}>
            <p className={styles.storyLabel}>{story.label}</p>
          </div>
          <div className={styles.storyTextWrapper}>
            {story.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.storyText}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
