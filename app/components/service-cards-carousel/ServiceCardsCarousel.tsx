"use client";

import { useEffect, useRef, useState } from "react";
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

export function ServiceCardsCarousel({
  cards,
  showAllOnDesktop = false,
}: ServiceCardsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

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

  // Native wheel event listener to convert vertical scroll to horizontal
  useEffect(() => {
    if (disableScrollBehaviors) return;

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
      >
        {cards.map((card) => (
          <div key={card.id} className={cardClass}>
            <WorkflowStepCard
              imageUrl={card.imageUrl}
              counter={card.counter}
              title={card.title}
              description={card.description}
              imageSizes={
                showAllOnDesktop
                  ? "(max-width: 768px) 85vw, 25vw"
                  : "(max-width: 768px) 85vw, 26vw"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
