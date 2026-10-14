import assert from "node:assert/strict";
import { test } from "node:test";
import { projectThumbnail } from "../app/lib/styling/project-thumbnails";
import type { StylingProject } from "../app/lib/styling/types";

const cover = {
  url: "https://cms.example/cover.jpg",
  width: 1200,
  height: 1500,
  alternativeText: "Project cover",
};

test("a CMS thumbnail replaces the card image without changing the cover", () => {
  const project = {
    slug: "elise-pure-urban-chic-lookbook",
    cover,
    thumbnail: {
      url: "https://cms.example/new-thumbnail.jpg",
      width: 2000,
      height: 2000,
      alternativeText: "Editor selected thumbnail",
    },
  } as StylingProject;

  const selected = projectThumbnail(project);
  assert.equal(selected.image.url, project.thumbnail?.url);
  assert.equal(selected.fit, "contain");
  assert.equal(selected.ratio, 4 / 5);
  assert.equal(project.cover.url, cover.url);
});

test("a project without a thumbnail continues using its cover", () => {
  const selected = projectThumbnail({
    slug: "another-project",
    cover,
  } as StylingProject);
  assert.equal(selected.image, cover);
  assert.equal(selected.fit, undefined);
});
