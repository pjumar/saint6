/* Publish the approved, distinct concept-room copy in English and Vietnamese.
 * Run --plan before --apply. The previous field values are saved under .backups.
 * --apply requires the Strapi schema with seo_title and seo_description.
 */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
require("dotenv").config({
  path: process.env.SAINT6_ENV_FILE || path.join(root, ".env.local"),
  quiet: true,
});

const origin =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://strapi.saint6.studio";
if (origin !== "https://strapi.saint6.studio")
  throw new Error("Unexpected Strapi destination");
const token = process.env.STRAPI_API_TOKEN;
if (!token) throw new Error("STRAPI_API_TOKEN is required");
const apply = process.argv.includes("--apply");
const statePath = path.join(root, ".backups/concept-room-seo.json");
const state = fs.existsSync(statePath)
  ? JSON.parse(fs.readFileSync(statePath, "utf8"))
  : { origin, before: {} };
if (state.origin !== origin) throw new Error("Backup destination changed");

const copy = {
  en: [
    {
      order: 4,
      description:
        "The Artisan Creme is a 65 m² Brutalist and Fine Art concept room in cream and concrete grey. High ceilings, a black leather Togo sofa, brick-toned sheer curtains and sculpture set the scene for fashion, editorial, magazine, music video and advertising shoots.",
      seo_title: "Concept Room 1: The Artisan Creme | Saint 6 Studio",
      seo_description:
        "Explore The Artisan Creme, a 65 m² Brutalist concept room at Saint 6 with cream and concrete-grey styling for fashion, editorial, music video and advertising shoots.",
    },
    {
      order: 5,
      description:
        "Vintage Mocha is a 45 m² Retro and Mid-century Modern concept room in warm wood tones. Wood-panelled walls, a black velvet sofa, a vintage TV and warm lighting suit classic concepts, artistic portraits, music videos, podcasts and interviews.",
      seo_title: "Concept Room 2: Vintage Mocha | Saint 6 Studio",
      seo_description:
        "Explore Vintage Mocha, a 45 m² Retro and Mid-century Modern room at Saint 6 with wood panelling, a velvet sofa and warm light for portraits, podcasts and interviews.",
    },
    {
      order: 6,
      description:
        "Classic Rosé is a 45 m² pink concept room inspired by Baroque and Renaissance interiors. Its spiral staircase, crystal chandelier, patterned arches and classical plaster sculpture suit beauty campaigns, feminine lookbooks, bridal shoots and romantic music videos.",
      seo_title: "Concept Room 3: Classic Rosé | Saint 6 Studio",
      seo_description:
        "Explore Classic Rosé, a 45 m² pink Baroque-inspired room at Saint 6 with a spiral staircase and crystal chandelier for beauty, bridal and romantic music video shoots.",
    },
  ],
  vi: [
    {
      order: 4,
      description:
        "The Artisan Creme là phòng concept 65 m² với tông kem và xám bê tông theo phong cách Brutalist & Fine Art. Trần cao, sofa Togo da đen, rèm voan gạch và tác phẩm điêu khắc tạo bối cảnh cho chụp thời trang, editorial, tạp chí, MV và quảng cáo.",
      seo_title: "Phòng Concept 1: The Artisan Creme | Saint 6 Studio",
      seo_description:
        "Khám phá The Artisan Creme, phòng concept 65 m² tông kem và xám bê tông phong cách Brutalist tại Saint 6, phù hợp chụp thời trang, editorial, MV và quảng cáo.",
    },
    {
      order: 5,
      description:
        "Vintage Mocha là phòng concept 45 m² mang sắc nâu gỗ ấm theo phong cách Retro & Mid-century Modern. Tường ốp gỗ, sofa nhung đen, TV cổ và ánh đèn vàng phù hợp concept cổ điển, chân dung nghệ thuật, MV, podcast và phỏng vấn.",
      seo_title: "Phòng Concept 2: Vintage Mocha | Saint 6 Studio",
      seo_description:
        "Khám phá Vintage Mocha, phòng concept 45 m² phong cách Retro & Mid-century tại Saint 6 với tường gỗ, sofa nhung đen và ánh đèn ấm cho chân dung, podcast và phỏng vấn.",
    },
    {
      order: 6,
      description:
        "Classic Rosé là phòng concept 45 m² mang sắc hồng và cảm hứng Baroque & Renaissance. Cầu thang xoắn ốc, đèn chùm pha lê, vòm cửa họa tiết và tượng thạch cao tạo bối cảnh cho beauty, lookbook nữ, chụp cưới và MV lãng mạn.",
      seo_title: "Phòng Concept 3: Classic Rosé | Saint 6 Studio",
      seo_description:
        "Khám phá Classic Rosé, phòng concept 45 m² sắc hồng Baroque tại Saint 6 với cầu thang xoắn và đèn chùm pha lê cho beauty, lookbook, ảnh cưới và MV lãng mạn.",
    },
  ],
};

function save() {
  fs.mkdirSync(path.dirname(statePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), { mode: 0o600 });
}
async function api(route, options = {}) {
  const response = await fetch(`${origin}/api/${route}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      `${options.method || "GET"} ${route.split("?")[0]}: ${response.status} ${result?.error?.message || ""}`,
    );
  return result;
}
async function room(locale, order) {
  const query = new URLSearchParams({
    locale,
    status: "published",
    "filters[type][$eq]": "concept",
    "filters[order][$eq]": String(order),
    "pagination[pageSize]": "2",
    "fields[0]": "seo_title",
    "fields[1]": "seo_description",
    "fields[2]": "description",
  });
  const result = await api(`studio-rooms?${query}`);
  if (result.data?.length !== 1)
    throw new Error(`Expected one concept room for ${locale}/${order}`);
  return result.data[0];
}
async function main() {
  for (const locale of ["en", "vi"]) {
    for (const entry of copy[locale]) {
      const current = await room(locale, entry.order);
      const key = `${locale}:${entry.order}`;
      const unchanged = ["description", "seo_title", "seo_description"].every(
        (field) => current[field] === entry[field],
      );
      console.log(`${key}: ${unchanged ? "current" : "update needed"}`);
      if (!apply || unchanged) continue;
      if (!(key in state.before)) {
        state.before[key] = {
          documentId: current.documentId,
          description: current.description || null,
          seo_title: current.seo_title || null,
          seo_description: current.seo_description || null,
        };
        save();
      }
      const route = `studio-rooms/${current.documentId}`;
      const published = await api(
        `${route}?${new URLSearchParams({ locale, status: "published" })}`,
        {
          method: "PUT",
          body: JSON.stringify({
            data: {
              description: entry.description,
              seo_title: entry.seo_title,
              seo_description: entry.seo_description,
            },
          }),
        },
      );
      if (!published.data?.publishedAt)
        throw new Error(`Publish failed for ${key}`);
      const verified = await room(locale, entry.order);
      if (
        !["description", "seo_title", "seo_description"].every(
          (field) => verified[field] === entry[field],
        )
      )
        throw new Error(`Verification failed for ${key}`);
      console.log(`Published: ${key}`);
    }
  }
}
main().catch((error) => {
  console.error(String(error.message).replaceAll(token, "<redacted>"));
  process.exitCode = 1;
});
