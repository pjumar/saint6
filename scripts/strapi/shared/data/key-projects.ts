import type { KeyProject } from "../types";

export const keyProjects: KeyProject[] = [
  {
    title: "LSoul Casting call for Shanghai Fashion Week 2025",
    title_vi: "LSoul Casting call cho Tuần lễ Thời trang Thượng Hải 2025",
    slug: "lsoul-shanghai-fashion-week-2025",
    client: "LSoul",
    info_text:
      "A high-profile casting call and photoshoot for Shanghai Fashion Week 2025, featuring emerging Vietnamese talent and international models in a stunning editorial showcase.",
    info_text_vi:
      "Buổi casting và chụp hình cao cấp cho Tuần lễ Thời trang Thượng Hải 2025, giới thiệu tài năng Việt Nam mới nổi và người mẫu quốc tế trong một bộ ảnh thời trang ấn tượng.",
    expertise: ["Set Design", "Production", "Location"],
    expertise_vi: ["Thiết Kế Bối Cảnh", "Sản Xuất", "Địa Điểm"],
    team: [
      { role: "Photo", name: "Linh Phạm" },
      { role: "Fashion Director", name: "Trần Đạt" },
      { role: "Set design production", name: "SAINT6 Production" },
    ],
    team_vi: [
      { role: "Nhiếp Ảnh", name: "Linh Phạm" },
      { role: "Giám Đốc Thời Trang", name: "Trần Đạt" },
      { role: "Sản xuất thiết kế bối cảnh", name: "SAINT6 Production" },
    ],
    testimonial: {
      quote:
        "Spacious, modular, with the energy and tools that serious creatives need.",
      author: "Crish Phan",
      role: "Creative Director at LSoul",
    },
    testimonial_vi: {
      quote:
        "Rộng rãi, linh hoạt, với năng lượng và công cụ mà các nhà sáng tạo chuyên nghiệp cần.",
      author: "Crish Phan",
      role: "Giám Đốc Sáng Tạo tại LSoul",
    },
    main_image: "/images/project/project-main.jpg",
    gallery_images: [
      { image: "/images/project/project-01.jpg", alt: "Project gallery 1" },
      { image: "/images/project/project-02.jpg", alt: "Project gallery 2" },
      { image: "/images/project/project-03.jpg", alt: "Project gallery 3" },
    ],
    is_featured: true,
  },
  {
    title: "Vinamilk Brand Campaign 2025",
    title_vi: "Chiến Dịch Thương Hiệu Vinamilk 2025",
    slug: "vinamilk-brand-campaign-2025",
    client: "Vinamilk",
    info_text:
      "A comprehensive brand campaign for Vietnam's leading dairy company, combining lifestyle photography with product showcases across multiple studio sets.",
    info_text_vi:
      "Chiến dịch thương hiệu toàn diện cho công ty sữa hàng đầu Việt Nam, kết hợp nhiếp ảnh lifestyle với trưng bày sản phẩm trên nhiều bối cảnh studio.",
    expertise: ["Creative Direction", "Set Design", "Production"],
    expertise_vi: ["Chỉ Đạo Sáng Tạo", "Thiết Kế Bối Cảnh", "Sản Xuất"],
    team: [
      { role: "Creative Director", name: "Minh Nguyễn" },
      { role: "Art Director", name: "Hương Trần" },
      { role: "Production Manager", name: "SAINT6 Production" },
    ],
    team_vi: [
      { role: "Giám Đốc Sáng Tạo", name: "Minh Nguyễn" },
      { role: "Giám Đốc Nghệ Thuật", name: "Hương Trần" },
      { role: "Quản Lý Sản Xuất", name: "SAINT6 Production" },
    ],
    testimonial: {
      quote:
        "SAINT6 delivered beyond our expectations. The versatility of their space allowed us to create multiple distinct looks in a single shoot.",
      author: "Thu Hà",
      role: "Marketing Director at Vinamilk",
    },
    testimonial_vi: {
      quote:
        "SAINT6 đã vượt xa kỳ vọng của chúng tôi. Sự đa dạng của không gian cho phép chúng tôi tạo ra nhiều phong cách khác nhau trong một buổi chụp.",
      author: "Thu Hà",
      role: "Giám Đốc Marketing tại Vinamilk",
    },
    main_image: "/images/gallery/gallery-01.jpg",
    gallery_images: [
      { image: "/images/gallery/gallery-02.jpg", alt: "Vinamilk campaign 1" },
      { image: "/images/gallery/gallery-03.jpg", alt: "Vinamilk campaign 2" },
      { image: "/images/gallery/gallery-04.jpg", alt: "Vinamilk campaign 3" },
    ],
    is_featured: false,
  },
];
