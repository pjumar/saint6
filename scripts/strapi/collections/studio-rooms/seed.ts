/**
 * Seed Studio Rooms
 *
 * Seeds studio room entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/studio-rooms/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { studioRooms } from "../../shared/data/studio-rooms";

async function seedStudioRooms(): Promise<number[]> {
  console.log("\n Seeding Studio Rooms...");
  const createdIds: number[] = [];

  for (const room of studioRooms) {
    const imageId = await uploadImage(room.image);

    // Create English version (exclude _vi fields)
    const entry = await createEntry("studio-rooms", {
      title: room.title,
      slug: room.slug,
      type: room.type,
      price_per_hour: room.price_per_hour,
      counter: room.counter,
      space: room.space,
      width: room.width,
      ceiling_height: room.ceiling_height,
      description: room.description,
      image: imageId,
      order: room.order,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization (include image for both locales)
      await createLocalization("studio-rooms", entry.documentId, "vi", {
        title: room.title_vi,
        description: room.description_vi,
        image: imageId,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} studio rooms`);
  return createdIds;
}

export { seedStudioRooms };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedStudioRooms()
    .then((ids) => {
      console.log(`\nStudio rooms seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed studio rooms:", error);
      process.exit(1);
    });
}
