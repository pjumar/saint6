# Styling preview — September 2026

## Review scope

Preview branch `codex/styling-preview`. No production deployment, live CMS migration or new tracking destination. Two explicitly approved, clearly labelled form tests were submitted to the existing notification flow on 29 September; inbox confirmation is recorded separately.

English and Vietnamese service pages at `/{locale}/styling`, plus 227 project pages and a searchable, paginated archive at `/{locale}/styling/{slug}`. Uses Saint 6’s existing fonts, header, navigation, hero, red section header, neutral backgrounds and footer. The main hero is a responsive three-panel composition of Kỳ Duyên in Dior, Đen Vâu and My Truth in Denim. Mobile uses a separate portrait image. Minh Triệu projects remain in the archive, but never in the main hero. All styling credits name **Trần Hoài Trang** personally. The legal company name in the existing footer remains correct and unchanged.

The project descriptions are new editorial summaries of the source imagery, not claims about campaign results. Original collaboration credits and source URLs are retained internally; the visitor-facing links to Trang’s personal website are removed. The source site’s placeholder 1970 dates are deliberately omitted. Realme was excluded because its source lists a different stylist.

## Content and assets

- `app/lib/styling/seed.json`: bilingual review copy and 227 projects.
- `docs/styling-sources.json`: source pages, source credits and image provenance.
- `public/images/styling/`: optimized WebP images fetched from Trang’s portfolio; no runtime hotlinking.
- `docs/styling-copy.md`: readable English and Vietnamese draft.

The preview uses the seed copy while the existing CMS stays untouched. The real CMS read path has also been tested against an isolated local Strapi instance with both languages, media uploads, gallery components and publication states.

## Strapi editor structure

**Styling Page** is a localized single type: hero image, mobile image, repeatable hero panels, brand-logo list and localized alt text, introduction, four repeatable service blocks, portfolio heading, founder profile with editable portrait, repeatable process steps, FAQs, SEO fields and optional social-image/alt fields.

**Shared Contact Section** is a localized single type for the introduction above the team photo, its image/alt and the compact form heading/subtitle. The old, unused Styling Page contact fields have been removed. Existing service pages keep their approved translation fallback if this shared CMS setting is unavailable.

**Styling Project** is a localized collection: shared slug, title, category, filter category, featured toggle, summary, body paragraphs, cover and localized alt text, repeatable gallery images and alt text, role/name credits, optional internal source URL, validated optional YouTube URL, order, SEO fields and optional social-image/alt fields. English and Vietnamese share the same document ID and slug. New projects appear automatically in the paginated archive; featured projects are shown on the service page (up to six); publish both languages before adding a project to avoid an untranslated destination.

Duplicate slugs are rejected across documents while translations share the same slug. Published slugs cannot be renamed, even after unpublishing; an administrator must prepare a redirect before a deliberate URL migration. PostgreSQL uses a transaction advisory lock for simultaneous saves; isolated SQLite serializes writers. The frontend reads published content only and revalidates every five minutes. CMS errors throw rather than silently restoring the review copy.

## Safe local CMS demonstration

From the repo root, using the Node version matching the installed Strapi native SQLite module (Node 24 on this Mac):

```sh
node scripts/styling/seed-local.cjs --generate-types --serve
```

This script forces an isolated SQLite database under `strapi/.tmp/styling-preview-archive`, creates separate local secrets, binds to `127.0.0.1:1346`, disables the retention cron and imports only missing styling content. Rerunning does not overwrite editorial changes. `--refresh-preview` explicitly refreshes this isolated local styling dataset from the reviewed seed; it is never a production import command. It does not load the production `.env` or access Strapi Cloud. Uploaded local files and secrets remain gitignored. The optional `--generate-types` refreshes Strapi’s schema typings. Do not transfer this isolated database over the real CMS: it contains no existing business content.

For a staging CMS, deploy these schema additions to that environment, import the reviewed copy/media there and give the frontend token read-only access to the three new types. Set:

```dotenv
STYLING_CONTENT_SOURCE=cms
STYLING_STRAPI_URL=https://your-staging-strapi.example
STYLING_STRAPI_TOKEN=your-server-only-read-token
```

Without a URL override the reader uses the existing Strapi URL/token. With an alternate URL, provide its own server-only token; the production token is never forwarded to a different CMS. Local development explicitly permits image access to 127.0.0.1:1346; hosted previews need an approved reachable media host. The Vercel preview remains the staging website; no additional hosted CMS was created.

## Future production launch — not performed

1. Approve the page design, copy, project selection and image reuse.
2. Back up the existing CMS and deploy the additive schema changes separately. Import the reviewed images and both localized versions **without replacing the current database**; do not overwrite existing styling entries on retries.
3. Grant the existing frontend server token read access to Styling Page, Styling Project and Shared Contact Section. Keep create/update/delete permissions out of the frontend token.
4. Set `STYLING_CONTENT_SOURCE=cms` in the production frontend. Verify that all 227 projects, both languages, images, alt text and credits are published in Strapi.
5. Only then set server-side `STYLING_PUBLIC_ENABLED=true` and deploy the approved frontend.

Until that explicit production switch, the new routes return 404 in Vercel Production, the navigation link stays hidden and the sitemap excludes Styling. Public launch also refuses seed content: it requires CMS mode. Preview deployments have `X-Robots-Tag: noindex, nofollow` and new routes have noindex metadata.

SEO includes unique page titles/descriptions, canonical URLs, EN/VI/x-default alternatives, correct Open Graph URLs/images, Service / CreativeWork / BreadcrumbList structured data, server-rendered project links and the production sitemap integration. No invented dates, awards or review ratings.

The Styling service, archive and project detail pages reuse the existing service-page contact form, including its Strapi submission and success-only conversion event. The approved contact and booking tests use explicit test attribution and labels. Non-production builds load no GTM container, do not emit form/Zalo conversion events and do not prepare Messenger referrals. Preview forms are disabled unless the server build variable `PREVIEW_FORM_TESTS_ENABLED=true` is explicitly set for a controlled test; the published review preview leaves it unset. Production sending and visitor attribution remain intact. The approved service introduction sits above the team photo, separate from the compact form header, in both languages. On mobile it precedes the photo. The lower company footer remains unchanged. Duplicate inline Messenger/Zalo links are removed; the shared floating buttons remain.

## Expanded archive review

228 source projects were inventoried across all five source index pages. **227 are included**. Realme 8 Pro is excluded at the owner’s explicit request because the source credits Vu Anh Le as stylist. The source’s placeholder dates and filler photography explanations were not copied. Older archive copy is intentionally concise and editable; the featured projects have individual editorial descriptions.

`/{locale}/styling/projects` supports six category filters, accent-insensitive name/brand search and 18 projects per page. Filters and pagination use server-rendered links/GET forms, so the archive remains usable without JavaScript. Search results are noindex; clean archive/category/pagination URLs have their own canonical and language alternates. CMS reads traverse every API page and never truncate at 100 projects.

Project cards use each image’s natural aspect ratio. Project heroes fill the width with a suitable wide cover or a two/three-image composition from the same project gallery. On mobile the hero chooses a portrait when available. Projects with only one suitable image retain it over a softened version of that same photograph, avoiding empty sidebars or an enlarged sharp thumbnail. Galleries preserve complete images. Pantene uses its original portrait campaign image instead of an enlarged film thumbnail. No source image is artificially upscaled during asset preparation.

Twelve official logo assets are documented in `docs/styling-brand-sources.json`. “Selected brands in our portfolio” encompasses campaign, editorial and celebrity styling; it does not assert twelve direct client contracts. Each logo opens the matching project search. La Habana is retained as an editorial title; its source lists BCBG, FCUK, DKNY, Maschio, Jessie Dolls and Fragile Spine as clothing brands, so no unrelated La Habana logo is used.

`docs/styling-archive-sources.json` records the full portfolio inventory and selected-image provenance. The original eight-project source audit remains available in `docs/styling-sources.json`. The production frontend and live CMS content models remain untouched. The only live CMS writes in this readiness pass are the two approved labelled form-test records.

## Preview refinements

The founder portrait is the owner-selected ELLE Decoration image, stored locally at `public/images/styling/tran-hoai-trang-elle.webp`. Source: https://cdn.elledecoration.vn/Ooe1mG7BhlhsaU4VsF1uJPIpsUEvXXN1vmX5wqs8QXw/rs:fit:1280:0/quality:82/2023/07/IMG_9506tnt.jpg@webp

Brand logos retain their original artwork. Optional `logo_view_box` frames unused canvas, while `display_width` sets the optical size in rem; both are editable on each CMS client component. The portfolio CTA no longer includes a count. Explore the work smoothly scrolls to the project grid, with an instant-scroll reduced-motion alternative and a normal anchor fallback.

Projects with a recognized YouTube URL display a responsive film section after the introduction and before the gallery. The self-hosted project poster loads first; the YouTube privacy-enhanced player is created only after an explicit Play click. Playback was verified with the Đen Vâu film. An ordinary YouTube link remains available for unavailable or embedding-restricted videos. The CMS video URL supports standard watch, share, shorts and embed URLs. No new analytics event is added.

The selected film poster is omitted from the still-image gallery to avoid repeating the same image. If it was the project’s only still, the empty gallery section is omitted; additional distinct photographs remain.

## Readiness verification and recovery

See `docs/styling-editor-guide.md` for editing, publishing and recovery steps. `node scripts/styling/verify-local.cjs` tests the real isolated database: drafts, bilingual publication, media replacement, ordering, custom social images, URL locks and concurrent duplicate saves. The local seeder accepts `--editor` to serve the built admin UI and creates a private, local-only QA login in its ignored directory. It never changes a production account.

Social cards use the page/project's optional custom artwork. Otherwise `/api/styling/social` renders a 1200 × 630 Saint 6 card with the complete photograph, title and existing Saira Condensed typeface. Local preview artwork is bundled with that route; CMS artwork is fetched from approved media hosts. Canonical URLs stay on production, while preview Open Graph URLs/images use that deployment's hostname. Vercel authentication still restricts external crawlers; valid external social/speed checks require an accessible preview link.

The CMS listing API now excludes galleries and credits. Each project detail fetches only its own complete record. Draft edits and unpublishing follow the five-minute cache window; refresh twice after the window because revalidation can serve one stale response while fetching the update.
