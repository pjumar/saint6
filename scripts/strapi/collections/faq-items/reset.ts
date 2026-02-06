/**
 * Reset FAQ Items
 *
 * Deletes all FAQ entries.
 *
 * Usage: npx tsx scripts/strapi/collections/faq-items/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetFaqItems(): Promise<number> {
  console.log("\n Resetting FAQ Items...");

  const entries = await getCollectionEntries("faq-items");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("faq-items", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted faq-items/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} FAQ items`);
  return deleted;
}

export { resetFaqItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetFaqItems()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} FAQ items.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset FAQ items:", error);
      process.exit(1);
    });
}
