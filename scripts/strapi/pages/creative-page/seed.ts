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
  getCollectionDocumentIds,
  getServiceItemDocumentIds,
  getPortfolioItemDocumentIds,
} from "../../shared/api";

async function seedCreativePage(): Promise<void> {
  console.log("\n Seeding Creative Page...");

  // Get required collection documentIds for EN locale (Strapi v5 relations use documentId)
  // Brand logos are not i18n, others need EN locale
  const brandLogoDocIds = await getCollectionDocumentIds("brand-logos");
  const testimonialDocIds = await getCollectionDocumentIds("testimonial-items", "en");
  const servicesDocIds = await getServiceItemDocumentIds("creative", "services", "en");
  const workflowDocIds = await getServiceItemDocumentIds("creative", "workflow", "en");
  const portfolioDocIds = await getPortfolioItemDocumentIds("creative", "en");

  console.log(`  Brand logos: ${brandLogoDocIds.length}, Testimonials: ${testimonialDocIds.length}`);
  console.log(`  Services: ${servicesDocIds.length}, Workflow: ${workflowDocIds.length}, Portfolio: ${portfolioDocIds.length}`);

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
    client_logos: brandLogoDocIds,
    services: servicesDocIds,
    intro: {
      label: "How We Work",
      description:
        "We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    workflow: workflowDocIds,
    portfolio_settings: {
      label: "Featured Work",
      statement:
        "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail.",
    },
    portfolio_items: portfolioDocIds,
    testimonials: testimonialDocIds,
  });

  // Get Vietnamese locale documentIds for relations
  const testimonialDocIdsVi = await getCollectionDocumentIds("testimonial-items", "vi");
  const servicesDocIdsVi = await getServiceItemDocumentIds("creative", "services", "vi");
  const workflowDocIdsVi = await getServiceItemDocumentIds("creative", "workflow", "vi");
  const portfolioDocIdsVi = await getPortfolioItemDocumentIds("creative", "vi");

  console.log(`  VI - Testimonials: ${testimonialDocIdsVi.length}, Services: ${servicesDocIdsVi.length}`);
  console.log(`  VI - Workflow: ${workflowDocIdsVi.length}, Portfolio: ${portfolioDocIdsVi.length}`);

  // Vietnamese - update all fields including relations
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
      client_logos: brandLogoDocIds, // Brand logos are not i18n
      services: servicesDocIdsVi.length > 0 ? servicesDocIdsVi : servicesDocIds,
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          "Chúng tôi có thể đảm nhận sản xuất toàn diện hoặc tham gia ở bất kỳ giai đoạn nào — từ phát triển moodboard và concept đến hậu kỳ và giao sản phẩm cuối cùng.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      workflow: workflowDocIdsVi.length > 0 ? workflowDocIdsVi : workflowDocIds,
      portfolio_settings: {
        label: "Tác Phẩm Nổi Bật",
        statement:
          "Hình ảnh cao cấp phản ánh tham vọng thương hiệu của bạn — một triển lãm của nghệ thuật và sự chú ý đến chi tiết.",
      },
      portfolio_items: portfolioDocIdsVi.length > 0 ? portfolioDocIdsVi : portfolioDocIds,
      testimonials: testimonialDocIdsVi.length > 0 ? testimonialDocIdsVi : testimonialDocIds,
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
