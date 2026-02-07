/**
 * Reset Event Projects
 *
 * Deletes all event project entries.
 *
 * Usage: npx tsx scripts/strapi/collections/event-projects/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetEventProjects(): Promise<number> {
  console.log("\n Resetting Event Projects...");

  const entries = await getCollectionEntries("event-projects");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("event-projects", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted event-projects/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} event projects`);
  return deleted;
}

export { resetEventProjects };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetEventProjects()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} event projects.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset event projects:", error);
      process.exit(1);
    });
}
