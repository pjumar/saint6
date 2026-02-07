/**
 * Seed Set Design Page
 *
 * Seeds set design page content for both EN and VI locales.
 * Requires service-items, portfolio-items, and testimonial-items to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/set-design-page/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getCollectionDocumentIds,
  getServiceItemDocumentIds,
  getPortfolioItemDocumentIds,
} from "../../shared/api";

async function seedSetDesignPage(): Promise<void> {
  console.log("\n Seeding Set Design Page...");

  // Get required collection documentIds for EN locale (Strapi v5 relations use documentId)
  const testimonialDocIds = await getCollectionDocumentIds("testimonial-items", "en");
  const workflowDocIds = await getServiceItemDocumentIds("set-design", "workflow", "en");
  const portfolioDocIds = await getPortfolioItemDocumentIds("set-design", "en");

  // Upload images
  const heroImageId = await uploadImage(
    "/images/set-design/hero-background.jpg"
  );

  // English
  await updateSingleType("set-design-page", {
    hero: {
      heading:
        "From Moodboard to Build — Complete Set Design for Visual Storytelling",
      background_image: heroImageId,
      background_alt: "Set Design",
    },
    intro: {
      label: "How We Work",
      description:
        "We design, construct, and manage physical sets that transform creative direction into production-ready environments.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    workflow: workflowDocIds,
    portfolio_settings: {
      label: "PORTFOLIO",
      statement:
        "We shape physical spaces that reflect your creative intent — environments that become part of your story",
    },
    portfolio_items: portfolioDocIds,
    testimonials: testimonialDocIds,
  });

  // Vietnamese - only update text fields, relations shared from EN
  await updateSingleType(
    "set-design-page",
    {
      hero: {
        heading:
          "Từ Bản Vẽ Ý Tưởng đến Hoàn Thiện — Thiết Kế Set Hoàn Chỉnh cho Câu Chuyện Hình Ảnh",
        background_image: heroImageId,
        background_alt: "Set Design",
      },
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          "Chúng tôi thiết kế, xây dựng và quản lý các set vật lý để biến đổi định hướng sáng tạo thành môi trường sẵn sàng sản xuất.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      portfolio_settings: {
        label: "PORTFOLIO",
        statement:
          "Chúng tôi tạo hình không gian vật lý phản ánh ý định sáng tạo của bạn — môi trường trở thành một phần câu chuyện của bạn",
      },
      // Note: workflow, portfolio_items, testimonials are i18n
      // and only have EN locale, so we don't update them for VI
    },
    "vi"
  );

  console.log("  Set design page seeded");
}

export { seedSetDesignPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedSetDesignPage()
    .then(() => {
      console.log("\nSet design page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed set design page:", error);
      process.exit(1);
    });
}
