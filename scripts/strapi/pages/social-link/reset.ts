/**
 * Reset Social Links
 *
 * Resets social links to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/social-link/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  facebook_url: null,
  facebook_label: null,
  instagram_url: null,
  instagram_label: null,
  tiktok_url: null,
  tiktok_label: null,
};

async function resetSocialLinks(): Promise<void> {
  console.log("\n Resetting Social Links...");
  await resetSingleType("social-link", resetData);
  console.log("  Social links reset");
}

export { resetSocialLinks };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetSocialLinks()
    .then(() => {
      console.log("\nSocial links reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset social links:", error);
      process.exit(1);
    });
}
