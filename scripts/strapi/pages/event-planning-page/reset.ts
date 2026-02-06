/**
 * Reset Event Planning Page
 *
 * Resets event planning page to empty state for both locales.
 *
 * Usage: npx tsx scripts/strapi/pages/event-planning-page/reset.ts
 */

import { resetSingleType } from "../../shared/api";

const resetData = {
  hero: null,
  intro: null,
  services: [],
  intro_2: null,
  workflow: [],
  event_projects: [],
};

async function resetEventPlanningPage(): Promise<void> {
  console.log("\n Resetting Event Planning Page...");
  await resetSingleType("event-planning-page", resetData);
  console.log("  Event planning page reset");
}

export { resetEventPlanningPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  resetEventPlanningPage()
    .then(() => {
      console.log("\nEvent planning page reset successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to reset event planning page:", error);
      process.exit(1);
    });
}
