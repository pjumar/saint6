/**
 * Reset Set Design Page
 *
 * Resets set design page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/set-design-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  intro: null,
  workflow: [],
  portfolio_settings: null,
  portfolio_items: [],
  testimonials: [],
};

async function resetSetDesignPage(): Promise<void> {
  console.log("\n Resetting Set Design Page...");
  await resetSingleType("set-design-page", resetData);
  console.log("  Set design page reset");
}

export { resetSetDesignPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetSetDesignPage()
    .then(() => {
      console.log("\nSet design page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset set design page:", error);
      process.exit(1);
    });
}
