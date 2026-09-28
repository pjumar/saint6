import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { getStylingContent } from "../app/lib/styling/content";
import seed from "../app/lib/styling/seed.json";
import { stylingMetadata } from "../app/lib/styling/seo";

// Editorial/data contract: prevents missing images, broken locale switches and
// accidental company-only styling credits when replacing the preview fixtures.
test("all eight bilingual project routes have media and personal stylist credits", () => {
  const slugs = seed.projects.en.map((p) => p.slug).sort();
  assert.equal(new Set(slugs).size, 8);
  assert.deepEqual(seed.projects.vi.map((p) => p.slug).sort(), slugs);
  for (const locale of ["en", "vi"] as const) {
    for (const project of seed.projects[locale]) {
      assert.ok(
        project.credits.some(
          (credit) =>
            /styling/i.test(credit.role) && credit.name === "Trần Hoài Trang",
        ),
      );
      assert.ok(!JSON.stringify(project).includes("Haus Of Trang"));
      assert.ok(project.gallery.length > 0);
      for (const image of [
        project.cover,
        ...project.gallery.map((g) => g.image),
        seed.pages[locale].hero_image,
      ]) {
        assert.ok(
          existsSync(path.join(process.cwd(), "public", image.url)),
          image.url,
        );
        assert.ok(image.width > 0 && image.height > 0 && image.alternativeText);
      }
    }
  }
});
test("project metadata has exact canonical, locale alternatives and preview noindex", () => {
  const p = seed.projects.en[0];
  const meta = stylingMetadata(
    "en",
    `/${p.slug}`,
    p.seo_title,
    p.seo_description,
    p.cover,
  );
  assert.equal(
    meta.alternates?.canonical,
    `https://www.saint6.studio/en/styling/${p.slug}`,
  );
  assert.equal(
    meta.alternates?.languages?.vi,
    `https://www.saint6.studio/vi/styling/${p.slug}`,
  );
  assert.equal(
    (meta.openGraph as { url: string }).url,
    meta.alternates?.canonical,
  );
  assert.deepEqual(meta.robots, { index: false, follow: false });
});
test("CMS mode reads published locale content and populated galleries", async () => {
  const previous = process.env.STYLING_CONTENT_SOURCE;
  const fetch = globalThis.fetch;
  process.env.STYLING_CONTENT_SOURCE = "cms";
  const calls: URL[] = [];
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    calls.push(url);
    return Response.json({
      data: url.pathname.endsWith("styling-page")
        ? seed.pages.vi
        : seed.projects.vi,
      meta: { pagination: { total: 8 } },
    });
  };
  try {
    const result = await getStylingContent("vi");
    assert.equal(result.page.intro_title, seed.pages.vi.intro_title);
    assert.equal(result.projects.length, 8);
    assert.ok(result.projects[0].cover.url.startsWith("https://"));
    assert.ok(
      calls.every(
        (url) =>
          url.searchParams.get("locale") === "vi" &&
          url.searchParams.get("status") === "published",
      ),
    );
    assert.equal(
      calls[1].searchParams.get("populate[gallery][populate][image]"),
      "true",
    );
  } finally {
    globalThis.fetch = fetch;
    if (previous === undefined) delete process.env.STYLING_CONTENT_SOURCE;
    else process.env.STYLING_CONTENT_SOURCE = previous;
  }
});
test("CMS failures do not silently replace edited content with preview seed", async () => {
  const previous = process.env.STYLING_CONTENT_SOURCE;
  const fetch = globalThis.fetch;
  process.env.STYLING_CONTENT_SOURCE = "cms";
  globalThis.fetch = async () => new Response("unavailable", { status: 503 });
  try {
    await assert.rejects(() => getStylingContent("en"), /CMS request failed/);
  } finally {
    globalThis.fetch = fetch;
    if (previous === undefined) delete process.env.STYLING_CONTENT_SOURCE;
    else process.env.STYLING_CONTENT_SOURCE = previous;
  }
});
