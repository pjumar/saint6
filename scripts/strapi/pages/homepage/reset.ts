/**
 * Reset Homepage
 *
 * Resets homepage to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/homepage/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  brand_logos: [],
  gallery_images: [],
  key_projects: [],
  space_section: null,
  crew_area: null,
};

async function resetHomepage(): Promise<void> {
  console.log("\n Resetting Homepage...");
  await resetSingleType("homepage", resetData);
  console.log("  Homepage reset");
}

export { resetHomepage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetHomepage()
    .then(() => {
      console.log("\nHomepage reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset homepage:", error);
      process.exit(1);
    });
}
