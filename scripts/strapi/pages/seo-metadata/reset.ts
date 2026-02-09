/**
 * Reset SEO Metadata
 *
 * Resets SEO metadata to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/seo-metadata/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  site_name: null,
  default_title: null,
  title_template: null,
  description: null,
  keywords: null,
  og_image: null,
  twitter_image: null,
};

async function resetSeoMetadata(): Promise<void> {
  console.log("\n Resetting SEO Metadata...");
  await resetSingleType("seo-metadata", resetData);
  console.log("  SEO metadata reset");
}

export { resetSeoMetadata };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetSeoMetadata()
    .then(() => {
      console.log("\nSEO metadata reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset SEO metadata:", error);
      process.exit(1);
    });
}
