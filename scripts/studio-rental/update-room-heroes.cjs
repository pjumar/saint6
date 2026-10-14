/* Set the six existing room hero images in Strapi after hero_image is deployed.
 * --plan prints the choices; --apply uploads the two new images and publishes EN/VI.
 */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
require("dotenv").config({ path: path.join(root, ".env.local"), quiet: true });

const origin = process.env.STUDIO_ROOM_ORIGIN || "https://strapi.saint6.studio";
if (origin !== "https://strapi.saint6.studio")
  throw new Error("Unexpected Strapi destination");
const token = process.env.STRAPI_API_TOKEN;
const apply = process.argv.includes("--apply");
const choices = [
  { type: "blank", order: 1, local: "blank-125.webp" },
  { type: "blank", order: 2, gallery: "IMG_2087_" },
  { type: "blank", order: 3, local: "blank-360.webp" },
  { type: "concept", order: 4, gallery: "R1_2_" },
  { type: "concept", order: 5, gallery: "R2_2_" },
  { type: "concept", order: 6, gallery: "R3_2_" },
];
const query = (fields) => new URLSearchParams(fields).toString();

async function api(route, options = {}) {
  const response = await fetch(`${origin}/api/${route}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
    signal: AbortSignal.timeout(120000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      `${options.method || "GET"} ${route.split("?")[0]}: ${response.status} ${result?.error?.message || ""}`,
    );
  return result;
}

async function rooms(locale) {
  const result = await api(
    `studio-rooms?${query({
      locale,
      status: "published",
      populate: "*",
      "pagination[pageSize]": "20",
    })}`,
  );
  return result.data;
}

async function localMedia(choice) {
  const filename = `saint6-room-hero-${choice.local}`;
  const existing = await api(
    `upload/files?${query({ "filters[name][$eq]": filename })}`,
  );
  if (existing.length > 1) throw new Error(`Ambiguous media: ${filename}`);
  if (existing[0]) return existing[0].id;
  const file = path.join(root, "public/images/room-heroes", choice.local);
  const form = new FormData();
  form.append(
    "files",
    new Blob([fs.readFileSync(file)], { type: "image/webp" }),
    filename,
  );
  form.append(
    "fileInfo",
    JSON.stringify({
      name: filename,
      alternativeText: `Saint 6 ${choice.order === 1 ? "125m²" : "360m²"} blank room`,
    }),
  );
  const uploaded = await api("upload", { method: "POST", body: form });
  if (!uploaded[0]?.id) throw new Error(`Upload failed: ${filename}`);
  return uploaded[0].id;
}

async function main() {
  if (!token) throw new Error("A server-only Strapi token is required");
  const byLocale = {
    en: await rooms("en"),
    vi: await rooms("vi"),
  };
  for (const choice of choices) {
    const key = `${choice.type}:${choice.order}`;
    const pair = ["en", "vi"].map((locale) => {
      const room = byLocale[locale].find(
        (item) => item.type === choice.type && item.order === choice.order,
      );
      if (!room) throw new Error(`Missing published room: ${key} (${locale})`);
      return { locale, room };
    });
    const english = pair[0].room;
    const galleryImage = choice.gallery
      ? english.gallery?.find((image) => image.url?.includes(choice.gallery))
      : null;
    if (choice.gallery && !galleryImage?.id)
      throw new Error(`Gallery image not found: ${key} ${choice.gallery}`);
    if (choice.local)
      fs.accessSync(path.join(root, "public/images/room-heroes", choice.local));
    console.log(
      `${key}: ${choice.local || galleryImage.name || choice.gallery} (current: ${english.hero_image?.name || "unset"})`,
    );
    if (!apply) continue;
    const mediaId = choice.local ? await localMedia(choice) : galleryImage.id;
    for (const { locale, room } of pair) {
      if (room.hero_image?.id === mediaId) {
        console.log(`Already current: ${key} (${locale})`);
        continue;
      }
      const updated = await api(
        `studio-rooms/${room.documentId}?${query({ locale, status: "published" })}`,
        {
          method: "PUT",
          body: JSON.stringify({ data: { hero_image: mediaId } }),
        },
      );
      if (!updated.data?.publishedAt)
        throw new Error(`Publish failed: ${key} (${locale})`);
      console.log(`Published: ${key} (${locale})`);
    }
  }
  if (apply) {
    for (const locale of ["en", "vi"]) {
      const current = await rooms(locale);
      for (const choice of choices) {
        const room = current.find(
          (item) => item.type === choice.type && item.order === choice.order,
        );
        if (!room?.hero_image?.url)
          throw new Error(
            `Hero verification failed: ${choice.type}:${choice.order} (${locale})`,
          );
      }
      console.log(`Verified six published heroes: ${locale}`);
    }
  }
}

main().catch((error) => {
  console.error(
    token
      ? String(error.message).replaceAll(token, "<redacted>")
      : String(error.message),
  );
  process.exitCode = 1;
});
