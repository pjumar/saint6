/**
 * Reset Testimonial Items
 *
 * Deletes all testimonial entries.
 *
 * Usage: npx tsx scripts/strapi/collections/testimonial-items/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetTestimonialItems(): Promise<number> {
  console.log("\n Resetting Testimonial Items...");

  const entries = await getCollectionEntries("testimonial-items");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("testimonial-items", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted testimonial-items/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} testimonial items`);
  return deleted;
}

export { resetTestimonialItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetTestimonialItems()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} testimonial items.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset testimonial items:", error);
      process.exit(1);
    });
}
