/**
 * Reset All Strapi Content
 *
 * Master script that resets all pages and deletes all collection entries.
 *
 * Usage: npx tsx scripts/reset-all.ts
 */

import { STRAPI_URL, STRAPI_API_TOKEN } from "./strapi/shared/config";
import { headers } from "./strapi/shared/config";

// Page resets
import { resetHomepage } from "./strapi/pages/homepage/reset";
import { resetStudioRentalPage } from "./strapi/pages/studio-rental-page/reset";
import { resetAboutPage } from "./strapi/pages/about-page/reset";
import { resetContactPage } from "./strapi/pages/contact-page/reset";
import { resetCreativePage } from "./strapi/pages/creative-page/reset";
import { resetProductionPage } from "./strapi/pages/production-page/reset";
import { resetSetDesignPage } from "./strapi/pages/set-design-page/reset";
import { resetEventPlanningPage } from "./strapi/pages/event-planning-page/reset";
import { resetDecorPage } from "./strapi/pages/decor-page/reset";

// Collection resets
import { resetBrandLogos } from "./strapi/collections/brand-logos/reset";
import { resetTestimonialItems } from "./strapi/collections/testimonial-items/reset";
import { resetServiceItems } from "./strapi/collections/service-items/reset";
import { resetStudioRooms } from "./strapi/collections/studio-rooms/reset";
import { resetEquipmentItems } from "./strapi/collections/equipment-items/reset";
import { resetFaqItems } from "./strapi/collections/faq-items/reset";
import { resetPortfolioItems } from "./strapi/collections/portfolio-items/reset";
import { resetKeyProjects } from "./strapi/collections/key-projects/reset";

async function deleteAllMedia(): Promise<number> {
  console.log("\n Deleting uploaded media files...");

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/upload/files?pagination[pageSize]=100`,
      {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      }
    );

    if (!response.ok) {
      console.log("  Could not fetch media files");
      return 0;
    }

    const files = await response.json();

    if (files.length === 0) {
      console.log("  No media files found");
      return 0;
    }

    let deleted = 0;
    for (const file of files) {
      try {
        const deleteResponse = await fetch(
          `${STRAPI_URL}/api/upload/files/${file.id}`,
          {
            method: "DELETE",
            headers,
          }
        );
        if (deleteResponse.ok) {
          deleted++;
          console.log(`  Deleted media file: ${file.name}`);
        }
      } catch {
        console.log(`  Could not delete file: ${file.name}`);
      }
    }

    console.log(`  Deleted ${deleted}/${files.length} media files`);
    return deleted;
  } catch (error) {
    console.log(`  Could not fetch media files: ${error}`);
    return 0;
  }
}

async function resetAll() {
  console.log("Starting Strapi CMS Reset...\n");
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  const summary = {
    pages: 0,
    collections: 0,
    mediaFiles: 0,
  };

  try {
    // Reset pages first (to remove references to collections)
    console.log("=== RESETTING PAGES ===");

    await resetHomepage();
    summary.pages++;

    await resetStudioRentalPage();
    summary.pages++;

    await resetAboutPage();
    summary.pages++;

    await resetContactPage();
    summary.pages++;

    await resetCreativePage();
    summary.pages++;

    await resetProductionPage();
    summary.pages++;

    await resetSetDesignPage();
    summary.pages++;

    await resetEventPlanningPage();
    summary.pages++;

    await resetDecorPage();
    summary.pages++;

    // Reset collections (delete all entries)
    console.log("\n=== RESETTING COLLECTIONS ===");

    summary.collections += await resetServiceItems();
    summary.collections += await resetTestimonialItems();
    summary.collections += await resetBrandLogos();
    summary.collections += await resetStudioRooms();
    summary.collections += await resetEquipmentItems();
    summary.collections += await resetFaqItems();
    summary.collections += await resetPortfolioItems();
    summary.collections += await resetKeyProjects();

    // Delete uploaded media files
    console.log("\n=== DELETING MEDIA ===");
    summary.mediaFiles = await deleteAllMedia();

    // Print summary
    console.log("\n\n=== RESET COMPLETE ===");
    console.log("\nSummary:");
    console.log(`  Pages reset: ${summary.pages}`);
    console.log(`  Collection entries deleted: ${summary.collections}`);
    console.log(`  Media files deleted: ${summary.mediaFiles}`);
  } catch (error) {
    console.error("\nReset failed:", error);
    process.exit(1);
  }
}

resetAll()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Reset failed:", error);
    process.exit(1);
  });
