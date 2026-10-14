import assert from "node:assert/strict";
import { test } from "node:test";
import {
  type PortfolioProject,
  translatedProject,
} from "../app/lib/portfolio/content";
import { portfolioSeoTitle } from "../app/lib/portfolio/listing";

function project(
  id: string,
  locale: "en" | "vi",
  translationKey?: string,
): PortfolioProject {
  return {
    id,
    translationKey,
    title: id,
    category: "Set design",
    summary: "",
    image: "https://example.com/project.jpg",
    imageAlt: id,
    href: `/${locale}/projects/${id}`,
    services: ["set-design"],
  };
}

test("project translations follow Strapi document IDs, not localized URLs", () => {
  const english = project("set-design-1252", "en", "portfolio:shared-doc");
  const vietnamese = project("set-design-1254", "vi", "portfolio:shared-doc");
  const unrelated = project("set-design-1252", "vi", "portfolio:other-doc");
  assert.equal(translatedProject(english, [unrelated, vietnamese]), vietnamese);
  assert.equal(translatedProject(vietnamese, [english]), english);
});

test("projects without a published translation are not paired", () => {
  const english = project("event-72", "en", "event:en-only");
  assert.equal(translatedProject(english, []), null);
  assert.equal(translatedProject(project("key-1", "en"), []), null);
});

test("portfolio titles use one brand reference in each language", () => {
  assert.equal(portfolioSeoTitle("en", "", 1), "Portfolio | Saint 6 Studio");
  assert.equal(
    portfolioSeoTitle("vi", "set-design", 2),
    "Dự án Thiết kế bối cảnh · Trang 2 | Saint 6 Studio",
  );
});
