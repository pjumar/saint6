"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
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
  const [isDesktop, setIsDesktop] = useState(false);

  // Scroll animations
  const headerRef = useScrollAnimation<HTMLDivElement>({
    type: "scale",
    duration: 0.8,
  });
  const mobileLayoutRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.1,
  });
  const storyLabelRef = useScrollAnimation<HTMLDivElement>({
    type: "fadeUp",
    duration: 0.6,
  });
  const storyTextRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.15,
  });

  // Track desktop breakpoint
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 769); // 48.0625rem = 769px
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Native wheel event listener to convert vertical scroll to horizontal (desktop only)
  useEffect(() => {
    if (!isDesktop) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollAmount =
        (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 2;

      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const isAtStart = carousel.scrollLeft <= 0;
      const isAtEnd = carousel.scrollLeft >= maxScroll - 1;

      if ((isAtStart && scrollAmount < 0) || (isAtEnd && scrollAmount > 0)) {
        return;
      }

      e.preventDefault();

      carousel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      carousel.removeEventListener("wheel", handleWheel);
    };
  }, [isDesktop]);

  return (
    <section className={styles.section}>
      {/* Header with spiral decoration and SAINT6 logo */}
      <div className={styles.header} ref={headerRef}>
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
      <div className={styles.mobileLayout} ref={mobileLayoutRef}>
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
          <div className={styles.storyLabelWrapper} ref={storyLabelRef}>
            <p className={styles.storyLabel}>{story.label}</p>
          </div>
          <div className={styles.storyTextWrapper} ref={storyTextRef}>
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
