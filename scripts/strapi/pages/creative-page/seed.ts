/**
 * Seed Creative Page
 *
 * Seeds creative page content for both EN and VI locales.
 * Requires service-items, portfolio-items, brand-logos, and testimonial-items to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/creative-page/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getCollectionIds,
  getServiceItemIds,
  getPortfolioItemIds,
} from "../../shared/api";

async function seedCreativePage(): Promise<void> {
  console.log("\n Seeding Creative Page...");

  // Get required collection IDs
  const brandLogoIds = await getCollectionIds("brand-logos");
  const testimonialIds = await getCollectionIds("testimonial-items");
  const servicesIds = await getServiceItemIds("creative", "services");
  const workflowIds = await getServiceItemIds("creative", "workflow");
  const portfolioIds = await getPortfolioItemIds("creative");

  // Upload images
  const heroImageId = await uploadImage("/images/creative/hero-background.jpg");

  // English
  await updateSingleType("creative-page", {
    hero: {
      heading: "Creative production for brands, campaigns & products",
      background_image: heroImageId,
      background_alt: "Creative",
    },
    clients: {
      label: "Selected Clients",
      description:
        "We're proud to collaborate with leading brands, agencies, and startups worldwide.",
    },
    client_logos: brandLogoIds,
    services: servicesIds,
    intro: {
      label: "How We Work",
      description:
        "We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: "Featured Work",
      statement:
        "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail.",
    },
    portfolio_items: portfolioIds,
    testimonials: testimonialIds,
  });

  // Vietnamese
  await updateSingleType(
    "creative-page",
    {
      hero: {
        heading: "Sản xuất sáng tạo cho thương hiệu, chiến dịch & sản phẩm",
        background_image: heroImageId,
        background_alt: "Creative",
      },
      clients: {
        label: "Khách Hàng Tiêu Biểu",
        description:
          "Chúng tôi tự hào hợp tác với các thương hiệu, agency và startup hàng đầu trên toàn thế giới.",
      },
      client_logos: brandLogoIds,
      services: servicesIds,
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          "Chúng tôi có thể đảm nhận sản xuất toàn diện hoặc tham gia ở bất kỳ giai đoạn nào — từ phát triển moodboard và concept đến hậu kỳ và giao sản phẩm cuối cùng.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      workflow: workflowIds,
      portfolio_settings: {
        label: "Tác Phẩm Nổi Bật",
        statement:
          "Hình ảnh cao cấp phản ánh tham vọng thương hiệu của bạn — một triển lãm của nghệ thuật và sự chú ý đến chi tiết.",
      },
      portfolio_items: portfolioIds,
      testimonials: testimonialIds,
    },
    "vi"
  );

  console.log("  Creative page seeded");
}

export { seedCreativePage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedCreativePage()
    .then(() => {
      console.log("\nCreative page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed creative page:", error);
      process.exit(1);
    });
}
