import type { Core } from "@strapi/strapi";

const help: Record<string, string> = {
  slug: "Shared by English and Vietnamese. Use lowercase words and hyphens. Locked after publishing to protect existing links.",
  social_image:
    "Optional sharing card for Facebook, Messenger, Zalo and LinkedIn. Recommended: 1200 × 630. Leave empty for the automatic Saint 6 card.",
  social_image_alt:
    "Describe the sharing image in the current language. Leave empty to use the media-library description.",
  hero_image:
    "Default hero and automatic sharing-card photograph. Use a sharp original, not a video thumbnail.",
  hero_mobile_image:
    "Portrait artwork for phones. Keep the subject clear of the navigation and title.",
  hero_panels:
    "Up to three photographs for the desktop collage, in left-to-right order.",
  cover:
    "Main project artwork on the detail page. Choose a sharp, representative photograph.",
  thumbnail:
    "Optional image for portfolio cards. Leave empty to use the cover. Square artwork is shown in full with matching space above and below.",
  cover_alt:
    "Describe the cover image in the current language, without keyword stuffing.",
  gallery:
    "Drag to reorder. Describe each image in the current language. A film poster is not repeated in the gallery.",
  video_url:
    "Optional HTTPS YouTube watch/share/Shorts/embed URL. The player loads only when a visitor presses Play.",
  video_files:
    "Optional uploaded project films. Add short web-ready MP4 clips in playback order; the player loads after a visitor presses Play.",
  source_url:
    "Optional internal source/provenance link. It is not shown to website visitors. Leave empty for new Saint 6 work.",
  featured:
    "Include this project among the first six featured projects on the Styling page.",
  sort_order:
    "Lower numbers appear first in the portfolio and featured selection.",
  category_key:
    "Portfolio filter shared across languages. The Category field is the visible, translated label.",
  credits:
    "Credit styling personally to Trần Hoài Trang. Add other collaborators with their correct roles.",
  seo_title:
    "Unique search/social title, including the project name. Aim for concise, natural wording.",
  seo_description:
    "A distinct, accurate summary in the current language. Avoid copying another project's description.",
  body: "Plain paragraphs. Separate paragraphs with a blank line; HTML is not rendered.",
  image:
    "The team photograph below the introduction on all service pages. Use the approved wide original.",
  image_alt: "Describe the team photograph in the current language.",
  heading:
    "Introduction above the team photo, separate from the compact form header.",
  text: "Shared introduction across all service and Styling project pages.",
  form_title: "Short heading inside the enquiry form, e.g. Get in touch.",
  form_subtitle: "One short line below the form heading.",
};

// Apply once per version, then respect subsequent editor layout customizations.
export async function configureStylingEditor(strapi: Core.Strapi) {
  const marker = strapi.store({
    type: "plugin",
    name: "saint6-editor",
    key: "styling-v1",
  });
  const service = strapi.plugin("content-manager").service("content-types");
  if (await marker.get()) {
    const videoMarker = strapi.store({
      type: "plugin",
      name: "saint6-editor",
      key: "styling-video-files-v1",
    });
    if (await videoMarker.get()) return;
    const model = strapi.contentType(
      "api::styling-project.styling-project" as never,
    );
    const config = await service.findConfiguration(model);
    const edit = [...config.layouts.edit];
    if (
      !edit.some((row) => row.some((field) => field.name === "video_files"))
    ) {
      const videoIndex = edit.findIndex((row) =>
        row.some((field) => field.name === "video_url"),
      );
      edit.splice(videoIndex + 1, 0, [{ name: "video_files", size: 12 }]);
    }
    await service.updateConfiguration(model, {
      ...config,
      metadatas: {
        ...config.metadatas,
        video_files: {
          ...config.metadatas.video_files,
          edit: {
            ...config.metadatas.video_files?.edit,
            label: "Video files",
            description: help.video_files,
            visible: true,
          },
        },
      },
      layouts: { ...config.layouts, edit },
    });
    await videoMarker.set({ value: true });
    return;
  }
  const fields: Record<string, string[]> = {
    "styling-page": [
      "hero_heading",
      "hero_image",
      "hero_mobile_image",
      "hero_panels",
      "hero_alt",
      "intro_label",
      "intro_title",
      "intro_text",
      "services_title",
      "services",
      "clients_title",
      "clients",
      "portfolio_label",
      "portfolio_title",
      "portfolio_note",
      "founder_label",
      "founder_title",
      "founder_image",
      "founder_text",
      "process_title",
      "process",
      "faq_title",
      "faqs",
      "seo_title",
      "seo_description",
      "social_image",
      "social_image_alt",
    ],
    "styling-project": [
      "title",
      "slug",
      "category_key",
      "category",
      "featured",
      "sort_order",
      "summary",
      "body",
      "cover",
      "thumbnail",
      "cover_alt",
      "gallery",
      "video_url",
      "video_files",
      "credits",
      "seo_title",
      "seo_description",
      "social_image",
      "social_image_alt",
      "source_url",
    ],
    "shared-contact": [
      "heading",
      "text",
      "image",
      "image_alt",
      "form_title",
      "form_subtitle",
    ],
  };
  for (const [name, order] of Object.entries(fields)) {
    const model = strapi.contentType(`api::${name}.${name}` as never);
    const config = await service.findConfiguration(model);
    const metadatas = { ...config.metadatas };
    for (const field of order) {
      const existing = metadatas[field] || {};
      const label = field
        .replace(/_/g, " ")
        .replace(/^./, (c) => c.toUpperCase())
        .replace(/^Seo /, "SEO ");
      metadatas[field] = {
        ...existing,
        edit: {
          ...existing.edit,
          label,
          description:
            help[field] || "Edit this value for the selected language.",
          visible: true,
        },
        list: { ...existing.list, label },
      };
    }
    if (metadatas.locked_slug)
      metadatas.locked_slug.edit = {
        ...metadatas.locked_slug.edit,
        visible: false,
      };
    await service.updateConfiguration(model, {
      ...config,
      settings: {
        ...config.settings,
        mainField:
          name === "styling-project"
            ? "title"
            : name === "shared-contact"
              ? "heading"
              : "hero_heading",
      },
      metadatas,
      layouts: {
        ...config.layouts,
        edit: order.map((name) => [{ name, size: 12 }]),
        ...(name === "styling-project"
          ? {
              list: ["title", "slug", "category_key", "featured", "sort_order"],
            }
          : {}),
      },
    });
  }
  await marker.set({ value: true });
}

// Add recently introduced fields to saved editor layouts without resetting
// any subsequent layout changes made by editors in Strapi.
export async function configureRecentProjectFields(strapi: Core.Strapi) {
  const service = strapi.plugin("content-manager").service("content-types");
  const additions: Record<
    string,
    { name: string; after: string; description: string }[]
  > = {
    "styling-project": [
      { name: "thumbnail", after: "cover", description: help.thumbnail },
    ],
    "event-project": [
      {
        name: "summary",
        after: "category",
        description: "Short introduction shown on the portfolio card.",
      },
      {
        name: "body",
        after: "summary",
        description: "Project detail paragraphs, separated by blank lines.",
      },
      {
        name: "credits",
        after: "body",
        description: "People and roles shown on the project detail page.",
      },
    ],
    "portfolio-item": [
      {
        name: "summary",
        after: "category",
        description: "Short introduction shown on the portfolio card.",
      },
      {
        name: "body",
        after: "summary",
        description: "Project detail paragraphs, separated by blank lines.",
      },
      {
        name: "gallery",
        after: "image",
        description: "Additional images shown on the project detail page.",
      },
      {
        name: "credits",
        after: "gallery",
        description: "People and roles shown on the project detail page.",
      },
    ],
    "studio-room": [
      {
        name: "hero_image",
        after: "image",
        description: "Wide image shown at the top of the room detail page.",
      },
    ],
  };
  for (const [name, fields] of Object.entries(additions)) {
    const model = strapi.contentType(`api::${name}.${name}` as never);
    const config = await service.findConfiguration(model);
    const edit = config.layouts.edit.map((row) => [...row]);
    const metadatas = { ...config.metadatas };
    let changed = false;
    for (const field of fields) {
      if (edit.some((row) => row.some((item) => item.name === field.name)))
        continue;
      const afterIndex = edit.findIndex((row) =>
        row.some((item) => item.name === field.after),
      );
      edit.splice(afterIndex < 0 ? edit.length : afterIndex + 1, 0, [
        { name: field.name, size: 12 },
      ]);
      const existing = metadatas[field.name] || {};
      metadatas[field.name] = {
        ...existing,
        edit: {
          ...existing.edit,
          description: field.description,
          visible: true,
        },
      };
      changed = true;
    }
    if (changed)
      await service.updateConfiguration(model, {
        ...config,
        metadatas,
        layouts: { ...config.layouts, edit },
      });
  }
}
