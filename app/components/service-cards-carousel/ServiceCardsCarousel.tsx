"use client";

import { useRef, useEffect, useState } from "react";
import { WorkflowStepCard } from "@/app/components/workflow-step-card/WorkflowStepCard";
import styles from "./ServiceCardsCarousel.module.css";

export interface ServiceCard {
  id: string;
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
}

interface ServiceCardsCarouselProps {
  cards: ServiceCard[];
  /** When true, shows all cards in a grid on desktop instead of carousel */
  showAllOnDesktop?: boolean;
}

export function ServiceCardsCarousel({ cards, showAllOnDesktop = false }: ServiceCardsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">("right");
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

  // Disable scroll behaviors on desktop when showAllOnDesktop is true
  const disableScrollBehaviors = showAllOnDesktop && isDesktop;

  // Auto-scroll on hover (pauses during manual scroll)
  useEffect(() => {
    if (disableScrollBehaviors) return;
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
  }, [isHovering, isManualScrolling, scrollDirection, disableScrollBehaviors]);

  // Native wheel event listener to prevent page scroll
  useEffect(() => {
    if (disableScrollBehaviors) return;

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
  }, [disableScrollBehaviors]);

  // Determine class names based on showAllOnDesktop prop
  const containerClass = showAllOnDesktop
    ? `${styles.container} ${styles.containerGrid}`
    : styles.container;
  const carouselClass = showAllOnDesktop
    ? `${styles.carousel} ${styles.carouselGrid}`
    : styles.carousel;
  const cardClass = showAllOnDesktop
    ? `${styles.card} ${styles.cardGrid}`
    : styles.card;

  return (
    <div className={containerClass}>
      <div
        ref={carouselRef}
        className={carouselClass}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsManualScrolling(false);
        }}
      >
        {cards.map((card) => (
          <div key={card.id} className={cardClass}>
            <WorkflowStepCard
              imageUrl={card.imageUrl}
              counter={card.counter}
              title={card.title}
              description={card.description}
              imageSizes={showAllOnDesktop ? "(max-width: 768px) 85vw, 25vw" : "(max-width: 768px) 85vw, 26vw"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
