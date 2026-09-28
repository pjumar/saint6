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
    "Portfolio thumbnail and main project artwork. Choose a sharp, representative photograph.",
  cover_alt:
    "Describe the cover image in the current language, without keyword stuffing.",
  gallery:
    "Drag to reorder. Describe each image in the current language. A film poster is not repeated in the gallery.",
  video_url:
    "Optional HTTPS YouTube watch/share/Shorts/embed URL. The player loads only when a visitor presses Play.",
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
  if (await marker.get()) return;
  const service = strapi.plugin("content-manager").service("content-types");
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
      "cover_alt",
      "gallery",
      "video_url",
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
