/* Additive, resumable import of the approved Drive portfolio into Strapi.
 * --plan reads only local files; --apply creates EN/VI drafts; --publish publishes
 * those drafts after the website and Strapi schema have been deployed.
 */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
require("dotenv").config({ path: path.join(root, ".env.local"), quiet: true });
const entries = require(path.join(root, "app/lib/styling/drive-projects.json"));
const schema = require(
  path.join(
    root,
    "strapi/src/api/styling-project/content-types/styling-project/schema.json",
  ),
);
const apply = process.argv.includes("--apply");
const publish = process.argv.includes("--publish");
if (apply && publish)
  throw new Error("Use --apply and --publish in separate runs");
const origin =
  process.env.STYLING_IMPORT_ORIGIN || "https://strapi.saint6.studio";
if (
  origin !== "https://strapi.saint6.studio" &&
  !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
)
  throw new Error("Unapproved import destination");
const token = process.env.STYLING_IMPORT_TOKEN || process.env.STRAPI_API_TOKEN;
const statePath = path.join(root, ".backups/drive-projects-import.json");
const state = fs.existsSync(statePath)
  ? JSON.parse(fs.readFileSync(statePath, "utf8"))
  : { origin, assets: {}, projects: {} };
if (state.origin !== origin) throw new Error("Import destination changed");
const save = () => {
  fs.mkdirSync(path.dirname(statePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), { mode: 0o600 });
};
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
function sourcePath(url) {
  if (
    !/^\/(?:images\/portfolio|media\/drive-projects)\/[a-z0-9.-]+$/i.test(url)
  )
    throw new Error(`Unexpected media path: ${url}`);
  const file = path.resolve(root, `public${url}`);
  if (!fs.existsSync(file)) throw new Error(`Missing local media: ${url}`);
  return file;
}
const media = new Map();
const slugs = new Set();
for (const entry of entries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || slugs.has(entry.slug))
    throw new Error(`Invalid or duplicate project slug: ${entry.slug}`);
  slugs.add(entry.slug);
  if (!schema.attributes.category_key.enum.includes(entry.category_key))
    throw new Error(`Unknown category key: ${entry.slug}`);
  for (const locale of ["en", "vi"]) {
    if (
      ![
        entry.title[locale],
        entry.category[locale],
        entry.summary[locale],
        entry.body[locale],
      ].every(Boolean)
    )
      throw new Error(`Incomplete ${locale} content: ${entry.slug}`);
    if (!entry.credits[locale]?.length)
      throw new Error(`Missing ${locale} credits: ${entry.slug}`);
  }
  if (!entry.images.length) throw new Error(`Missing cover: ${entry.slug}`);
  for (const image of entry.images) media.set(image.url, sourcePath(image.url));
  for (const video of entry.videos) media.set(video, sourcePath(video));
}
async function mediaId(url, alternativeText = "") {
  if (state.assets[url]) return state.assets[url];
  const file = media.get(url);
  const name = `saint6-drive-${path.basename(file)}`;
  const found = await api(
    `upload/files?${query({ "filters[name][$eq]": name, "pagination[pageSize]": "2" })}`,
  );
  if (found.length > 1) throw new Error(`Ambiguous CMS media: ${name}`);
  if (found.length === 1) {
    state.assets[url] = found[0].id;
    save();
    return found[0].id;
  }
  const bytes = fs.readFileSync(file);
  const mime = file.endsWith(".mp4") ? "video/mp4" : "image/jpeg";
  const form = new FormData();
  form.append("files", new Blob([bytes], { type: mime }), name);
  form.append("fileInfo", JSON.stringify({ name, alternativeText }));
  const uploaded = await api("upload", { method: "POST", body: form });
  if (!uploaded[0]?.id) throw new Error(`Upload returned no media ID: ${name}`);
  state.assets[url] = uploaded[0].id;
  save();
  return uploaded[0].id;
}
async function existing(slug, locale, status = "draft") {
  const route = `styling-projects?${query({ locale, status, "filters[slug][$eq]": slug, "pagination[pageSize]": "2" })}`;
  const result = await api(route);
  if (result.data.length > 1)
    throw new Error(`Duplicate CMS slug: ${slug} (${locale})`);
  return result.data[0] || null;
}
async function main() {
  console.log(
    JSON.stringify({
      mode: publish ? "publish" : apply ? "create-drafts" : "plan",
      origin,
      projects: entries.length,
      languages: ["en", "vi"],
      images: [...media.keys()].filter((url) => url.endsWith(".jpg")).length,
      videos: [...media.keys()].filter((url) => url.endsWith(".mp4")).length,
    }),
  );
  if (!apply && !publish) return;
  if (!token) throw new Error("A server-only Strapi token is required");
  // An old CMS schema rejects this populate query. Fail before uploading anything.
  await api(
    `styling-projects?${query({ locale: "en", status: "draft", "pagination[pageSize]": "1", "populate[video_files]": "true" })}`,
  );
  if (apply) {
    for (const entry of entries) {
      const currentByLocale = {
        en: await existing(entry.slug, "en"),
        vi: await existing(entry.slug, "vi"),
      };
      if (currentByLocale.en && currentByLocale.vi) {
        console.log(`Already in Strapi: ${entry.slug}`);
        continue;
      }
      const imageIds = [];
      for (const [index, image] of entry.images.entries())
        imageIds.push(
          await mediaId(image.url, `${entry.title.en} — image ${index + 1}`),
        );
      const videoIds = [];
      for (const video of entry.videos)
        videoIds.push(await mediaId(video, entry.title.en));
      for (const locale of ["en", "vi"]) {
        const current = currentByLocale[locale];
        if (current) {
          state.projects[`${entry.slug}:${locale}`] = current.documentId;
          save();
          continue; // Do not overwrite editor changes.
        }
        const english = locale === "vi" ? currentByLocale.en : null;
        const payload = {
          slug: entry.slug,
          title: entry.title[locale],
          category: entry.category[locale],
          category_key: entry.category_key,
          featured: entries.indexOf(entry) < 6,
          sort_order: entries.indexOf(entry),
          summary: entry.summary[locale],
          body: entry.body[locale],
          cover: imageIds[0],
          cover_alt: `${entry.title[locale]} — project image`,
          gallery: imageIds.slice(1).map((id, index) => ({
            image: id,
            alt: `${entry.title[locale]} — image ${index + 2}`,
          })),
          video_files: videoIds,
          credits: entry.credits[locale],
          source_url: entry.source_url || null,
          seo_title: `${entry.title[locale]} | Saint 6 Studio`,
          seo_description: entry.summary[locale],
        };
        const route = `styling-projects${english ? `/${english.documentId}` : ""}?${query({ locale })}`;
        const result = await api(route, {
          method: english ? "PUT" : "POST",
          body: JSON.stringify({ data: payload }),
        });
        if (!result.data?.documentId)
          throw new Error(`Draft not created: ${entry.slug} (${locale})`);
        state.projects[`${entry.slug}:${locale}`] = result.data.documentId;
        currentByLocale[locale] = result.data;
        save();
      }
      console.log(`Draft ready: ${entry.slug}`);
    }
  }
  if (publish) {
    for (const entry of entries) {
      for (const locale of ["en", "vi"]) {
        if (await existing(entry.slug, locale, "published")) continue;
        const current = await existing(entry.slug, locale);
        if (!current)
          throw new Error(`Missing draft: ${entry.slug} (${locale})`);
        const route = `styling-projects/${current.documentId}?${query({ locale, status: "published" })}`;
        const result = await api(route, {
          method: "PUT",
          body: JSON.stringify({ data: {} }),
        });
        if (!result.data?.publishedAt)
          throw new Error(`Not published: ${entry.slug} (${locale})`);
      }
      console.log(`Published: ${entry.slug}`);
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
