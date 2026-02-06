/**
 * Seed Contact Page
 *
 * Seeds contact page content for both EN and VI locales.
 *
 * Usage: npx tsx scripts/strapi/pages/contact-page/seed.ts
 */

import { uploadImage, updateSingleType } from "../../shared/api";

async function seedContactPage(): Promise<void> {
  console.log("\n Seeding Contact Page...");

  const heroImageId = await uploadImage("/images/contact/hero-background.jpg");
  const mapImageId = await uploadImage("/images/contact/saint6-map.jpg");

  // English
  await updateSingleType("contact-page", {
    hero: {
      heading: "Let's Connect",
      background_image: heroImageId,
      background_alt: "Saint 6 Studio exterior",
    },
    info: {
      title: "Contact Us",
      subheading: "Let's Create Something Exceptional Together",
      address_line_1: "6 Be Van Cam, Tan Kieng",
      address_line_2: "District 7, HCMC",
      email: "Saint6studios@gmail.com",
      phone: "0919 403 784 - 0918 756 573",
    },
    map_image: mapImageId,
  });

  // Vietnamese
  await updateSingleType(
    "contact-page",
    {
      hero: {
        heading: "Hãy Kết Nối",
        background_image: heroImageId,
        background_alt: "Saint 6 Studio exterior",
      },
      info: {
        title: "Liên Hệ",
        subheading: "Cùng Tạo Ra Điều Đặc Biệt",
        address_line_1: "6 Bế Văn Cấm, Tân Kiểng",
        address_line_2: "Quận 7, TP.HCM",
        email: "Saint6studios@gmail.com",
        phone: "0919 403 784 - 0918 756 573",
      },
      map_image: mapImageId,
    },
    "vi"
  );

  console.log("  Contact page seeded");
}

export { seedContactPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedContactPage()
    .then(() => {
      console.log("\nContact page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed contact page:", error);
      process.exit(1);
    });
}
