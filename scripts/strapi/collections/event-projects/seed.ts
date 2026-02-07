/**
 * Seed Event Projects
 *
 * Seeds event project entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/event-projects/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { eventProjects } from "../../shared/data/event-projects";

async function seedEventProjects(): Promise<number[]> {
  console.log("\n Seeding Event Projects...");
  const createdIds: number[] = [];

  for (const project of eventProjects) {
    // Upload all images
    const imageIds: number[] = [];
    for (const imagePath of project.images) {
      const imageId = await uploadImage(imagePath);
      if (imageId) {
        imageIds.push(imageId);
      }
    }

    if (imageIds.length === 0) {
      console.log(`  Skipping ${project.title} - no images uploaded`);
      continue;
    }

    // Create English version
    const entry = await createEntry("event-projects", {
      title: project.title,
      slug: project.slug,
      category: project.category,
      images: imageIds,
      order: project.order,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("event-projects", entry.documentId, "vi", {
        title: project.title_vi,
        category: project.category_vi,
        images: imageIds,
        order: project.order,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} event projects`);
  return createdIds;
}

export { seedEventProjects };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedEventProjects()
    .then((ids) => {
      console.log(`\nEvent projects seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed event projects:", error);
      process.exit(1);
    });
}
