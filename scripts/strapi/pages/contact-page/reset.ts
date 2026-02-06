/**
 * Reset Contact Page
 *
 * Resets contact page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/contact-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  info: null,
  map_image: null,
};

async function resetContactPage(): Promise<void> {
  console.log("\n Resetting Contact Page...");
  await resetSingleType("contact-page", resetData);
  console.log("  Contact page reset");
}

export { resetContactPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetContactPage()
    .then(() => {
      console.log("\nContact page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset contact page:", error);
      process.exit(1);
    });
}
