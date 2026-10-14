/* Attach the three selected Drive images to the dedicated Strapi thumbnail field.
 * --plan validates local assets. --apply uploads and publishes EN/VI updates.
 * Run --apply only after the Strapi schema with thumbnail has deployed.
 */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
require("dotenv").config({ path: path.join(root, ".env.local"), quiet: true });

const entries = [
  {
    slug: "elise-pure-urban-chic-lookbook",
    file: "elise-pure-urban-chic.jpg",
    alt: "ELISE Pure Urban Chic lookbook portrait in a black dress",
  },
  {
    slug: "mb-priflexi-hoa-minzy",
    file: "mb-priflexi.jpg",
    alt: "MB PriFlexi campaign artwork featuring Hòa Minzy",
  },
  {
    slug: "thieu-bao-tram-editorial",
    file: "thieu-bao-tram.jpg",
    alt: "Thiều Bảo Trâm in a blue striped shirt and tailored trousers",
  },
];
const assetDirectory =
  process.env.STYLING_THUMBNAIL_SOURCE_DIR ||
  path.join(root, ".backups/styling-thumbnail-source");
const schema = require(
  path.join(
    root,
    "strapi/src/api/styling-project/content-types/styling-project/schema.json",
  ),
);
if (schema.attributes.thumbnail?.type !== "media")
  throw new Error(
    "The local Strapi schema is missing the thumbnail media field",
  );
for (const entry of entries) {
  entry.path = path.join(assetDirectory, entry.file);
  if (!fs.existsSync(entry.path)) throw new Error(`Missing ${entry.path}`);
}

const apply = process.argv.includes("--apply");
const origin =
  process.env.STYLING_IMPORT_ORIGIN || "https://strapi.saint6.studio";
if (origin !== "https://strapi.saint6.studio")
  throw new Error("Unapproved import destination");
const token = process.env.STYLING_IMPORT_TOKEN || process.env.STRAPI_API_TOKEN;
const statePath = path.join(root, ".backups/styling-thumbnails.json");
const state = fs.existsSync(statePath)
  ? JSON.parse(fs.readFileSync(statePath, "utf8"))
  : { origin, assets: {}, before: {} };
if (state.origin !== origin) throw new Error("Import destination changed");
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
async function mediaId(entry) {
  if (state.assets[entry.slug]) return state.assets[entry.slug];
  const name = `saint6-thumbnail-${entry.file}`;
  const found = await api(
    `upload/files?${query({ "filters[name][$eq]": name, "pagination[pageSize]": "2" })}`,
  );
  if (found.length > 1) throw new Error(`Ambiguous CMS media: ${name}`);
  if (found.length === 1) {
    if (
      found[0].size &&
      Math.abs(
        Math.round(found[0].size * 1000) - fs.statSync(entry.path).size,
      ) > 10
    )
      throw new Error(`Existing CMS media has a different size: ${name}`);
    state.assets[entry.slug] = found[0].id;
    save();
    return found[0].id;
  }
  const form = new FormData();
  form.append(
    "files",
    new Blob([fs.readFileSync(entry.path)], { type: "image/jpeg" }),
    name,
  );
  form.append("fileInfo", JSON.stringify({ name, alternativeText: entry.alt }));
  const uploaded = await api("upload", { method: "POST", body: form });
  if (!uploaded[0]?.id) throw new Error(`Upload returned no ID: ${name}`);
  state.assets[entry.slug] = uploaded[0].id;
  save();
  return uploaded[0].id;
}
async function project(slug, locale) {
  const result = await api(
    `styling-projects?${query({
      locale,
      status: "published",
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "2",
      "populate[thumbnail]": "true",
    })}`,
  );
  if (result.data.length !== 1)
    throw new Error(`Expected one published project: ${slug} (${locale})`);
  return result.data[0];
}
async function main() {
  for (const entry of entries)
    console.log(
      `${entry.slug}: ${entry.file} (${fs.statSync(entry.path).size} bytes)`,
    );
  if (!apply) return;
  if (!token) throw new Error("A server-only Strapi token is required");
  // Fail before uploading if Strapi Cloud has not deployed the new field.
  await project(entries[0].slug, "en");
  for (const entry of entries) {
    const id = await mediaId(entry);
    for (const locale of ["en", "vi"]) {
      const current = await project(entry.slug, locale);
      const key = `${entry.slug}:${locale}`;
      if (!(key in state.before)) {
        state.before[key] = {
          documentId: current.documentId,
          thumbnail: current.thumbnail?.id || null,
        };
        save();
      }
      if (current.thumbnail?.id === id) {
        console.log(`Already current: ${key}`);
        continue;
      }
      const route = `styling-projects/${current.documentId}`;
      await api(`${route}?${query({ locale })}`, {
        method: "PUT",
        body: JSON.stringify({ data: { thumbnail: id } }),
      });
      const published = await api(
        `${route}?${query({ locale, status: "published" })}`,
        { method: "PUT", body: JSON.stringify({ data: {} }) },
      );
      if (!published.data?.publishedAt)
        throw new Error(`Publish failed: ${key}`);
      const verified = await project(entry.slug, locale);
      if (verified.thumbnail?.id !== id)
        throw new Error(`Thumbnail verification failed: ${key}`);
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
