/* Refresh the six Drive folders labelled Updated without changing CMS copy.
 * --plan checks local media. --apply uploads, updates, and publishes EN/VI.
 * Re-running --apply reuses named uploads and preserves unrelated gallery items.
 */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
require("dotenv").config({ path: path.join(root, ".env.local"), quiet: true });
const entries = require(path.join(root, "app/lib/styling/drive-projects.json"));
const slugs = [
  "abbott-grow-gold-25-years-tvc",
  "clear-48h-toc-tien-tvc",
  "lipice-sheer-color-q-lo-lem",
  "olivoila-dep-hon-moi-ngay-tvc",
  "sun-life-tron-ven-vi-nha-minh",
  "tefal-easy-rice-max-my-linh",
];
const selected = slugs.map((slug) => {
  const entry = entries.find((project) => project.slug === slug);
  if (!entry) throw new Error(`Missing local project: ${slug}`);
  for (const image of entry.images) {
    if (!/^\/media\/drive-projects\/[a-z0-9.-]+$/i.test(image.url))
      throw new Error(`Unexpected asset path: ${image.url}`);
    if (!fs.existsSync(path.join(root, "public", image.url)))
      throw new Error(`Missing local image: ${image.url}`);
  }
  return entry;
});
const apply = process.argv.includes("--apply");
const origin =
  process.env.STYLING_IMPORT_ORIGIN || "https://strapi.saint6.studio";
if (origin !== "https://strapi.saint6.studio")
  throw new Error("Unapproved update destination");
const token = process.env.STYLING_IMPORT_TOKEN || process.env.STRAPI_API_TOKEN;
const statePath = path.join(root, ".backups/updated-project-covers.json");
const state = fs.existsSync(statePath)
  ? JSON.parse(fs.readFileSync(statePath, "utf8"))
  : { origin, assets: {}, before: {} };
if (state.origin !== origin) throw new Error("Update destination changed");
function save() {
  fs.mkdirSync(path.dirname(statePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), { mode: 0o600 });
}
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
async function mediaId(image, title) {
  if (state.assets[image.url]) return state.assets[image.url];
  const name = `saint6-drive-${path.basename(image.url)}`;
  const found = await api(
    `upload/files?${query({ "filters[name][$eq]": name, "pagination[pageSize]": "2" })}`,
  );
  if (found.length > 1) throw new Error(`Ambiguous CMS media: ${name}`);
  if (found.length === 1) {
    state.assets[image.url] = found[0].id;
    save();
    return found[0].id;
  }
  const mime = image.url.endsWith(".webp") ? "image/webp" : "image/jpeg";
  const form = new FormData();
  form.append(
    "files",
    new Blob([fs.readFileSync(path.join(root, "public", image.url))], {
      type: mime,
    }),
    name,
  );
  form.append("fileInfo", JSON.stringify({ name, alternativeText: title }));
  const uploaded = await api("upload", { method: "POST", body: form });
  if (!uploaded[0]?.id) throw new Error(`Upload returned no ID: ${name}`);
  state.assets[image.url] = uploaded[0].id;
  save();
  return uploaded[0].id;
}
async function project(slug, locale, status) {
  const result = await api(
    `styling-projects?${query({
      locale,
      status,
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "2",
      "populate[cover]": "true",
      "populate[gallery][populate][image]": "true",
    })}`,
  );
  if (result.data.length !== 1)
    throw new Error(`Expected one ${status} project: ${slug} (${locale})`);
  return result.data[0];
}
async function main() {
  for (const entry of selected)
    console.log(
      `${entry.slug}: cover=${path.basename(entry.images[0].url)} gallery=${entry.images.length - 1}`,
    );
  if (!apply) return;
  if (!token) throw new Error("A server-only Strapi token is required");
  for (const entry of selected) {
    const ids = [];
    for (const image of entry.images)
      ids.push(await mediaId(image, `${entry.title.en} — project image`));
    for (const locale of ["en", "vi"]) {
      const current = await project(entry.slug, locale, "published");
      const key = `${entry.slug}:${locale}`;
      if (!state.before[key]) {
        state.before[key] = {
          documentId: current.documentId,
          cover: current.cover?.id,
          cover_alt: current.cover_alt,
          gallery: current.gallery?.map((item) => ({
            image: item.image?.id,
            alt: item.alt,
          })),
        };
        save();
      }
      const gallery = ids.slice(1).map((id, index) => ({
        image: id,
        alt: `${entry.title[locale]} — image ${index + 2}`,
      }));
      const known = new Set(gallery.map((item) => item.image));
      for (const item of current.gallery || []) {
        if (item.image?.id && !known.has(item.image.id)) {
          gallery.push({ image: item.image.id, alt: item.alt || "" });
          known.add(item.image.id);
        }
      }
      if (
        current.cover?.id === ids[0] &&
        gallery.length === (current.gallery || []).length
      ) {
        const currentIds = (current.gallery || []).map(
          (item) => item.image?.id,
        );
        if (gallery.every((item, index) => item.image === currentIds[index])) {
          console.log(`Already current: ${key}`);
          continue;
        }
      }
      const route = `styling-projects/${current.documentId}`;
      await api(`${route}?${query({ locale })}`, {
        method: "PUT",
        body: JSON.stringify({
          data: {
            cover: ids[0],
            cover_alt: `${entry.title[locale]} — project image`,
            gallery,
          },
        }),
      });
      const published = await api(
        `${route}?${query({ locale, status: "published" })}`,
        { method: "PUT", body: JSON.stringify({ data: {} }) },
      );
      if (!published.data?.publishedAt)
        throw new Error(`Publish failed: ${key}`);
      const verified = await project(entry.slug, locale, "published");
      if (verified.cover?.id !== ids[0])
        throw new Error(`Cover verification failed: ${key}`);
      console.log(`Published and verified: ${key}`);
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
