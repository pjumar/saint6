import Image from "next/image";
import styles from "./DecorPortfolio.module.css";

export interface DecorProject {
  id: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  title: string;
  size?: "large" | "small"; // For masonry layout
}

interface DecorPortfolioProps {
  topRowProjects: DecorProject[];
  masonryProjects: DecorProject[][];
}

export function DecorPortfolio({ topRowProjects, masonryProjects }: DecorPortfolioProps) {
  return (
    <div className={styles.portfolio}>
      {/* Top Row - 2 Equal Columns */}
      <div className={styles.topRow}>
        {topRowProjects.map((project) => (
          <div key={project.id} className={styles.topRowCard}>
            <div className={styles.topRowImageContainer}>
              <Image
                src={project.imageUrl}
                alt={project.imageAlt}
                fill
                className={styles.projectImage}
              />
            </div>
            <div className={styles.projectInfo}>
              <div className={styles.categoryRow}>
                <span className={styles.category}>{project.category}</span>
              </div>
              <h3 className={styles.projectTitle}>{project.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Masonry Grid - 3 Columns */}
      <div className={styles.masonryGrid}>
        {masonryProjects.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.masonryColumn}>
            {column.map((project) => (
              <div
                key={project.id}
                className={`${styles.masonryCard} ${
                  project.size === "large" ? styles.masonryCardLarge : styles.masonryCardSmall
                }`}
              >
                <div className={styles.masonryImageContainer}>
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    fill
                    className={styles.projectImage}
                  />
                </div>
                <div className={styles.projectInfo}>
                  <div className={styles.categoryRow}>
                    <span className={styles.category}>{project.category}</span>
                  </div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
