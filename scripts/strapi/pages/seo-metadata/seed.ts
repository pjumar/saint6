/**
 * Seed SEO Metadata
 *
 * Seeds global SEO metadata for both EN and VI locales.
 *
 * Usage: npx tsx scripts/strapi/pages/seo-metadata/seed.ts
 */

import { updateSingleType, uploadImage } from "../../shared/api";

async function seedSeoMetadata(): Promise<void> {
  console.log("\n Seeding SEO Metadata...");

  // Upload OG and Twitter images
  const ogImageId = await uploadImage("/og-image.jpg");
  const twitterImageId = await uploadImage("/twitter-image.jpg");

  // English
  await updateSingleType("seo-metadata", {
    og_image: ogImageId,
    twitter_image: twitterImageId,
    site_name: "Saint 6 Studio",
    default_title:
      "Saint 6 Studio | Exclusive Production & Event Destination",
    title_template: "Saint 6 Studio | %s",
    description:
      "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
    keywords:
      "studio rental, set design, production services, event planning, creative studio, film production, photography studio, event venue",
  });

  // Vietnamese
  await updateSingleType(
    "seo-metadata",
    {
      default_title:
        "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền",
      description:
        "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn. Thuê studio, thiết kế set, dịch vụ sản xuất và giải pháp sáng tạo được điều chỉnh theo nhu cầu của bạn.",
      keywords:
        "thuê studio, thiết kế set, dịch vụ sản xuất, tổ chức sự kiện, studio sáng tạo, sản xuất phim, studio chụp ảnh, địa điểm sự kiện",
    },
    "vi",
  );

  console.log("  SEO metadata seeded");
}

export { seedSeoMetadata };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedSeoMetadata()
    .then(() => {
      console.log("\nSEO metadata seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed SEO metadata:", error);
      process.exit(1);
    });
}
