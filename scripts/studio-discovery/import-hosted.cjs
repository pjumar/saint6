const fs = require("node:fs");
const path = require("node:path");
const seed = require("../../app/lib/studio-discovery/seed.json");

async function run() {
  const origin = process.env.STUDIO_DISCOVERY_IMPORT_URL;
  const token = process.env.STUDIO_DISCOVERY_IMPORT_TOKEN;
  if (!origin || !token || new URL(origin).protocol !== "https:") {
    throw new Error(
      "Set an explicit HTTPS STUDIO_DISCOVERY_IMPORT_URL and its own STUDIO_DISCOVERY_IMPORT_TOKEN.",
    );
  }
  const headers = { Authorization: `Bearer ${token}` };
  async function request(endpoint, options = {}) {
    const response = await fetch(new URL(`/api/${endpoint}`, origin), {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: AbortSignal.timeout(30000),
    });
    // An empty Strapi single type returns 404 until its first locale is saved.
    if (
      response.status === 404 &&
      endpoint.startsWith("studio-discovery?") &&
      (!options.method || options.method === "GET")
    )
      return { data: null };
    if (!response.ok)
      throw new Error(
        `CMS ${endpoint.split("?")[0]} failed (${response.status})`,
      );
    return response.json();
  }
  const missing = [];
  for (const locale of ["en", "vi"]) {
    const { data } = await request(
      `studio-discovery?locale=${locale}&status=draft`,
    );
    if (data) console.log(`${locale}: existing editorial content retained`);
    else missing.push(locale);
  }
  if (!missing.length) return;
  if (!process.argv.includes("--apply")) {
    console.log(
      `Dry run: import missing locales ${missing.join(", ")} and floorplan as drafts. Add --apply to execute.`,
    );
    return;
  }
  async function uploadImage(name, relativePath, alternativeText) {
    const query = new URLSearchParams({ "filters[name][$eq]": name });
    const existing = await request(`upload/files?${query}`);
    let imageId = existing[0]?.id;
    if (!imageId) {
      const filepath = path.resolve(__dirname, relativePath);
      const form = new FormData();
      form.append(
        "files",
        new Blob([fs.readFileSync(filepath)], { type: "image/webp" }),
        name,
      );
      form.append("fileInfo", JSON.stringify({ name, alternativeText }));
      const uploaded = await request("upload", { method: "POST", body: form });
      imageId = uploaded[0]?.id;
      if (!imageId) throw new Error("Floorplan upload did not return an image");
    }
    return imageId;
  }
  const imageId = await uploadImage(
    "saint6-floorplan.webp",
    "../../public/images/studio-rental/floorplan.webp",
    seed.en.floorplan.image_alt,
  );
  const accessImageId = await uploadImage(
    "saint6-truck-access-retouched.webp",
    "../../public/images/studio-rental/truck-access-retouched.webp",
    seed.en.floorplan.access_image_alt,
  );
  for (const locale of missing) {
    const data = {
      ...seed[locale],
      floorplan: {
        ...seed[locale].floorplan,
        image: imageId,
        access_image: accessImageId,
      },
    };
    await request(`studio-discovery?locale=${locale}&status=draft`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    console.log(`${locale}: imported as a draft; publish after reviewing`);
  }
}
run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
