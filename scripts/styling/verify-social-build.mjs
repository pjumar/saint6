import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Verify generated output, not just the route's cache configuration.
const root = path.resolve(".next");
const manifest = JSON.parse(
  await readFile(path.join(root, "prerender-manifest.json"), "utf8"),
);
const images = Object.entries(manifest.routes).filter(([url]) =>
  url.startsWith("/api/styling/social/"),
);
assert.ok(
  images.length >= 2,
  "Build with Styling enabled before running this check",
);
for (const [url, entry] of images) {
  assert.equal(entry.initialRevalidateSeconds, 300, url);
  const base = path.join(root, "server/app", url);
  const meta = JSON.parse(await readFile(`${base}.meta`, "utf8"));
  assert.equal(meta.status, 200, url);
  assert.equal(meta.headers["content-type"], "image/png", url);
  const image = await sharp(await readFile(`${base}.body`)).metadata();
  assert.equal(image.width, 1200, url);
  assert.equal(image.height, 630, url);
}
let maxOffset = 0;
let pages = 0;
for (const url of Object.keys(manifest.routes).filter((url) =>
  /^\/(en|vi)\/styling(?:\/|$)/.test(url),
)) {
  const html = await readFile(path.join(root, "server/app", `${url}.html`));
  const end = html.indexOf("</head>");
  for (const property of ["og:title", "og:description", "og:image"]) {
    const offset = html.indexOf(`property="${property}"`);
    assert.ok(
      offset > 0 && offset < end && offset < 16384,
      `${url}: ${property} must be early in head (found at ${offset})`,
    );
    maxOffset = Math.max(maxOffset, offset);
  }
  const imageUrl = html
    .toString()
    .match(/property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(imageUrl, `${url}: missing image`);
  const imagePath = new URL(imageUrl).pathname;
  if (imagePath.startsWith("/api/styling/social/")) {
    assert.ok(
      manifest.routes[imagePath],
      `${url}: sharing image wasn't pre-rendered`,
    );
  }
  pages++;
}
assert.ok(pages >= 2);
console.log(
  JSON.stringify(
    {
      preRenderedImages: images.length,
      checkedPages: pages,
      latestMetadataByte: maxOffset,
    },
    null,
    2,
  ),
);
