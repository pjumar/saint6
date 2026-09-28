# Styling preview — September 2026

## Review scope

Preview branch `codex/styling-preview`. No production deployment, live CMS migration, new tracking destination, enquiry submission or message sent.

English and Vietnamese service pages at `/{locale}/styling`, plus eight project pages at `/{locale}/styling/{slug}`. Uses Saint 6’s existing fonts, header, navigation, hero, red section header, neutral backgrounds and footer. The homepage hero is Minh Triệu & Kỳ Duyên at the Lê Thanh Hoà fashion show. All styling credits name **Trần Hoài Trang** personally. The legal company name in the existing footer remains correct and unchanged.

The project descriptions are new editorial summaries of the source imagery, not claims about campaign results. Original collaboration credits and source URLs are retained. The source site’s placeholder 1970 dates are deliberately omitted. Realme was excluded because its source lists a different stylist.

## Content and assets

- `app/lib/styling/seed.json`: bilingual review copy and 8 projects.
- `docs/styling-sources.json`: source pages, source credits and image provenance.
- `public/images/styling/`: 43 optimized WebP images fetched from Trang’s portfolio; no runtime hotlinking.
- `docs/styling-copy.md`: readable English and Vietnamese draft.

The preview uses the seed copy while the existing CMS stays untouched. The real CMS read path has also been tested against an isolated local Strapi instance with both languages, media uploads, gallery components and publication states.

## Strapi editor structure

**Styling Page** is a localized single type: hero image and localized alt text, introduction, four repeatable service blocks, portfolio heading, stylist profile, repeatable process steps, FAQs, enquiry heading and SEO fields.

**Styling Project** is a localized collection: shared slug, title, category, summary, body paragraphs, cover and localized alt text, repeatable gallery images and alt text, role/name credits, original source URL, optional video URL, order and SEO fields. English and Vietnamese share the same document ID and slug. New projects appear automatically in the page listing; publish both languages before adding a project to avoid an untranslated destination.

Keep `slug` unique across projects and stable after launch. Changing an existing public slug will require a redirect. The frontend reads published content only and revalidates every five minutes. CMS errors throw rather than silently restoring the review copy.

## Safe local CMS demonstration

From the repo root, using the Node version matching the installed Strapi native SQLite module (Node 24 on this Mac):

```sh
node scripts/styling/seed-local.cjs --generate-types --serve
```

This script forces an isolated SQLite database under `strapi/.tmp/styling-preview`, creates separate local secrets, binds to `127.0.0.1:1346`, disables the retention cron and imports only missing styling content. Rerunning does not overwrite editorial changes. It does not load the production `.env` or access Strapi Cloud. Uploaded local files and secrets remain gitignored. The optional `--generate-types` refreshes Strapi’s schema typings. Do not transfer this isolated database over the real CMS: it contains no existing business content.

For a staging CMS, deploy these schema additions to that environment, import the reviewed copy/media there and give the frontend token read-only access to the two new types. Set:

```dotenv
STYLING_CONTENT_SOURCE=cms
STYLING_STRAPI_URL=https://your-staging-strapi.example
STYLING_STRAPI_TOKEN=your-server-only-read-token
```

The URL/token overrides are optional: without them the reader uses the project’s existing Strapi URL and server-only token. A staging deployment using localhost images needs a reachable media host accepted by Next’s image configuration.

## Future production launch — not performed

1. Approve the page design, copy, project selection and image reuse.
2. Back up the existing CMS and deploy the additive schema changes separately. Import the reviewed images and both localized versions **without replacing the current database**; do not overwrite existing styling entries on retries.
3. Grant the existing frontend server token read access to Styling Page and Styling Project. Keep create/update/delete permissions out of the frontend token.
4. Set `STYLING_CONTENT_SOURCE=cms` in the production frontend. Verify that all eight projects, both languages, images, alt text and credits are published in Strapi.
5. Only then set server-side `STYLING_PUBLIC_ENABLED=true` and deploy the approved frontend.

Until that explicit production switch, the new routes return 404 in Vercel Production, the navigation link stays hidden and the sitemap excludes Styling. Public launch also refuses seed content: it requires CMS mode. Preview deployments have `X-Robots-Tag: noindex, nofollow` and new routes have noindex metadata.

SEO includes unique page titles/descriptions, canonical URLs, EN/VI/x-default alternatives, correct Open Graph URLs/images, Service / CreativeWork / BreadcrumbList structured data, server-rendered project links and the production sitemap integration. No invented dates, awards or review ratings.

The enquiry section links to the existing contact page and to Messenger/Zalo. Messenger reuses the existing referral helper and its feature flag. Zalo emits the existing `zalo_click` event with `styling_enquiry` placement. No new message-sent conversion is claimed.
