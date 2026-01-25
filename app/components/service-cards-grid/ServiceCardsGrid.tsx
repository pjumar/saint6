"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ServiceCardsGrid.module.css";

export interface ServiceCard {
  id: string;
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
}

interface ServiceCardsGridProps {
  cards: ServiceCard[];
}

export function ServiceCardsGrid({ cards }: ServiceCardsGridProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">("right");
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll on hover (pauses during manual scroll)
  useEffect(() => {
    if (!isHovering || isManualScrolling || !carouselRef.current) return;

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
  }, [isHovering, isManualScrolling, scrollDirection]);

  // Native wheel event listener to prevent page scroll
  useEffect(() => {
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
      const scrollAmount = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 2;
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
  }, []);

  return (
    <div className={styles.container}>
      <div
        ref={carouselRef}
        className={styles.carousel}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsManualScrolling(false);
        }}
      >
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 85vw, 26vw"
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <span className={styles.counter}>{card.counter}</span>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.description}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
