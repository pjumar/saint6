/**
 * Strapi CMS Seed Script
 *
 * This script uploads images and populates the Strapi CMS with mock data
 * from the current React components.
 *
 * Usage: npx tsx scripts/seed-strapi.ts
 */

import { config } from "dotenv";

config({ path: ".env.local" });

import { Blob } from "node:buffer";
import * as fs from "node:fs";
import * as path from "node:path";

// Configuration
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://attractive-confidence-baa5492cbd.strapiapp.com";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error("❌ STRAPI_API_TOKEN is required. Set it in .env.local");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
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
      "Content-Type": "application/json",
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
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// Find existing image in Strapi media library by filename
async function findExistingImage(fileName: string): Promise<number | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload/files`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });

    if (!response.ok) return null;

    const files = await response.json();
    // Find the most recent upload with matching filename
    const matches = files
      .filter((f: { name: string }) => f.name === fileName)
      .sort((a: { id: number }, b: { id: number }) => b.id - a.id);

    if (matches.length > 0) {
      console.log(`📎 Found existing: ${fileName} (ID: ${matches[0].id})`);
      return matches[0].id;
    }
    return null;
  } catch {
    return null;
  }
}

async function uploadImage(imagePath: string): Promise<number | null> {
  const fileName = path.basename(imagePath);

  // Check cache first
  if (imageCache[imagePath]) {
    return imageCache[imagePath];
  }

  // Check if image already exists in Strapi
  const existingId = await findExistingImage(fileName);
  if (existingId) {
    imageCache[imagePath] = existingId;
    return existingId;
  }

  // Upload new image
  const fullPath = path.join(process.cwd(), "public", imagePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${imagePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const mimeType = getMimeType(fullPath);

  const formData = new FormData();
  const blob = new Blob([fileBuffer], {
    type: mimeType,
  }) as unknown as globalThis.Blob;
  formData.append("files", blob, fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
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
      method: "POST",
      body: JSON.stringify({ data }),
    });
    console.log(
      `✅ Created ${contentType}: ${data.title || data.name || "entry"}`,
    );
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to create ${contentType}:`, error);
    return null;
  }
}

async function updateSingleType(
  contentType: string,
  data: Record<string, unknown>,
  locale: string = "en",
) {
  try {
    const url =
      locale === "en" ? contentType : `${contentType}?locale=${locale}`;
    const result = await apiRequest(url, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });
    console.log(`✅ Updated ${contentType} (${locale})`);
    return result.data;
  } catch (error) {
    console.error(`❌ Failed to update ${contentType} (${locale}):`, error);
    return null;
  }
}

async function createLocalization(
  contentType: string,
  documentId: string,
  locale: string,
  data: Record<string, unknown>,
) {
  try {
    // Strapi v5: Use PUT with locale parameter to create/update localized version
    const result = await apiRequest(
      `${contentType}/${documentId}?locale=${locale}`,
      {
        method: "PUT",
        body: JSON.stringify({ data }),
      },
    );
    console.log(`✅ Created ${locale} localization for ${contentType}`);
    return result.data;
  } catch (error) {
    console.error(
      `❌ Failed to create ${locale} localization for ${contentType}:`,
      error,
    );
    return null;
  }
}

// ============================================================================
// Seed Data
// ============================================================================

const brandLogos = [
  { name: "Lenskart", logo: "/images/brands/brand-01.png", order: 1 },
  { name: "L'Officiel", logo: "/images/brands/brand-02.png", order: 2 },
  { name: "Vinamilk", logo: "/images/brands/brand-03.png", order: 3 },
  { name: "Sony", logo: "/images/brands/brand-04.png", order: 4 },
  { name: "VinFast", logo: "/images/brands/brand-05.png", order: 5 },
  { name: "Miss Cosmo", logo: "/images/brands/brand-06.png", order: 6 },
  { name: "Harper's Bazaar", logo: "/images/brands/brand-07.png", order: 7 },
  { name: "Highlands Coffee", logo: "/images/brands/brand-08.png", order: 8 },
  {
    name: "Maybelline New York",
    logo: "/images/brands/brand-09.png",
    order: 9,
  },
];

const studioRooms = [
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
    order: 6,
  },
];

const equipmentItems = [
  {
    name: "Godox Light",
    name_vi: "Đèn Godox",
    spec: "QS 800 | QS 1200",
    image: "/images/equipment/godox-light.jpg",
    order: 1,
  },
  {
    name: "2x Softbox",
    name_vi: "2x Softbox",
    spec: "80X120CM",
    image: "/images/equipment/softbox-1.jpg",
    order: 2,
  },
  {
    name: "2x Softbox",
    name_vi: "2x Softbox",
    spec: "30X160CM",
    image: "/images/equipment/softbox-2.jpg",
    order: 3,
  },
  {
    name: "1x Parabolic",
    name_vi: "1x Parabolic",
    spec: "120CM",
    image: "/images/equipment/parabolic.jpg",
    order: 4,
  },
  {
    name: "1x Softbox OCTA",
    name_vi: "1x Softbox OCTA",
    spec: "110CM",
    image: "/images/equipment/softbox-octa.jpg",
    order: 5,
  },
  {
    name: "1x Softbox",
    name_vi: "1x Softbox",
    spec: "110CM",
    image: "/images/equipment/softbox-3.jpg",
    order: 6,
  },
  {
    name: "1x Beauty Dish",
    name_vi: "1x Beauty Dish",
    spec: "60CM",
    image: "/images/equipment/beauty-dish.jpg",
    order: 7,
  },
  {
    name: "1x Gobo",
    name_vi: "1x Gobo",
    spec: "EF-ZF3",
    image: "/images/equipment/gobo.jpg",
    order: 8,
  },
];

const faqItems = [
  {
    question: "What is the minimum rental time?",
    question_vi: "Thời gian thuê tối thiểu là bao lâu?",
    answer: "The minimum rental time is 2 hours for any of our studio spaces.",
    answer_vi:
      "Thời gian thuê tối thiểu là 2 giờ cho bất kỳ không gian studio nào của chúng tôi.",
    category: "studio-rental",
    order: 1,
  },
  {
    question: "Can I bring my own equipment?",
    question_vi: "Tôi có thể mang thiết bị của mình không?",
    answer:
      "Yes, you are welcome to bring your own equipment. We also provide professional lighting and equipment for rent.",
    answer_vi:
      "Có, bạn được hoan nghênh mang thiết bị của riêng mình. Chúng tôi cũng cung cấp thiết bị chiếu sáng và thiết bị chuyên nghiệp cho thuê.",
    category: "studio-rental",
    order: 2,
  },
  {
    question: "Is there parking available?",
    question_vi: "Có chỗ đậu xe không?",
    answer:
      "Yes, we have free parking available for all clients during their rental period.",
    answer_vi:
      "Có, chúng tôi có chỗ đậu xe miễn phí cho tất cả khách hàng trong thời gian thuê.",
    category: "studio-rental",
    order: 3,
  },
  {
    question: "Can I extend my booking?",
    question_vi: "Tôi có thể gia hạn đặt chỗ không?",
    answer:
      "Extensions are subject to availability. Please check with our team at least 30 minutes before your session ends.",
    answer_vi:
      "Việc gia hạn tùy thuộc vào tình trạng còn trống. Vui lòng liên hệ với đội ngũ của chúng tôi ít nhất 30 phút trước khi phiên của bạn kết thúc.",
    category: "studio-rental",
    order: 4,
  },
];

const portfolioItems = [
  // Creative page (8 items)
  {
    title: "FRESSI KV",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-fressi.jpg",
    size: "large",
    page: "creative",
    order: 1,
  },
  {
    title: "MIRINDA",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-mirinda.jpg",
    size: "large",
    page: "creative",
    order: 2,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-denvau-1.jpg",
    size: "short",
    page: "creative",
    order: 3,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-denvau-2.jpg",
    size: "tall",
    page: "creative",
    order: 4,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-denvau-3.jpg",
    size: "tall",
    page: "creative",
    order: 5,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-denvau-4.jpg",
    size: "tall",
    page: "creative",
    order: 6,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-denvau-5.jpg",
    size: "short",
    page: "creative",
    order: 7,
  },
  {
    title: "YAMAHA SOCIAL LAYOUT",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/creative/portfolio-yamaha.jpg",
    size: "short",
    page: "creative",
    order: 8,
  },
  // Set Design page (8 items)
  {
    title: "FRESSI KV",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/campaign-fressi.jpg",
    size: "large",
    page: "set-design",
    order: 1,
  },
  {
    title: "Mirinda",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/campaign-mirinda.jpg",
    size: "large",
    page: "set-design",
    order: 2,
  },
  {
    title: "MV Diễn Viên Tồi - Đen Vâu",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/portfolio-den-vau-1.jpg",
    size: "short",
    page: "set-design",
    order: 3,
  },
  {
    title: "MV Diễn Viên Tồi - Đen Vâu",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/portfolio-den-vau-2.jpg",
    size: "tall",
    page: "set-design",
    order: 4,
  },
  {
    title: "MV Diễn Viên Tồi - Đen Vâu",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/portfolio-den-vau-3.jpg",
    size: "tall",
    page: "set-design",
    order: 5,
  },
  {
    title: "MV Diễn Viên Tồi - Đen Vâu",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/portfolio-den-vau-4.jpg",
    size: "tall",
    page: "set-design",
    order: 6,
  },
  {
    title: "MV Diễn Viên Tồi - Đen Vâu",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/portfolio-den-vau-5.jpg",
    size: "short",
    page: "set-design",
    order: 7,
  },
  {
    title: "YAMAHA SOCIAL LAYOUT",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/set-design/portfolio-yamaha.jpg",
    size: "short",
    page: "set-design",
    order: 8,
  },
  // Decor page (8 items)
  {
    title: "FRESSI KV",
    category: "Fashion Stores",
    category_vi: "Cửa hàng Thời trang",
    image: "/images/decoration/portfolio-fressi.jpg",
    size: "large",
    page: "decor",
    order: 1,
  },
  {
    title: "MIRINDA",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-mirinda.jpg",
    size: "large",
    page: "decor",
    order: 2,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-denvau-1.jpg",
    size: "short",
    page: "decor",
    order: 3,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-denvau-2.jpg",
    size: "tall",
    page: "decor",
    order: 4,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-denvau-3.jpg",
    size: "tall",
    page: "decor",
    order: 5,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-denvau-4.jpg",
    size: "tall",
    page: "decor",
    order: 6,
  },
  {
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-denvau-5.jpg",
    size: "short",
    page: "decor",
    order: 7,
  },
  {
    title: "YAMAHA SOCIAL LAYOUT",
    category: "Campaign",
    category_vi: "Chiến dịch",
    image: "/images/decoration/portfolio-yamaha.jpg",
    size: "short",
    page: "decor",
    order: 8,
  },
];

const testimonialItems = [
  {
    brand_name: "L'OFFICIEL",
    brand_logo: "/images/brands/brand-01.png",
    quote_en:
      "It's rare to find a studio where creative direction, production, and hospitality all come together. Saint 6 delivered on every front. Our client was blown away.",
    quote_vi:
      "Hiếm có studio nào mà chỉ đạo sáng tạo, sản xuất và dịch vụ đều hoàn hảo. Saint 6 đã làm được tất cả. Khách hàng của chúng tôi vô cùng ấn tượng.",
    author_name: "Aaron Tan",
    author_title_en: "Creative Director, Elle Vietnam",
    author_title_vi: "Giám đốc Sáng tạo, Elle Vietnam",
    order: 1,
  },
  {
    brand_name: "Fressi",
    brand_logo: "/images/brands/brand-02.png",
    quote_en:
      "Saint 6's attention to detail and creative vision transformed our campaign into something truly memorable. The team understood our brand from day one.",
    quote_vi:
      "Sự chú ý đến chi tiết và tầm nhìn sáng tạo của Saint 6 đã biến chiến dịch của chúng tôi thành điều thực sự đáng nhớ. Đội ngũ hiểu thương hiệu của chúng tôi ngay từ ngày đầu.",
    author_name: "Nguyen Thi Mai",
    author_title_en: "Marketing Director, Fressi Vietnam",
    author_title_vi: "Giám đốc Marketing, Fressi Vietnam",
    order: 2,
  },
  {
    brand_name: "Vinamilk",
    brand_logo: "/images/brands/brand-03.png",
    quote_en:
      "Working with Saint 6 was seamless. Their production quality and creative approach exceeded our expectations for the product launch.",
    quote_vi:
      "Làm việc với Saint 6 rất suôn sẻ. Chất lượng sản xuất và cách tiếp cận sáng tạo của họ vượt quá mong đợi của chúng tôi cho buổi ra mắt sản phẩm.",
    author_name: "Tran Van Duc",
    author_title_en: "Brand Manager, Vinamilk",
    author_title_vi: "Quản lý Thương hiệu, Vinamilk",
    order: 3,
  },
  {
    brand_name: "Sony",
    brand_logo: "/images/brands/brand-04.png",
    quote_en:
      "The team's expertise in both creative direction and technical execution made our collaboration incredibly smooth and successful.",
    quote_vi:
      "Chuyên môn của đội ngũ trong cả chỉ đạo sáng tạo và thực hiện kỹ thuật đã giúp sự hợp tác của chúng tôi diễn ra suôn sẻ và thành công.",
    author_name: "Le Hoang Nam",
    author_title_en: "Creative Lead, Sony Vietnam",
    author_title_vi: "Trưởng nhóm Sáng tạo, Sony Vietnam",
    order: 4,
  },
];

// Service Items for all pages (services & workflow sections)
const serviceItems = [
  // Creative page - services
  {
    title: "Brand & Advertising Campaigns",
    title_vi: "Chiến Dịch Thương Hiệu & Quảng Cáo",
    description:
      "We produce fashion, lifestyle, editorial, social media, and influencer campaigns that bring brands to life with fresh creative energy.",
    description_vi:
      "Chúng tôi sản xuất các chiến dịch thời trang, phong cách sống, biên tập, mạng xã hội và influencer mang đến sức sống mới cho thương hiệu.",
    page: "creative",
    section: "services",
    order: 1,
  },
  {
    title: "Product & Packaging Shoots",
    title_vi: "Chụp Sản Phẩm & Bao Bì",
    description:
      "From product labels and e-commerce images to packshots and still life, we create polished visuals that elevate packaging, catalogs, and online stores.",
    description_vi:
      "Từ nhãn sản phẩm và hình ảnh thương mại điện tử đến packshot và tĩnh vật, chúng tôi tạo ra hình ảnh chất lượng cho bao bì, catalog và cửa hàng trực tuyến.",
    page: "creative",
    section: "services",
    order: 2,
  },
  // Creative page - workflow
  {
    title: "Creative Direction",
    title_vi: "Định Hướng Sáng Tạo",
    description:
      "We study your brief and develop creative directions based on your brand, audience, and goals.",
    description_vi:
      "Chúng tôi nghiên cứu brief và phát triển định hướng sáng tạo dựa trên thương hiệu, đối tượng và mục tiêu của bạn.",
    counter: "01.",
    page: "creative",
    section: "workflow",
    order: 1,
  },
  {
    title: "Storyboard Development",
    title_vi: "Phát Triển Storyboard",
    description:
      "Our team creates detailed storyboards and shot lists to visualize the final output.",
    description_vi:
      "Đội ngũ của chúng tôi tạo storyboard chi tiết và danh sách cảnh quay để hình dung sản phẩm cuối cùng.",
    counter: "02.",
    page: "creative",
    section: "workflow",
    order: 2,
  },
  {
    title: "Pre-production & Sourcing",
    title_vi: "Tiền Sản Xuất & Chuẩn Bị",
    description:
      "We coordinate talent, locations, props, and equipment to ensure smooth execution.",
    description_vi:
      "Chúng tôi phối hợp nhân sự, địa điểm, đạo cụ và thiết bị để đảm bảo thực hiện suôn sẻ.",
    counter: "03.",
    page: "creative",
    section: "workflow",
    order: 3,
  },
  {
    title: "Shoot / Production",
    title_vi: "Chụp / Sản Xuất",
    description:
      "Our experienced crew captures your vision with precision and creative flair.",
    description_vi:
      "Đội ngũ giàu kinh nghiệm của chúng tôi ghi lại tầm nhìn của bạn với độ chính xác và phong cách sáng tạo.",
    counter: "04.",
    page: "creative",
    section: "workflow",
    order: 4,
  },
  {
    title: "Post-production",
    title_vi: "Hậu Kỳ",
    description:
      "Professional editing, color grading, and retouching bring the final deliverables to life.",
    description_vi:
      "Chỉnh sửa chuyên nghiệp, chỉnh màu và retouch mang sản phẩm cuối cùng thành hiện thực.",
    counter: "05.",
    page: "creative",
    section: "workflow",
    order: 5,
  },
  {
    title: "Final Delivery",
    title_vi: "Bàn Giao",
    description:
      "We deliver polished assets ready for print, digital, and social media deployment.",
    description_vi:
      "Chúng tôi bàn giao sản phẩm hoàn chỉnh sẵn sàng cho in ấn, kỹ thuật số và mạng xã hội.",
    counter: "06.",
    page: "creative",
    section: "workflow",
    order: 6,
  },

  // Production page - services
  {
    title: "Campaign & Editorial Production",
    title_vi: "Sản Xuất Chiến Dịch & Editorial",
    description:
      "We curate bespoke campaigns and editorials that blend artistry, narrative, and timeless sophistication — bringing each brand story to life with cinematic allure.",
    description_vi:
      "Chúng tôi tạo ra các chiến dịch và editorial riêng biệt kết hợp nghệ thuật, câu chuyện và sự tinh tế vượt thời gian — mang từng câu chuyện thương hiệu sống động với sức hút điện ảnh.",
    page: "production",
    section: "services",
    order: 1,
  },
  {
    title: "Photography & Film Production",
    title_vi: "Sản Xuất Nhiếp Ảnh & Phim",
    description:
      "From concept to final cut, we deliver high-impact visuals through expert direction, seamless coordination, and creative storytelling.",
    description_vi:
      "Từ concept đến bản cắt cuối, chúng tôi cung cấp hình ảnh có tác động cao thông qua chỉ đạo chuyên nghiệp, phối hợp liền mạch và kể chuyện sáng tạo.",
    page: "production",
    section: "services",
    order: 2,
  },
  {
    title: "Lighting & Equipment Rental",
    title_vi: "Cho Thuê Ánh Sáng & Thiết Bị",
    description:
      "Premium lighting and state-of-the-art equipment designed to elevate every production with precision, balance, and creative control.",
    description_vi:
      "Ánh sáng cao cấp và thiết bị hiện đại được thiết kế để nâng tầm mọi sản xuất với độ chính xác, cân bằng và kiểm soát sáng tạo.",
    page: "production",
    section: "services",
    order: 3,
  },
  {
    title: "Make-up & Hair Stylist",
    title_vi: "Trang Điểm & Làm Tóc",
    description:
      "Professional beauty services that transform talent and enhance visual storytelling with meticulous attention to detail.",
    description_vi:
      "Dịch vụ làm đẹp chuyên nghiệp biến đổi nhân sự và nâng cao kể chuyện hình ảnh với sự chú ý tỉ mỉ đến từng chi tiết.",
    page: "production",
    section: "services",
    order: 4,
  },
  {
    title: "Location Scouting & Permits",
    title_vi: "Khảo Sát Địa Điểm & Giấy Phép",
    description:
      "We source the perfect locations and handle all permit logistics, ensuring smooth operations from pre-production to wrap.",
    description_vi:
      "Chúng tôi tìm kiếm địa điểm hoàn hảo và xử lý tất cả thủ tục giấy phép, đảm bảo hoạt động suôn sẻ từ tiền sản xuất đến kết thúc.",
    page: "production",
    section: "services",
    order: 5,
  },
  {
    title: "Post-production Coordination",
    title_vi: "Điều Phối Hậu Kỳ",
    description:
      "End-to-end post-production management, from editing and color grading to final delivery across all formats.",
    description_vi:
      "Quản lý hậu kỳ toàn diện, từ chỉnh sửa và chỉnh màu đến bàn giao cuối cùng trên tất cả các định dạng.",
    page: "production",
    section: "services",
    order: 6,
  },
  // Production page - workflow
  {
    title: "Pre-Production",
    title_vi: "Tiền Sản Xuất",
    description: "Concept, scheduling, and creative",
    description_vi: "Concept, lịch trình và sáng tạo",
    counter: "01.",
    page: "production",
    section: "workflow",
    order: 1,
  },
  {
    title: "Set-Up",
    title_vi: "Chuẩn Bị",
    description: "Lighting, camera, art direction",
    description_vi: "Ánh sáng, máy quay, chỉ đạo nghệ thuật",
    counter: "02.",
    page: "production",
    section: "workflow",
    order: 2,
  },
  {
    title: "Shoot Day",
    title_vi: "Ngày Quay",
    description: "Execution and real-time adjustments",
    description_vi: "Thực hiện và điều chỉnh thời gian thực",
    counter: "03.",
    page: "production",
    section: "workflow",
    order: 3,
  },
  {
    title: "Wrap & Delivery",
    title_vi: "Kết Thúc & Bàn Giao",
    description: "Editing, review, and delivery",
    description_vi: "Chỉnh sửa, đánh giá và bàn giao",
    counter: "04.",
    page: "production",
    section: "workflow",
    order: 4,
  },

  // Set Design page - workflow
  {
    title: "Brief & Concept Alignment",
    title_vi: "Hiểu Brief & Định Hướng Concept",
    description:
      "We start by understanding your creative direction, brand language, and spatial needs.",
    description_vi:
      "Chúng tôi bắt đầu bằng việc hiểu định hướng sáng tạo, ngôn ngữ thương hiệu và nhu cầu không gian của bạn.",
    counter: "01.",
    page: "set-design",
    section: "workflow",
    order: 1,
  },
  {
    title: "2D Layout & 3D Render",
    title_vi: "Bản Vẽ 2D & Render 3D",
    description:
      "We create technical layouts and 3D visuals that bring the proposed set design to life — before anything is built.",
    description_vi:
      "Chúng tôi tạo bản vẽ kỹ thuật và hình ảnh 3D mang thiết kế bối cảnh đề xuất thành hiện thực — trước khi bất cứ thứ gì được xây dựng.",
    counter: "02.",
    page: "set-design",
    section: "workflow",
    order: 2,
  },
  {
    title: "Presentation & Feedback Loop",
    title_vi: "Trình Bày & Phản Hồi",
    description:
      "We present the design and collaborate closely with your team to refine it until it's approved.",
    description_vi:
      "Chúng tôi trình bày thiết kế và hợp tác chặt chẽ với đội ngũ của bạn để hoàn thiện cho đến khi được phê duyệt.",
    counter: "03.",
    page: "set-design",
    section: "workflow",
    order: 3,
  },
  {
    title: "Set Construction & Sourcing",
    title_vi: "Xây Dựng & Chuẩn Bị Bối Cảnh",
    description:
      "We build the set and source all backdrops, structural elements, props, and textures to match the approved concept.",
    description_vi:
      "Chúng tôi xây dựng bối cảnh và chuẩn bị tất cả phông nền, yếu tố cấu trúc, đạo cụ và kết cấu phù hợp với concept đã duyệt.",
    counter: "04.",
    page: "set-design",
    section: "workflow",
    order: 4,
  },
  {
    title: "Setup & Shoot Support",
    title_vi: "Chuẩn Bị & Hỗ Trợ Quay",
    description:
      "We handle set assembly, stay present during the shoot to make real-time adjustments, and ensure everything works on camera.",
    description_vi:
      "Chúng tôi xử lý lắp đặt bối cảnh, có mặt trong suốt buổi quay để điều chỉnh thời gian thực và đảm bảo mọi thứ hoạt động trên camera.",
    counter: "05.",
    page: "set-design",
    section: "workflow",
    order: 5,
  },
  {
    title: "Set Maintenance & Tear-Down",
    title_vi: "Bảo Trì & Tháo Dỡ Bối Cảnh",
    description:
      "Once the shoot wraps, we handle cleanup and dismantle the set efficiently and professionally.",
    description_vi:
      "Khi buổi quay kết thúc, chúng tôi xử lý dọn dẹp và tháo dỡ bối cảnh một cách hiệu quả và chuyên nghiệp.",
    counter: "06.",
    page: "set-design",
    section: "workflow",
    order: 6,
  },

  // Event Planning page - services
  {
    title: "Product & Brand Launches",
    title_vi: "Ra Mắt Sản Phẩm & Thương Hiệu",
    description:
      "We craft launch experiences that captivate audiences and elevate your brand story with precision and flair.",
    description_vi:
      "Chúng tôi tạo ra trải nghiệm ra mắt thu hút khán giả và nâng tầm câu chuyện thương hiệu với độ chính xác và phong cách.",
    page: "event-planning",
    section: "services",
    order: 1,
  },
  {
    title: "Fashion Shows",
    title_vi: "Trình Diễn Thời Trang",
    description:
      "From runway to backstage, we design and execute fashion events that celebrate artistry and style.",
    description_vi:
      "Từ sàn diễn đến hậu trường, chúng tôi thiết kế và thực hiện các sự kiện thời trang tôn vinh nghệ thuật và phong cách.",
    page: "event-planning",
    section: "services",
    order: 2,
  },
  {
    title: "Private Dinners",
    title_vi: "Tiệc Riêng Tư",
    description:
      "Intimate gatherings curated with exquisite detail, creating memorable moments for your guests.",
    description_vi:
      "Các buổi họp mặt thân mật được tổ chức với chi tiết tinh tế, tạo ra những khoảnh khắc đáng nhớ cho khách của bạn.",
    page: "event-planning",
    section: "services",
    order: 3,
  },
  {
    title: "Art & Lifestyle Pop-Ups",
    title_vi: "Pop-Up Nghệ Thuật & Phong Cách Sống",
    description:
      "Immersive pop-up experiences that blend art, culture, and lifestyle into unforgettable activations.",
    description_vi:
      "Trải nghiệm pop-up đắm chìm kết hợp nghệ thuật, văn hóa và phong cách sống thành các hoạt động khó quên.",
    page: "event-planning",
    section: "services",
    order: 4,
  },
  {
    title: "Press & Influencer Events",
    title_vi: "Sự Kiện Báo Chí & Influencer",
    description:
      "Strategic media events designed to generate buzz and build lasting connections with key voices.",
    description_vi:
      "Sự kiện truyền thông chiến lược được thiết kế để tạo tiếng vang và xây dựng kết nối lâu dài với các tiếng nói quan trọng.",
    page: "event-planning",
    section: "services",
    order: 5,
  },
  {
    title: "Corporate Celebrations",
    title_vi: "Lễ Kỷ Niệm Doanh Nghiệp",
    description:
      "Professional yet refined corporate events that reflect your company's values and vision.",
    description_vi:
      "Sự kiện doanh nghiệp chuyên nghiệp nhưng tinh tế phản ánh giá trị và tầm nhìn của công ty bạn.",
    page: "event-planning",
    section: "services",
    order: 6,
  },
  // Event Planning page - workflow
  {
    title: "Full Creative & Design Direction",
    title_vi: "Chỉ Đạo Sáng Tạo & Thiết Kế Toàn Diện",
    description:
      "From concept to creation, Saint 6 shapes a cohesive visual story that embodies your brand's vision.",
    description_vi:
      "Từ concept đến sáng tạo, Saint 6 định hình câu chuyện hình ảnh gắn kết thể hiện tầm nhìn thương hiệu của bạn.",
    counter: "01.",
    page: "event-planning",
    section: "workflow",
    order: 1,
  },
  {
    title: "Guest Experience & Flow Planning",
    title_vi: "Trải Nghiệm Khách & Lập Kế Hoạch Luồng",
    description:
      "Every moment is designed with intention — seamless, elegant, and unforgettable.",
    description_vi:
      "Mỗi khoảnh khắc được thiết kế có chủ đích — liền mạch, thanh lịch và khó quên.",
    counter: "02.",
    page: "event-planning",
    section: "workflow",
    order: 2,
  },
  {
    title: "On-site Management & Run-of-Show Execution",
    title_vi: "Quản Lý Tại Chỗ & Thực Hiện Chương Trình",
    description:
      "Flawless coordination ensures your event unfolds with effortless precision.",
    description_vi:
      "Phối hợp hoàn hảo đảm bảo sự kiện của bạn diễn ra với độ chính xác dễ dàng.",
    counter: "03.",
    page: "event-planning",
    section: "workflow",
    order: 3,
  },
  {
    title: "Venue Styling & Set Design",
    title_vi: "Trang Trí Địa Điểm & Thiết Kế Bối Cảnh",
    description:
      "We craft immersive environments that capture emotion, detail, and distinctive character.",
    description_vi:
      "Chúng tôi tạo ra môi trường đắm chìm nắm bắt cảm xúc, chi tiết và tính cách đặc biệt.",
    counter: "04.",
    page: "event-planning",
    section: "workflow",
    order: 4,
  },
  {
    title: "Catering & Entertainment Coordination",
    title_vi: "Điều Phối Ẩm Thực & Giải Trí",
    description:
      "We curate dining and performances that enrich the mood and elevate the experience.",
    description_vi:
      "Chúng tôi tuyển chọn ẩm thực và biểu diễn làm phong phú không khí và nâng tầm trải nghiệm.",
    counter: "05.",
    page: "event-planning",
    section: "workflow",
    order: 5,
  },

  // Decor page - workflow
  {
    title: "Brief Overview",
    title_vi: "Tổng Quan Brief",
    description:
      "We study the brief and develop multiple creative directions based on your brand, audience, and goals.",
    description_vi:
      "Chúng tôi nghiên cứu brief và phát triển nhiều hướng sáng tạo dựa trên thương hiệu, đối tượng và mục tiêu của bạn.",
    counter: "01.",
    page: "decor",
    section: "workflow",
    order: 1,
  },
  {
    title: "2D Ideation",
    title_vi: "Ý Tưởng 2D",
    description:
      "Our design team creates detailed mood boards and conceptual layouts to visualize the space transformation.",
    description_vi:
      "Đội ngũ thiết kế của chúng tôi tạo mood board chi tiết và bố cục khái niệm để hình dung sự chuyển đổi không gian.",
    counter: "02.",
    page: "decor",
    section: "workflow",
    order: 2,
  },
  {
    title: "3D Render",
    title_vi: "Render 3D",
    description:
      "We produce photorealistic 3D renders so you can experience the space before construction begins.",
    description_vi:
      "Chúng tôi tạo ra render 3D thực tế để bạn có thể trải nghiệm không gian trước khi xây dựng bắt đầu.",
    counter: "03.",
    page: "decor",
    section: "workflow",
    order: 3,
  },
  {
    title: "Pre-Production",
    title_vi: "Tiền Sản Xuất",
    description:
      "We coordinate materials, vendors, and timelines to ensure smooth execution of your project.",
    description_vi:
      "Chúng tôi phối hợp vật liệu, nhà cung cấp và lịch trình để đảm bảo thực hiện dự án suôn sẻ.",
    counter: "04.",
    page: "decor",
    section: "workflow",
    order: 4,
  },
  {
    title: "Final Installation",
    title_vi: "Lắp Đặt Hoàn Thiện",
    description:
      "Our team manages the complete installation, bringing every detail to life with precision.",
    description_vi:
      "Đội ngũ của chúng tôi quản lý việc lắp đặt hoàn chỉnh, đưa từng chi tiết vào cuộc sống với độ chính xác.",
    counter: "05.",
    page: "decor",
    section: "workflow",
    order: 5,
  },
];

const keyProjects = [
  {
    title: "LSoul Casting call for Shanghai Fashion Week 2025",
    title_vi: "LSoul Casting call cho Tuần lễ Thời trang Thượng Hải 2025",
    slug: "lsoul-shanghai-fashion-week-2025",
    project_number: "01/02",
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
    project_number: "02/02",
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

const galleryImages = Array.from({ length: 15 }, (_, i) => ({
  image: `/images/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Gallery image ${i + 1}`,
}));

// Vietnamese translations are now inline in each seed function

// ============================================================================
// Seed Functions - Collections
// ============================================================================

async function seedBrandLogos() {
  console.log("\n📦 Seeding Brand Logos...");
  const createdIds: number[] = [];
  for (const logo of brandLogos) {
    const imageId = await uploadImage(logo.logo);
    if (imageId) {
      const entry = await createEntry("brand-logos", {
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
  console.log("\n📦 Seeding Studio Rooms...");
  const createdIds: number[] = [];
  for (const room of studioRooms) {
    const imageId = await uploadImage(room.image);
    // Create English version (exclude _vi fields)
    const { title_vi, description_vi, ...roomData } = room;
    const entry = await createEntry("studio-rooms", {
      ...roomData,
      image: imageId,
    });
    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("studio-rooms", entry.documentId, "vi", {
        title: title_vi,
        description: description_vi,
      });
    }
  }
  return createdIds;
}

async function seedEquipmentItems() {
  console.log("\n📦 Seeding Equipment Items...");
  const createdIds: number[] = [];
  for (const item of equipmentItems) {
    const imageId = await uploadImage(item.image);
    // Create English version (exclude _vi fields)
    const { name_vi, ...itemData } = item;
    const entry = await createEntry("equipment-items", {
      ...itemData,
      image: imageId,
    });
    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("equipment-items", entry.documentId, "vi", {
        name: name_vi,
      });
    }
  }
  return createdIds;
}

async function seedFaqItems() {
  console.log("\n📦 Seeding FAQ Items...");
  const createdIds: number[] = [];
  for (const item of faqItems) {
    // Create English version (exclude _vi fields)
    const { question_vi, answer_vi, ...itemData } = item;
    const entry = await createEntry("faq-items", itemData);
    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("faq-items", entry.documentId, "vi", {
        question: question_vi,
        answer: answer_vi,
      });
    }
  }
  return createdIds;
}

async function seedPortfolioItems() {
  console.log("\n📦 Seeding Portfolio Items...");
  const createdIds: number[] = [];
  for (const item of portfolioItems) {
    const imageId = await uploadImage(item.image);
    // Create English version (exclude _vi fields)
    const { category_vi, ...itemData } = item;
    const entry = await createEntry("portfolio-items", {
      ...itemData,
      image: imageId,
    });
    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization (title stays the same as it's brand names)
      await createLocalization("portfolio-items", entry.documentId, "vi", {
        title: item.title,
        category: category_vi,
      });
    }
  }
  return createdIds;
}

async function seedKeyProjects() {
  console.log("\n📦 Seeding Key Projects...");
  const createdIds: number[] = [];
  for (const project of keyProjects) {
    const mainImageId = await uploadImage(project.main_image);
    const galleryImageComponents = [];
    for (const img of project.gallery_images) {
      const id = await uploadImage(img.image);
      if (id) galleryImageComponents.push({ image: id, alt: img.alt });
    }

    // Extract Vietnamese fields
    const {
      title_vi,
      info_text_vi,
      expertise_vi,
      team_vi,
      testimonial_vi,
      ...projectData
    } = project;

    // Create English version
    const entry = await createEntry("key-projects", {
      title: projectData.title,
      slug: projectData.slug,
      project_number: projectData.project_number,
      client: projectData.client,
      info_text: projectData.info_text,
      expertise: projectData.expertise,
      team: projectData.team,
      testimonial: projectData.testimonial,
      main_image: mainImageId,
      gallery_images: galleryImageComponents,
      is_featured: projectData.is_featured,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("key-projects", entry.documentId, "vi", {
        title: title_vi,
        info_text: info_text_vi,
        expertise: expertise_vi,
        team: team_vi,
        testimonial: testimonial_vi,
      });
    }
  }
  return createdIds;
}

async function seedTestimonialItems() {
  console.log("\n📦 Seeding Testimonial Items...");
  const createdIds: number[] = [];
  for (const item of testimonialItems) {
    const logoId = await uploadImage(item.brand_logo);
    // Create English version
    const entry = await createEntry("testimonial-items", {
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
      await createLocalization("testimonial-items", entry.documentId, "vi", {
        quote: item.quote_vi,
        author_title: item.author_title_vi,
      });
    }
  }
  return createdIds;
}

async function seedServiceItems() {
  console.log("\n📦 Seeding Service Items...");
  const createdEntries: { id: number; page: string; section: string }[] = [];
  for (const item of serviceItems) {
    const entry = await createEntry("service-items", {
      title: item.title,
      description: item.description,
      counter: item.counter,
      page: item.page,
      section: item.section,
      order: item.order,
    });
    if (entry) {
      createdEntries.push({
        id: entry.id,
        page: item.page,
        section: item.section,
      });
      // Create Vietnamese localization
      await createLocalization("service-items", entry.documentId, "vi", {
        title: item.title_vi,
        description: item.description_vi,
      });
    }
  }
  return createdEntries;
}

// Helper to get service item IDs by page and section
function getServiceIds(
  serviceEntries: { id: number; page: string; section: string }[],
  page: string,
  section: string,
): number[] {
  return serviceEntries
    .filter((e) => e.page === page && e.section === section)
    .map((e) => e.id);
}

// ============================================================================
// Seed Functions - Pages
// ============================================================================

async function seedHomepage(brandLogoIds: number[], keyProjectIds: number[]) {
  console.log("\n📄 Seeding Homepage...");

  const heroImageId = await uploadImage("/images/hero/hero-background.jpg");
  const spaceImages = await Promise.all([
    uploadImage("/images/space/space-01.png"),
    uploadImage("/images/space/space-02.png"),
    uploadImage("/images/space/space-03.png"),
    uploadImage("/images/space/space-04.png"),
  ]);
  const crewMainImageId = await uploadImage("/images/crew/crew-main.png");
  const crewImage1Id = await uploadImage("/images/crew/crew-01.png");
  const crewImage2Id = await uploadImage("/images/crew/crew-02.png");

  const galleryImageComponents = [];
  for (const img of galleryImages) {
    const imageId = await uploadImage(img.image);
    if (imageId) galleryImageComponents.push({ image: imageId, alt: img.alt });
  }

  // English
  await updateSingleType("homepage", {
    hero: {
      heading:
        "The place where all your concepts and artistic ideas can come true",
      background_image: heroImageId,
      background_alt: "Saint 6 Studio",
    },
    brand_logos: brandLogoIds,
    gallery_images: galleryImageComponents,
    key_projects: keyProjectIds,
    space_section: {
      caption: "WIDE RANGE OF SPACE",
      description:
        "900m² of modular creative space, designed to support everything from fashion editorials to livestreams and events.",
      cta_text: "VIEW STUDIO RENTAL",
      cta_link: "/studio-rental",
      stats: [
        { label: "Total Rooms", value: "6" },
        { label: "Blank Rooms", value: "3" },
        { label: "Concept Room", value: "3" },
        { label: "Ceiling Height", value: "4.5m" },
        { label: "Total Space", value: "900m²" },
      ],
      gallery_images: spaceImages.filter(Boolean),
    },
    crew_area: {
      caption: "CREW AREA",
      heading:
        "And a separate dining area and makeup room for the crew and customers",
      info_label: "INFO",
      info_text:
        "Indulge in a dedicated dining space and a professional makeup room—curated for comfort, privacy, and effortless preparation.",
      main_image: crewMainImageId,
      secondary_image_1: crewImage1Id,
      secondary_image_2: crewImage2Id,
    },
  });

  // Vietnamese
  await updateSingleType(
    "homepage",
    {
      hero: {
        heading:
          "Nơi mọi ý tưởng và khái niệm nghệ thuật của bạn có thể trở thành hiện thực",
        background_image: heroImageId,
        background_alt: "Saint 6 Studio",
      },
      brand_logos: brandLogoIds,
      gallery_images: galleryImageComponents,
      key_projects: keyProjectIds,
      space_section: {
        caption: "KHÔNG GIAN ĐA DẠNG",
        description:
          "900m² không gian sáng tạo linh hoạt, được thiết kế để hỗ trợ mọi thứ từ chụp ảnh thời trang đến livestream và sự kiện.",
        cta_text: "XEM THUÊ STUDIO",
        cta_link: "/studio-rental",
        stats: [
          { label: "Tổng số phòng", value: "6" },
          { label: "Phòng trống", value: "3" },
          { label: "Phòng Concept", value: "3" },
          { label: "Chiều cao trần", value: "4.5m" },
          { label: "Tổng diện tích", value: "900m²" },
        ],
        gallery_images: spaceImages.filter(Boolean),
      },
      crew_area: {
        caption: "KHU VỰC EKIP",
        heading:
          "Và khu vực ăn uống riêng biệt cùng phòng trang điểm cho ekip và khách hàng",
        info_label: "THÔNG TIN",
        info_text:
          "Tận hưởng không gian ăn uống riêng biệt và phòng trang điểm chuyên nghiệp—được thiết kế cho sự thoải mái, riêng tư và chuẩn bị dễ dàng.",
        main_image: crewMainImageId,
        secondary_image_1: crewImage1Id,
        secondary_image_2: crewImage2Id,
      },
    },
    "vi",
  );
}

async function seedStudioRentalPage(
  roomIds: number[],
  equipmentIds: number[],
  faqIds: number[],
) {
  console.log("\n📄 Seeding Studio Rental Page...");

  const heroImageId = await uploadImage(
    "/images/studio-rental/hero-background.jpg",
  );
  const fullRentalBgId = await uploadImage("/images/full-studio-bg.jpg");
  const makeupImageId = await uploadImage("/images/facilities/makeup-room.jpg");
  const loungeImageId = await uploadImage(
    "/images/facilities/dining-lounge.jpg",
  );

  // Separate blank rooms and concept rooms
  const blankRoomIds = roomIds.slice(0, 3);
  const conceptRoomIds = roomIds.slice(3);

  // English
  await updateSingleType("studio-rental-page", {
    hero: {
      heading: "Your creative playground",
      background_image: heroImageId,
      background_alt: "Studio Rental",
    },
    intro: {
      label: "How It Works",
      description:
        "Because your vision deserves more than a space— It needs a stage, a story, and a studio that moves with you.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    stats: {
      total_rooms: 6,
      ceiling_height: "4.5m",
      total_space: "900m²",
      blank_rooms: 3,
      concept_rooms: 3,
    },
    rooms: blankRoomIds,
    concept_rooms: conceptRoomIds,
    full_rental: {
      price: "2,500,000",
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
  await updateSingleType(
    "studio-rental-page",
    {
      hero: {
        heading: "Sân chơi sáng tạo của bạn",
        background_image: heroImageId,
        background_alt: "Studio Rental",
      },
      intro: {
        label: "Cách thức hoạt động",
        description:
          "Vì tầm nhìn của bạn xứng đáng hơn một không gian— Nó cần một sân khấu, một câu chuyện, và một studio đồng hành cùng bạn.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      stats: {
        total_rooms: 6,
        ceiling_height: "4.5m",
        total_space: "900m²",
        blank_rooms: 3,
        concept_rooms: 3,
      },
      rooms: blankRoomIds,
      concept_rooms: conceptRoomIds,
      full_rental: {
        price: "2,500,000",
        background_image: fullRentalBgId,
      },
      facilities: {
        makeup_image: makeupImageId,
        lounge_image: loungeImageId,
      },
      equipment: equipmentIds,
      faqs: faqIds,
    },
    "vi",
  );
}

async function seedCreativePage(
  portfolioIds: number[],
  brandLogoIds: number[],
  testimonialIds: number[],
  serviceEntries: { id: number; page: string; section: string }[],
) {
  console.log("\n📄 Seeding Creative Page...");

  const heroImageId = await uploadImage("/images/creative/hero-background.jpg");

  // Filter portfolio items for creative page
  const creativePortfolioIds = portfolioIds.slice(0, 8); // First 8 are creative

  // Get service item IDs for this page
  const servicesIds = getServiceIds(serviceEntries, "creative", "services");
  const workflowIds = getServiceIds(serviceEntries, "creative", "workflow");

  // English
  await updateSingleType("creative-page", {
    hero: {
      heading: "Creative production for brands, campaigns & products",
      background_image: heroImageId,
      background_alt: "Creative",
    },
    clients: {
      label: "Selected Clients",
      description:
        "We're proud to collaborate with leading brands, agencies, and startups worldwide.",
    },
    client_logos: brandLogoIds,
    services: servicesIds,
    intro: {
      label: "How We Work",
      description:
        "We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: "Featured Work",
      statement:
        "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail.",
    },
    portfolio_items: creativePortfolioIds,
    testimonials: testimonialIds,
  });

  // Vietnamese
  await updateSingleType(
    "creative-page",
    {
      hero: {
        heading: "Sản xuất sáng tạo cho thương hiệu, chiến dịch & sản phẩm",
        background_image: heroImageId,
        background_alt: "Creative",
      },
      clients: {
        label: "Khách Hàng Tiêu Biểu",
        description:
          "Chúng tôi tự hào hợp tác với các thương hiệu, agency và startup hàng đầu trên toàn thế giới.",
      },
      client_logos: brandLogoIds,
      services: servicesIds,
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          "Chúng tôi có thể đảm nhận sản xuất toàn diện hoặc tham gia ở bất kỳ giai đoạn nào — từ phát triển moodboard và concept đến hậu kỳ và giao sản phẩm cuối cùng.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      workflow: workflowIds,
      portfolio_settings: {
        label: "Tác Phẩm Nổi Bật",
        statement:
          "Hình ảnh cao cấp phản ánh tham vọng thương hiệu của bạn — một triển lãm của nghệ thuật và sự chú ý đến chi tiết.",
      },
      portfolio_items: creativePortfolioIds,
      testimonials: testimonialIds,
    },
    "vi",
  );
}

async function seedProductionPage(
  keyProjectIds: number[],
  serviceEntries: { id: number; page: string; section: string }[],
) {
  console.log("\n📄 Seeding Production Page...");

  const heroImageId = await uploadImage(
    "/images/production/hero-background.jpg",
  );

  // Get service item IDs for this page
  const servicesIds = getServiceIds(serviceEntries, "production", "services");
  const workflowIds = getServiceIds(serviceEntries, "production", "workflow");

  // English
  await updateSingleType("production-page", {
    hero: {
      heading: "Full-Scale Production, Seamless Execution.",
      background_image: heroImageId,
      background_alt: "Production",
    },
    intro: {
      label: "Our Service",
      description:
        "From concept to final delivery, we bring your campaign to life through precision planning, creative direction, and technical mastery.",
      cta_text: "Plan Your Production",
      cta_link: "#contact-form",
    },
    services: servicesIds,
    intro_2: {
      label: "The Saint 6 Way of Creation",
      description:
        "We believe in structured creativity — a process that respects your vision while bringing our expertise to every detail.",
    },
    workflow: workflowIds,
    key_projects: keyProjectIds,
  });

  // Vietnamese
  await updateSingleType(
    "production-page",
    {
      hero: {
        heading: "Sản Xuất Toàn Diện, Thực Hiện Liền Mạch.",
        background_image: heroImageId,
        background_alt: "Production",
      },
      intro: {
        label: "Dịch Vụ",
        description:
          "Từ ý tưởng đến sản phẩm cuối cùng, chúng tôi mang chiến dịch của bạn vào cuộc sống thông qua lập kế hoạch chính xác, chỉ đạo sáng tạo và kỹ thuật điêu luyện.",
        cta_text: "Lên Kế Hoạch Sản Xuất",
        cta_link: "#contact-form",
      },
      services: servicesIds,
      intro_2: {
        label: "Phong Cách Sáng Tạo Saint 6",
        description:
          "Chúng tôi tin vào sự sáng tạo có cấu trúc — một quy trình tôn trọng tầm nhìn của bạn đồng thời mang chuyên môn của chúng tôi vào từng chi tiết.",
      },
      workflow: workflowIds,
      key_projects: keyProjectIds,
    },
    "vi",
  );
}

async function seedSetDesignPage(
  portfolioIds: number[],
  testimonialIds: number[],
  serviceEntries: { id: number; page: string; section: string }[],
) {
  console.log("\n📄 Seeding Set Design Page...");

  const heroImageId = await uploadImage(
    "/images/set-design/hero-background.jpg",
  );

  // Filter portfolio items for set-design page
  const setDesignPortfolioIds = portfolioIds.slice(8, 16); // Items 9-16 are set-design

  // Get service item IDs for this page
  const workflowIds = getServiceIds(serviceEntries, "set-design", "workflow");

  // English
  await updateSingleType("set-design-page", {
    hero: {
      heading:
        "From Moodboard to Build — Complete Set Design for Visual Storytelling",
      background_image: heroImageId,
      background_alt: "Set Design",
    },
    intro: {
      label: "How We Work",
      description:
        "We design, construct, and manage physical sets that transform creative direction into production-ready environments.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    workflow: workflowIds,
    portfolio_settings: {
      label: "PORTFOLIO",
      statement:
        "We shape physical spaces that reflect your creative intent — environments that become part of your story",
    },
    portfolio_items: setDesignPortfolioIds,
    testimonials: testimonialIds,
  });

  // Vietnamese
  await updateSingleType(
    "set-design-page",
    {
      hero: {
        heading:
          "Từ Bản Vẽ Ý Tưởng đến Hoàn Thiện — Thiết Kế Set Hoàn Chỉnh cho Câu Chuyện Hình Ảnh",
        background_image: heroImageId,
        background_alt: "Set Design",
      },
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          "Chúng tôi thiết kế, xây dựng và quản lý các set vật lý để biến đổi định hướng sáng tạo thành môi trường sẵn sàng sản xuất.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      workflow: workflowIds,
      portfolio_settings: {
        label: "PORTFOLIO",
        statement:
          "Chúng tôi tạo hình không gian vật lý phản ánh ý định sáng tạo của bạn — môi trường trở thành một phần câu chuyện của bạn",
      },
      portfolio_items: setDesignPortfolioIds,
      testimonials: testimonialIds,
    },
    "vi",
  );
}

async function seedEventPlanningPage(
  keyProjectIds: number[],
  serviceEntries: { id: number; page: string; section: string }[],
) {
  console.log("\n📄 Seeding Event Planning Page...");

  const heroImageId = await uploadImage(
    "/images/event-planning/hero-background.jpg",
  );

  // Get service item IDs for this page
  const servicesIds = getServiceIds(
    serviceEntries,
    "event-planning",
    "services",
  );
  const workflowIds = getServiceIds(
    serviceEntries,
    "event-planning",
    "workflow",
  );

  // English
  await updateSingleType("event-planning-page", {
    hero: {
      heading: "Curated Experiences, Designed to Inspire.",
      background_image: heroImageId,
      background_alt: "Event Planning",
    },
    intro: {
      label: "Every Moment, An Emotion",
      description:
        "Saint 6 approaches every event as a living brand story. Our in-house creative team designs atmospheres where concept, design, and guest experience blend seamlessly.",
      cta_text: "Plan Your Event",
      cta_link: "#contact-form",
    },
    services: servicesIds,
    intro_2: {
      label: "Every Moment, An Emotion",
      description:
        "Beyond venue and décor, Saint 6 delivers artistry in motion — a rare harmony of creative vision, flawless execution, and atmosphere designed to leave a lasting impression.",
    },
    workflow: workflowIds,
    event_projects: keyProjectIds,
  });

  // Vietnamese
  await updateSingleType(
    "event-planning-page",
    {
      hero: {
        heading: "Trải Nghiệm Được Chọn Lọc, Thiết Kế Để Truyền Cảm Hứng.",
        background_image: heroImageId,
        background_alt: "Event Planning",
      },
      intro: {
        label: "Mỗi Khoảnh Khắc, Một Cảm Xúc",
        description:
          "Saint 6 tiếp cận mỗi sự kiện như một câu chuyện thương hiệu sống động. Đội ngũ sáng tạo nội bộ của chúng tôi thiết kế không gian nơi ý tưởng, thiết kế và trải nghiệm khách mời hòa quyện hoàn hảo.",
        cta_text: "Lên Kế Hoạch Sự Kiện",
        cta_link: "#contact-form",
      },
      services: servicesIds,
      intro_2: {
        label: "Mỗi Khoảnh Khắc, Một Cảm Xúc",
        description:
          "Vượt xa địa điểm và trang trí, Saint 6 mang đến nghệ thuật trong chuyển động — sự hòa hợp hiếm có giữa tầm nhìn sáng tạo, thực hiện hoàn hảo và bầu không khí được thiết kế để để lại ấn tượng lâu dài.",
      },
      workflow: workflowIds,
      event_projects: keyProjectIds,
    },
    "vi",
  );
}

async function seedDecorPage(
  portfolioIds: number[],
  serviceEntries: { id: number; page: string; section: string }[],
) {
  console.log("\n📄 Seeding Decor Page...");

  const heroImageId = await uploadImage(
    "/images/decoration/hero-background.jpg",
  );

  // Filter portfolio items for decor page
  const decorPortfolioIds = portfolioIds.slice(16, 24); // Items 17-24 are decor

  // Get service item IDs for this page
  const workflowIds = getServiceIds(serviceEntries, "decor", "workflow");

  // English
  await updateSingleType("decor-page", {
    hero: {
      heading:
        "From flagship stores to private villas — we design and decorate spaces that tell a story.",
      background_image: heroImageId,
      background_alt: "Decoration",
    },
    intro: {
      label: "How We Work",
      description:
        'The name "Decor" feels refined and adaptable, representing Saint 6\'s creative work across fashion stores, restaurants, and personal villas.',
      cta_text: "Plan Your Decoration",
      cta_link: "#contact-form",
    },
    workflow: workflowIds,
    intro_2: {
      label: "every moment, an emotion",
      description:
        "Every project begins with a vision. We bring it to life — detail by detail.",
    },
    portfolio_settings: {
      label: "every moment, an emotion",
      statement:
        "Every project begins with a vision. We bring it to life — detail by detail.",
    },
    portfolio_items: decorPortfolioIds,
  });

  // Vietnamese
  await updateSingleType(
    "decor-page",
    {
      hero: {
        heading:
          "Từ cửa hàng flagship đến biệt thự riêng — chúng tôi thiết kế và trang trí không gian kể câu chuyện.",
        background_image: heroImageId,
        background_alt: "Decoration",
      },
      intro: {
        label: "Cách Chúng Tôi Làm Việc",
        description:
          'Tên gọi "Decor" mang cảm giác tinh tế và linh hoạt, đại diện cho công việc sáng tạo của Saint 6 qua các cửa hàng thời trang, nhà hàng và biệt thự cá nhân.',
        cta_text: "Lên Kế Hoạch Trang Trí",
        cta_link: "#contact-form",
      },
      workflow: workflowIds,
      intro_2: {
        label: "mỗi khoảnh khắc, một cảm xúc",
        description:
          "Mỗi dự án bắt đầu bằng một tầm nhìn. Chúng tôi mang nó vào cuộc sống — từng chi tiết một.",
      },
      portfolio_settings: {
        label: "mỗi khoảnh khắc, một cảm xúc",
        statement:
          "Mỗi dự án bắt đầu bằng một tầm nhìn. Chúng tôi mang nó vào cuộc sống — từng chi tiết một.",
      },
      portfolio_items: decorPortfolioIds,
    },
    "vi",
  );
}

async function seedAboutPage() {
  console.log("\n📄 Seeding About Page...");

  const heroImageId = await uploadImage("/images/about-us/hero-background.jpg");
  const introImageId = await uploadImage("/images/about-us/intro-portrait.jpg");
  const fullWidthImageId = await uploadImage(
    "/images/about-us/full-width-image.jpg",
  );
  const founderImageId = await uploadImage(
    "/images/about-us/founder-portrait.jpg",
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
        "We create work that feels alive, work that holds emotion, atmosphere, and story. For us, it's never \"just decor.\" It's the feeling someone carries home.",
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
    "vi",
  );
}

async function seedContactPage() {
  console.log("\n📄 Seeding Contact Page...");

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
    "vi",
  );
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log("🚀 Starting Strapi CMS Seed...\n");
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
    await seedCreativePage(
      portfolioIds,
      brandLogoIds,
      testimonialIds,
      serviceEntries,
    );
    await seedProductionPage(keyProjectIds, serviceEntries);
    await seedSetDesignPage(portfolioIds, testimonialIds, serviceEntries);
    await seedEventPlanningPage(keyProjectIds, serviceEntries);
    await seedDecorPage(portfolioIds, serviceEntries);
    await seedAboutPage();
    await seedContactPage();

    console.log("\n✅ Seed completed successfully!");
    console.log("\n📊 Summary:");
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
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
