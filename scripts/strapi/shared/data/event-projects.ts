/**
 * Event Projects seed data
 */

export interface EventProjectSeedData {
  title: string;
  title_vi: string;
  slug: string;
  category: string;
  category_vi: string;
  images: string[];
  order: number;
}

export const eventProjects: EventProjectSeedData[] = [
  {
    title: "Spring Collection Reveal",
    title_vi: "Ra Mắt Bộ Sưu Tập Xuân",
    slug: "spring-collection-reveal",
    category: "Fashion Shows",
    category_vi: "Thời Trang",
    images: [
      "public/images/event-planning/gallery-1.jpg",
      "public/images/event-planning/gallery-2.jpg",
      "public/images/event-planning/portfolio-1.jpg",
    ],
    order: 1,
  },
  {
    title: "VIP Gala Evening",
    title_vi: "Dạ Tiệc VIP",
    slug: "vip-gala-evening",
    category: "Private Dinners",
    category_vi: "Tiệc Riêng",
    images: [
      "public/images/event-planning/gallery-3.jpg",
      "public/images/event-planning/gallery-4.jpg",
      "public/images/event-planning/portfolio-2.jpg",
      "public/images/event-planning/portfolio-3.jpg",
    ],
    order: 2,
  },
  {
    title: "Contemporary Art Opening",
    title_vi: "Khai Mạc Nghệ Thuật Đương Đại",
    slug: "contemporary-art-opening",
    category: "Art & Lifestyle Pop-Ups",
    category_vi: "Nghệ Thuật & Phong Cách Sống",
    images: [
      "public/images/event-planning/portfolio-4.jpg",
      "public/images/event-planning/portfolio-5.jpg",
    ],
    order: 3,
  },
  {
    title: "Annual Awards Ceremony",
    title_vi: "Lễ Trao Giải Thường Niên",
    slug: "annual-awards-ceremony",
    category: "Corporate Celebrations",
    category_vi: "Sự Kiện Doanh Nghiệp",
    images: [
      "public/images/event-planning/service-corporate.jpg",
      "public/images/event-planning/service-press-events.jpg",
      "public/images/event-planning/service-product-launches.jpg",
    ],
    order: 4,
  },
];
