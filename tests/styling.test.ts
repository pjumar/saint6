import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { getStylingContent } from "../app/lib/styling/content";
import seed from "../app/lib/styling/seed.json";
import { stylingMetadata } from "../app/lib/styling/seo";

// Editorial/data contract: prevents missing images, broken locale switches and
// accidental company-only styling credits when replacing the preview fixtures.
test("all portfolio bilingual project routes have media and personal stylist credits", () => {
  const slugs = seed.projects.en.map((p) => p.slug).sort();
  assert.equal(new Set(slugs).size, 227);
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
      meta: { pagination: { total: 227 } },
    });
  };
  try {
    const result = await getStylingContent("vi");
    assert.equal(result.page.intro_title, seed.pages.vi.intro_title);
    assert.equal(result.projects.length, 227);
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

test("Minh Triệu remains in the archive, with independent high-resolution hero artwork", () => {
  assert.ok(
    seed.projects.en.some((p) => p.slug === "le-thanh-hoa-fashion-show"),
  );
  assert.ok(
    seed.projects.en.some(
      (p) => p.slug === "la-habana-minh-trieu-ho-vinh-khoa",
    ),
  );
  for (const page of Object.values(seed.pages)) {
    for (const panel of page.hero_panels) {
      assert.ok(!/minh tri|le-thanh-hoa|habana/i.test(JSON.stringify(panel)));
      assert.ok(panel.image.width >= 1000);
      assert.ok(
        existsSync(path.join(process.cwd(), "public", panel.image.url)),
      );
    }
    assert.ok(page.hero_mobile_image.height > page.hero_mobile_image.width);
  }
});
test("archive pagination and accent-insensitive search find projects beyond the old selection", async () => {
  const { portfolioResults, portfolioHref } = await import(
    "../app/lib/styling/portfolio"
  );
  const first = portfolioResults(seed.projects.en, "", "", "1");
  const last = portfolioResults(seed.projects.en, "", "", "999");
  assert.equal(first.projects.length, 18);
  assert.equal(last.page, 13);
  assert.equal(last.projects.length, 11);
  const found = portfolioResults(seed.projects.en, "", "Đen Vâu", "1");
  const unaccented = portfolioResults(seed.projects.en, "", "den vau", "1");
  assert.deepEqual(found.projects, unaccented.projects);
  assert.ok(found.projects.some((p) => p.slug === "den-vau-dien-vien-toi"));
  const films = portfolioResults(seed.projects.en, "music", "", "1");
  assert.ok(films.projects.every((p) => p.category_key === "music"));
  assert.equal(
    portfolioResults(seed.projects.en, "", "no-such-project", "5").total,
    0,
  );
  assert.equal(
    portfolioHref("vi", "editorial", "denim", 2),
    "/vi/styling/projects?category=editorial&q=denim&page=2#portfolio-results",
  );
});
test("CMS reads all pages rather than truncating a portfolio at 100 projects", async () => {
  const previous = process.env.STYLING_CONTENT_SOURCE;
  const fetch = globalThis.fetch;
  process.env.STYLING_CONTENT_SOURCE = "cms";
  const requested: number[] = [];
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("styling-page"))
      return Response.json({ data: seed.pages.en });
    const page = Number(url.searchParams.get("pagination[page]"));
    requested.push(page);
    return Response.json({
      data: seed.projects.en.slice((page - 1) * 100, page * 100),
      meta: { pagination: { total: 227, pageCount: 3 } },
    });
  };
  try {
    const result = await getStylingContent("en");
    assert.equal(result.projects.length, 227);
    assert.deepEqual(requested, [1, 2, 3]);
    assert.ok(result.page.hero_panels?.[0].image.url.startsWith("https://"));
    assert.ok(result.page.clients?.[0].logo.url.startsWith("https://"));
  } finally {
    globalThis.fetch = fetch;
    if (previous === undefined) delete process.env.STYLING_CONTENT_SOURCE;
    else process.env.STYLING_CONTENT_SOURCE = previous;
  }
});
