"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./EventProjectGallery.module.css";

export interface EventProject {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  category: string;
}

interface EventProjectGalleryProps {
  projects: EventProject[];
}

function formatCounter(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

export function EventProjectGallery({ projects }: EventProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const activeProject = projects[activeIndex];

  return (
    <section className={styles.gallerySection}>
      {/* Main Image */}
      <div className={styles.imageContainer}>
        <Image
          src={activeProject.imageUrl}
          alt={activeProject.imageAlt}
          fill
          sizes="100vw"
          className={styles.backgroundImage}
          priority
        />
      </div>

      {/* Navigation Arrows */}
      <button
        className={`${styles.navButton} ${styles.navButtonLeft}`}
        onClick={handlePrevious}
        aria-label="Previous project"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        className={`${styles.navButton} ${styles.navButtonRight}`}
        onClick={handleNext}
        aria-label="Next project"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Project Tabs */}
      <div className={styles.tabsContainer}>
        {projects.map((project, index) => (
          <button
            key={project.id}
            className={`${styles.tab} ${index === activeIndex ? styles.tabActive : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <span className={styles.tabCounter}>{formatCounter(index)}</span>
            <div className={styles.tabContent}>
              <h3 className={styles.tabTitle}>{project.title}</h3>
              <p className={styles.tabCategory}>{project.category}</p>
            </div>
            {index === activeIndex && <div className={styles.activeIndicator} />}
          </button>
        ))}
      </div>
    </section>
  );
}
