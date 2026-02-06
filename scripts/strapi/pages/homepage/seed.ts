/**
 * Seed Homepage
 *
 * Seeds homepage content for both EN and VI locales.
 * Requires brand-logos and key-projects to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/homepage/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getCollectionDocumentIds,
} from "../../shared/api";
import { galleryImages } from "../../shared/data/gallery-images";

async function seedHomepage(): Promise<void> {
  console.log("\n Seeding Homepage...");

  // Get required collection documentIds (Strapi v5 relations use documentId)
  const brandLogoDocIds = await getCollectionDocumentIds("brand-logos");
  const keyProjectDocIds = await getCollectionDocumentIds("key-projects");

  // Upload images
  const heroImageId = await uploadImage("/images/hero/hero-background.jpg");
  const spaceImages = await Promise.all([
    uploadImage("/images/space/space-01.png"),
    uploadImage("/images/space/space-02.png"),
    uploadImage("/images/space/space-03.png"),
    uploadImage("/images/space/space-04.png"),
  ]);
  const crewMainImageId = await uploadImage("/images/crew/crew-main.png");
  const crewImage1Id = await uploadImage("/images/crew/crew-01.png");
  const crewImage2Id = await uploadImage("/images/crew/crew-02.png");

  const galleryImageComponents = [];
  for (const img of galleryImages) {
    const imageId = await uploadImage(img.image);
    if (imageId) galleryImageComponents.push({ image: imageId, alt: img.alt });
  }

  // English
  await updateSingleType("homepage", {
    hero: {
      heading:
        "The place where all your concepts and artistic ideas can come true",
      background_image: heroImageId,
      background_alt: "Saint 6 Studio",
    },
    brand_logos: brandLogoDocIds,
    gallery_images: galleryImageComponents,
    key_projects: keyProjectDocIds,
    space_section: {
      caption: "WIDE RANGE OF SPACE",
      description:
        "900m² of modular creative space, designed to support everything from fashion editorials to livestreams and events.",
      cta_text: "VIEW STUDIO RENTAL",
      cta_link: "/studio-rental",
      stats: [
        { label: "Total Rooms", value: "6" },
        { label: "Blank Rooms", value: "3" },
        { label: "Concept Room", value: "3" },
        { label: "Ceiling Height", value: "4.5m" },
        { label: "Total Space", value: "900m²" },
      ],
      gallery_images: spaceImages.filter(Boolean),
    },
    crew_area: {
      caption: "CREW AREA",
      heading:
        "And a separate dining area and makeup room for the crew and customers",
      info_label: "INFO",
      info_text:
        "Indulge in a dedicated dining space and a professional makeup room—curated for comfort, privacy, and effortless preparation.",
      main_image: crewMainImageId,
      secondary_image_1: crewImage1Id,
      secondary_image_2: crewImage2Id,
    },
  });

  // Vietnamese
  await updateSingleType(
    "homepage",
    {
      hero: {
        heading:
          "Nơi mọi ý tưởng và sáng kiến nghệ thuật của bạn có thể trở thành hiện thực",
        background_image: heroImageId,
        background_alt: "Saint 6 Studio",
      },
      brand_logos: brandLogoDocIds,
      gallery_images: galleryImageComponents,
      key_projects: keyProjectDocIds,
      space_section: {
        caption: "KHÔNG GIAN ĐA DẠNG",
        description:
          "900m² không gian sáng tạo linh hoạt, được thiết kế để hỗ trợ mọi thứ từ chụp ảnh thời trang đến livestream và sự kiện.",
        cta_text: "XEM THUÊ STUDIO",
        cta_link: "/studio-rental",
        stats: [
          { label: "Tổng số phòng", value: "6" },
          { label: "Phòng trống", value: "3" },
          { label: "Phòng Concept", value: "3" },
          { label: "Chiều cao trần", value: "4.5m" },
          { label: "Tổng diện tích", value: "900m²" },
        ],
        gallery_images: spaceImages.filter(Boolean),
      },
      crew_area: {
        caption: "KHU VỰC EKIP",
        heading:
          "Và khu vực ăn uống riêng biệt cùng phòng trang điểm cho ekip và khách hàng",
        info_label: "THÔNG TIN",
        info_text:
          "Tận hưởng không gian ăn uống riêng biệt và phòng trang điểm chuyên nghiệp—được thiết kế cho sự thoải mái, riêng tư và chuẩn bị dễ dàng.",
        main_image: crewMainImageId,
        secondary_image_1: crewImage1Id,
        secondary_image_2: crewImage2Id,
      },
    },
    "vi"
  );

  console.log("  Homepage seeded");
}

export { seedHomepage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedHomepage()
    .then(() => {
      console.log("\nHomepage seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed homepage:", error);
      process.exit(1);
    });
}
