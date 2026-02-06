/**
 * Seed Testimonial Items
 *
 * Seeds testimonial entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/testimonial-items/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { testimonialItems } from "../../shared/data/testimonial-items";

async function seedTestimonialItems(): Promise<number[]> {
  console.log("\n Seeding Testimonial Items...");
  const createdIds: number[] = [];

  for (const item of testimonialItems) {
    const logoId = await uploadImage(item.brand_logo);

    // Create English version
    const entry = await createEntry("testimonial-items", {
      brand_name: item.brand_name,
      brand_logo: logoId,
      quote: item.quote_en,
      author_name: item.author_name,
      author_title: item.author_title_en,
      order: item.order,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization (include brand_logo for both locales)
      await createLocalization("testimonial-items", entry.documentId, "vi", {
        quote: item.quote_vi,
        author_title: item.author_title_vi,
        brand_logo: logoId,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} testimonial items`);
  return createdIds;
}

export { seedTestimonialItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedTestimonialItems()
    .then((ids) => {
      console.log(`\nTestimonial items seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed testimonial items:", error);
      process.exit(1);
    });
}
