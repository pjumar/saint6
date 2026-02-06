/**
 * Reset Service Items
 *
 * Deletes all service/workflow entries.
 *
 * Usage: npx tsx scripts/strapi/collections/service-items/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetServiceItems(): Promise<number> {
  console.log("\n Resetting Service Items...");

  const entries = await getCollectionEntries("service-items");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("service-items", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted service-items/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} service items`);
  return deleted;
}

export { resetServiceItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetServiceItems()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} service items.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset service items:", error);
      process.exit(1);
    });
}
