import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homepage}>
      <HeroSection />
      <TrustedBySection />
      <GallerySection />
      <KeyProjectSection />
      <ProjectSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <Image
          src="/images/hero/hero-background.jpg"
          alt="Hero background"
          fill
          className={styles.heroBackgroundImage}
          priority
        />
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.decorativeLine}>
        <Image
          src="/images/hero/decorative-line.svg"
          alt=""
          fill
          className={styles.decorativeLineImage}
        />
      </div>

      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/assets/saint6-logo.svg"
            alt="Saint 6 Studio"
            width={183}
            height={39}
            priority
          />
        </div>

        <nav className={styles.nav}>
          <a href="#studio-rental" className={styles.navItem}>STUDIO RENTAL</a>
          <a href="#set-design" className={styles.navItem}>SET DESIGN</a>
          <a href="#production" className={styles.navItem}>PRODUCTION</a>
          <a href="#event-planning" className={styles.navItem}>EVENT PLANNING</a>
          <a href="#decor" className={styles.navItem}>DECOR</a>
          <a href="#creative" className={styles.navItem}>CREATIVE</a>
        </nav>
      </header>

      <div className={styles.heroContent}>
        <h1 className={`heading-desktop ${styles.heroHeading}`}>
          The place where all your concepts and artistic ideas can come true
        </h1>
      </div>

      <div className={styles.heroFooter}>
        <div className={styles.socialLinks}>
          <a href="#" className="caption">FB</a>
          <a href="#" className="caption">INST</a>
          <a href="#" className="caption">TIKTOK</a>
        </div>

        <div className={styles.heroFooterRight}>
          <a href="#contact" className="caption">CONTACT</a>
          <a href="#about" className="caption">ABOUT US</a>
          <div className={styles.languageSelector}>
            <span className="caption">EN</span>
            <div className={styles.caretIcon} />
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <Image
          src="/images/hero/scroll-icon.svg"
          alt=""
          width={16}
          height={16}
          className={styles.scrollIcon}
        />
        <p className="caption">scroll down to explore</p>
      </div>
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className={styles.trustedBy}>
      <div className={styles.trustedByContent}>
        <p className="caption" style={{ color: "var(--color-primary)" }}>
          TRUSTED BY TOP BRANDS AND ARTISTS
        </p>
        <h2 className="heading-desktop">
          An exclusive destination for elevated productions, private events, and visionary experiences tailored to your every need
        </h2>
      </div>
      <div className={styles.brandLogos}>
        <Image src="/images/brands/brand-01.png" alt="Brand 1" width={170} height={35} className={styles.brandLogo} />
        <Image src="/images/brands/brand-02.png" alt="Brand 2" width={138} height={40} className={styles.brandLogo} />
        <Image src="/images/brands/brand-03.png" alt="Brand 3" width={98} height={32} className={styles.brandLogo} />
        <Image src="/images/brands/brand-04.png" alt="Brand 4" width={114} height={20} className={styles.brandLogo} />
        <Image src="/images/brands/brand-05.png" alt="Brand 5" width={128} height={32} className={styles.brandLogo} />
      </div>
    </section>
  );
}

function GallerySection() {
  const galleryImages = [
    { id: 1, src: "/images/gallery/gallery-01.jpg", alt: "Gallery image 1" },
    { id: 2, src: "/images/gallery/gallery-02.jpg", alt: "Gallery image 2" },
    { id: 3, src: "/images/gallery/gallery-03.jpg", alt: "Gallery image 3" },
    { id: 4, src: "/images/gallery/gallery-04.jpg", alt: "Gallery image 4" },
    { id: 5, src: "/images/gallery/gallery-05.jpg", alt: "Gallery image 5" },
    { id: 6, src: "/images/gallery/gallery-06.jpg", alt: "Gallery image 6" },
    { id: 7, src: "/images/gallery/gallery-07.jpg", alt: "Gallery image 7" },
    { id: 8, src: "/images/gallery/gallery-08.jpg", alt: "Gallery image 8" },
    { id: 9, src: "/images/gallery/gallery-09.jpg", alt: "Gallery image 9" },
    { id: 10, src: "/images/gallery/gallery-10.jpg", alt: "Gallery image 10" },
    { id: 11, src: "/images/gallery/gallery-11.jpg", alt: "Gallery image 11" },
    { id: 12, src: "/images/gallery/gallery-12.jpg", alt: "Gallery image 12" },
    { id: 13, src: "/images/gallery/gallery-13.jpg", alt: "Gallery image 13" },
    { id: 14, src: "/images/gallery/gallery-14.jpg", alt: "Gallery image 14" },
    { id: 15, src: "/images/gallery/gallery-15.jpg", alt: "Gallery image 15" },
    { id: 16, src: "/images/gallery/gallery-01.jpg", alt: "Gallery image 16" },
    { id: 17, src: "/images/gallery/gallery-02.jpg", alt: "Gallery image 17" },
    { id: 18, src: "/images/gallery/gallery-03.jpg", alt: "Gallery image 18" },
  ];

  return (
    <section className={styles.gallery}>
      <div className={styles.galleryGrid}>
        {galleryImages.map((image) => (
          <div key={image.id} className={styles.galleryItem}>
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={600}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function KeyProjectSection() {
  return (
    <section className={styles.keyProjectSection}>
      <div className={styles.keyProjectContent}>
        <p className="caption" style={{ opacity: 0.4 }}>
          Highlights from the journeys that shaped our craft.
        </p>
        <h2 className={styles.keyProjectHeading}>Key Project</h2>
        <div className={styles.keyProjectDecoration}>
          <Image
            src="/images/key-project/key-project-bg.svg"
            alt=""
            width={710}
            height={710}
            className={styles.keyProjectBg}
          />
          <Image
            src="/images/key-project/key-project-group.svg"
            alt=""
            width={710}
            height={710}
            className={styles.keyProjectGroup}
          />
        </div>
      </div>
    </section>
  );
}

function ProjectSection() {
  return (
    <section className={styles.projectSection}>
      <div className={styles.projectHeader}>
        <div className={styles.projectHeaderContent}>
          <p className="caption">CLIENTS</p>
          <h2 className="heading-desktop">
            Casting call for Shaghai Fashion Week 2025
          </h2>
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
            SAINT 6 Studio is the go-to destination for set design and production. Since 2018, we&apos;ve delivered top-tier studio environments for Shanghai Fashion Week casting calls, film shoots, and exclusive events.
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
