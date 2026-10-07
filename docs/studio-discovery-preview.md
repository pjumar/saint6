# Studio discovery preview

This release implements audit recommendations 1–4: correct statistics in initial HTML, page-specific search metadata and introductory copy, a dedicated floorplan, and visible studio specifications. Section links scroll smoothly and honor reduced motion. Existing video capabilities and project case studies are outside this release.

## Content and measurements

The published CMS supplies current rates, areas and ceiling heights. Widths with no CMS value are omitted rather than replaced with a made-up measurement. Optional `dimensions` and localized `inclusions` fields have been added to Studio Room. These fields appear on the page when populated.

The 125 m² option is a partial-space booking within the larger rooms, according to the owner. Statistics therefore describe **booking options**, not a count of separate physical rooms. Total venue area is 900 m²; the largest listed blank room is 360 m². Do not add the booking-option areas together to calculate the venue area. The supplied floorplan shows the 250 m² and 360 m² rooms, concept spaces and preparation areas; it is also retained in existing galleries.

## Editing in Strapi

The additive **Studio & Search Content** single type has independently published English and Vietnamese versions:

- **Pages:** route, SEO title, SEO description, optional hero heading and introduction. Nine existing core routes have unique titles and descriptions; new headings and introductions are supplied for Home, Studio Rental and Production. Existing Styling metadata stays on its current model.
- **Navigation links:** labels and section targets, including the floorplan link.
- **Floorplan:** media, alternative text, label, heading, description and enlargement button label. The truck-access feature has editable heading, description, label, photo and alternative text. The wider supplied HEIC photo is converted to an optimized WebP for the website.
- **Room summaries:** an area and space type identify the booking option; the description is shown on room cards and in the booking dialog. Individual room inclusions can override the shared inclusion copy.
- **Specification labels, statistics labels and currency:** localized display content. Measurements and rates continue to come from Studio Rental Page / Studio Room.
- **Workshops:** heading, paragraphs and CTA label.
- **Full rental:** heading and description. Rates continue to come from the existing CMS.

Page-specific metadata is independent of the visual hero heading. The frontend reader requires complete metadata for each existing route; failed requests throw so ISR retains the previous successful page.

## Isolated local CMS

Run with Node 24 (the installed SQLite dependency was built for that version):

```sh
node scripts/studio-discovery/seed-local.cjs --generate-types --verify
node scripts/studio-discovery/seed-local.cjs --serve --editor
```

The script uses a separate SQLite database under `strapi/.tmp/studio-discovery-preview`, separate secrets, and localhost port 1347. It never imports into Strapi Cloud. Subsequent runs preserve existing local copy unless `--refresh-preview` is explicitly supplied. `--verify` exercises unpublished draft isolation; avoid that option while editing a draft. Local editor credentials remain in the ignored `editor.private.json` file.

To read the local content through the frontend:

```sh
STUDIO_DISCOVERY_SOURCE=cms
STUDIO_DISCOVERY_STRAPI_URL=http://127.0.0.1:1347
```

The alternate origin never inherits the production API token. Its optional token is `STUDIO_DISCOVERY_STRAPI_TOKEN`.

## Hosted review and later production release

The Vercel review deployment uses the draft seed content for the new model. Existing studio measurements, rates, photography and gallery content still come from the current published CMS. Preview deployments remain noindex and preserve the project's existing preview form restrictions.

For a CMS-backed hosted preview, deploy the additive schema to a reachable staging CMS, import the new content there, publish both locales and configure the origin/token above. The importer needs explicit `STUDIO_DISCOVERY_IMPORT_URL` and `STUDIO_DISCOVERY_IMPORT_TOKEN` environment variables. It defaults to a dry run; `--apply` imports only missing locales as drafts and preserves existing editorial content:

```sh
node scripts/studio-discovery/import-hosted.cjs
node scripts/studio-discovery/import-hosted.cjs --apply
```

Before a later production frontend deployment, deploy the additive Strapi schema against a backed-up production database, import/review/publish both new locale entries, grant the frontend read access, and set `STUDIO_DISCOVERY_SOURCE=cms`. Production intentionally refuses the preview seed. No production website or cloud CMS migration is part of this preview deployment.
