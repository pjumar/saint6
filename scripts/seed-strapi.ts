/**
 * Strapi CMS Seed Script
 *
 * This script uploads images and populates the Strapi CMS with mock data
 * from the current React components.
 *
 * Usage: npx tsx scripts/seed-strapi.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
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
  if (imageCache[imagePath]) {
    return imageCache[imagePath];
  }

  const fullPath = path.join(process.cwd(), 'public', imagePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${imagePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const fileName = path.basename(imagePath);
  const mimeType = getMimeType(fullPath);

  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: mimeType }) as unknown as globalThis.Blob;
  formData.append('files', blob, fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` },
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

async function createEntry(contentType: string, data: Record<string, unknown>) {
  try {
    const result = await apiRequest(contentType, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
    console.log(`✅ Created ${contentType}: ${data.title || data.name || 'entry'}`);
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to create ${contentType}:`, error);
    return null;
  }
}

async function updateSingleType(contentType: string, data: Record<string, unknown>, locale: string = 'en') {
  try {
    const url = locale === 'en' ? contentType : `${contentType}?locale=${locale}`;
    const result = await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
    console.log(`✅ Updated ${contentType} (${locale})`);
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to update ${contentType} (${locale}):`, error);
    return null;
  }
}

async function createLocalization(contentType: string, documentId: string, locale: string, data: Record<string, unknown>) {
  try {
    const result = await apiRequest(`${contentType}/${documentId}/localizations`, {
      method: 'POST',
      body: JSON.stringify({ locale, data }),
    });
    console.log(`✅ Created ${locale} localization for ${contentType}`);
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to create ${locale} localization for ${contentType}:`, error);
    return null;
  }
}

// ============================================================================
// Seed Data
// ============================================================================

const brandLogos = [
  { name: 'Lenskart', logo: '/images/brands/brand-01.png', order: 1 },
  { name: "L'Officiel", logo: '/images/brands/brand-02.png', order: 2 },
  { name: 'Vinamilk', logo: '/images/brands/brand-03.png', order: 3 },
  { name: 'Sony', logo: '/images/brands/brand-04.png', order: 4 },
  { name: 'VinFast', logo: '/images/brands/brand-05.png', order: 5 },
  { name: 'Miss Cosmo', logo: '/images/brands/brand-06.png', order: 6 },
  { name: "Harper's Bazaar", logo: '/images/brands/brand-07.png', order: 7 },
  { name: 'Highlands Coffee', logo: '/images/brands/brand-08.png', order: 8 },
  { name: 'Maybelline New York', logo: '/images/brands/brand-09.png', order: 9 },
];

const studioRooms = [
  { title: 'The Loft', slug: 'the-loft', type: 'blank', price_per_hour: '450,000', counter: '01/06', space: '125m²', width: '6m', ceiling_height: '4.5m', description: 'Perfect for editorial shoots, interviews, and minimalist campaigns.', image: '/images/rooms/loft.jpg', order: 1 },
  { title: 'The Studio', slug: 'the-studio', type: 'blank', price_per_hour: '800,000', counter: '02/06', space: '125m²', width: '6m', ceiling_height: '4.5m', description: 'Perfect for editorial shoots, interviews, and minimalist campaigns.', image: '/images/rooms/studio.jpg', order: 2 },
  { title: 'The Arena', slug: 'the-arena', type: 'blank', price_per_hour: '850,000', counter: '03/06', space: '125m²', width: '6m', ceiling_height: '4.5m', description: 'Perfect for editorial shoots, interviews, and minimalist campaigns.', image: '/images/rooms/arena.jpg', order: 3 },
  { title: 'Concept Room 1', slug: 'concept-room-1', type: 'concept', price_per_hour: '450,000', counter: '04/06', space: '125m²', width: '6m', ceiling_height: '4.5m', description: 'Seasonal themed room for unique creative concepts.', image: '/images/rooms/concept1.jpg', order: 4 },
  { title: 'Concept Room 2', slug: 'concept-room-2', type: 'concept', price_per_hour: '450,000', counter: '05/06', space: '125m²', width: '6m', ceiling_height: '4.5m', description: 'Seasonal themed room for unique creative concepts.', image: '/images/rooms/concept2.jpg', order: 5 },
  { title: 'Concept Room 3', slug: 'concept-room-3', type: 'concept', price_per_hour: '450,000', counter: '06/06', space: '125m²', width: '6m', ceiling_height: '4.5m', description: 'Seasonal themed room for unique creative concepts.', image: '/images/rooms/concept3.jpg', order: 6 },
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
  { question: 'What is the minimum rental time?', answer: 'The minimum rental time is 2 hours for any of our studio spaces.', category: 'studio-rental', order: 1 },
  { question: 'Can I bring my own equipment?', answer: 'Yes, you are welcome to bring your own equipment. We also provide professional lighting and equipment for rent.', category: 'studio-rental', order: 2 },
  { question: 'Is there parking available?', answer: 'Yes, we have free parking available for all clients during their rental period.', category: 'studio-rental', order: 3 },
  { question: 'Can I extend my booking?', answer: 'Extensions are subject to availability. Please check with our team at least 30 minutes before your session ends.', category: 'studio-rental', order: 4 },
];

const portfolioItems = [
  // Creative page (8 items)
  { title: 'FRESSI KV', category: 'Campaign', image: '/images/creative/portfolio-fressi.jpg', size: 'large', page: 'creative', order: 1 },
  { title: 'MIRINDA', category: 'Campaign', image: '/images/creative/portfolio-mirinda.jpg', size: 'large', page: 'creative', order: 2 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-1.jpg', size: 'short', page: 'creative', order: 3 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-2.jpg', size: 'tall', page: 'creative', order: 4 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-3.jpg', size: 'tall', page: 'creative', order: 5 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-4.jpg', size: 'tall', page: 'creative', order: 6 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-5.jpg', size: 'short', page: 'creative', order: 7 },
  { title: 'YAMAHA SOCIAL LAYOUT', category: 'Campaign', image: '/images/creative/portfolio-yamaha.jpg', size: 'short', page: 'creative', order: 8 },
  // Set Design page (8 items)
  { title: 'FRESSI KV', category: 'Campaign', image: '/images/set-design/campaign-fressi.jpg', size: 'large', page: 'set-design', order: 1 },
  { title: 'Mirinda', category: 'Campaign', image: '/images/set-design/campaign-mirinda.jpg', size: 'large', page: 'set-design', order: 2 },
  { title: 'MV Diễn Viên Tồi - Đen Vâu', category: 'Campaign', image: '/images/set-design/portfolio-den-vau-1.jpg', size: 'short', page: 'set-design', order: 3 },
  { title: 'MV Diễn Viên Tồi - Đen Vâu', category: 'Campaign', image: '/images/set-design/portfolio-den-vau-2.jpg', size: 'tall', page: 'set-design', order: 4 },
  { title: 'MV Diễn Viên Tồi - Đen Vâu', category: 'Campaign', image: '/images/set-design/portfolio-den-vau-3.jpg', size: 'tall', page: 'set-design', order: 5 },
  { title: 'MV Diễn Viên Tồi - Đen Vâu', category: 'Campaign', image: '/images/set-design/portfolio-den-vau-4.jpg', size: 'tall', page: 'set-design', order: 6 },
  { title: 'MV Diễn Viên Tồi - Đen Vâu', category: 'Campaign', image: '/images/set-design/portfolio-den-vau-5.jpg', size: 'short', page: 'set-design', order: 7 },
  { title: 'YAMAHA SOCIAL LAYOUT', category: 'Campaign', image: '/images/set-design/portfolio-yamaha.jpg', size: 'short', page: 'set-design', order: 8 },
  // Decor page (8 items)
  { title: 'FRESSI KV', category: 'Fashion Stores', image: '/images/decoration/portfolio-fressi.jpg', size: 'large', page: 'decor', order: 1 },
  { title: 'MIRINDA', category: 'Campaign', image: '/images/decoration/portfolio-mirinda.jpg', size: 'large', page: 'decor', order: 2 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/decoration/portfolio-denvau-1.jpg', size: 'short', page: 'decor', order: 3 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/decoration/portfolio-denvau-2.jpg', size: 'tall', page: 'decor', order: 4 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/decoration/portfolio-denvau-3.jpg', size: 'tall', page: 'decor', order: 5 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/decoration/portfolio-denvau-4.jpg', size: 'tall', page: 'decor', order: 6 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/decoration/portfolio-denvau-5.jpg', size: 'short', page: 'decor', order: 7 },
  { title: 'YAMAHA SOCIAL LAYOUT', category: 'Campaign', image: '/images/decoration/portfolio-yamaha.jpg', size: 'short', page: 'decor', order: 8 },
];

const testimonialItems = [
  {
    brand_name: "L'OFFICIEL",
    brand_logo: '/images/brands/brand-01.png',
    quote_en: "It's rare to find a studio where creative direction, production, and hospitality all come together. Saint 6 delivered on every front. Our client was blown away.",
    quote_vi: 'Hiếm có studio nào mà chỉ đạo sáng tạo, sản xuất và dịch vụ đều hoàn hảo. Saint 6 đã làm được tất cả. Khách hàng của chúng tôi vô cùng ấn tượng.',
    author_name: 'Aaron Tan',
    author_title_en: 'Creative Director, Elle Vietnam',
    author_title_vi: 'Giám đốc Sáng tạo, Elle Vietnam',
    order: 1,
  },
  {
    brand_name: 'Fressi',
    brand_logo: '/images/brands/brand-02.png',
    quote_en: "Saint 6's attention to detail and creative vision transformed our campaign into something truly memorable. The team understood our brand from day one.",
    quote_vi: 'Sự chú ý đến chi tiết và tầm nhìn sáng tạo của Saint 6 đã biến chiến dịch của chúng tôi thành điều thực sự đáng nhớ. Đội ngũ hiểu thương hiệu của chúng tôi ngay từ ngày đầu.',
    author_name: 'Nguyen Thi Mai',
    author_title_en: 'Marketing Director, Fressi Vietnam',
    author_title_vi: 'Giám đốc Marketing, Fressi Vietnam',
    order: 2,
  },
  {
    brand_name: 'Vinamilk',
    brand_logo: '/images/brands/brand-03.png',
    quote_en: 'Working with Saint 6 was seamless. Their production quality and creative approach exceeded our expectations for the product launch.',
    quote_vi: 'Làm việc với Saint 6 rất suôn sẻ. Chất lượng sản xuất và cách tiếp cận sáng tạo của họ vượt quá mong đợi của chúng tôi cho buổi ra mắt sản phẩm.',
    author_name: 'Tran Van Duc',
    author_title_en: 'Brand Manager, Vinamilk',
    author_title_vi: 'Quản lý Thương hiệu, Vinamilk',
    order: 3,
  },
  {
    brand_name: 'Sony',
    brand_logo: '/images/brands/brand-04.png',
    quote_en: "The team's expertise in both creative direction and technical execution made our collaboration incredibly smooth and successful.",
    quote_vi: 'Chuyên môn của đội ngũ trong cả chỉ đạo sáng tạo và thực hiện kỹ thuật đã giúp sự hợp tác của chúng tôi diễn ra suôn sẻ và thành công.',
    author_name: 'Le Hoang Nam',
    author_title_en: 'Creative Lead, Sony Vietnam',
    author_title_vi: 'Trưởng nhóm Sáng tạo, Sony Vietnam',
    order: 4,
  },
];

// Service Items for all pages (services & workflow sections)
const serviceItems = [
  // Creative page - services
  { title: 'Brand & Advertising Campaigns', description: 'We produce fashion, lifestyle, editorial, social media, and influencer campaigns that bring brands to life with fresh creative energy.', page: 'creative', section: 'services', order: 1 },
  { title: 'Product & Packaging Shoots', description: 'From product labels and e-commerce images to packshots and still life, we create polished visuals that elevate packaging, catalogs, and online stores.', page: 'creative', section: 'services', order: 2 },
  // Creative page - workflow
  { title: 'Creative Direction', description: 'We study your brief and develop creative directions based on your brand, audience, and goals.', counter: '01.', page: 'creative', section: 'workflow', order: 1 },
  { title: 'Storyboard Development', description: 'Our team creates detailed storyboards and shot lists to visualize the final output.', counter: '02.', page: 'creative', section: 'workflow', order: 2 },
  { title: 'Pre-production & Sourcing', description: 'We coordinate talent, locations, props, and equipment to ensure smooth execution.', counter: '03.', page: 'creative', section: 'workflow', order: 3 },
  { title: 'Shoot / Production', description: 'Our experienced crew captures your vision with precision and creative flair.', counter: '04.', page: 'creative', section: 'workflow', order: 4 },
  { title: 'Post-production', description: 'Professional editing, color grading, and retouching bring the final deliverables to life.', counter: '05.', page: 'creative', section: 'workflow', order: 5 },
  { title: 'Final Delivery', description: 'We deliver polished assets ready for print, digital, and social media deployment.', counter: '06.', page: 'creative', section: 'workflow', order: 6 },

  // Production page - services
  { title: 'Campaign & Editorial Production', description: 'We curate bespoke campaigns and editorials that blend artistry, narrative, and timeless sophistication — bringing each brand story to life with cinematic allure.', page: 'production', section: 'services', order: 1 },
  { title: 'Photography & Film Production', description: 'From concept to final cut, we deliver high-impact visuals through expert direction, seamless coordination, and creative storytelling.', page: 'production', section: 'services', order: 2 },
  { title: 'Lighting & Equipment Rental', description: 'Premium lighting and state-of-the-art equipment designed to elevate every production with precision, balance, and creative control.', page: 'production', section: 'services', order: 3 },
  { title: 'Make-up & Hair Stylist', description: 'Professional beauty services that transform talent and enhance visual storytelling with meticulous attention to detail.', page: 'production', section: 'services', order: 4 },
  { title: 'Location Scouting & Permits', description: 'We source the perfect locations and handle all permit logistics, ensuring smooth operations from pre-production to wrap.', page: 'production', section: 'services', order: 5 },
  { title: 'Post-production Coordination', description: 'End-to-end post-production management, from editing and color grading to final delivery across all formats.', page: 'production', section: 'services', order: 6 },
  // Production page - workflow
  { title: 'Pre-Production', description: 'Concept, scheduling, and creative', counter: '01.', page: 'production', section: 'workflow', order: 1 },
  { title: 'Set-Up', description: 'Lighting, camera, art direction', counter: '02.', page: 'production', section: 'workflow', order: 2 },
  { title: 'Shoot Day', description: 'Execution and real-time adjustments', counter: '03.', page: 'production', section: 'workflow', order: 3 },
  { title: 'Wrap & Delivery', description: 'Editing, review, and delivery', counter: '04.', page: 'production', section: 'workflow', order: 4 },

  // Set Design page - workflow
  { title: 'Brief & Concept Alignment', description: 'We start by understanding your creative direction, brand language, and spatial needs.', counter: '01.', page: 'set-design', section: 'workflow', order: 1 },
  { title: '2D Layout & 3D Render', description: 'We create technical layouts and 3D visuals that bring the proposed set design to life — before anything is built.', counter: '02.', page: 'set-design', section: 'workflow', order: 2 },
  { title: 'Presentation & Feedback Loop', description: "We present the design and collaborate closely with your team to refine it until it's approved.", counter: '03.', page: 'set-design', section: 'workflow', order: 3 },
  { title: 'Set Construction & Sourcing', description: 'We build the set and source all backdrops, structural elements, props, and textures to match the approved concept.', counter: '04.', page: 'set-design', section: 'workflow', order: 4 },
  { title: 'Setup & Shoot Support', description: 'We handle set assembly, stay present during the shoot to make real-time adjustments, and ensure everything works on camera.', counter: '05.', page: 'set-design', section: 'workflow', order: 5 },
  { title: 'Set Maintenance & Tear-Down', description: 'Once the shoot wraps, we handle cleanup and dismantle the set efficiently and professionally.', counter: '06.', page: 'set-design', section: 'workflow', order: 6 },

  // Event Planning page - services
  { title: 'Product & Brand Launches', description: 'We craft launch experiences that captivate audiences and elevate your brand story with precision and flair.', page: 'event-planning', section: 'services', order: 1 },
  { title: 'Fashion Shows', description: 'From runway to backstage, we design and execute fashion events that celebrate artistry and style.', page: 'event-planning', section: 'services', order: 2 },
  { title: 'Private Dinners', description: 'Intimate gatherings curated with exquisite detail, creating memorable moments for your guests.', page: 'event-planning', section: 'services', order: 3 },
  { title: 'Art & Lifestyle Pop-Ups', description: 'Immersive pop-up experiences that blend art, culture, and lifestyle into unforgettable activations.', page: 'event-planning', section: 'services', order: 4 },
  { title: 'Press & Influencer Events', description: 'Strategic media events designed to generate buzz and build lasting connections with key voices.', page: 'event-planning', section: 'services', order: 5 },
  { title: 'Corporate Celebrations', description: "Professional yet refined corporate events that reflect your company's values and vision.", page: 'event-planning', section: 'services', order: 6 },
  // Event Planning page - workflow
  { title: 'Full Creative & Design Direction', description: "From concept to creation, Saint 6 shapes a cohesive visual story that embodies your brand's vision.", counter: '01.', page: 'event-planning', section: 'workflow', order: 1 },
  { title: 'Guest Experience & Flow Planning', description: 'Every moment is designed with intention — seamless, elegant, and unforgettable.', counter: '02.', page: 'event-planning', section: 'workflow', order: 2 },
  { title: 'On-site Management & Run-of-Show Execution', description: 'Flawless coordination ensures your event unfolds with effortless precision.', counter: '03.', page: 'event-planning', section: 'workflow', order: 3 },
  { title: 'Venue Styling & Set Design', description: 'We craft immersive environments that capture emotion, detail, and distinctive character.', counter: '04.', page: 'event-planning', section: 'workflow', order: 4 },
  { title: 'Catering & Entertainment Coordination', description: 'We curate dining and performances that enrich the mood and elevate the experience.', counter: '05.', page: 'event-planning', section: 'workflow', order: 5 },

  // Decor page - workflow
  { title: 'Brief Overview', description: 'We study the brief and develop multiple creative directions based on your brand, audience, and goals.', counter: '01.', page: 'decor', section: 'workflow', order: 1 },
  { title: '2D Ideation', description: 'Our design team creates detailed mood boards and conceptual layouts to visualize the space transformation.', counter: '02.', page: 'decor', section: 'workflow', order: 2 },
  { title: '3D Render', description: 'We produce photorealistic 3D renders so you can experience the space before construction begins.', counter: '03.', page: 'decor', section: 'workflow', order: 3 },
  { title: 'Pre-Production', description: 'We coordinate materials, vendors, and timelines to ensure smooth execution of your project.', counter: '04.', page: 'decor', section: 'workflow', order: 4 },
  { title: 'Final Installation', description: 'Our team manages the complete installation, bringing every detail to life with precision.', counter: '05.', page: 'decor', section: 'workflow', order: 5 },
];

const keyProjects = [
  {
    title: 'LSoul Casting call for Shanghai Fashion Week 2025',
    slug: 'lsoul-shanghai-fashion-week-2025',
    project_number: '01/03',
    client: 'LSoul',
    info_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
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
      { image: '/images/project/project-01.jpg', alt: 'Project gallery 1' },
      { image: '/images/project/project-02.jpg', alt: 'Project gallery 2' },
      { image: '/images/project/project-03.jpg', alt: 'Project gallery 3' },
    ],
    is_featured: true,
  },
];

const galleryImages = Array.from({ length: 15 }, (_, i) => ({
  image: `/images/gallery/gallery-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `Gallery image ${i + 1}`,
}));

// Vietnamese translations are now inline in each seed function

// ============================================================================
// Seed Functions - Collections
// ============================================================================

async function seedBrandLogos() {
  console.log('\n📦 Seeding Brand Logos...');
  const createdIds: number[] = [];
  for (const logo of brandLogos) {
    const imageId = await uploadImage(logo.logo);
    if (imageId) {
      const entry = await createEntry('brand-logos', { name: logo.name, logo: imageId, order: logo.order });
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
    const entry = await createEntry('studio-rooms', { ...room, image: imageId });
    if (entry) createdIds.push(entry.id);
  }
  return createdIds;
}

async function seedEquipmentItems() {
  console.log('\n📦 Seeding Equipment Items...');
  const createdIds: number[] = [];
  for (const item of equipmentItems) {
    const imageId = await uploadImage(item.image);
    const entry = await createEntry('equipment-items', { ...item, image: imageId });
    if (entry) createdIds.push(entry.id);
  }
  return createdIds;
}

async function seedFaqItems() {
  console.log('\n📦 Seeding FAQ Items...');
  const createdIds: number[] = [];
  for (const item of faqItems) {
    const entry = await createEntry('faq-items', item);
    if (entry) createdIds.push(entry.id);
  }
  return createdIds;
}

async function seedPortfolioItems() {
  console.log('\n📦 Seeding Portfolio Items...');
  const createdIds: number[] = [];
  for (const item of portfolioItems) {
    const imageId = await uploadImage(item.image);
    const entry = await createEntry('portfolio-items', { ...item, image: imageId });
    if (entry) createdIds.push(entry.id);
  }
  return createdIds;
}

async function seedKeyProjects() {
  console.log('\n📦 Seeding Key Projects...');
  const createdIds: number[] = [];
  for (const project of keyProjects) {
    const mainImageId = await uploadImage(project.main_image);
    const galleryImageComponents = [];
    for (const img of project.gallery_images) {
      const id = await uploadImage(img.image);
      if (id) galleryImageComponents.push({ image: id, alt: img.alt });
    }
    const entry = await createEntry('key-projects', {
      ...project,
      main_image: mainImageId,
      gallery_images: galleryImageComponents,
    });
    if (entry) createdIds.push(entry.id);
  }
  return createdIds;
}

async function seedTestimonialItems() {
  console.log('\n📦 Seeding Testimonial Items...');
  const createdIds: number[] = [];
  for (const item of testimonialItems) {
    const logoId = await uploadImage(item.brand_logo);
    // Create English version
    const entry = await createEntry('testimonial-items', {
      brand_name: item.brand_name,
      brand_logo: logoId,
      quote: item.quote_en,
      author_name: item.author_name,
      author_title: item.author_title_en,
      order: item.order,
    });
    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization('testimonial-items', entry.documentId, 'vi', {
        quote: item.quote_vi,
        author_title: item.author_title_vi,
      });
    }
  }
  return createdIds;
}

async function seedServiceItems() {
  console.log('\n📦 Seeding Service Items...');
  const createdEntries: { id: number; page: string; section: string }[] = [];
  for (const item of serviceItems) {
    const entry = await createEntry('service-items', {
      title: item.title,
      description: item.description,
      counter: item.counter,
      page: item.page,
      section: item.section,
      order: item.order,
    });
    if (entry) {
      createdEntries.push({ id: entry.id, page: item.page, section: item.section });
    }
  }
  return createdEntries;
}

// Helper to get service item IDs by page and section
function getServiceIds(
  serviceEntries: { id: number; page: string; section: string }[],
  page: string,
  section: string
): number[] {
  return serviceEntries
    .filter(e => e.page === page && e.section === section)
    .map(e => e.id);
}

// ============================================================================
// Seed Functions - Pages
// ============================================================================

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

  const galleryImageComponents = [];
  for (const img of galleryImages) {
    const imageId = await uploadImage(img.image);
    if (imageId) galleryImageComponents.push({ image: imageId, alt: img.alt });
  }

  // English
  await updateSingleType('homepage', {
    hero: {
      heading: 'The place where all your concepts and artistic ideas can come true',
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio',
    },
    brand_logos: brandLogoIds,
    gallery_images: galleryImageComponents,
    key_projects: keyProjectIds,
    space_section: {
      caption: 'WIDE RANGE OF SPACE',
      description: '900m² of modular creative space, designed to support everything from fashion editorials to livestreams and events.',
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
      info_text: 'Indulge in a dedicated dining space and a professional makeup room—curated for comfort, privacy, and effortless preparation.',
      main_image: crewMainImageId,
      secondary_image_1: crewImage1Id,
      secondary_image_2: crewImage2Id,
    },
  });

  // Vietnamese
  await updateSingleType('homepage', {
    hero: {
      heading: 'Nơi mọi ý tưởng và khái niệm nghệ thuật của bạn có thể trở thành hiện thực',
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio',
    },
    brand_logos: brandLogoIds,
    gallery_images: galleryImageComponents,
    key_projects: keyProjectIds,
    space_section: {
      caption: 'KHÔNG GIAN ĐA DẠNG',
      description: '900m² không gian sáng tạo linh hoạt, được thiết kế để hỗ trợ mọi thứ từ chụp ảnh thời trang đến livestream và sự kiện.',
      cta_text: 'XEM THUÊ STUDIO',
      cta_link: '/studio-rental',
      stats: [
        { label: 'Tổng số phòng', value: '6' },
        { label: 'Phòng trống', value: '3' },
        { label: 'Phòng Concept', value: '3' },
        { label: 'Chiều cao trần', value: '4.5m' },
        { label: 'Tổng diện tích', value: '900m²' },
      ],
      gallery_images: spaceImages.filter(Boolean),
    },
    crew_area: {
      caption: 'KHU VỰC EKIP',
      heading: 'Và khu vực ăn uống riêng biệt cùng phòng trang điểm cho ekip và khách hàng',
      info_label: 'THÔNG TIN',
      info_text: 'Tận hưởng không gian ăn uống riêng biệt và phòng trang điểm chuyên nghiệp—được thiết kế cho sự thoải mái, riêng tư và chuẩn bị dễ dàng.',
      main_image: crewMainImageId,
      secondary_image_1: crewImage1Id,
      secondary_image_2: crewImage2Id,
    },
  }, 'vi');
}

async function seedStudioRentalPage(roomIds: number[], equipmentIds: number[], faqIds: number[]) {
  console.log('\n📄 Seeding Studio Rental Page...');

  const heroImageId = await uploadImage('/images/studio-rental/hero-background.jpg');
  const fullRentalBgId = await uploadImage('/images/full-studio-bg.jpg');
  const makeupImageId = await uploadImage('/images/facilities/makeup-room.jpg');
  const loungeImageId = await uploadImage('/images/facilities/dining-lounge.jpg');

  // Separate blank rooms and concept rooms
  const blankRoomIds = roomIds.slice(0, 3);
  const conceptRoomIds = roomIds.slice(3);

  // English
  await updateSingleType('studio-rental-page', {
    hero: {
      heading: 'Your creative playground',
      background_image: heroImageId,
      background_alt: 'Studio Rental',
    },
    intro: {
      title: 'How It Works',
      description: 'Because your vision deserves more than a space— It needs a stage, a story, and a studio that moves with you.',
      cta_text: 'Get in touch',
      cta_link: '#contact-form',
    },
    stats: {
      total_rooms: 6,
      ceiling_height: '4.5m',
      total_space: '900m²',
      blank_rooms: 3,
      concept_rooms: 3,
    },
    rooms: blankRoomIds,
    concept_rooms: conceptRoomIds,
    full_rental: {
      price: '2,500,000',
      background_image: fullRentalBgId,
    },
    facilities: {
      makeup_image: makeupImageId,
      lounge_image: loungeImageId,
    },
    equipment: equipmentIds,
    faqs: faqIds,
  });

  // Vietnamese
  await updateSingleType('studio-rental-page', {
    hero: {
      heading: 'Sân chơi sáng tạo của bạn',
      background_image: heroImageId,
      background_alt: 'Studio Rental',
    },
    intro: {
      title: 'Cách thức hoạt động',
      description: 'Vì tầm nhìn của bạn xứng đáng hơn một không gian— Nó cần một sân khấu, một câu chuyện, và một studio đồng hành cùng bạn.',
      cta_text: 'Liên hệ ngay',
      cta_link: '#contact-form',
    },
    stats: {
      total_rooms: 6,
      ceiling_height: '4.5m',
      total_space: '900m²',
      blank_rooms: 3,
      concept_rooms: 3,
    },
    rooms: blankRoomIds,
    concept_rooms: conceptRoomIds,
    full_rental: {
      price: '2,500,000',
      background_image: fullRentalBgId,
    },
    facilities: {
      makeup_image: makeupImageId,
      lounge_image: loungeImageId,
    },
    equipment: equipmentIds,
    faqs: faqIds,
  }, 'vi');
}

async function seedCreativePage(
  portfolioIds: number[],
  brandLogoIds: number[],
  testimonialIds: number[],
  serviceEntries: { id: number; page: string; section: string }[]
) {
  console.log('\n📄 Seeding Creative Page...');

  const heroImageId = await uploadImage('/images/creative/hero-background.jpg');

  // Filter portfolio items for creative page
  const creativePortfolioIds = portfolioIds.slice(0, 8); // First 8 are creative

  // Get service item IDs for this page
  const servicesIds = getServiceIds(serviceEntries, 'creative', 'services');
  const workflowIds = getServiceIds(serviceEntries, 'creative', 'workflow');

  // English
  await updateSingleType('creative-page', {
    hero: {
      heading: 'Creative production for brands, campaigns & products',
      background_image: heroImageId,
      background_alt: 'Creative',
    },
    clients: {
      label: 'Selected Clients',
      description: "We're proud to collaborate with leading brands, agencies, and startups worldwide.",
    },
    client_logos: brandLogoIds,
    services: servicesIds,
    intro: {
      title: 'How We Work',
      description: 'We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery.',
      cta_text: 'Get in touch',
      cta_link: '#contact-form',
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: 'Featured Work',
      statement: "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail.",
    },
    portfolio_items: creativePortfolioIds,
    testimonials: testimonialIds,
  });

  // Vietnamese
  await updateSingleType('creative-page', {
    hero: {
      heading: 'Sản xuất sáng tạo cho thương hiệu, chiến dịch & sản phẩm',
      background_image: heroImageId,
      background_alt: 'Creative',
    },
    clients: {
      label: 'Khách Hàng Tiêu Biểu',
      description: 'Chúng tôi tự hào hợp tác với các thương hiệu, agency và startup hàng đầu trên toàn thế giới.',
    },
    client_logos: brandLogoIds,
    services: servicesIds,
    intro: {
      title: 'Cách Chúng Tôi Làm Việc',
      description: 'Chúng tôi có thể đảm nhận sản xuất toàn diện hoặc tham gia ở bất kỳ giai đoạn nào — từ phát triển moodboard và concept đến hậu kỳ và giao sản phẩm cuối cùng.',
      cta_text: 'Liên hệ ngay',
      cta_link: '#contact-form',
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: 'Tác Phẩm Nổi Bật',
      statement: 'Hình ảnh cao cấp phản ánh tham vọng thương hiệu của bạn — một triển lãm của nghệ thuật và sự chú ý đến chi tiết.',
    },
    portfolio_items: creativePortfolioIds,
    testimonials: testimonialIds,
  }, 'vi');
}

async function seedProductionPage(
  keyProjectIds: number[],
  serviceEntries: { id: number; page: string; section: string }[]
) {
  console.log('\n📄 Seeding Production Page...');

  const heroImageId = await uploadImage('/images/production/hero-background.jpg');

  // Get service item IDs for this page
  const servicesIds = getServiceIds(serviceEntries, 'production', 'services');
  const workflowIds = getServiceIds(serviceEntries, 'production', 'workflow');

  // English
  await updateSingleType('production-page', {
    hero: {
      heading: 'Full-Scale Production, Seamless Execution.',
      background_image: heroImageId,
      background_alt: 'Production',
    },
    intro: {
      title: 'Our Service',
      description: 'From concept to final delivery, we bring your campaign to life through precision planning, creative direction, and technical mastery.',
      cta_text: 'Plan Your Production',
      cta_link: '#contact-form',
    },
    services: servicesIds,
    intro_2: {
      title: 'The Saint 6 Way of Creation',
      description: 'We believe in structured creativity — a process that respects your vision while bringing our expertise to every detail.',
    },
    workflow: workflowIds,
    key_projects: keyProjectIds,
  });

  // Vietnamese
  await updateSingleType('production-page', {
    hero: {
      heading: 'Sản Xuất Toàn Diện, Thực Hiện Liền Mạch.',
      background_image: heroImageId,
      background_alt: 'Production',
    },
    intro: {
      title: 'Dịch Vụ',
      description: 'Từ ý tưởng đến sản phẩm cuối cùng, chúng tôi mang chiến dịch của bạn vào cuộc sống thông qua lập kế hoạch chính xác, chỉ đạo sáng tạo và kỹ thuật điêu luyện.',
      cta_text: 'Lên Kế Hoạch Sản Xuất',
      cta_link: '#contact-form',
    },
    services: servicesIds,
    intro_2: {
      title: 'Phong Cách Sáng Tạo Saint 6',
      description: 'Chúng tôi tin vào sự sáng tạo có cấu trúc — một quy trình tôn trọng tầm nhìn của bạn đồng thời mang chuyên môn của chúng tôi vào từng chi tiết.',
    },
    workflow: workflowIds,
    key_projects: keyProjectIds,
  }, 'vi');
}

async function seedSetDesignPage(
  portfolioIds: number[],
  testimonialIds: number[],
  serviceEntries: { id: number; page: string; section: string }[]
) {
  console.log('\n📄 Seeding Set Design Page...');

  const heroImageId = await uploadImage('/images/set-design/hero-background.jpg');

  // Filter portfolio items for set-design page
  const setDesignPortfolioIds = portfolioIds.slice(8, 16); // Items 9-16 are set-design

  // Get service item IDs for this page
  const workflowIds = getServiceIds(serviceEntries, 'set-design', 'workflow');

  // English
  await updateSingleType('set-design-page', {
    hero: {
      heading: 'From Moodboard to Build — Complete Set Design for Visual Storytelling',
      background_image: heroImageId,
      background_alt: 'Set Design',
    },
    intro: {
      title: 'How We Work',
      description: 'We design, construct, and manage physical sets that transform creative direction into production-ready environments.',
      cta_text: 'Get in touch',
      cta_link: '#contact-form',
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: 'PORTFOLIO',
      statement: 'We shape physical spaces that reflect your creative intent — environments that become part of your story',
    },
    portfolio_items: setDesignPortfolioIds,
    testimonials: testimonialIds,
  });

  // Vietnamese
  await updateSingleType('set-design-page', {
    hero: {
      heading: 'Từ Bản Vẽ Ý Tưởng đến Hoàn Thiện — Thiết Kế Set Hoàn Chỉnh cho Câu Chuyện Hình Ảnh',
      background_image: heroImageId,
      background_alt: 'Set Design',
    },
    intro: {
      title: 'Cách Chúng Tôi Làm Việc',
      description: 'Chúng tôi thiết kế, xây dựng và quản lý các set vật lý để biến đổi định hướng sáng tạo thành môi trường sẵn sàng sản xuất.',
      cta_text: 'Liên hệ ngay',
      cta_link: '#contact-form',
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: 'PORTFOLIO',
      statement: 'Chúng tôi tạo hình không gian vật lý phản ánh ý định sáng tạo của bạn — môi trường trở thành một phần câu chuyện của bạn',
    },
    portfolio_items: setDesignPortfolioIds,
    testimonials: testimonialIds,
  }, 'vi');
}

async function seedEventPlanningPage(
  keyProjectIds: number[],
  serviceEntries: { id: number; page: string; section: string }[]
) {
  console.log('\n📄 Seeding Event Planning Page...');

  const heroImageId = await uploadImage('/images/event-planning/hero-background.jpg');

  // Get service item IDs for this page
  const servicesIds = getServiceIds(serviceEntries, 'event-planning', 'services');
  const workflowIds = getServiceIds(serviceEntries, 'event-planning', 'workflow');

  // English
  await updateSingleType('event-planning-page', {
    hero: {
      heading: 'Curated Experiences, Designed to Inspire.',
      background_image: heroImageId,
      background_alt: 'Event Planning',
    },
    intro: {
      title: 'Every Moment, An Emotion',
      description: 'Saint 6 approaches every event as a living brand story. Our in-house creative team designs atmospheres where concept, design, and guest experience blend seamlessly.',
      cta_text: 'Plan Your Event',
      cta_link: '#contact-form',
    },
    services: servicesIds,
    intro_2: {
      title: 'Every Moment, An Emotion',
      description: 'Beyond venue and décor, Saint 6 delivers artistry in motion — a rare harmony of creative vision, flawless execution, and atmosphere designed to leave a lasting impression.',
    },
    workflow: workflowIds,
    event_projects: keyProjectIds,
  });

  // Vietnamese
  await updateSingleType('event-planning-page', {
    hero: {
      heading: 'Trải Nghiệm Được Chọn Lọc, Thiết Kế Để Truyền Cảm Hứng.',
      background_image: heroImageId,
      background_alt: 'Event Planning',
    },
    intro: {
      title: 'Mỗi Khoảnh Khắc, Một Cảm Xúc',
      description: 'Saint 6 tiếp cận mỗi sự kiện như một câu chuyện thương hiệu sống động. Đội ngũ sáng tạo nội bộ của chúng tôi thiết kế không gian nơi ý tưởng, thiết kế và trải nghiệm khách mời hòa quyện hoàn hảo.',
      cta_text: 'Lên Kế Hoạch Sự Kiện',
      cta_link: '#contact-form',
    },
    services: servicesIds,
    intro_2: {
      title: 'Mỗi Khoảnh Khắc, Một Cảm Xúc',
      description: 'Vượt xa địa điểm và trang trí, Saint 6 mang đến nghệ thuật trong chuyển động — sự hòa hợp hiếm có giữa tầm nhìn sáng tạo, thực hiện hoàn hảo và bầu không khí được thiết kế để để lại ấn tượng lâu dài.',
    },
    workflow: workflowIds,
    event_projects: keyProjectIds,
  }, 'vi');
}

async function seedDecorPage(
  portfolioIds: number[],
  serviceEntries: { id: number; page: string; section: string }[]
) {
  console.log('\n📄 Seeding Decor Page...');

  const heroImageId = await uploadImage('/images/decoration/hero-background.jpg');

  // Filter portfolio items for decor page
  const decorPortfolioIds = portfolioIds.slice(16, 24); // Items 17-24 are decor

  // Get service item IDs for this page
  const workflowIds = getServiceIds(serviceEntries, 'decor', 'workflow');

  // English
  await updateSingleType('decor-page', {
    hero: {
      heading: 'From flagship stores to private villas — we design and decorate spaces that tell a story.',
      background_image: heroImageId,
      background_alt: 'Decoration',
    },
    intro: {
      title: 'How We Work',
      description: 'The name "Decor" feels refined and adaptable, representing Saint 6\'s creative work across fashion stores, restaurants, and personal villas.',
      cta_text: 'Plan Your Decoration',
      cta_link: '#contact-form',
    },
    workflow: workflowIds,
    intro_2: {
      title: 'every moment, an emotion',
      description: 'Every project begins with a vision. We bring it to life — detail by detail.',
    },
    portfolio_settings: {
      label: 'every moment, an emotion',
      statement: 'Every project begins with a vision. We bring it to life — detail by detail.',
    },
    portfolio_items: decorPortfolioIds,
  });

  // Vietnamese
  await updateSingleType('decor-page', {
    hero: {
      heading: 'Từ cửa hàng flagship đến biệt thự riêng — chúng tôi thiết kế và trang trí không gian kể câu chuyện.',
      background_image: heroImageId,
      background_alt: 'Decoration',
    },
    intro: {
      title: 'Cách Chúng Tôi Làm Việc',
      description: 'Tên gọi "Decor" mang cảm giác tinh tế và linh hoạt, đại diện cho công việc sáng tạo của Saint 6 qua các cửa hàng thời trang, nhà hàng và biệt thự cá nhân.',
      cta_text: 'Lên Kế Hoạch Trang Trí',
      cta_link: '#contact-form',
    },
    workflow: workflowIds,
    intro_2: {
      title: 'mỗi khoảnh khắc, một cảm xúc',
      description: 'Mỗi dự án bắt đầu bằng một tầm nhìn. Chúng tôi mang nó vào cuộc sống — từng chi tiết một.',
    },
    portfolio_settings: {
      label: 'mỗi khoảnh khắc, một cảm xúc',
      statement: 'Mỗi dự án bắt đầu bằng một tầm nhìn. Chúng tôi mang nó vào cuộc sống — từng chi tiết một.',
    },
    portfolio_items: decorPortfolioIds,
  }, 'vi');
}

async function seedAboutPage() {
  console.log('\n📄 Seeding About Page...');

  const heroImageId = await uploadImage('/images/about-us/hero-background.jpg');
  const introImageId = await uploadImage('/images/about-us/intro-portrait.jpg');
  const fullWidthImageId = await uploadImage('/images/about-us/full-width-image.jpg');
  const founderImageId = await uploadImage('/images/about-us/founder-portrait.jpg');

  const timelineImages = await Promise.all([
    uploadImage('/images/about-us/timeline-2021.jpg'),
    uploadImage('/images/about-us/timeline-2022.jpg'),
    uploadImage('/images/about-us/timeline-2023.jpg'),
    uploadImage('/images/about-us/timeline-2024.jpg'),
    uploadImage('/images/about-us/timeline-2025.jpg'),
    uploadImage('/images/about-us/timeline-2026.jpg'),
  ]);

  // English
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
    vision: { label: 'VISION', statement: 'To create work that is remembered through the feelings it evokes.' },
    full_width_image: fullWidthImageId,
    mission: { label: 'MISSION', statement: 'We transform ideas, identities, and stories into visual experiences that move people.' },
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
      { year: '2022', image: timelineImages[1], description: 'The first Saint 6 studio space was built.' },
      { year: '2023', image: timelineImages[2], description: 'We expanded into store décor and spatial brand environments.' },
      { year: '2024', image: timelineImages[3], description: 'We began designing events and weddings.' },
      { year: '2025', image: timelineImages[4], description: 'We surpassed 1,000 set designs created since our founding.' },
      { year: '2026 (Next)', image: timelineImages[5], description: 'We are opening a second Saint 6 location.' },
    ],
    founder: {
      image: founderImageId,
      quote: 'Creation is emotional work. We build spaces for people to feel something real.',
      name: 'Trang',
      title: 'Founder & Creative Director',
    },
  });

  // Vietnamese
  await updateSingleType('about-page', {
    hero: {
      heading: 'Chúng Tôi Tưởng Tượng. Chúng Tôi Thiết Kế. Chúng Tôi Sáng Tạo.',
      background_image: heroImageId,
      background_alt: 'About Saint 6 Studio',
    },
    intro: {
      label: 'GIỚI THIỆU',
      headline: 'Chúng tôi là một studio của các nghệ sĩ, thợ xây, stylist, người mơ mộng, người giải quyết vấn đề và người kể chuyện.\nChúng tôi biến ý tưởng thành không gian, cảm xúc và ký ức.',
      body_paragraph_1: 'Saint 6 Studios, được sáng lập bởi Trang Nhẹ Nhàng, là một studio sáng tạo đa ngành chuyên tạo ra các set, không gian, môi trường và trải nghiệm.',
      body_paragraph_2: 'Chúng tôi tạo ra những tác phẩm có hồn, những tác phẩm chứa đựng cảm xúc, bầu không khí và câu chuyện. Với chúng tôi, đó không bao giờ chỉ là "trang trí." Đó là cảm xúc mà ai đó mang về nhà.',
      image: introImageId,
    },
    vision: { label: 'TẦM NHÌN', statement: 'Tạo ra những tác phẩm được ghi nhớ qua những cảm xúc mà chúng gợi lên.' },
    full_width_image: fullWidthImageId,
    mission: { label: 'SỨ MỆNH', statement: 'Chúng tôi biến ý tưởng, bản sắc và câu chuyện thành những trải nghiệm hình ảnh chạm đến trái tim con người.' },
    values: [
      { letter: 'S', title: 'Simplicity', description: 'Sự rõ ràng bộc lộ cảm xúc.' },
      { letter: 'A', title: 'Authenticity', description: 'Cảm xúc phải thật, không được tạo dựng.' },
      { letter: 'I', title: 'Intention', description: 'Mọi lựa chọn đều phục vụ cảm xúc.' },
      { letter: 'N', title: 'Narrative', description: 'Mọi thứ đều là một phần của câu chuyện.' },
      { letter: 'T', title: 'Trust', description: 'Nghệ thuật cần sự đáng tin cậy để phát triển.' },
      { letter: '6', title: 'Sixth Sense', description: 'Chúng tôi thiết kế cho cảm xúc ẩn dấu.' },
    ],
    our_story: {
      label: 'Câu Chuyện Của Chúng Tôi',
      paragraph_1: 'Trước Saint 6, đã có Haus of Trang - nơi Trang học được rằng styling không chỉ là về việc mọi thứ trông như thế nào, mà còn là cách chúng khiến người ta cảm nhận.',
      paragraph_2: 'Nhận thức đó đã trở thành nền tảng của Saint 6',
    },
    timeline: [
      { year: '2021', image: timelineImages[0], description: 'Saint 6 được thành lập với niềm tin rằng cái đẹp là cảm xúc, không phải trang trí.' },
      { year: '2022', image: timelineImages[1], description: 'Không gian studio Saint 6 đầu tiên được xây dựng.' },
      { year: '2023', image: timelineImages[2], description: 'Chúng tôi mở rộng sang trang trí cửa hàng và môi trường thương hiệu không gian.' },
      { year: '2024', image: timelineImages[3], description: 'Chúng tôi bắt đầu thiết kế sự kiện và đám cưới.' },
      { year: '2025', image: timelineImages[4], description: 'Chúng tôi vượt qua 1.000 thiết kế bối cảnh được tạo ra kể từ khi thành lập.' },
      { year: '2026 (Tiếp theo)', image: timelineImages[5], description: 'Chúng tôi đang mở địa điểm Saint 6 thứ hai.' },
    ],
    founder: {
      image: founderImageId,
      quote: 'Sáng tạo là công việc của cảm xúc. Chúng tôi xây dựng không gian để mọi người cảm nhận điều gì đó chân thật.',
      name: 'Trang',
      title: 'Nhà Sáng Lập & Giám Đốc Sáng Tạo',
    },
  }, 'vi');
}

async function seedContactPage() {
  console.log('\n📄 Seeding Contact Page...');

  const heroImageId = await uploadImage('/images/contact/hero-background.jpg');
  const mapImageId = await uploadImage('/images/contact/saint6-map.jpg');

  // English
  await updateSingleType('contact-page', {
    hero: {
      heading: "Let's Connect",
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

  // Vietnamese
  await updateSingleType('contact-page', {
    hero: {
      heading: 'Hãy Kết Nối',
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio exterior',
    },
    info: {
      title: 'Liên Hệ',
      subheading: 'Cùng Tạo Ra Điều Đặc Biệt',
      address_line_1: '6 Bế Văn Cấm, Tân Kiểng',
      address_line_2: 'Quận 7, TP.HCM',
      email: 'Saint6studios@gmail.com',
      phone: '0919 403 784 - 0918 756 573',
    },
    map_image: mapImageId,
  }, 'vi');
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
    const testimonialIds = await seedTestimonialItems();
    const serviceEntries = await seedServiceItems();

    // Seed all pages
    await seedHomepage(brandLogoIds, keyProjectIds);
    await seedStudioRentalPage(studioRoomIds, equipmentIds, faqIds);
    await seedCreativePage(portfolioIds, brandLogoIds, testimonialIds, serviceEntries);
    await seedProductionPage(keyProjectIds, serviceEntries);
    await seedSetDesignPage(portfolioIds, testimonialIds, serviceEntries);
    await seedEventPlanningPage(keyProjectIds, serviceEntries);
    await seedDecorPage(portfolioIds, serviceEntries);
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
    console.log(`   - Testimonial Items: ${testimonialIds.length}`);
    console.log(`   - Service Items: ${serviceEntries.length}`);
    console.log(`   - Gallery Images: ${galleryImages.length}`);
    console.log(`   - Images uploaded: ${Object.keys(imageCache).length}`);
    console.log(`   - Pages seeded: 9 (English + Vietnamese)`);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
