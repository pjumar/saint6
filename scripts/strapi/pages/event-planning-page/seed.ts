/**
 * Seed Event Planning Page
 *
 * Seeds event planning page content for both EN and VI locales.
 * Requires service-items, event-projects, and testimonial-items to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/event-planning-page/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getCollectionDocumentIds,
  getServiceItemDocumentIds,
} from "../../shared/api";

async function seedEventPlanningPage(): Promise<void> {
  console.log("\n Seeding Event Planning Page...");

  // Get required collection documentIds for EN locale (Strapi v5 relations use documentId)
  const eventProjectDocIds = await getCollectionDocumentIds("event-projects", "en");
  const servicesDocIds = await getServiceItemDocumentIds("event-planning", "services", "en");
  const workflowDocIds = await getServiceItemDocumentIds("event-planning", "workflow", "en");
  const testimonialDocIds = await getCollectionDocumentIds("testimonial-items", "en");

  // Upload images
  const heroImageId = await uploadImage(
    "/images/event-planning/hero-background.jpg"
  );

  // English
  await updateSingleType("event-planning-page", {
    hero: {
      heading: "Curated Experiences, Designed to Inspire.",
      background_image: heroImageId,
      background_alt: "Event Planning",
    },
    intro: {
      label: "Every Moment, An Emotion",
      description:
        "Saint 6 approaches every event as a living brand story. Our in-house creative team designs atmospheres where concept, design, and guest experience blend seamlessly.",
      cta_text: "Plan Your Event",
      cta_link: "#contact-form",
    },
    services: servicesDocIds,
    intro_2: {
      label: "Every Moment, An Emotion",
      description:
        "Beyond venue and décor, Saint 6 delivers artistry in motion — a rare harmony of creative vision, flawless execution, and atmosphere designed to leave a lasting impression.",
    },
    workflow: workflowDocIds,
    event_projects: eventProjectDocIds,
    testimonials: testimonialDocIds,
  });

  // Vietnamese - only update text fields, relations shared from EN
  await updateSingleType(
    "event-planning-page",
    {
      hero: {
        heading: "Trải Nghiệm Được Chọn Lọc, Thiết Kế Để Truyền Cảm Hứng.",
        background_image: heroImageId,
        background_alt: "Event Planning",
      },
      intro: {
        label: "Mỗi Khoảnh Khắc, Một Cảm Xúc",
        description:
          "Saint 6 tiếp cận mỗi sự kiện như một câu chuyện thương hiệu sống động. Đội ngũ sáng tạo nội bộ của chúng tôi thiết kế không gian nơi ý tưởng, thiết kế và trải nghiệm khách mời hòa quyện hoàn hảo.",
        cta_text: "Lên Kế Hoạch Sự Kiện",
        cta_link: "#contact-form",
      },
      intro_2: {
        label: "Mỗi Khoảnh Khắc, Một Cảm Xúc",
        description:
          "Vượt xa địa điểm và trang trí, Saint 6 mang đến nghệ thuật trong chuyển động — sự hòa hợp hiếm có giữa tầm nhìn sáng tạo, thực hiện hoàn hảo và bầu không khí được thiết kế để để lại ấn tượng lâu dài.",
      },
      // Note: services, workflow, event_projects are i18n
      // and only have EN locale, so we don't update them for VI
    },
    "vi"
  );

  console.log("  Event planning page seeded");
}

export { seedEventPlanningPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedEventPlanningPage()
    .then(() => {
      console.log("\nEvent planning page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed event planning page:", error);
      process.exit(1);
    });
}
