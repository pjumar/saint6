/**
 * Seed All Strapi Content
 *
 * Master script that seeds all collections and pages in the correct order.
 *
 * Usage: npx tsx scripts/seed-all.ts
 */

import { STRAPI_URL } from "./strapi/shared/config";

// Collection seeds
import { seedBrandLogos } from "./strapi/collections/brand-logos/seed";
import { seedTestimonialItems } from "./strapi/collections/testimonial-items/seed";
import { seedServiceItems } from "./strapi/collections/service-items/seed";
import { seedStudioRooms } from "./strapi/collections/studio-rooms/seed";
import { seedEquipmentItems } from "./strapi/collections/equipment-items/seed";
import { seedFaqItems } from "./strapi/collections/faq-items/seed";
import { seedPortfolioItems } from "./strapi/collections/portfolio-items/seed";
import { seedKeyProjects } from "./strapi/collections/key-projects/seed";

// Page seeds
import { seedHomepage } from "./strapi/pages/homepage/seed";
import { seedStudioRentalPage } from "./strapi/pages/studio-rental-page/seed";
import { seedAboutPage } from "./strapi/pages/about-page/seed";
import { seedContactPage } from "./strapi/pages/contact-page/seed";
import { seedCreativePage } from "./strapi/pages/creative-page/seed";
import { seedProductionPage } from "./strapi/pages/production-page/seed";
import { seedSetDesignPage } from "./strapi/pages/set-design-page/seed";
import { seedEventPlanningPage } from "./strapi/pages/event-planning-page/seed";
import { seedDecorPage } from "./strapi/pages/decor-page/seed";

async function seedAll() {
  console.log("Starting Strapi CMS Seed...\n");
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  const summary = {
    collections: {
      brandLogos: 0,
      testimonialItems: 0,
      serviceItems: 0,
      studioRooms: 0,
      equipmentItems: 0,
      faqItems: 0,
      portfolioItems: 0,
      keyProjects: 0,
    },
    pages: 0,
  };

  try {
    // Seed collections first (order matters for dependencies)
    console.log("=== SEEDING COLLECTIONS ===");

    const brandLogoIds = await seedBrandLogos();
    summary.collections.brandLogos = brandLogoIds.length;

    const testimonialIds = await seedTestimonialItems();
    summary.collections.testimonialItems = testimonialIds.length;

    const serviceEntries = await seedServiceItems();
    summary.collections.serviceItems = serviceEntries.length;

    const studioRoomIds = await seedStudioRooms();
    summary.collections.studioRooms = studioRoomIds.length;

    const equipmentIds = await seedEquipmentItems();
    summary.collections.equipmentItems = equipmentIds.length;

    const faqIds = await seedFaqItems();
    summary.collections.faqItems = faqIds.length;

    const portfolioIds = await seedPortfolioItems();
    summary.collections.portfolioItems = portfolioIds.length;

    const keyProjectIds = await seedKeyProjects();
    summary.collections.keyProjects = keyProjectIds.length;

    // Seed pages (depend on collections)
    console.log("\n=== SEEDING PAGES ===");

    await seedHomepage();
    summary.pages++;

    await seedStudioRentalPage();
    summary.pages++;

    await seedAboutPage();
    summary.pages++;

    await seedContactPage();
    summary.pages++;

    await seedCreativePage();
    summary.pages++;

    await seedProductionPage();
    summary.pages++;

    await seedSetDesignPage();
    summary.pages++;

    await seedEventPlanningPage();
    summary.pages++;

    await seedDecorPage();
    summary.pages++;

    // Print summary
    console.log("\n\n=== SEED COMPLETE ===");
    console.log("\nSummary:");
    console.log(`  Brand Logos: ${summary.collections.brandLogos}`);
    console.log(`  Testimonial Items: ${summary.collections.testimonialItems}`);
    console.log(`  Service Items: ${summary.collections.serviceItems}`);
    console.log(`  Studio Rooms: ${summary.collections.studioRooms}`);
    console.log(`  Equipment Items: ${summary.collections.equipmentItems}`);
    console.log(`  FAQ Items: ${summary.collections.faqItems}`);
    console.log(`  Portfolio Items: ${summary.collections.portfolioItems}`);
    console.log(`  Key Projects: ${summary.collections.keyProjects}`);
    console.log(`  Pages seeded: ${summary.pages} (EN + VI)`);
  } catch (error) {
    console.error("\nSeed failed:", error);
    process.exit(1);
  }
}

seedAll()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
