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
  // Creative page
  { title: 'FRESSI KV', category: 'Campaign', image: '/images/creative/portfolio-fressi.jpg', size: 'large', page: 'creative', order: 1 },
  { title: 'MIRINDA', category: 'Campaign', image: '/images/creative/portfolio-mirinda.jpg', size: 'large', page: 'creative', order: 2 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-1.jpg', size: 'short', page: 'creative', order: 3 },
  { title: 'MV DIỄN VIÊN TỒI - ĐEN VÂU', category: 'Campaign', image: '/images/creative/portfolio-denvau-2.jpg', size: 'tall', page: 'creative', order: 4 },
  { title: 'YAMAHA SOCIAL LAYOUT', category: 'Campaign', image: '/images/creative/portfolio-yamaha.jpg', size: 'short', page: 'creative', order: 5 },
  // Set Design page
  { title: 'FRESSI KV', category: 'Campaign', image: '/images/set-design/campaign-fressi.jpg', size: 'large', page: 'set-design', order: 1 },
  { title: 'Mirinda', category: 'Campaign', image: '/images/set-design/campaign-mirinda.jpg', size: 'large', page: 'set-design', order: 2 },
  // Decor page
  { title: 'FRESSI KV', category: 'Fashion Stores', image: '/images/decoration/portfolio-fressi.jpg', size: 'large', page: 'decor', order: 1 },
  { title: 'MIRINDA', category: 'Campaign', image: '/images/decoration/portfolio-mirinda.jpg', size: 'large', page: 'decor', order: 2 },
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

// ============================================================================
// Vietnamese Translations
// ============================================================================

const viTranslations = {
  homepage: {
    hero: { heading: 'Nơi Trí Tưởng Tượng Thành Hình' },
    space_section: {
      caption: 'KHÔNG GIAN ĐA DẠNG',
      description: '900m² không gian sáng tạo linh hoạt, được thiết kế để hỗ trợ mọi thứ từ chụp ảnh thời trang đến livestream và sự kiện.',
      cta_text: 'XEM THUÊ STUDIO',
      stats: [
        { label: 'Tổng số phòng', value: '6' },
        { label: 'Phòng trống', value: '3' },
        { label: 'Phòng Concept', value: '3' },
        { label: 'Chiều cao trần', value: '4.5m' },
        { label: 'Tổng diện tích', value: '900m²' },
      ],
    },
    crew_area: {
      caption: 'KHU VỰC EKIP',
      heading: 'Và khu vực ăn uống riêng biệt cùng phòng trang điểm cho ekip và khách hàng',
      info_label: 'THÔNG TIN',
      info_text: 'Tận hưởng không gian ăn uống riêng biệt và phòng trang điểm chuyên nghiệp—được thiết kế cho sự thoải mái, riêng tư và chuẩn bị dễ dàng.',
    },
  },
  studioRental: {
    hero: { heading: 'Không Gian Studio Được Thiết Kế Cho Sáng Tạo' },
    intro: {
      label: 'CÁCH THỨC HOẠT ĐỘNG',
      description: 'Đặt không gian lý tưởng của bạn, mang theo tầm nhìn của bạn, và để SAINT 6 lo phần còn lại.',
      cta_text: 'Đặt Ngay',
    },
  },
  creative: {
    hero: { heading: 'Sản xuất sáng tạo cho thương hiệu, chiến dịch & sản phẩm' },
    clients_label: 'Khách Hàng Tiêu Biểu',
    clients_description: 'Chúng tôi tự hào hợp tác với các thương hiệu, agency và startup hàng đầu trên toàn thế giới.',
    services: [
      { title: 'Chiến Dịch Thương Hiệu & Quảng Cáo', description: 'Chúng tôi sản xuất các chiến dịch thời trang, lifestyle, editorial, mạng xã hội và influencer để đưa thương hiệu vào cuộc sống.' },
      { title: 'Chụp Sản Phẩm & Bao Bì', description: 'Từ nhãn sản phẩm và hình ảnh thương mại điện tử đến packshot và still life, chúng tôi tạo ra hình ảnh hoàn hảo.' },
    ],
    how_we_work: {
      label: 'Cách Chúng Tôi Làm Việc',
      description: 'Chúng tôi có thể đảm nhận toàn bộ quy trình sản xuất hoặc tham gia ở bất kỳ giai đoạn nào — từ moodboard và phát triển concept đến hậu kỳ và bàn giao cuối cùng.',
      cta_text: 'Liên hệ ngay',
    },
    workflow: [
      { title: 'Định Hướng Sáng Tạo', description: 'Chúng tôi nghiên cứu brief và phát triển các hướng sáng tạo dựa trên thương hiệu, đối tượng và mục tiêu của bạn.' },
      { title: 'Phát Triển Storyboard', description: 'Đội ngũ của chúng tôi tạo storyboard chi tiết và danh sách shot để hình dung kết quả cuối cùng.' },
      { title: 'Tiền Sản Xuất & Tìm Nguồn', description: 'Chúng tôi phối hợp người mẫu, địa điểm, đạo cụ và thiết bị để đảm bảo thực hiện suôn sẻ.' },
      { title: 'Quay / Sản Xuất', description: 'Ekip giàu kinh nghiệm của chúng tôi ghi lại tầm nhìn của bạn với độ chính xác và phong cách sáng tạo.' },
      { title: 'Hậu Kỳ', description: 'Biên tập chuyên nghiệp, chỉnh màu và retouch để hoàn thiện sản phẩm cuối cùng.' },
      { title: 'Bàn Giao Cuối Cùng', description: 'Chúng tôi bàn giao tài sản hoàn chỉnh sẵn sàng cho in ấn, digital và triển khai mạng xã hội.' },
    ],
    portfolio_settings: {
      label: 'Dự Án Nổi Bật',
      statement: 'Hình ảnh đẳng cấp phản ánh tham vọng thương hiệu của bạn — một showcase của nghệ thuật và sự chú ý đến chi tiết.',
    },
  },
  production: {
    hero: { heading: 'Sản Xuất Quy Mô Lớn, Thực Hiện Liền Mạch.' },
    intro: {
      label: 'Dịch Vụ Của Chúng Tôi',
      description: 'Từ concept đến bàn giao cuối cùng, chúng tôi đưa chiến dịch của bạn vào cuộc sống thông qua lập kế hoạch chính xác, định hướng sáng tạo và làm chủ kỹ thuật.',
      cta_text: 'Lên Kế Hoạch Sản Xuất',
    },
    services: [
      { title: 'Sản Xuất Chiến Dịch & Editorial', description: 'Chúng tôi tuyển chọn các chiến dịch và editorial độc đáo kết hợp nghệ thuật, câu chuyện và sự tinh tế vượt thời gian.' },
      { title: 'Sản Xuất Nhiếp Ảnh & Phim', description: 'Từ concept đến final cut, chúng tôi mang đến hình ảnh ấn tượng qua đạo diễn chuyên nghiệp và kể chuyện sáng tạo.' },
      { title: 'Cho Thuê Ánh Sáng & Thiết Bị', description: 'Ánh sáng cao cấp và thiết bị hiện đại được thiết kế để nâng tầm mọi dự án sản xuất.' },
      { title: 'Trang Điểm & Làm Tóc', description: 'Dịch vụ làm đẹp chuyên nghiệp biến đổi người mẫu và nâng cao kể chuyện thị giác.' },
      { title: 'Tìm Địa Điểm & Giấy Phép', description: 'Chúng tôi tìm kiếm địa điểm hoàn hảo và xử lý tất cả thủ tục giấy phép.' },
      { title: 'Phối Hợp Hậu Kỳ', description: 'Quản lý hậu kỳ toàn diện, từ biên tập và chỉnh màu đến bàn giao cuối cùng.' },
    ],
    saint6_way_title: 'Phương Thức Sáng Tạo Saint 6',
    saint6_way_description: 'Chúng tôi mang cấu trúc vào sáng tạo — kết hợp định hướng chiến lược, tầm nhìn nghệ thuật và thực hiện tinh tế.',
    workflow: [
      { title: 'Tiền Sản Xuất', description: 'Lập kế hoạch, định hướng sáng tạo và phối hợp logistics.' },
      { title: 'Chuẩn Bị', description: 'Cài đặt thiết bị, thiết kế ánh sáng và chuẩn bị không gian.' },
      { title: 'Ngày Quay', description: 'Thực hiện chuyên nghiệp với ekip giàu kinh nghiệm.' },
      { title: 'Kết Thúc & Bàn Giao', description: 'Hậu kỳ và bàn giao tài sản cuối cùng.' },
    ],
  },
  setDesign: {
    hero: { heading: 'Từ Moodboard Đến Xây Dựng — Thiết Kế Bối Cảnh Toàn Diện Cho Kể Chuyện Thị Giác' },
    how_we_work: {
      label: 'Cách Chúng Tôi Làm Việc',
      description: 'Chúng tôi thiết kế, xây dựng và quản lý bối cảnh vật lý biến đổi định hướng sáng tạo thành môi trường sẵn sàng sản xuất.',
      cta_text: 'Liên hệ ngay',
    },
    workflow: [
      { title: 'Brief & Concept', description: 'Chúng tôi nghiên cứu brief và phát triển các hướng sáng tạo dựa trên tầm nhìn của bạn.' },
      { title: 'Layout & Render', description: 'Đội ngũ thiết kế của chúng tôi tạo ra layout chi tiết và render 3D.' },
      { title: 'Vòng Lặp Phản Hồi', description: 'Tinh chỉnh hợp tác để đảm bảo phù hợp hoàn hảo với mục tiêu của bạn.' },
      { title: 'Xây Dựng', description: 'Xây dựng chuyên nghiệp với sự chú ý đến từng chi tiết.' },
      { title: 'Hỗ Trợ Quay', description: 'Hỗ trợ tại chỗ trong quá trình sản xuất.' },
      { title: 'Bảo Trì', description: 'Dọn dẹp sau quay và quản lý bối cảnh.' },
    ],
    portfolio_settings: {
      label: 'PORTFOLIO',
      statement: 'Chúng tôi định hình không gian vật lý phản ánh ý định sáng tạo của bạn — môi trường trở thành một phần câu chuyện của bạn.',
    },
  },
  eventPlanning: {
    hero: { heading: 'Sự Kiện Được Tuyển Chọn Để Lại Ấn Tượng Khó Quên' },
    intro: {
      label: 'Dịch Vụ Của Chúng Tôi',
      description: 'Từ những buổi gặp gỡ thân mật đến những lễ kỷ niệm hoành tráng, chúng tôi thiết kế và thực hiện sự kiện cuốn hút và truyền cảm hứng.',
      cta_text: 'Lên Kế Hoạch Sự Kiện',
    },
    services: [
      { title: 'Ra Mắt Sản Phẩm & Thương Hiệu', description: 'Chúng tôi tạo ra trải nghiệm ra mắt cuốn hút khán giả và nâng tầm câu chuyện thương hiệu của bạn.' },
      { title: 'Trình Diễn Thời Trang', description: 'Từ sàn runway đến hậu trường, chúng tôi thiết kế và thực hiện sự kiện thời trang tôn vinh nghệ thuật.' },
      { title: 'Tiệc Riêng', description: 'Những buổi gặp gỡ thân mật được tuyển chọn với chi tiết tinh tế, tạo nên những khoảnh khắc đáng nhớ.' },
      { title: 'Pop-Up Nghệ Thuật & Lifestyle', description: 'Trải nghiệm pop-up đắm chìm kết hợp nghệ thuật, văn hóa và lifestyle.' },
      { title: 'Sự Kiện Báo Chí & Influencer', description: 'Sự kiện truyền thông chiến lược được thiết kế để tạo buzz và xây dựng kết nối.' },
      { title: 'Lễ Kỷ Niệm Doanh Nghiệp', description: 'Sự kiện doanh nghiệp chuyên nghiệp nhưng tinh tế phản ánh giá trị của bạn.' },
    ],
    process_title: 'Quy Trình Của Chúng Tôi',
    process_description: 'Mọi sự kiện bắt đầu bằng việc hiểu tầm nhìn của bạn. Sau đó chúng tôi biến nó thành hiện thực thông qua lập kế hoạch tỉ mỉ và thực hiện hoàn hảo.',
    workflow: [
      { title: 'Khám Phá', description: 'Hiểu tầm nhìn, mục tiêu và đối tượng của bạn.' },
      { title: 'Phát Triển Concept', description: 'Tạo concept sự kiện độc đáo phù hợp với nhu cầu của bạn.' },
      { title: 'Lập Kế Hoạch & Logistics', description: 'Lập kế hoạch chi tiết và phối hợp tất cả các yếu tố.' },
      { title: 'Thực Hiện', description: 'Quản lý và phối hợp tại chỗ hoàn hảo.' },
      { title: 'Theo Dõi', description: 'Báo cáo sau sự kiện và thu thập phản hồi.' },
    ],
  },
  decor: {
    hero: { heading: 'Từ cửa hàng flagship đến biệt thự riêng — chúng tôi thiết kế và trang trí không gian kể câu chuyện.' },
    how_we_work: {
      label: 'Cách Chúng Tôi Làm Việc',
      description: 'Tên "Decor" đại diện cho công việc sáng tạo của Saint 6 trên các cửa hàng thời trang, nhà hàng và biệt thự cá nhân.',
      cta_text: 'Lên Kế Hoạch Trang Trí',
    },
    workflow: [
      { title: 'Tổng Quan Brief', description: 'Chúng tôi nghiên cứu brief và phát triển nhiều hướng sáng tạo.' },
      { title: 'Ý Tưởng 2D', description: 'Đội ngũ thiết kế của chúng tôi tạo mood board chi tiết và layout concept.' },
      { title: 'Render 3D', description: 'Chúng tôi tạo render 3D chân thực để bạn có thể trải nghiệm không gian.' },
      { title: 'Tiền Sản Xuất', description: 'Chúng tôi phối hợp vật liệu, nhà cung cấp và timeline.' },
      { title: 'Lắp Đặt Cuối Cùng', description: 'Đội ngũ của chúng tôi quản lý toàn bộ việc lắp đặt với độ chính xác cao.' },
    ],
    portfolio_settings: {
      label: 'mỗi khoảnh khắc, một cảm xúc',
      statement: 'Mỗi dự án bắt đầu với một tầm nhìn. Chúng tôi biến nó thành hiện thực — từng chi tiết một.',
    },
  },
  about: {
    hero: { heading: 'Chúng Tôi Tưởng Tượng. Chúng Tôi Thiết Kế. Chúng Tôi Sáng Tạo.' },
    intro: {
      label: 'VỀ CHÚNG TÔI',
      headline: 'Chúng tôi là một studio của các nghệ sĩ, người xây dựng, stylist, người mơ mộng, người giải quyết vấn đề và người kể chuyện.',
      body_paragraph_1: 'Saint 6 Studios, được sáng lập bởi Trang Nhẹ Nhàng, là một studio sáng tạo đa ngành.',
      body_paragraph_2: 'Chúng tôi tạo ra tác phẩm có hồn, tác phẩm chứa đựng cảm xúc, bầu không khí và câu chuyện.',
    },
    vision: { label: 'TẦM NHÌN', statement: 'Tạo ra tác phẩm được ghi nhớ qua những cảm xúc mà nó gợi lên.' },
    mission: { label: 'SỨ MỆNH', statement: 'Chúng tôi biến ý tưởng, bản sắc và câu chuyện thành trải nghiệm thị giác lay động con người.' },
    values: [
      { title: 'Đơn Giản', description: 'Sự rõ ràng bộc lộ cảm xúc.' },
      { title: 'Chân Thực', description: 'Cảm xúc phải thật, không được tạo ra.' },
      { title: 'Có Chủ Đích', description: 'Mọi lựa chọn phục vụ cảm xúc.' },
      { title: 'Tự Sự', description: 'Mọi thứ đều là một phần của câu chuyện.' },
      { title: 'Tin Tưởng', description: 'Nghệ thuật cần sự đáng tin cậy để phát triển.' },
      { title: 'Giác Quan Thứ Sáu', description: 'Chúng tôi thiết kế cho cảm xúc ẩn sau brief.' },
    ],
    our_story: {
      label: 'Câu Chuyện Của Chúng Tôi',
      paragraph_1: 'Trước Saint 6, có Haus of Trang - nơi Trang học được rằng styling không chỉ là về cách mọi thứ trông như thế nào, mà còn về cách chúng khiến người ta cảm thấy.',
      paragraph_2: 'Nhận thức đó đã trở thành nền tảng của Saint 6',
    },
    timeline: [
      { description: 'Saint 6 được thành lập với niềm tin rằng cái đẹp là cảm xúc, không phải trang trí.' },
      { description: 'Không gian studio Saint 6 đầu tiên được xây dựng.' },
      { description: 'Chúng tôi mở rộng sang trang trí cửa hàng và môi trường thương hiệu không gian.' },
      { description: 'Chúng tôi bắt đầu thiết kế sự kiện và đám cưới.' },
      { description: 'Chúng tôi vượt qua 1.000 thiết kế bối cảnh được tạo ra kể từ khi thành lập.' },
      { description: 'Chúng tôi đang mở địa điểm Saint 6 thứ hai.' },
    ],
    founder: {
      quote: 'Sáng tạo là công việc cảm xúc. Chúng tôi xây dựng không gian cho mọi người cảm nhận điều gì đó thực sự.',
      title: 'Nhà Sáng Lập & Giám Đốc Sáng Tạo',
    },
  },
  contact: {
    hero: { heading: 'Hãy Cùng Tạo Nên Điều Phi Thường' },
    info: {
      title: 'Liên Hệ',
      subheading: 'Hãy Cùng Tạo Nên Điều Phi Thường',
    },
  },
};

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
      heading: 'Where Imagination Takes Form',
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio',
    },
    brand_logos: brandLogoIds,
    gallery_images: galleryImageComponents,
    featured_projects: keyProjectIds,
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
      heading: viTranslations.homepage.hero.heading,
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio',
    },
    brand_logos: brandLogoIds,
    gallery_images: galleryImageComponents,
    featured_projects: keyProjectIds,
    space_section: {
      caption: viTranslations.homepage.space_section.caption,
      description: viTranslations.homepage.space_section.description,
      cta_text: viTranslations.homepage.space_section.cta_text,
      cta_link: '/studio-rental',
      stats: viTranslations.homepage.space_section.stats,
      gallery_images: spaceImages.filter(Boolean),
    },
    crew_area: {
      caption: viTranslations.homepage.crew_area.caption,
      heading: viTranslations.homepage.crew_area.heading,
      info_label: viTranslations.homepage.crew_area.info_label,
      info_text: viTranslations.homepage.crew_area.info_text,
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

  // English
  await updateSingleType('studio-rental-page', {
    hero: {
      heading: 'Studio Spaces Designed for Creation',
      background_image: heroImageId,
      background_alt: 'Studio Rental',
    },
    intro: {
      label: 'HOW IT WORKS',
      description: 'Book your ideal space, bring your vision, and let SAINT 6 handle the rest.',
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

  // Vietnamese
  await updateSingleType('studio-rental-page', {
    hero: {
      heading: viTranslations.studioRental.hero.heading,
      background_image: heroImageId,
      background_alt: 'Studio Rental',
    },
    intro: {
      label: viTranslations.studioRental.intro.label,
      description: viTranslations.studioRental.intro.description,
      cta_text: viTranslations.studioRental.intro.cta_text,
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
  }, 'vi');
}

async function seedCreativePage(portfolioIds: number[]) {
  console.log('\n📄 Seeding Creative Page...');

  const heroImageId = await uploadImage('/images/creative/hero-background.jpg');

  // Filter portfolio items for creative page
  const creativePortfolioIds = portfolioIds.slice(0, 5); // First 5 are creative

  // English
  await updateSingleType('creative-page', {
    hero: {
      heading: 'Creative production for brands, campaigns & products',
      background_image: heroImageId,
      background_alt: 'Creative',
    },
    clients_label: 'Selected Clients',
    clients_description: "We're proud to collaborate with leading brands, agencies, and startups worldwide.",
    services: [
      { icon: 'camera', title: 'Brand & Advertising Campaigns', description: 'We produce fashion, lifestyle, editorial, social media, and influencer campaigns that bring brands to life.' },
      { icon: 'box', title: 'Product & Packaging Shoots', description: 'From product labels and e-commerce images to packshots and still life, we create polished visuals.' },
    ],
    how_we_work: {
      label: 'How We Work',
      description: 'We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery.',
      cta_text: 'Get in touch',
      cta_link: '#contact-form',
    },
    workflow: [
      { step_number: '01', title: 'Creative Direction', description: 'We study your brief and develop creative directions based on your brand, audience, and goals.' },
      { step_number: '02', title: 'Storyboard Development', description: 'Our team creates detailed storyboards and shot lists to visualize the final output.' },
      { step_number: '03', title: 'Pre-production & Sourcing', description: 'We coordinate talent, locations, props, and equipment to ensure smooth execution.' },
      { step_number: '04', title: 'Shoot / Production', description: 'Our experienced crew captures your vision with precision and creative flair.' },
      { step_number: '05', title: 'Post-production', description: 'Professional editing, color grading, and retouching bring the final deliverables to life.' },
      { step_number: '06', title: 'Final Delivery', description: 'We deliver polished assets ready for print, digital, and social media deployment.' },
    ],
    portfolio_settings: {
      label: 'Featured Work',
      statement: "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail.",
    },
    portfolio_items: creativePortfolioIds,
  });

  // Vietnamese
  await updateSingleType('creative-page', {
    hero: {
      heading: viTranslations.creative.hero.heading,
      background_image: heroImageId,
      background_alt: 'Creative',
    },
    clients_label: viTranslations.creative.clients_label,
    clients_description: viTranslations.creative.clients_description,
    services: viTranslations.creative.services.map((s, i) => ({ icon: ['camera', 'box'][i], ...s })),
    how_we_work: {
      label: viTranslations.creative.how_we_work.label,
      description: viTranslations.creative.how_we_work.description,
      cta_text: viTranslations.creative.how_we_work.cta_text,
      cta_link: '#contact-form',
    },
    workflow: viTranslations.creative.workflow.map((w, i) => ({ step_number: `0${i + 1}`, ...w })),
    portfolio_settings: viTranslations.creative.portfolio_settings,
    portfolio_items: creativePortfolioIds,
  }, 'vi');
}

async function seedProductionPage(keyProjectIds: number[]) {
  console.log('\n📄 Seeding Production Page...');

  const heroImageId = await uploadImage('/images/production/hero-background.jpg');
  const serviceIcons = ['film', 'camera', 'lightbulb', 'palette', 'map', 'edit'];

  // English
  await updateSingleType('production-page', {
    hero: {
      heading: 'Full-Scale Production, Seamless Execution.',
      background_image: heroImageId,
      background_alt: 'Production',
    },
    intro: {
      label: 'Our Service',
      description: 'From concept to final delivery, we bring your campaign to life through precision planning, creative direction, and technical mastery.',
      cta_text: 'Plan Your Production',
      cta_link: '#contact-form',
    },
    services: [
      { icon: 'film', title: 'Campaign & Editorial Production', description: 'We curate bespoke campaigns and editorials that blend artistry, narrative, and timeless sophistication.' },
      { icon: 'camera', title: 'Photography & Film Production', description: 'From concept to final cut, we deliver high-impact visuals through expert direction and creative storytelling.' },
      { icon: 'lightbulb', title: 'Lighting & Equipment Rental', description: 'Premium lighting and state-of-the-art equipment designed to elevate every production.' },
      { icon: 'palette', title: 'Make-up & Hair Stylist', description: 'Professional beauty services that transform talent and enhance visual storytelling.' },
      { icon: 'map', title: 'Location Scouting & Permits', description: 'We source the perfect locations and handle all permit logistics.' },
      { icon: 'edit', title: 'Post-production Coordination', description: 'End-to-end post-production management, from editing and color grading to final delivery.' },
    ],
    saint6_way_title: 'The Saint 6 Way of Creation',
    saint6_way_description: 'We bring structure to creativity — blending strategic direction, artistic vision, and refined execution.',
    workflow: [
      { step_number: '01', title: 'Pre-Production', description: 'Planning, creative direction, and logistics coordination.' },
      { step_number: '02', title: 'Set Up', description: 'Equipment setup, lighting design, and space preparation.' },
      { step_number: '03', title: 'Shoot Day', description: 'Professional execution with our experienced crew.' },
      { step_number: '04', title: 'Wrap & Delivery', description: 'Post-production and final asset delivery.' },
    ],
    featured_project: keyProjectIds[0],
  });

  // Vietnamese
  await updateSingleType('production-page', {
    hero: {
      heading: viTranslations.production.hero.heading,
      background_image: heroImageId,
      background_alt: 'Production',
    },
    intro: {
      label: viTranslations.production.intro.label,
      description: viTranslations.production.intro.description,
      cta_text: viTranslations.production.intro.cta_text,
      cta_link: '#contact-form',
    },
    services: viTranslations.production.services.map((s, i) => ({ icon: serviceIcons[i], ...s })),
    saint6_way_title: viTranslations.production.saint6_way_title,
    saint6_way_description: viTranslations.production.saint6_way_description,
    workflow: viTranslations.production.workflow.map((w, i) => ({ step_number: `0${i + 1}`, ...w })),
    featured_project: keyProjectIds[0],
  }, 'vi');
}

async function seedSetDesignPage(portfolioIds: number[]) {
  console.log('\n📄 Seeding Set Design Page...');

  const heroImageId = await uploadImage('/images/set-design/hero-background.jpg');

  // Filter portfolio items for set-design page
  const setDesignPortfolioIds = portfolioIds.slice(5, 7); // Items 6-7 are set-design

  // English
  await updateSingleType('set-design-page', {
    hero: {
      heading: 'From Moodboard to Build — Complete Set Design for Visual Storytelling',
      background_image: heroImageId,
      background_alt: 'Set Design',
    },
    how_we_work: {
      label: 'How We Work',
      description: 'We design, construct, and manage physical sets that transform creative direction into production-ready environments.',
      cta_text: 'Get in touch',
      cta_link: '#contact-form',
    },
    workflow: [
      { step_number: '01', title: 'Brief & Concept', description: 'We study the brief and develop creative directions based on your vision.' },
      { step_number: '02', title: 'Layout & Render', description: 'Our design team creates detailed layouts and 3D renders.' },
      { step_number: '03', title: 'Feedback Loop', description: 'Collaborative refinement to ensure perfect alignment with your goals.' },
      { step_number: '04', title: 'Construction', description: 'Professional build with attention to every detail.' },
      { step_number: '05', title: 'Shoot Support', description: 'On-site support during production.' },
      { step_number: '06', title: 'Maintenance', description: 'Post-shoot cleanup and set management.' },
    ],
    portfolio_settings: {
      label: 'PORTFOLIO',
      statement: 'We shape physical spaces that reflect your creative intent — environments that become part of your story.',
    },
    portfolio_items: setDesignPortfolioIds,
  });

  // Vietnamese
  await updateSingleType('set-design-page', {
    hero: {
      heading: viTranslations.setDesign.hero.heading,
      background_image: heroImageId,
      background_alt: 'Set Design',
    },
    how_we_work: {
      label: viTranslations.setDesign.how_we_work.label,
      description: viTranslations.setDesign.how_we_work.description,
      cta_text: viTranslations.setDesign.how_we_work.cta_text,
      cta_link: '#contact-form',
    },
    workflow: viTranslations.setDesign.workflow.map((w, i) => ({ step_number: `0${i + 1}`, ...w })),
    portfolio_settings: viTranslations.setDesign.portfolio_settings,
    portfolio_items: setDesignPortfolioIds,
  }, 'vi');
}

async function seedEventPlanningPage() {
  console.log('\n📄 Seeding Event Planning Page...');

  const heroImageId = await uploadImage('/images/event-planning/hero-background.jpg');
  const serviceIcons = ['star', 'scissors', 'utensils', 'palette', 'mic', 'briefcase'];

  // English
  await updateSingleType('event-planning-page', {
    hero: {
      heading: 'Curated Events That Leave Lasting Impressions',
      background_image: heroImageId,
      background_alt: 'Event Planning',
    },
    intro: {
      label: 'Our Service',
      description: 'From intimate gatherings to grand celebrations, we design and execute events that captivate and inspire.',
      cta_text: 'Plan Your Event',
      cta_link: '#contact-form',
    },
    services: [
      { icon: 'star', title: 'Product & Brand Launches', description: 'We craft launch experiences that captivate audiences and elevate your brand story.' },
      { icon: 'scissors', title: 'Fashion Shows', description: 'From runway to backstage, we design and execute fashion events that celebrate artistry.' },
      { icon: 'utensils', title: 'Private Dinners', description: 'Intimate gatherings curated with exquisite detail, creating memorable moments.' },
      { icon: 'palette', title: 'Art & Lifestyle Pop-Ups', description: 'Immersive pop-up experiences that blend art, culture, and lifestyle.' },
      { icon: 'mic', title: 'Press & Influencer Events', description: 'Strategic media events designed to generate buzz and build connections.' },
      { icon: 'briefcase', title: 'Corporate Celebrations', description: 'Professional yet refined corporate events that reflect your values.' },
    ],
    process_title: 'Our Process',
    process_description: 'Every event begins with understanding your vision. We then bring it to life through meticulous planning and flawless execution.',
    workflow: [
      { step_number: '01', title: 'Discovery', description: 'Understanding your vision, goals, and audience.' },
      { step_number: '02', title: 'Concept Development', description: 'Creating a unique event concept tailored to your needs.' },
      { step_number: '03', title: 'Planning & Logistics', description: 'Detailed planning and coordination of all elements.' },
      { step_number: '04', title: 'Execution', description: 'Flawless on-site management and coordination.' },
      { step_number: '05', title: 'Follow-up', description: 'Post-event reporting and feedback collection.' },
    ],
    event_projects: [],
  });

  // Vietnamese
  await updateSingleType('event-planning-page', {
    hero: {
      heading: viTranslations.eventPlanning.hero.heading,
      background_image: heroImageId,
      background_alt: 'Event Planning',
    },
    intro: {
      label: viTranslations.eventPlanning.intro.label,
      description: viTranslations.eventPlanning.intro.description,
      cta_text: viTranslations.eventPlanning.intro.cta_text,
      cta_link: '#contact-form',
    },
    services: viTranslations.eventPlanning.services.map((s, i) => ({ icon: serviceIcons[i], ...s })),
    process_title: viTranslations.eventPlanning.process_title,
    process_description: viTranslations.eventPlanning.process_description,
    workflow: viTranslations.eventPlanning.workflow.map((w, i) => ({ step_number: `0${i + 1}`, ...w })),
    event_projects: [],
  }, 'vi');
}

async function seedDecorPage(portfolioIds: number[]) {
  console.log('\n📄 Seeding Decor Page...');

  const heroImageId = await uploadImage('/images/decoration/hero-background.jpg');

  // Filter portfolio items for decor page
  const decorPortfolioIds = portfolioIds.slice(7, 9); // Items 8-9 are decor

  // English
  await updateSingleType('decor-page', {
    hero: {
      heading: 'From flagship stores to private villas — we design and decorate spaces that tell a story.',
      background_image: heroImageId,
      background_alt: 'Decoration',
    },
    how_we_work: {
      label: 'How We Work',
      description: 'The name "Decor" represents Saint 6\'s creative work across fashion stores, restaurants, and personal villas.',
      cta_text: 'Plan Your Decoration',
      cta_link: '#contact-form',
    },
    workflow: [
      { step_number: '01', title: 'Brief Overview', description: 'We study the brief and develop multiple creative directions.' },
      { step_number: '02', title: '2D Ideation', description: 'Our design team creates detailed mood boards and conceptual layouts.' },
      { step_number: '03', title: '3D Render', description: 'We produce photorealistic 3D renders so you can experience the space.' },
      { step_number: '04', title: 'Pre-Production', description: 'We coordinate materials, vendors, and timelines.' },
      { step_number: '05', title: 'Final Installation', description: 'Our team manages the complete installation with precision.' },
    ],
    portfolio_settings: {
      label: 'every moment, an emotion',
      statement: 'Every project begins with a vision. We bring it to life — detail by detail.',
    },
    portfolio_items: decorPortfolioIds,
  });

  // Vietnamese
  await updateSingleType('decor-page', {
    hero: {
      heading: viTranslations.decor.hero.heading,
      background_image: heroImageId,
      background_alt: 'Decoration',
    },
    how_we_work: {
      label: viTranslations.decor.how_we_work.label,
      description: viTranslations.decor.how_we_work.description,
      cta_text: viTranslations.decor.how_we_work.cta_text,
      cta_link: '#contact-form',
    },
    workflow: viTranslations.decor.workflow.map((w, i) => ({ step_number: `0${i + 1}`, ...w })),
    portfolio_settings: viTranslations.decor.portfolio_settings,
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

  const timelineYears = ['2021', '2022', '2023', '2024', '2025', '2026 (Next)'];
  const valueLetters = ['S', 'A', 'I', 'N', 'T', '6'];

  // English
  await updateSingleType('about-page', {
    hero: {
      heading: 'We Imagine. We Design. We Create.',
      background_image: heroImageId,
      background_alt: 'About Saint 6 Studio',
    },
    intro: {
      label: 'ABOUT US',
      headline: 'We are a studio of artists, builders, stylists, dreamers, problem solvers, and storytellers.',
      body_paragraph_1: 'Saint 6 Studios, founded by Trang Nhe Nhang, is a multi-disciplinary creative studio.',
      body_paragraph_2: 'We create work that feels alive, work that holds emotion, atmosphere, and story.',
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
      heading: viTranslations.about.hero.heading,
      background_image: heroImageId,
      background_alt: 'About Saint 6 Studio',
    },
    intro: {
      label: viTranslations.about.intro.label,
      headline: viTranslations.about.intro.headline,
      body_paragraph_1: viTranslations.about.intro.body_paragraph_1,
      body_paragraph_2: viTranslations.about.intro.body_paragraph_2,
      image: introImageId,
    },
    vision: viTranslations.about.vision,
    full_width_image: fullWidthImageId,
    mission: viTranslations.about.mission,
    values: viTranslations.about.values.map((v, i) => ({ letter: valueLetters[i], ...v })),
    our_story: viTranslations.about.our_story,
    timeline: viTranslations.about.timeline.map((t, i) => ({ year: timelineYears[i], image: timelineImages[i], ...t })),
    founder: {
      image: founderImageId,
      quote: viTranslations.about.founder.quote,
      name: 'Trang',
      title: viTranslations.about.founder.title,
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

  // Vietnamese
  await updateSingleType('contact-page', {
    hero: {
      heading: viTranslations.contact.hero.heading,
      background_image: heroImageId,
      background_alt: 'Saint 6 Studio exterior',
    },
    info: {
      title: viTranslations.contact.info.title,
      subheading: viTranslations.contact.info.subheading,
      address_line_1: '6 Bê Văn Cấm, Tân Kiểng',
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

    // Seed all pages
    await seedHomepage(brandLogoIds, keyProjectIds);
    await seedStudioRentalPage(studioRoomIds, equipmentIds, faqIds);
    await seedCreativePage(portfolioIds);
    await seedProductionPage(keyProjectIds);
    await seedSetDesignPage(portfolioIds);
    await seedEventPlanningPage();
    await seedDecorPage(portfolioIds);
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
    console.log(`   - Gallery Images: ${galleryImages.length}`);
    console.log(`   - Images uploaded: ${Object.keys(imageCache).length}`);
    console.log(`   - Pages seeded: 9 (English + Vietnamese)`);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
