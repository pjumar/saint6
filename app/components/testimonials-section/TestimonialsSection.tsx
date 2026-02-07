"use client";

import {
  TestimonialCard,
  type TestimonialCardProps,
} from "@/app/components/testimonial-card/TestimonialCard";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
import styles from "./TestimonialsSection.module.css";

export interface TestimonialItem extends TestimonialCardProps {
  id: string;
}

export interface TestimonialsSectionProps {
  label: string;
  title: string;
  items: TestimonialItem[];
}

export function TestimonialsSection({
  label,
  title,
  items,
}: TestimonialsSectionProps) {
  const headerRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const gridRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.15,
  });

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.sectionInner}>
        <div ref={headerRef} className={styles.header}>
          <p className={styles.label}>{label}</p>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div ref={gridRef} className={styles.grid}>
          {items.map((item) => (
            <TestimonialCard
              key={item.id}
              logoUrl={item.logoUrl}
              logoAlt={item.logoAlt}
              quote={item.quote}
              authorName={item.authorName}
              authorTitle={item.authorTitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
