const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "../..");
const appDir = path.join(root, "strapi");
const localDir = path.join(appDir, ".tmp/studio-discovery-preview");
fs.mkdirSync(localDir, { recursive: true });
const envPath = path.join(localDir, ".env");
if (!fs.existsSync(envPath)) {
  const secret = () => crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(
    envPath,
    [
      "APP_KEYS=" + [secret(), secret()].join(","),
      ...[
        "ADMIN_JWT_SECRET",
        "API_TOKEN_SALT",
        "TRANSFER_TOKEN_SALT",
        "ENCRYPTION_KEY",
        "JWT_SECRET",
      ].map((key) => key + "=" + secret()),
    ].join("\n"),
    { mode: 0o600 },
  );
}
Object.assign(process.env, {
  ENV_PATH: envPath,
  NODE_ENV: "development",
  DATABASE_CLIENT: "sqlite",
  DATABASE_FILENAME: ".tmp/studio-discovery-preview/data.db",
  DATABASE_URL: "",
  HOST: "127.0.0.1",
  PORT: "1347",
  STRAPI_TELEMETRY_DISABLED: "true",
  STRAPI_DISABLE_UPDATE_NOTIFICATION: "true",
  RESEND_API_KEY: "",
  SMTP_PASSWORD: "",
});
process.chdir(appDir);
const { createStrapi, compileStrapi } = require(
  path.join(appDir, "node_modules/@strapi/strapi"),
);
const seed = require(path.join(root, "app/lib/studio-discovery/seed.json"));
const uid = "api::studio-discovery.studio-discovery";

async function run() {
  const context = await compileStrapi({ appDir, ignoreDiagnostics: true });
  const app = createStrapi({
    ...context,
    serveAdminPanel: process.argv.includes("--editor"),
  });
  await app.load();
  app.cron.destroy();
  let serving = false;
  try {
    async function uploadImage(name, relativePath, alternativeText) {
      let image = await app.db
        .query("plugin::upload.file")
        .findOne({ where: { name } });
      if (!image) {
        const filepath = path.join(root, relativePath);
        [image] = await app
          .plugin("upload")
          .service("upload")
          .upload({
            data: {
              fileInfo: { name, alternativeText },
            },
            files: {
              filepath,
              originalFilename: name,
              mimetype: "image/webp",
              size: fs.statSync(filepath).size,
            },
          });
      }
      return image;
    }
    const image = await uploadImage(
      "saint6-floorplan.webp",
      "public/images/studio-rental/floorplan.webp",
      seed.en.floorplan.image_alt,
    );
    const accessImage = await uploadImage(
      "saint6-truck-access-retouched.webp",
      "public/images/studio-rental/truck-access-retouched.webp",
      seed.en.floorplan.access_image_alt,
    );
    const docs = app.documents(uid);
    for (const locale of ["en", "vi"]) {
      const current = await docs.findFirst({ locale });
      if (!current || process.argv.includes("--refresh-preview")) {
        const data = {
          ...seed[locale],
          floorplan: {
            ...seed[locale].floorplan,
            image: image.id,
            access_image: accessImage.id,
          },
        };
        const base =
          current ||
          (locale === "vi" ? await docs.findFirst({ locale: "en" }) : null);
        if (base)
          await docs.update({
            documentId: base.documentId,
            locale,
            data,
            status: "published",
          });
        else await docs.create({ locale, data, status: "published" });
      }
    }
    const role = await app.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });
    const action = uid + ".find";
    if (
      !(await app.db
        .query("plugin::users-permissions.permission")
        .findOne({ where: { action, role: role.id } }))
    ) {
      await app.db
        .query("plugin::users-permissions.permission")
        .create({ data: { action, role: role.id } });
    }
    const populate = {
      pages: true,
      navigation_links: true,
      floorplan: { populate: { image: true, access_image: true } },
      room_summaries: true,
      spec_labels: true,
      stats_labels: true,
      workshops: true,
    };
    for (const locale of ["en", "vi"]) {
      const published = await docs.findFirst({
        locale,
        status: "published",
        populate,
      });
      assert.equal(published.pages.length, 9);
      assert.ok(published.floorplan.image.url);
      assert.ok(published.floorplan.access_image.url);
      assert.equal(published.navigation_links.length, 4);
      assert.equal(published.room_summaries[0].area_sqm, 125);
      console.log(
        `PASS: ${locale} published SEO, floorplan media, room content and navigation`,
      );
    }
    if (process.argv.includes("--verify")) {
      const english = await docs.findFirst({
        locale: "en",
        status: "published",
        populate,
      });
      const original = english.pages[0].seo_title;
      await docs.update({
        documentId: english.documentId,
        locale: "en",
        data: {
          pages: english.pages.map(({ id, ...page }, index) =>
            index === 0 ? { ...page, seo_title: "LOCAL DRAFT QA" } : page,
          ),
        },
      });
      assert.equal(
        (await docs.findFirst({ locale: "en", status: "published", populate }))
          .pages[0].seo_title,
        original,
      );
      await docs.discardDraft({ documentId: english.documentId, locale: "en" });
      console.log(
        "PASS: unpublished edits stay hidden and Vietnamese remains independent",
      );
    }
    if (process.argv.includes("--generate-types")) {
      await require(
        path.join(appDir, "node_modules/@strapi/typescript-utils"),
      ).generators.generate({
        strapi: app,
        pwd: appDir,
        artifacts: { contentTypes: true, components: true },
      });
    }
    if (process.argv.includes("--editor")) {
      const credentialsPath = path.join(localDir, "editor.private.json");
      if (!fs.existsSync(credentialsPath)) {
        const adminRole = await app.db
          .query("admin::role")
          .findOne({ where: { code: "strapi-super-admin" } });
        const credentials = {
          email: "local-studio-qa@example.invalid",
          password: crypto.randomBytes(24).toString("base64url") + "!Aa9",
        };
        await app.admin.services.user.create({
          ...credentials,
          firstname: "Local",
          lastname: "Studio",
          isActive: true,
          roles: [adminRole.id],
        });
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials), {
          mode: 0o600,
        });
      }
    }
    if (process.argv.includes("--serve")) {
      await new Promise((resolve) =>
        app.server.listen(1347, "127.0.0.1", resolve),
      );
      serving = true;
      console.log("Isolated studio CMS: http://127.0.0.1:1347");
    }
  } finally {
    if (!serving) await app.destroy();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
