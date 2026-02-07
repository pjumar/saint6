/**
 * Cleanup Strapi Assets (Uploaded Files)
 *
 * Deletes all uploaded files/images from Strapi media library.
 *
 * Usage: npx tsx scripts/strapi/cleanup-assets.ts
 */

import { STRAPI_URL, authHeaders } from "./shared/config";

async function cleanupAssets() {
  console.log("\n Cleaning up Strapi Assets...");
  console.log(`  Strapi URL: ${STRAPI_URL}\n`);

  try {
    // Get all files
    const response = await fetch(`${STRAPI_URL}/api/upload/files?pagination[pageSize]=1000`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch files: ${response.status} ${text}`);
    }

    const files = await response.json();
    console.log(`  Found ${files.length} files to delete\n`);

    let deleted = 0;
    for (const file of files) {
      try {
        const deleteResponse = await fetch(`${STRAPI_URL}/api/upload/files/${file.id}`, {
          method: "DELETE",
          headers: authHeaders,
        });

        if (deleteResponse.ok) {
          console.log(`  Deleted: ${file.name} (ID: ${file.id})`);
          deleted++;
        } else {
          console.log(`  Failed to delete: ${file.name} (ID: ${file.id})`);
        }
      } catch (error) {
        console.log(`  Error deleting ${file.name}:`, error);
      }
    }

    console.log(`\n  Cleanup complete. Deleted ${deleted}/${files.length} files.`);
  } catch (error) {
    console.error("  Cleanup failed:", error);
    process.exit(1);
  }
}

cleanupAssets()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
  });
