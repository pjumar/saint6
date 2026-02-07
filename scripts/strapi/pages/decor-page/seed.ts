/**
 * Seed Decor Page
 *
 * Seeds decor page content for both EN and VI locales.
 * Requires service-items and portfolio-items to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/decor-page/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getServiceItemDocumentIds,
  getPortfolioItemDocumentIds,
} from "../../shared/api";

async function seedDecorPage(): Promise<void> {
  console.log("\n Seeding Decor Page...");

  // Get required collection documentIds for EN locale (Strapi v5 relations use documentId)
  const workflowDocIds = await getServiceItemDocumentIds("decor", "workflow", "en");
  const portfolioDocIds = await getPortfolioItemDocumentIds("decor", "en");

  // Upload images
  const heroImageId = await uploadImage(
    "/images/decoration/hero-background.jpg"
  );

  // English
  await updateSingleType("decor-page", {
    hero: {
      heading:
        "From flagship stores to private villas — we design and decorate spaces that tell a story.",
      background_image: heroImageId,
      background_alt: "Decoration",
    },
    intro: {
      label: "How We Work",
      description:
        'The name "Decor" feels refined and adaptable, representing Saint 6\'s creative work across fashion stores, restaurants, and personal villas.',
      cta_text: "Plan Your Decoration",
      cta_link: "#contact-form",
    },
    workflow: workflowDocIds,
    intro_2: {
      label: "every moment, an emotion",
      description:
        "Every project begins with a vision. We bring it to life — detail by detail.",
    },
    portfolio_settings: {
      label: "every moment, an emotion",
      statement:
        "Every project begins with a vision. We bring it to life — detail by detail.",
    },
    portfolio_items: portfolioDocIds,
  });

  // Vietnamese - only update text fields, relations shared from EN
  await updateSingleType(
    "decor-page",
    {
      hero: {
        heading:
          "Từ cửa hàng flagship đến biệt thự riêng — chúng tôi thiết kế và trang trí không gian kể câu chuyện.",
        background_image: heroImageId,
        background_alt: "Decoration",
      },
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          'Tên gọi "Decor" mang cảm giác tinh tế và linh hoạt, đại diện cho công việc sáng tạo của Saint 6 qua các cửa hàng thời trang, nhà hàng và biệt thự cá nhân.',
        cta_text: "Lên Kế Hoạch Trang Trí",
        cta_link: "#contact-form",
      },
      intro_2: {
        label: "mỗi khoảnh khắc, một cảm xúc",
        description:
          "Mỗi dự án bắt đầu bằng một tầm nhìn. Chúng tôi mang nó vào cuộc sống — từng chi tiết một.",
      },
      portfolio_settings: {
        label: "mỗi khoảnh khắc, một cảm xúc",
        statement:
          "Mỗi dự án bắt đầu bằng một tầm nhìn. Chúng tôi mang nó vào cuộc sống — từng chi tiết một.",
      },
      // Note: workflow, portfolio_items are i18n
      // and only have EN locale, so we don't update them for VI
    },
    "vi"
  );

  console.log("  Decor page seeded");
}

export { seedDecorPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedDecorPage()
    .then(() => {
      console.log("\nDecor page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed decor page:", error);
      process.exit(1);
    });
}
