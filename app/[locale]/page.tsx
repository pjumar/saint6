import type { Metadata } from "next";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { TrustedBySection } from "@/app/components/trusted-by-section/TrustedBySection";
import { GallerySection } from "@/app/components/gallery-section/GallerySection";
import {
  KeyProjectSection,
  type KeyProjectData,
} from "@/app/components/key-project-section/KeyProjectSection";
import styles from "@/app/page.module.css";
import type { Locale } from "@/app/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const isVi = typedLocale === "vi";

  return {
    title: isVi
      ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
      : "Saint 6 Studio | Exclusive Production & Event Destination",
    description: isVi
      ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn. Thuê studio, thiết kế set, dịch vụ sản xuất và giải pháp sáng tạo được điều chỉnh theo nhu cầu của bạn."
      : "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
    openGraph: {
      title: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      description: isVi
        ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn."
        : "An exclusive destination for elevated productions, private events, and visionary experiences.",
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      description: isVi
        ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn."
        : "An exclusive destination for elevated productions, private events, and visionary experiences.",
    },
  };
}

export const revalidate = 3600;

// TODO: Replace with actual CMS data fetching
// Example project data structure - replace this with your CMS data
const exampleProjectData: KeyProjectData = {
  projectNumber: "01/03",
  title: "LSoul Casting call for Shaghai Fashion Week 2025",
  infoText:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  team: [
    { role: "Photo", name: "Linh Phạm" },
    { role: "Fashion Director", name: "Trần Đạt" },
    { role: "Set design production", name: "SAINT6 Production" },
  ],
  expertise: ["Set Design", "Production", "Location"],
  client: "LSoul",
  mainImage: {
    src: "/images/project/project-main.jpg",
    alt: "LSoul Casting call for Shaghai Fashion Week 2025",
    width: 440,
    height: 297,
  },
  testimonial: {
    quote:
      "Spacious, modular, with the energy and tools that serious creatives need.",
    author: "Crish Phan",
    role: "Creative Director at LSoul",
  },
  galleryImages: [
    {
      src: "/images/project/project-01.jpg",
      alt: "",
      width: 161,
      height: 287,
    },
    {
      src: "/images/project/project-02.jpg",
      alt: "",
      width: 219,
      height: 138,
    },
    {
      src: "/images/project/project-03.jpg",
      alt: "",
      width: 219,
      height: 137,
    },
  ],
};

export default function Home() {
  return (
    <div className={styles.homepage}>
      <HeroSection />
      <div className={styles.contentContainer}>
        <TrustedBySection />
        <GallerySection />
        <KeyProjectSection project={exampleProjectData} />
      </div>
    </div>
  );
}

