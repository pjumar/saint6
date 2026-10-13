import type { StylingLocale, StylingProject } from "./types";

const cover = {
  url: "/images/portfolio/2-ngay-1-dem.jpg",
  width: 1638,
  height: 1141,
  alternativeText:
    "The cast of 2 Ngày 1 Đêm wearing coordinated custom jackets outdoors",
};

export const featuredStylingProjects: Record<StylingLocale, StylingProject[]> =
  {
    en: [
      {
        slug: "2-ngay-1-dem-vietnam",
        title: "2 Ngày 1 Đêm – Vietnam",
        category: "TV show / reality show",
        category_key: "music",
        featured: true,
        summary: "On-set styling and a custom outerwear piece for the cast.",
        body: "For this episode of 2 Ngày 1 Đêm, Haus of Trang joined the on-set styling team, working with the artists’ existing wardrobes and developing a custom jacket for the episode. The design balanced each artist’s individual style with a cohesive group look and the practical needs of outdoor filming. On set, the team coordinated outfits, made adjustments and maintained the looks throughout production.",
        cover,
        gallery: [],
        credits: [
          { role: "Stylist", name: "Haus of Trang" },
          { role: "Role", name: "On-set styling / custom garment" },
        ],
        source_url: "",
        sort_order: -1,
        seo_title:
          "2 Ngày 1 Đêm – Vietnam | Styling by Haus of Trang | Saint 6",
        seo_description:
          "Explore Haus of Trang’s on-set styling and custom garment for 2 Ngày 1 Đêm – Vietnam.",
      },
    ],
    vi: [
      {
        slug: "2-ngay-1-dem-vietnam",
        title: "2 Ngày 1 Đêm – Việt Nam",
        category: "Chương trình truyền hình / truyền hình thực tế",
        category_key: "music",
        featured: true,
        summary:
          "Styling tại trường quay và thiết kế áo khoác riêng cho dàn nghệ sĩ.",
        body: "Trong tập này của 2 Ngày 1 Đêm, Haus of Trang tham gia với vai trò on-set stylist, trực tiếp làm việc cùng nghệ sĩ trên set và phát triển riêng một thiết kế áo khoác custom cho tập quay. Thiết kế phù hợp với phong cách riêng của từng nghệ sĩ, tạo sự đồng nhất về hình ảnh cho cả nhóm và đáp ứng các hoạt động ngoài trời. Trên set, đội ngũ phụ trách điều phối trang phục, chỉnh sửa outfit và duy trì tổng thể hình ảnh xuyên suốt quá trình quay.",
        cover,
        gallery: [],
        credits: [
          { role: "Stylist", name: "Haus of Trang" },
          { role: "Vai trò", name: "On-set stylist / thiết kế trang phục" },
        ],
        source_url: "",
        sort_order: -1,
        seo_title:
          "2 Ngày 1 Đêm – Việt Nam | Styling bởi Haus of Trang | Saint 6",
        seo_description:
          "Khám phá dự án styling tại trường quay và thiết kế trang phục của Haus of Trang cho 2 Ngày 1 Đêm – Việt Nam.",
      },
    ],
  };
