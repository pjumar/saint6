/**
 * Reset Production Page
 *
 * Resets production page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/production-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  intro: null,
  services: [],
  intro_2: null,
  workflow: [],
  key_projects: [],
};

async function resetProductionPage(): Promise<void> {
  console.log("\n Resetting Production Page...");
  await resetSingleType("production-page", resetData);
  console.log("  Production page reset");
}

export { resetProductionPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetProductionPage()
    .then(() => {
      console.log("\nProduction page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset production page:", error);
      process.exit(1);
    });
}
