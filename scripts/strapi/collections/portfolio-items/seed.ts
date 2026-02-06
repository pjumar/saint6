/**
 * Seed Portfolio Items
 *
 * Seeds portfolio entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/portfolio-items/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { portfolioItems } from "../../shared/data/portfolio-items";

async function seedPortfolioItems(): Promise<number[]> {
  console.log("\n Seeding Portfolio Items...");
  const createdIds: number[] = [];

  for (const item of portfolioItems) {
    const imageId = await uploadImage(item.image);

    // Create English version
    const entry = await createEntry("portfolio-items", {
      title: item.title,
      category: item.category,
      image: imageId,
      size: item.size,
      page: item.page,
      order: item.order,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization (title stays the same as it's brand names, include image)
      await createLocalization("portfolio-items", entry.documentId, "vi", {
        title: item.title,
        category: item.category_vi,
        image: imageId,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} portfolio items`);
  return createdIds;
}

export { seedPortfolioItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedPortfolioItems()
    .then((ids) => {
      console.log(`\nPortfolio items seeded. Count: ${ids.length}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed portfolio items:", error);
      process.exit(1);
    });
}
