import type { StudioRoom } from "../types";

// All room images for gallery (each room shows its own image first, then the others)
const allRoomImages = [
  "/images/rooms/loft.jpg",
  "/images/rooms/studio.jpg",
  "/images/rooms/arena.jpg",
  "/images/rooms/concept1.jpg",
  "/images/rooms/concept2.jpg",
  "/images/rooms/concept3.jpg",
];

// Helper to create gallery with own image first, then others
function createGallery(ownImageIndex: number): string[] {
  const gallery = [allRoomImages[ownImageIndex]];
  for (let i = 0; i < allRoomImages.length; i++) {
    if (i !== ownImageIndex) {
      gallery.push(allRoomImages[i]);
    }
  }
  return gallery;
}

export const studioRooms: StudioRoom[] = [
  {
    title: "The Loft",
    title_vi: "The Loft",
    slug: "the-loft",
    type: "blank",
    price_per_hour: "450,000",
    counter: "01/06",
    space: "125m²",
    width: "6m",
    ceiling_height: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    description_vi:
      "Hoàn hảo cho các buổi chụp editorial, phỏng vấn và chiến dịch tối giản.",
    image: "/images/rooms/loft.jpg",
    gallery: createGallery(0),
    order: 1,
  },
  {
    title: "The Studio",
    title_vi: "The Studio",
    slug: "the-studio",
    type: "blank",
    price_per_hour: "800,000",
    counter: "02/06",
    space: "125m²",
    width: "6m",
    ceiling_height: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    description_vi:
      "Hoàn hảo cho các buổi chụp editorial, phỏng vấn và chiến dịch tối giản.",
    image: "/images/rooms/studio.jpg",
    gallery: createGallery(1),
    order: 2,
  },
  {
    title: "The Arena",
    title_vi: "The Arena",
    slug: "the-arena",
    type: "blank",
    price_per_hour: "850,000",
    counter: "03/06",
    space: "125m²",
    width: "6m",
    ceiling_height: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    description_vi:
      "Hoàn hảo cho các buổi chụp editorial, phỏng vấn và chiến dịch tối giản.",
    image: "/images/rooms/arena.jpg",
    gallery: createGallery(2),
    order: 3,
  },
  {
    title: "Concept Room 1",
    title_vi: "Phòng Concept 1",
    slug: "concept-room-1",
    type: "concept",
    price_per_hour: "450,000",
    counter: "04/06",
    space: "125m²",
    width: "6m",
    ceiling_height: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    description_vi: "Phòng theo chủ đề mùa cho các concept sáng tạo độc đáo.",
    image: "/images/rooms/concept1.jpg",
    gallery: createGallery(3),
    order: 4,
  },
  {
    title: "Concept Room 2",
    title_vi: "Phòng Concept 2",
    slug: "concept-room-2",
    type: "concept",
    price_per_hour: "450,000",
    counter: "05/06",
    space: "125m²",
    width: "6m",
    ceiling_height: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    description_vi: "Phòng theo chủ đề mùa cho các concept sáng tạo độc đáo.",
    image: "/images/rooms/concept2.jpg",
    gallery: createGallery(4),
    order: 5,
  },
  {
    title: "Concept Room 3",
    title_vi: "Phòng Concept 3",
    slug: "concept-room-3",
    type: "concept",
    price_per_hour: "450,000",
    counter: "06/06",
    space: "125m²",
    width: "6m",
    ceiling_height: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    description_vi: "Phòng theo chủ đề mùa cho các concept sáng tạo độc đáo.",
    image: "/images/rooms/concept3.jpg",
    gallery: createGallery(5),
    order: 6,
  },
];
