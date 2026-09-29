import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";

process.env.NEXT_PUBLIC_STYLING_ENABLED = "true";
delete process.env.STYLING_CONTENT_SOURCE;

test("cached social routes cover both locales and render complete PNGs", async () => {
  const route = await import(
    "../app/api/styling/social/[locale]/[image]/route"
  );
  const params = await route.generateStaticParams();
  assert.equal(params.length, 456);
  assert.equal(new Set(params.map((p) => `${p.locale}/${p.image}`)).size, 456);
  for (const item of [
    { locale: "en", image: "mv-tim-hanh-tinh-khac-vu-cat-tuong.png" },
    { locale: "vi", image: "_service.png" },
  ]) {
    assert.ok(
      params.some((p) => p.locale === item.locale && p.image === item.image),
    );
    const response = await route.GET(new Request("https://www.saint6.studio"), {
      params: Promise.resolve(item),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const png = await sharp(
      Buffer.from(await response.arrayBuffer()),
    ).metadata();
    assert.equal(png.width, 1200);
    assert.equal(png.height, 630);
  }
});

test("invalid and missing social images return 404", async () => {
  const route = await import(
    "../app/api/styling/social/[locale]/[image]/route"
  );
  for (const params of [
    { locale: "fr", image: "_service.png" },
    { locale: "en", image: "../../secret.png" },
    { locale: "en", image: "_service.jpg" },
    { locale: "en", image: "not-a-published-project.png" },
  ]) {
    const response = await route.GET(new Request("https://www.saint6.studio"), {
      params: Promise.resolve(params),
    });
    assert.equal(response.status, 404);
  }
});

test("previously shared image URLs redirect to cached PNGs", async () => {
  const { GET } = await import("../app/api/styling/social/route");
  const response = await GET(
    new Request(
      "https://www.saint6.studio/api/styling/social?locale=vi&slug=example-project&v=2-old",
    ),
  );
  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "https://www.saint6.studio/api/styling/social/vi/example-project.png?v=2-old",
  );
  const service = await GET(
    new Request("https://www.saint6.studio/api/styling/social"),
  );
  assert.equal(
    service.headers.get("location"),
    "https://www.saint6.studio/api/styling/social/en/_service.png",
  );
  const invalid = await GET(
    new Request("https://www.saint6.studio/api/styling/social?locale=fr"),
  );
  assert.equal(invalid.status, 404);
});
