/**
 * Reset Studio Rental Page
 *
 * Resets studio rental page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/studio-rental-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  intro: null,
  stats: null,
  rooms: [],
  concept_rooms: [],
  full_rental: null,
  facilities: null,
  equipment: [],
  faqs: [],
};

async function resetStudioRentalPage(): Promise<void> {
  console.log("\n Resetting Studio Rental Page...");
  await resetSingleType("studio-rental-page", resetData);
  console.log("  Studio rental page reset");
}

export { resetStudioRentalPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetStudioRentalPage()
    .then(() => {
      console.log("\nStudio rental page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset studio rental page:", error);
      process.exit(1);
    });
}
