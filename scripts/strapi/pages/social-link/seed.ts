/**
 * Seed Social Links
 *
 * Seeds social media links for both EN and VI locales.
 *
 * Usage: npx tsx scripts/strapi/pages/social-link/seed.ts
 */

import { updateSingleType } from "../../shared/api";

async function seedSocialLinks(): Promise<void> {
  console.log("\n Seeding Social Links...");

  // English
  await updateSingleType("social-link", {
    facebook_url: "https://www.facebook.com/saint6studios/",
    facebook_label: "FACEBOOK",
    instagram_url: "https://www.instagram.com/saint6.studios/",
    instagram_label: "INSTAGRAM",
    tiktok_url: "https://www.tiktok.com/@saint6studios",
    tiktok_label: "TIKTOK",
  });

  // Vietnamese
  await updateSingleType(
    "social-link",
    {
      facebook_label: "FACEBOOK",
      instagram_label: "INSTAGRAM",
      tiktok_label: "TIKTOK",
    },
    "vi",
  );

  console.log("  Social links seeded");
}

export { seedSocialLinks };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedSocialLinks()
    .then(() => {
      console.log("\nSocial links seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed social links:", error);
      process.exit(1);
    });
}
