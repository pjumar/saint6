/**
 * Reset About Page
 *
 * Resets about page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/about-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  intro: null,
  vision: null,
  mission: null,
  values: [],
  our_story: null,
  timeline: [],
  founder: null,
  full_width_image: null,
};

async function resetAboutPage(): Promise<void> {
  console.log("\n Resetting About Page...");
  await resetSingleType("about-page", resetData);
  console.log("  About page reset");
}

export { resetAboutPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetAboutPage()
    .then(() => {
      console.log("\nAbout page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset about page:", error);
      process.exit(1);
    });
}
