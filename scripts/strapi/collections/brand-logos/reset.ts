/**
 * Reset Brand Logos
 *
 * Deletes all brand logo entries.
 *
 * Usage: npx tsx scripts/strapi/collections/brand-logos/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetBrandLogos(): Promise<number> {
  console.log("\n Resetting Brand Logos...");

  const entries = await getCollectionEntries("brand-logos");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("brand-logos", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted brand-logos/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} brand logos`);
  return deleted;
}

export { resetBrandLogos };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetBrandLogos()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} brand logos.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset brand logos:", error);
      process.exit(1);
    });
}
