import Image from "next/image";
import styles from "./ProjectSection.module.css";

export function ProjectSection() {
  return (
    <section className={styles.projectSection}>
      <div className={styles.projectHeader}>
        <div className={styles.projectHeaderContent}>
          <p className="caption">CLIENTS</p>
          <h2 className="heading-desktop">Casting call for Shaghai Fashion Week 2025</h2>
        </div>

        <div className={styles.projectMeta}>
          <div className={styles.projectMetaItem}>
            <p className="caption">EKIP</p>
            <div className="body-regular">
              <p>Photo: Linh Phạm</p>
              <p>Fashion Director: Trần Đạt</p>
              <p>Set design production: SAINT6 Production</p>
            </div>
          </div>

          <div className={styles.projectMetaItem}>
            <p className="caption">CLIENT</p>
            <p className="body-regular">LSoul</p>
          </div>

          <div className={styles.projectMetaItem}>
            <p className="caption">EXPERTISE</p>
            <div className="body-regular">
              <p>Set Design</p>
              <p>Production</p>
              <p>Location</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.projectContent}>
        <div className={styles.projectInfo}>
          <p className="caption">INFO</p>
          <p className="body-regular">
            SAINT 6 Studio is the go-to destination for set design and production. Since 2018,
            we&apos;ve delivered top-tier studio environments for Shanghai Fashion Week casting
            calls, film shoots, and exclusive events.
          </p>
        </div>

        <div className={styles.projectImages}>
          <div className={styles.projectImageMain}>
            <Image
              src="/images/project/project-main.jpg"
              alt="Project main image"
              width={800}
              height={1200}
              className={styles.projectImage}
            />
          </div>

          <div className={styles.projectImageGrid}>
            <Image
              src="/images/project/project-01.jpg"
              alt="Project image 1"
              width={400}
              height={600}
              className={styles.projectImage}
            />
            <Image
              src="/images/project/project-02.jpg"
              alt="Project image 2"
              width={400}
              height={600}
              className={styles.projectImage}
            />
            <Image
              src="/images/project/project-03.jpg"
              alt="Project image 3"
              width={400}
              height={600}
              className={styles.projectImage}
            />
          </div>
        </div>

        <div className={styles.testimonial}>
          <div className={styles.testimonialQuote}>
            <p className={styles.quoteMark}>&quot;</p>
            <p className="main-text-desktop">
              Spacious, modular, with the energy and tools that serious creatives need.
            </p>
          </div>
          <div className={styles.testimonialAuthor}>
            <Image
              src="/images/project/testimonial-line.svg"
              alt=""
              width={39}
              height={1}
              className={styles.testimonialLine}
            />
            <div>
              <p className="body-regular">Crish Phan</p>
              <p className="body-regular" style={{ color: "var(--color-text-tertiary)", opacity: 0.4 }}>
                Creative Director at LSoul
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

