/**
 * Publish All Strapi Content
 *
 * Publishes all drafts for single types (pages) and collection entries
 * across both EN and VI locales. Run this after seeding to make all
 * content live.
 *
 * Usage: npx tsx scripts/strapi/publish-all.ts
 */

import { publishAll } from "./shared/api";

publishAll()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Publish failed:", error);
    process.exit(1);
  });
