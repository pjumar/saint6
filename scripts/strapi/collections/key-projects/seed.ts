/**
 * Seed Key Projects
 *
 * Seeds key project entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/key-projects/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { keyProjects } from "../../shared/data/key-projects";

async function seedKeyProjects(): Promise<number[]> {
  console.log("\n Seeding Key Projects...");
  const createdIds: number[] = [];

  for (const project of keyProjects) {
    const mainImageId = await uploadImage(project.main_image);
    const galleryImageComponents = [];

    for (const img of project.gallery_images) {
      const id = await uploadImage(img.image);
      if (id) galleryImageComponents.push({ image: id, alt: img.alt });
    }

    // Create English version
    const entry = await createEntry("key-projects", {
      title: project.title,
      slug: project.slug,
      client: project.client,
      info_text: project.info_text,
      expertise: project.expertise,
      team: project.team,
      testimonial: project.testimonial,
      main_image: mainImageId,
      gallery_images: galleryImageComponents,
      is_featured: project.is_featured,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization (include images for both locales)
      await createLocalization("key-projects", entry.documentId, "vi", {
        title: project.title_vi,
        info_text: project.info_text_vi,
        expertise: project.expertise_vi,
        team: project.team_vi,
        testimonial: project.testimonial_vi,
        main_image: mainImageId,
        gallery_images: galleryImageComponents,
        is_featured: project.is_featured,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} key projects`);
  return createdIds;
}

export { seedKeyProjects };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedKeyProjects()
    .then((ids) => {
      console.log(`\nKey projects seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed key projects:", error);
      process.exit(1);
    });
}
