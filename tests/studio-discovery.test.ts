import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnimatedValue } from "../app/components/animated-value/AnimatedValue";
import {
  getDiscoveryPage,
  getStudioDiscovery,
} from "../app/lib/studio-discovery/content";
import seed from "../app/lib/studio-discovery/seed.json";

test("studio measurements exist in HTML before any browser animation", () => {
  for (const value of ["900m²", "6m", "4.8m", "6"]) {
    const html = renderToStaticMarkup(createElement(AnimatedValue, { value }));
    assert.ok(html.includes(`>${value}</span>`), html);
  }
});

test("published CMS content uses its own credentials and populated localized media", async () => {
  const previous = { ...process.env };
  const fetch = globalThis.fetch;
  const calls: { url: URL; authorization: string | null }[] = [];
  Object.assign(process.env, {
    STUDIO_DISCOVERY_SOURCE: "cms",
    STUDIO_DISCOVERY_STRAPI_URL: "https://staging.example.invalid",
    STRAPI_API_TOKEN: "production-token-must-not-leak",
  });
  delete process.env.STUDIO_DISCOVERY_STRAPI_TOKEN;
  globalThis.fetch = async (input, options) => {
    calls.push({
      url: new URL(String(input)),
      authorization: new Headers(options?.headers).get("Authorization"),
    });
    return Response.json({
      data: {
        ...seed.vi,
        floorplan: {
          ...seed.vi.floorplan,
          image: { ...seed.vi.floorplan.image, url: "/uploads/map.webp" },
        },
      },
    });
  };
  try {
    const content = await getStudioDiscovery("vi");
    assert.equal(calls[0].url.searchParams.get("locale"), "vi");
    assert.equal(calls[0].url.searchParams.get("status"), "published");
    assert.equal(
      calls[0].url.searchParams.get("populate[floorplan][populate][image]"),
      "true",
    );
    assert.equal(calls[0].authorization, null);
    assert.equal(
      content.floorplan.image.url,
      "https://staging.example.invalid/uploads/map.webp",
    );
    assert.equal(content.pages[0].seo_title, seed.vi.pages[0].seo_title);
  } finally {
    globalThis.fetch = fetch;
    for (const name of [
      "STUDIO_DISCOVERY_SOURCE",
      "STUDIO_DISCOVERY_STRAPI_URL",
      "STUDIO_DISCOVERY_STRAPI_TOKEN",
      "STRAPI_API_TOKEN",
    ]) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
});

test("production cannot publish preview fixtures", async () => {
  const previousEnvironment = process.env.VERCEL_ENV;
  const previousSource = process.env.STUDIO_DISCOVERY_SOURCE;
  process.env.VERCEL_ENV = "production";
  delete process.env.STUDIO_DISCOVERY_SOURCE;
  try {
    await assert.rejects(
      getStudioDiscovery("en"),
      /requires STUDIO_DISCOVERY_SOURCE=cms/,
    );
  } finally {
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
    if (previousSource === undefined)
      delete process.env.STUDIO_DISCOVERY_SOURCE;
    else process.env.STUDIO_DISCOVERY_SOURCE = previousSource;
  }
});

test("every existing service route has distinct bilingual search metadata", async () => {
  for (const locale of ["en", "vi"] as const) {
    assert.equal(
      new Set(seed[locale].pages.map((page) => page.seo_title)).size,
      9,
    );
    assert.equal(
      new Set(seed[locale].pages.map((page) => page.seo_description)).size,
      9,
    );
    const page = await getDiscoveryPage(locale, "studio-rental");
    assert.equal(page?.seo_title, seed[locale].pages[1].seo_title);
  }
});
