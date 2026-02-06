/**
 * Seed Production Page
 *
 * Seeds production page content for both EN and VI locales.
 * Requires service-items and key-projects to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/production-page/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getCollectionIds,
  getServiceItemIds,
} from "../../shared/api";

async function seedProductionPage(): Promise<void> {
  console.log("\n Seeding Production Page...");

  // Get required collection IDs
  const keyProjectIds = await getCollectionIds("key-projects");
  const servicesIds = await getServiceItemIds("production", "services");
  const workflowIds = await getServiceItemIds("production", "workflow");

  // Upload images
  const heroImageId = await uploadImage(
    "/images/production/hero-background.jpg"
  );

  // English
  await updateSingleType("production-page", {
    hero: {
      heading: "Full-Scale Production, Seamless Execution.",
      background_image: heroImageId,
      background_alt: "Production",
    },
    intro: {
      label: "Our Service",
      description:
        "From concept to final delivery, we bring your campaign to life through precision planning, creative direction, and technical mastery.",
      cta_text: "Plan Your Production",
      cta_link: "#contact-form",
    },
    services: servicesIds,
    intro_2: {
      label: "The Saint 6 Way of Creation",
      description:
        "We believe in structured creativity — a process that respects your vision while bringing our expertise to every detail.",
    },
    workflow: workflowIds,
    key_projects: keyProjectIds,
  });

  // Vietnamese
  await updateSingleType(
    "production-page",
    {
      hero: {
        heading: "Sản Xuất Toàn Diện, Thực Hiện Liền Mạch.",
        background_image: heroImageId,
        background_alt: "Production",
      },
      intro: {
        label: "Dịch Vụ",
        description:
          "Từ ý tưởng đến sản phẩm cuối cùng, chúng tôi mang chiến dịch của bạn vào cuộc sống thông qua lập kế hoạch chính xác, chỉ đạo sáng tạo và kỹ thuật điêu luyện.",
        cta_text: "Lên Kế Hoạch Sản Xuất",
        cta_link: "#contact-form",
      },
      services: servicesIds,
      intro_2: {
        label: "Phong Cách Sáng Tạo Saint 6",
        description:
          "Chúng tôi tin vào sự sáng tạo có cấu trúc — một quy trình tôn trọng tầm nhìn của bạn đồng thời mang chuyên môn của chúng tôi vào từng chi tiết.",
      },
      workflow: workflowIds,
      key_projects: keyProjectIds,
    },
    "vi"
  );

  console.log("  Production page seeded");
}

export { seedProductionPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedProductionPage()
    .then(() => {
      console.log("\nProduction page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed production page:", error);
      process.exit(1);
    });
}
