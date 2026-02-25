/**
 * Seed Footer
 *
 * Seeds footer content for both EN and VI locales.
 *
 * Usage: npx tsx scripts/strapi/pages/footer/seed.ts
 */

import { updateSingleType } from "../../shared/api";

async function seedFooter(): Promise<void> {
  console.log("\n Seeding Footer...");

  // English
  await updateSingleType("footer", {
    contact_label: "CONTACT US",
    address: "6 Be Van Cam, Tan Kieng, District 7, HCMC",
    email: "Saint6studios@gmail.com",
    phone: "0919 403 784 - 0918 756 573",
  });

  // Vietnamese
  await updateSingleType(
    "footer",
    {
      contact_label: "LIÊN HỆ VỚI CHÚNG TÔI",
      address: "6 Bế Văn Cấm, Tân Kiểng, Quận 7, TP.HCM",
    },
    "vi",
  );

  console.log("  Footer seeded");
}

export { seedFooter };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedFooter()
    .then(() => {
      console.log("\nFooter seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed footer:", error);
      process.exit(1);
    });
}
