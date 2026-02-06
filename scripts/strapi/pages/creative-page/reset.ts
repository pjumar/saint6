/**
 * Reset Creative Page
 *
 * Resets creative page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/creative-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  clients: null,
  client_logos: [],
  services: [],
  intro: null,
  workflow: [],
  portfolio_settings: null,
  portfolio_items: [],
  testimonials: [],
};

async function resetCreativePage(): Promise<void> {
  console.log("\n Resetting Creative Page...");
  await resetSingleType("creative-page", resetData);
  console.log("  Creative page reset");
}

export { resetCreativePage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetCreativePage()
    .then(() => {
      console.log("\nCreative page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset creative page:", error);
      process.exit(1);
    });
}
