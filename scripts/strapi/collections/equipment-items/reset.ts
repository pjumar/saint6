/**
 * Reset Equipment Items
 *
 * Deletes all equipment entries.
 *
 * Usage: npx tsx scripts/strapi/collections/equipment-items/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetEquipmentItems(): Promise<number> {
  console.log("\n Resetting Equipment Items...");

  const entries = await getCollectionEntries("equipment-items");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("equipment-items", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted equipment-items/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} equipment items`);
  return deleted;
}

export { resetEquipmentItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetEquipmentItems()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} equipment items.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset equipment items:", error);
      process.exit(1);
    });
}
