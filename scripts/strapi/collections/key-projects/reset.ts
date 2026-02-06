/**
 * Reset Key Projects
 *
 * Deletes all key project entries.
 *
 * Usage: npx tsx scripts/strapi/collections/key-projects/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetKeyProjects(): Promise<number> {
  console.log("\n Resetting Key Projects...");

  const entries = await getCollectionEntries("key-projects");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("key-projects", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted key-projects/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} key projects`);
  return deleted;
}

export { resetKeyProjects };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetKeyProjects()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} key projects.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset key projects:", error);
      process.exit(1);
    });
}
