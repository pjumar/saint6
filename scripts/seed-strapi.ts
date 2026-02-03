/**
 * Strapi CMS Seed Script
 *
 * This script uploads images and populates the Strapi CMS with mock data
 * from the current React components.
 *
 * Usage: npx tsx scripts/seed-strapi.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { Blob } from 'buffer';

// Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://fantastic-attraction-7b2626fe03.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN is required. Set it in .env.local');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
};

// Image cache to avoid re-uploading
const imageCache: Record<string, number> = {};

// ============================================================================
// API Utilities
// ============================================================================

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status}: ${text}`);
  }

  return response.json();
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

async function uploadImage(imagePath: string): Promise<number | null> {
  // Check cache first
  if (imageCache[imagePath]) {
    return imageCache[imagePath];
  }

  const fullPath = path.join(process.cwd(), 'public', imagePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${imagePath}`);
    return null;
  }

  // Read file as buffer and create Blob
  const fileBuffer = fs.readFileSync(fullPath);
  const fileName = path.basename(imagePath);
  const mimeType = getMimeType(fullPath);

  // Create FormData with native API
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('files', blob, fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Upload failed for ${imagePath}: ${text}`);
      return null;
    }

    const data = await response.json();
    const imageId = data[0]?.id;

    if (imageId) {
      imageCache[imagePath] = imageId;
      console.log(`✅ Uploaded: ${imagePath} (ID: ${imageId})`);
    }

    return imageId;
  } catch (error) {
    console.error(`❌ Upload error for ${imagePath}:`, error);
    return null;
  }
}

async function createEntry(contentType: string, data: Record<string, unknown>, locale = 'en') {
  try {
    const result = await apiRequest(contentType, {
      method: 'POST',
      body: JSON.stringify({ data: { ...data, locale } }),
    });
    console.log(`✅ Created ${contentType}: ${data.title || data.name || 'entry'}`);
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to create ${contentType}:`, error);
    return null;
  }
}

async function updateSingleType(contentType: string, data: Record<string, unknown>, locale = 'en') {
  try {
    const result = await apiRequest(contentType, {
      method: 'PUT',
      body: JSON.stringify({ data: { ...data, locale } }),
    });
    console.log(`✅ Updated ${contentType}`);
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to update ${contentType}:`, error);
    return null;
  }
}

// ============================================================================
// Seed Data
// ============================================================================

const brandLogos = [
  { name: "L'Officiel", logo: '/images/brands/brand-01.png', order: 1 },
  { name: 'Fressi', logo: '/images/brands/brand-02.png', order: 2 },
  { name: 'Vinamilk', logo: '/images/brands/brand-03.png', order: 3 },
  { name: 'Sony', logo: '/images/brands/brand-04.png', order: 4 },
  { name: 'Pepsi', logo: '/images/brands/brand-05.png', order: 5 },
  { name: 'Honda', logo: '/images/brands/brand-06.png', order: 6 },
];

const studioRooms = [
  {
    title: 'The Loft',
    slug: 'the-loft',
    type: 'blank',
    price_per_hour: '450,000',
    counter: '01/06',
    space: '125m²',
    width: '6m',
    ceiling_height: '4.5m',
    description: 'Perfect for editorial shoots, interviews, and minimalist campaigns.',
    image: '/images/rooms/loft.jpg',
    order: 1,
  },
  {
    title: 'The Studio',
    slug: 'the-studio',
    type: 'blank',
    price_per_hour: '800,000',
    counter: '02/06',
    space: '125m²',
    width: '6m',
    ceiling_height: '4.5m',
    description: 'Perfect for editorial shoots, interviews, and minimalist campaigns.',
    image: '/images/rooms/studio.jpg',
    order: 2,
  },
  {
    title: 'The Arena',
    slug: 'the-arena',
    type: 'blank',
    price_per_hour: '850,000',
    counter: '03/06',
    space: '125m²',
    width: '6m',
    ceiling_height: '4.5m',
    description: 'Perfect for editorial shoots, interviews, and minimalist campaigns.',
    image: '/images/rooms/arena.jpg',
    order: 3,
  },
  {
    title: 'Concept Room 1',
    slug: 'concept-room-1',
    type: 'concept',
    price_per_hour: '450,000',
    counter: '04/06',
    space: '125m²',
    width: '6m',
    ceiling_height: '4.5m',
    description: 'Seasonal themed room for unique creative concepts.',
    image: '/images/rooms/concept1.jpg',
    order: 4,
  },
  {
    title: 'Concept Room 2',
    slug: 'concept-room-2',
    type: 'concept',
    price_per_hour: '450,000',
    counter: '05/06',
    space: '125m²',
    width: '6m',
    ceiling_height: '4.5m',
    description: 'Seasonal themed room for unique creative concepts.',
    image: '/images/rooms/concept2.jpg',
    order: 5,
  },
  {
    title: 'Concept Room 3',
    slug: 'concept-room-3',
    type: 'concept',
    price_per_hour: '450,000',
    counter: '06/06',
    space: '125m²',
    width: '6m',
    ceiling_height: '4.5m',
    description: 'Seasonal themed room for unique creative concepts.',
    image: '/images/rooms/concept3.jpg',
    order: 6,
  },
];

const equipmentItems = [
  { name: 'Godox Light', spec: 'QS 800 | QS 1200', image: '/images/equipment/godox-light.jpg', order: 1 },
  { name: '2x Softbox', spec: '80X120CM', image: '/images/equipment/softbox-1.jpg', order: 2 },
  { name: '2x Softbox', spec: '30X160CM', image: '/images/equipment/softbox-2.jpg', order: 3 },
  { name: '1x Parabolic', spec: '120CM', image: '/images/equipment/parabolic.jpg', order: 4 },
  { name: '1x Softbox OCTA', spec: '110CM', image: '/images/equipment/softbox-octa.jpg', order: 5 },
  { name: '1x Softbox', spec: '110CM', image: '/images/equipment/softbox-3.jpg', order: 6 },
  { name: '1x Beauty Dish', spec: '60CM', image: '/images/equipment/beauty-dish.jpg', order: 7 },
  { name: '1x Gobo', spec: 'EF-ZF3', image: '/images/equipment/gobo.jpg', order: 8 },
];

const faqItems = [
  {
    question: 'What is the minimum rental time?',
    answer: 'The minimum rental time is 2 hours for any of our studio spaces.',
    category: 'studio-rental',
    order: 1,
  },
  {
    question: 'Can I bring my own equipment?',
    answer: 'Yes, you are welcome to bring your own equipment. We also provide professional lighting and equipment for rent.',
    category: 'studio-rental',
    order: 2,
  },
  {
    question: 'Is there parking available?',
    answer: 'Yes, we have free parking available for all clients during their rental period.',
    category: 'studio-rental',
    order: 3,
  },
  {
    question: 'Can I extend my booking?',
    answer: 'Extensions are subject to availability. Please check with our team at least 30 minutes before your session ends.',
    category: 'studio-rental',
    order: 4,
  },
];

const portfolioItems = [
  { title: 'FRESSI KV', category: 'Campaign', image: '/images/creative/portfolio-fressi.jpg', size: 'large', page: 'creative', order: 1 },
  { title: 'MIRINDA', category: 'Campaign', image: '/images/creative/portfolio-mirinda.jpg', size: 'large', page: 'creative', order: 2 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-1.jpg', size: 'short', page: 'creative', order: 3 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-2.jpg', size: 'tall', page: 'creative', order: 4 },
  { title: 'YAMAHA SOCIAL LAYOUT', category: 'Campaign', image: '/images/creative/portfolio-yamaha.jpg', size: 'short', page: 'creative', order: 5 },
  // Set Design portfolio
  { title: 'FRESSI KV', category: 'Campaign', image: '/images/set-design/campaign-fressi.jpg', size: 'large', page: 'set-design', order: 1 },
  { title: 'Mirinda', category: 'Campaign', image: '/images/set-design/campaign-mirinda.jpg', size: 'large', page: 'set-design', order: 2 },
  // Decor portfolio
  { title: 'FRESSI KV', category: 'Fashion Stores', image: '/images/decoration/portfolio-fressi.jpg', size: 'large', page: 'decor', order: 1 },
  { title: 'MIRINDA', category: 'Campaign', image: '/images/decoration/portfolio-mirinda.jpg', size: 'large', page: 'decor', order: 2 },
];

const keyProjects = [
  {
    title: 'LSoul Casting call for Shanghai Fashion Week 2025',
    slug: 'lsoul-shanghai-fashion-week-2025',
    project_number: '01/03',
    client: 'LSoul',
    info_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    expertise: ['Set Design', 'Production', 'Location'],
    team: [
      { role: 'Photo', name: 'Linh Phạm' },
      { role: 'Fashion Director', name: 'Trần Đạt' },
      { role: 'Set design production', name: 'SAINT6 Production' },
    ],
    testimonial: {
      quote: 'Spacious, modular, with the energy and tools that serious creatives need.',
      author: 'Crish Phan',
      role: 'Creative Director at LSoul',
    },
    main_image: '/images/project/project-main.jpg',
    gallery_images: [
      '/images/project/project-01.jpg',
      '/images/project/project-02.jpg',
      '/images/project/project-03.jpg',
    ],
    is_featured: true,
  },
];

// ============================================================================
// Seed Functions
// ============================================================================

async function seedBrandLogos() {
  console.log('\n📦 Seeding Brand Logos...');
  const createdIds: number[] = [];

  for (const logo of brandLogos) {
    const imageId = await uploadImage(logo.logo);
    if (imageId) {
      const entry = await createEntry('brand-logos', {
        name: logo.name,
        logo: imageId,
        order: logo.order,
      });
      if (entry) createdIds.push(entry.id);
    }
  }

  return createdIds;
}

async function seedStudioRooms() {
  console.log('\n📦 Seeding Studio Rooms...');
  const createdIds: number[] = [];

  for (const room of studioRooms) {
    const imageId = await uploadImage(room.image);
    const entry = await createEntry('studio-rooms', {
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
    if (entry) createdIds.push(entry.id);
  }

  return createdIds;
}

async function seedEquipmentItems() {
  console.log('\n📦 Seeding Equipment Items...');
  const createdIds: number[] = [];

  for (const item of equipmentItems) {
    const imageId = await uploadImage(item.image);
    const entry = await createEntry('equipment-items', {
      name: item.name,
      spec: item.spec,
      image: imageId,
      order: item.order,
    });
    if (entry) createdIds.push(entry.id);
  }

  return createdIds;
}

async function seedFaqItems() {
  console.log('\n📦 Seeding FAQ Items...');
  const createdIds: number[] = [];

  for (const item of faqItems) {
    const entry = await createEntry('faq-items', {
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: item.order,
    });
    if (entry) createdIds.push(entry.id);
  }

  return createdIds;
}

async function seedPortfolioItems() {
  console.log('\n📦 Seeding Portfolio Items...');
  const createdIds: number[] = [];

  for (const item of portfolioItems) {
    const imageId = await uploadImage(item.image);
    const entry = await createEntry('portfolio-items', {
      title: item.title,
      category: item.category,
      image: imageId,
      size: item.size,
      page: item.page,
      order: item.order,
    });
    if (entry) createdIds.push(entry.id);
  }

  return createdIds;
}

async function seedKeyProjects() {
  console.log('\n📦 Seeding Key Projects...');
  const createdIds: number[] = [];

  for (const project of keyProjects) {
    const mainImageId = await uploadImage(project.main_image);

    // Upload gallery images
    const galleryImageIds: number[] = [];
    for (const img of project.gallery_images) {
      const id = await uploadImage(img);
      if (id) galleryImageIds.push(id);
    }

    const entry = await createEntry('key-projects', {
      title: project.title,
      slug: project.slug,
      project_number: project.project_number,
      client: project.client,
      info_text: project.info_text,
      expertise: project.expertise,
      team: project.team,
      testimonial: project.testimonial,
      main_image: mainImageId,
      gallery_images: galleryImageIds.map(id => ({ image: id })),
      is_featured: project.is_featured,
    });
    if (entry) createdIds.push(entry.id);
  }

  return createdIds;
}

async function seedHomepage(brandLogoIds: number[], keyProjectIds: number[]) {
  console.log('\n📄 Seeding Homepage...');

  const heroImageId = await uploadImage('/images/hero/hero-background.jpg');
  const spaceImages = await Promise.all([
    uploadImage('/images/space/space-01.png'),
    uploadImage('/images/space/space-02.png'),
    uploadImage('/images/space/space-03.png'),
    uploadImage('/images/space/space-04.png'),
  ]);
  const crewMainImageId = await uploadImage('/images/crew/crew-main.png');
  const crewImage1Id = await uploadImage('/images/crew/crew-01.png');
  const crewImage2Id = await uploadImage('/images/crew/crew-02.png');

  // Upload gallery images
  const galleryImages = await Promise.all([
    uploadImage('/images/gallery/gallery-01.jpg'),
    uploadImage('/images/gallery/gallery-02.jpg'),
    uploadImage('/images/gallery/gallery-03.jpg'),
    uploadImage('/images/gallery/gallery-04.jpg'),
  ]);

  await updateSingleType('homepage', {
    hero: {
      heading: 'Where Imagination Takes Form',
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio',
    },
    trusted_by: {
      caption: 'TRUSTED BY',
      heading: 'Leading brands and creative agencies',
    },
    brand_logos: brandLogoIds,
    gallery_images: galleryImages.filter(Boolean),
    featured_project: keyProjectIds[0],
    space_section: {
      caption: 'WIDE RANGE OF SPACE',
      description: '900m² of modular creative space, designed to support everything from fashion editorials to livestreams and events. With a range of customizable sets and zones, SAINT 6 adapts to your imagination.',
      cta_text: 'VIEW STUDIO RENTAL',
      cta_link: '/studio-rental',
      stats: [
        { label: 'Total Rooms', value: '6' },
        { label: 'Blank Rooms', value: '3' },
        { label: 'Concept Room', value: '3' },
        { label: 'Ceiling Height', value: '4.5m' },
        { label: 'Total Space', value: '900m²' },
      ],
      gallery_images: spaceImages.filter(Boolean),
    },
    crew_area: {
      caption: 'CREW AREA',
      heading: 'And a separate dining area and makeup room for the crew and customers',
      info_label: 'INFO',
      info_text: 'Indulge in a dedicated dining space and a professional makeup room—curated for comfort, privacy, and effortless preparation throughout your production.',
      main_image: crewMainImageId,
      secondary_image_1: crewImage1Id,
      secondary_image_2: crewImage2Id,
    },
  });
}

async function seedStudioRentalPage(roomIds: number[], equipmentIds: number[], faqIds: number[]) {
  console.log('\n📄 Seeding Studio Rental Page...');

  const heroImageId = await uploadImage('/images/studio-rental/hero-background.jpg');
  const fullRentalBgId = await uploadImage('/images/full-studio-bg.jpg');
  const makeupImageId = await uploadImage('/images/facilities/makeup-room.jpg');
  const loungeImageId = await uploadImage('/images/facilities/dining-lounge.jpg');

  await updateSingleType('studio-rental-page', {
    hero: {
      heading: 'Studio Spaces Designed for Creation',
      background_image: heroImageId,
      background_alt: 'Studio Rental',
    },
    intro: {
      label: 'HOW IT WORKS',
      description: 'Book your ideal space, bring your vision, and let SAINT 6 handle the rest. From blank canvases to concept rooms, every corner is designed to inspire.',
      cta_text: 'Book Now',
      cta_link: '#contact-form',
    },
    stats: {
      total_rooms: 6,
      ceiling_height: '4.5m',
      total_space: '900m²',
      blank_rooms: 3,
      concept_rooms: 3,
    },
    rooms: roomIds,
    full_rental: {
      price: '2,500,000',
      background_image: fullRentalBgId,
    },
    facilities: {
      makeup_image: makeupImageId,
      lounge_image: loungeImageId,
    },
    equipment: equipmentIds,
    faq_items: faqIds,
  });
}

async function seedAboutPage() {
  console.log('\n📄 Seeding About Page...');

  const heroImageId = await uploadImage('/images/about-us/hero-background.jpg');
  const introImageId = await uploadImage('/images/about-us/intro-portrait.jpg');
  const fullWidthImageId = await uploadImage('/images/about-us/full-width-image.jpg');
  const founderImageId = await uploadImage('/images/about-us/founder-portrait.jpg');

  // Upload timeline images
  const timelineImages = await Promise.all([
    uploadImage('/images/about-us/timeline-2021.jpg'),
    uploadImage('/images/about-us/timeline-2022.jpg'),
    uploadImage('/images/about-us/timeline-2023.jpg'),
    uploadImage('/images/about-us/timeline-2024.jpg'),
    uploadImage('/images/about-us/timeline-2025.jpg'),
    uploadImage('/images/about-us/timeline-2026.jpg'),
  ]);

  await updateSingleType('about-page', {
    hero: {
      heading: 'We Imagine. We Design. We Create.',
      background_image: heroImageId,
      background_alt: 'About Saint 6 Studio',
    },
    intro: {
      label: 'ABOUT US',
      headline: 'We are a studio of artists, builders, stylists, dreamers, problem solvers, and storytellers.\nWe turn ideas into places, feelings, and memories.',
      body_paragraph_1: 'Saint 6 Studios, founded by Trang Nhe Nhang, is a multi-disciplinary creative studio crafting sets, spaces, environments, and experiences.',
      body_paragraph_2: 'We create work that feels alive, work that holds emotion, atmosphere, and story. For us, it\'s never "just decor." It\'s the feeling someone carries home.',
      image: introImageId,
    },
    vision: {
      label: 'VISION',
      statement: 'To create work that is remembered through the feelings it evokes.',
    },
    full_width_image: fullWidthImageId,
    mission: {
      label: 'MISSION',
      statement: 'We transform ideas, identities, and stories into visual experiences that move people.',
    },
    values: [
      { letter: 'S', title: 'Simplicity', description: 'Clarity reveals emotion.' },
      { letter: 'A', title: 'Authenticity', description: 'Emotion must be real, not manufactured.' },
      { letter: 'I', title: 'Intention', description: 'Every choice serves the feeling.' },
      { letter: 'N', title: 'Narrative', description: 'Everything is part of the story.' },
      { letter: 'T', title: 'Trust', description: 'Art needs reliability to thrive.' },
      { letter: '6', title: 'Sixth Sense', description: 'We design for the feeling beneath the brief.' },
    ],
    our_story: {
      label: 'Our Story',
      paragraph_1: 'Before Saint 6, there was Haus of Trang - where Trang learned that styling is not only about how things look, but how they make people feel.',
      paragraph_2: 'That realization became the foundation of Saint 6',
    },
    timeline: [
      { year: '2021', image: timelineImages[0], description: 'Saint 6 was founded with the belief that beauty is emotional, not ornamental.' },
      { year: '2022', image: timelineImages[1], description: 'The first Saint 6 studio space was built — a home for creation, experimentation, and community.' },
      { year: '2023', image: timelineImages[2], description: 'We expanded into store décor and spatial brand environments, shaping how customers feel inside a space.' },
      { year: '2024', image: timelineImages[3], description: 'We began designing events and weddings, translating personal stories into atmospheres.' },
      { year: '2025', image: timelineImages[4], description: 'We surpassed 1,000 set designs created since our founding — from intimate shoots to major brand activations.' },
      { year: '2026 (Next)', image: timelineImages[5], description: 'We are opening a second Saint 6 location, expanding our creative capacity and community.' },
    ],
    founder: {
      image: founderImageId,
      quote: 'Creation is emotional work. We build spaces for people to feel something real.',
      name: 'Trang',
      title: 'Founder & Creative Director',
    },
  });
}

async function seedContactPage() {
  console.log('\n📄 Seeding Contact Page...');

  const heroImageId = await uploadImage('/images/contact/hero-background.jpg');
  const mapImageId = await uploadImage('/images/contact/saint6-map.jpg');

  await updateSingleType('contact-page', {
    hero: {
      heading: "Let's Create Something Exceptional Together",
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio exterior',
    },
    info: {
      title: 'Contact Us',
      subheading: "Let's Create Something Exceptional Together",
      address_line_1: '6 Be Van Cam, Tan Kieng',
      address_line_2: 'District 7, HCMC',
      email: 'Saint6studios@gmail.com',
      phone: '0919 403 784 - 0918 756 573',
    },
    map_image: mapImageId,
  });
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🚀 Starting Strapi CMS Seed...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);

  try {
    // Seed collections first
    const brandLogoIds = await seedBrandLogos();
    const studioRoomIds = await seedStudioRooms();
    const equipmentIds = await seedEquipmentItems();
    const faqIds = await seedFaqItems();
    const portfolioIds = await seedPortfolioItems();
    const keyProjectIds = await seedKeyProjects();

    // Seed pages
    await seedHomepage(brandLogoIds, keyProjectIds);
    await seedStudioRentalPage(studioRoomIds, equipmentIds, faqIds);
    await seedAboutPage();
    await seedContactPage();

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Brand Logos: ${brandLogoIds.length}`);
    console.log(`   - Studio Rooms: ${studioRoomIds.length}`);
    console.log(`   - Equipment Items: ${equipmentIds.length}`);
    console.log(`   - FAQ Items: ${faqIds.length}`);
    console.log(`   - Portfolio Items: ${portfolioIds.length}`);
    console.log(`   - Key Projects: ${keyProjectIds.length}`);
    console.log(`   - Images uploaded: ${Object.keys(imageCache).length}`);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
