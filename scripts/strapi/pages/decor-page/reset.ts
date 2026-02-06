/**
 * Reset Decor Page
 *
 * Resets decor page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/decor-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  intro: null,
  workflow: [],
  intro_2: null,
  portfolio_settings: null,
  portfolio_items: [],
};

async function resetDecorPage(): Promise<void> {
  console.log("\n Resetting Decor Page...");
  await resetSingleType("decor-page", resetData);
  console.log("  Decor page reset");
}

export { resetDecorPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetDecorPage()
    .then(() => {
      console.log("\nDecor page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset decor page:", error);
      process.exit(1);
    });
}
