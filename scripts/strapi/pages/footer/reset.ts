/**
 * Reset Footer
 *
 * Resets footer to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/footer/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  contact_label: null,
  address: null,
  email: null,
  phone: null,
};

async function resetFooter(): Promise<void> {
  console.log("\n Resetting Footer...");
  await resetSingleType("footer", resetData);
  console.log("  Footer reset");
}

export { resetFooter };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetFooter()
    .then(() => {
      console.log("\nFooter reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset footer:", error);
      process.exit(1);
    });
}
