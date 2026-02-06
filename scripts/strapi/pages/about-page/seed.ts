/**
 * Seed About Page
 *
 * Seeds about page content for both EN and VI locales.
 *
 * Usage: npx tsx scripts/strapi/pages/about-page/seed.ts
 */

import { uploadImage, updateSingleType } from "../../shared/api";

async function seedAboutPage(): Promise<void> {
  console.log("\n Seeding About Page...");

  const heroImageId = await uploadImage("/images/about-us/hero-background.jpg");
  const introImageId = await uploadImage("/images/about-us/intro-portrait.jpg");
  const fullWidthImageId = await uploadImage(
    "/images/about-us/full-width-image.jpg"
  );
  const founderImageId = await uploadImage(
    "/images/about-us/founder-portrait.jpg"
  );

  const timelineImages = await Promise.all([
    uploadImage("/images/about-us/timeline-2021.jpg"),
    uploadImage("/images/about-us/timeline-2022.jpg"),
    uploadImage("/images/about-us/timeline-2023.jpg"),
    uploadImage("/images/about-us/timeline-2024.jpg"),
    uploadImage("/images/about-us/timeline-2025.jpg"),
    uploadImage("/images/about-us/timeline-2026.jpg"),
  ]);

  // English
  await updateSingleType("about-page", {
    hero: {
      heading: "We Imagine. We Design. We Create.",
      background_image: heroImageId,
      background_alt: "About Saint 6 Studio",
    },
    intro: {
      label: "ABOUT US",
      headline:
        "We are a studio of artists, builders, stylists, dreamers, problem solvers, and storytellers.\nWe turn ideas into places, feelings, and memories.",
      body_paragraph_1:
        "Saint 6 Studios, founded by Trang Nhe Nhang, is a multi-disciplinary creative studio crafting sets, spaces, environments, and experiences.",
      body_paragraph_2:
        'We create work that feels alive, work that holds emotion, atmosphere, and story. For us, it\'s never "just decor." It\'s the feeling someone carries home.',
      image: introImageId,
    },
    vision: {
      label: "VISION",
      statement:
        "To create work that is remembered through the feelings it evokes.",
    },
    full_width_image: fullWidthImageId,
    mission: {
      label: "MISSION",
      statement:
        "We transform ideas, identities, and stories into visual experiences that move people.",
    },
    values: [
      {
        letter: "S",
        title: "Simplicity",
        description: "Clarity reveals emotion.",
      },
      {
        letter: "A",
        title: "Authenticity",
        description: "Emotion must be real, not manufactured.",
      },
      {
        letter: "I",
        title: "Intention",
        description: "Every choice serves the feeling.",
      },
      {
        letter: "N",
        title: "Narrative",
        description: "Everything is part of the story.",
      },
      {
        letter: "T",
        title: "Trust",
        description: "Art needs reliability to thrive.",
      },
      {
        letter: "6",
        title: "Sixth Sense",
        description: "We design for the feeling beneath the brief.",
      },
    ],
    our_story: {
      label: "Our Story",
      paragraph_1:
        "Before Saint 6, there was Haus of Trang - where Trang learned that styling is not only about how things look, but how they make people feel.",
      paragraph_2: "That realization became the foundation of Saint 6",
    },
    timeline: [
      {
        year: "2021",
        image: timelineImages[0],
        description:
          "Saint 6 was founded with the belief that beauty is emotional, not ornamental.",
      },
      {
        year: "2022",
        image: timelineImages[1],
        description: "The first Saint 6 studio space was built.",
      },
      {
        year: "2023",
        image: timelineImages[2],
        description:
          "We expanded into store décor and spatial brand environments.",
      },
      {
        year: "2024",
        image: timelineImages[3],
        description: "We began designing events and weddings.",
      },
      {
        year: "2025",
        image: timelineImages[4],
        description:
          "We surpassed 1,000 set designs created since our founding.",
      },
      {
        year: "2026 (Next)",
        image: timelineImages[5],
        description: "We are opening a second Saint 6 location.",
      },
    ],
    founder: {
      image: founderImageId,
      quote:
        "Creation is emotional work. We build spaces for people to feel something real.",
      name: "Trang",
      title: "Founder & Creative Director",
    },
  });

  // Vietnamese
  await updateSingleType(
    "about-page",
    {
      hero: {
        heading:
          "Chúng Tôi Tưởng Tượng. Chúng Tôi Thiết Kế. Chúng Tôi Sáng Tạo.",
        background_image: heroImageId,
        background_alt: "About Saint 6 Studio",
      },
      intro: {
        label: "GIỚI THIỆU",
        headline:
          "Chúng tôi là một studio của các nghệ sĩ, thợ xây, stylist, người mơ mộng, người giải quyết vấn đề và người kể chuyện.\nChúng tôi biến ý tưởng thành không gian, cảm xúc và ký ức.",
        body_paragraph_1:
          "Saint 6 Studios, được sáng lập bởi Trang Nhẹ Nhàng, là một studio sáng tạo đa ngành chuyên tạo ra các set, không gian, môi trường và trải nghiệm.",
        body_paragraph_2:
          'Chúng tôi tạo ra những tác phẩm có hồn, những tác phẩm chứa đựng cảm xúc, bầu không khí và câu chuyện. Với chúng tôi, đó không bao giờ chỉ là "trang trí." Đó là cảm xúc mà ai đó mang về nhà.',
        image: introImageId,
      },
      vision: {
        label: "TẦM NHÌN",
        statement:
          "Tạo ra những tác phẩm được ghi nhớ qua những cảm xúc mà chúng gợi lên.",
      },
      full_width_image: fullWidthImageId,
      mission: {
        label: "SỨ MỆNH",
        statement:
          "Chúng tôi biến ý tưởng, bản sắc và câu chuyện thành những trải nghiệm hình ảnh chạm đến trái tim con người.",
      },
      values: [
        {
          letter: "S",
          title: "Simplicity",
          description: "Sự rõ ràng bộc lộ cảm xúc.",
        },
        {
          letter: "A",
          title: "Authenticity",
          description: "Cảm xúc phải thật, không được tạo dựng.",
        },
        {
          letter: "I",
          title: "Intention",
          description: "Mọi lựa chọn đều phục vụ cảm xúc.",
        },
        {
          letter: "N",
          title: "Narrative",
          description: "Mọi thứ đều là một phần của câu chuyện.",
        },
        {
          letter: "T",
          title: "Trust",
          description: "Nghệ thuật cần sự đáng tin cậy để phát triển.",
        },
        {
          letter: "6",
          title: "Sixth Sense",
          description: "Chúng tôi thiết kế cho cảm xúc ẩn dấu.",
        },
      ],
      our_story: {
        label: "Câu Chuyện Của Chúng Tôi",
        paragraph_1:
          "Trước Saint 6, đã có Haus of Trang - nơi Trang học được rằng styling không chỉ là về việc mọi thứ trông như thế nào, mà còn là cách chúng khiến người ta cảm nhận.",
        paragraph_2: "Nhận thức đó đã trở thành nền tảng của Saint 6",
      },
      timeline: [
        {
          year: "2021",
          image: timelineImages[0],
          description:
            "Saint 6 được thành lập với niềm tin rằng cái đẹp là cảm xúc, không phải trang trí.",
        },
        {
          year: "2022",
          image: timelineImages[1],
          description: "Không gian studio Saint 6 đầu tiên được xây dựng.",
        },
        {
          year: "2023",
          image: timelineImages[2],
          description:
            "Chúng tôi mở rộng sang trang trí cửa hàng và môi trường thương hiệu không gian.",
        },
        {
          year: "2024",
          image: timelineImages[3],
          description: "Chúng tôi bắt đầu thiết kế sự kiện và đám cưới.",
        },
        {
          year: "2025",
          image: timelineImages[4],
          description:
            "Chúng tôi vượt qua 1.000 thiết kế bối cảnh được tạo ra kể từ khi thành lập.",
        },
        {
          year: "2026 (Tiếp theo)",
          image: timelineImages[5],
          description: "Chúng tôi đang mở địa điểm Saint 6 thứ hai.",
        },
      ],
      founder: {
        image: founderImageId,
        quote:
          "Sáng tạo là công việc của cảm xúc. Chúng tôi xây dựng không gian để mọi người cảm nhận điều gì đó chân thật.",
        name: "Trang",
        title: "Nhà Sáng Lập & Giám Đốc Sáng Tạo",
      },
    },
    "vi"
  );

  console.log("  About page seeded");
}

export { seedAboutPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedAboutPage()
    .then(() => {
      console.log("\nAbout page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed about page:", error);
      process.exit(1);
    });
}
