/**
 * Seed Brand Logos
 *
 * Seeds brand logo entries (no i18n - content type doesn't support localization).
 *
 * Usage: npx tsx scripts/strapi/collections/brand-logos/seed.ts
 */

import { uploadImage, createEntry } from "../../shared/api";
import { brandLogos } from "../../shared/data/brand-logos";

async function seedBrandLogos(): Promise<number[]> {
  console.log("\n Seeding Brand Logos...");
  const createdIds: number[] = [];

  for (const logo of brandLogos) {
    const imageId = await uploadImage(logo.logo);
    if (imageId) {
      const entry = await createEntry("brand-logos", {
        name: logo.name,
        logo: imageId,
        order: logo.order,
      });

      if (entry) {
        createdIds.push(entry.id);
      }
    }
  }

  console.log(`  Seeded ${createdIds.length} brand logos`);
  return createdIds;
}

export { seedBrandLogos };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedBrandLogos()
    .then((ids) => {
      console.log(`\nBrand logos seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed brand logos:", error);
      process.exit(1);
    });
}
