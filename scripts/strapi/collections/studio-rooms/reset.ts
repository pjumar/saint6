/**
 * Reset Studio Rooms
 *
 * Deletes all studio room entries.
 *
 * Usage: npx tsx scripts/strapi/collections/studio-rooms/reset.ts
 */

import { getCollectionEntries, deleteEntry } from "../../shared/api";

async function resetStudioRooms(): Promise<number> {
  console.log("\n Resetting Studio Rooms...");

  const entries = await getCollectionEntries("studio-rooms");

  if (entries.length === 0) {
    console.log("  No entries found");
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry("studio-rooms", entry.documentId);
    if (success) {
      deleted++;
      console.log(`  Deleted studio-rooms/${entry.documentId}`);
    }
  }

  console.log(`  Deleted ${deleted}/${entries.length} studio rooms`);
  return deleted;
}

export { resetStudioRooms };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetStudioRooms()
    .then((count) => {
      console.log(`\nReset complete. Deleted ${count} studio rooms.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset studio rooms:", error);
      process.exit(1);
    });
}
