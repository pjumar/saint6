/**
 * Reset Portfolio Items
 *
 * Deletes all portfolio entries.
 *
 * Usage: npx tsx scripts/strapi/collections/portfolio-items/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetPortfolioItems(): Promise<number> {
  console.log("\n Resetting Portfolio Items...");

  const entries = await getCollectionEntries("portfolio-items");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("portfolio-items", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted portfolio-items/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} portfolio items`);
  return deleted;
}

export { resetPortfolioItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetPortfolioItems()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} portfolio items.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset portfolio items:", error);
      process.exit(1);
    });
}
