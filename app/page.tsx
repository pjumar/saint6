import type { Metadata } from "next";
import { HeroSection } from "./components/hero-section/HeroSection";
import { TrustedBySection } from "./components/trusted-by-section/TrustedBySection";
import { GallerySection } from "./components/gallery-section/GallerySection";
import { KeyProjectSection } from "./components/key-project-section/KeyProjectSection";
import { ProjectSection } from "./components/project-section/ProjectSection";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Saint 6 Studio | Exclusive Production & Event Destination",
  description:
    "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
  openGraph: {
    title: "Saint 6 Studio | Exclusive Production & Event Destination",
    description:
      "An exclusive destination for elevated productions, private events, and visionary experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saint 6 Studio | Exclusive Production & Event Destination",
    description:
      "An exclusive destination for elevated productions, private events, and visionary experiences.",
  },
};

export const revalidate = 3600;

export default function Home() {
  return (
    <div className={styles.homepage}>
      <HeroSection />
      <div className={styles.contentContainer}>
        <TrustedBySection />
        <GallerySection />
        <KeyProjectSection />
        <ProjectSection />
      </div>
    </div>
  );
}
