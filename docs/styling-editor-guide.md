# Styling editing and launch guide

## Where to edit

| Strapi entry | Website content |
| --- | --- |
| Styling Page | Service-page hero, brand logos, services, founder, process, FAQs and SEO |
| Styling Project | Project title/copy, category, featured position, cover, gallery, film and credits |
| Shared Contact Section | Introduction above the team photograph, team image and compact form heading on service/project pages |

Select English or Vietnamese before editing. Each language has its own draft and published version. Use **Save** to keep a draft, then **Publish** to make that language available. The website only reads published records. Publish both translations before promoting a new project.

The hosted Vercel review preview still uses the approved seed dataset until a hosted CMS connection is explicitly configured. The local walkthrough uses the isolated database, never Strapi Cloud. A CMS-backed website caches content for five minutes; the first request after expiry can show stale content while revalidation runs. Refresh again to see the new version.

## Project fields

- **Slug:** lowercase words and hyphens. Shared between languages; unique across different projects. Once published it is locked, including after unpublishing. Create new work with a new entry and a new slug. Do not rename existing URLs casually.
- **Category key:** the archive filter. **Category:** its translated label. Lower **Sort order** appears first; **Featured** includes the project in the first six selected works.
- **Cover / gallery:** use sharp originals. Supply useful localized descriptions. Drag gallery entries to reorder. The film poster is omitted from the gallery to avoid duplication. Check both mobile and desktop composition after replacement.
- **Video URL:** an optional HTTPS YouTube watch, share, Shorts or embed URL. The player only loads after Play; an external YouTube link is always available. Embedding restrictions are controlled by the video owner.
- **Social image:** optional artwork, ideally 1200 × 630. Keep important details away from the edges. **Social image alt** describes it in the selected language. Empty fields use the automatic card, preserving the full photograph with Saint 6 branding.
- **SEO title / description:** distinct, accurate wording for each project, in the selected language. Do not invent project dates or campaign results.
- **Source URL:** optional internal provenance, never a visitor-facing link. New Saint 6 projects can leave it empty.
- **Credits:** credit styling personally to Trần Hoài Trang. Preserve other collaborators and their correct roles.

Custom social artwork is used as uploaded; its aspect ratio is not silently altered. Preview the card before publishing. The automatic card is always 1200 × 630.

## Local verification

Use Node 24 on this Mac, matching SQLite's native binding:

```sh
node scripts/styling/seed-local.cjs --generate-types --serve --editor
node scripts/styling/verify-local.cjs
node --import tsx --test tests/styling.test.ts tests/form-tracking.test.ts
```

The seeder forces localhost, an isolated SQLite database and separate secrets. Its optional local editor login is saved privately in `strapi/.tmp/styling-preview-archive/editor.private.json`. Do not commit it. The verification script removes only the temporary QA records it created. Avoid running verification while actively editing the same local project.

For the frontend, set `STYLING_CONTENT_SOURCE=cms` and `STYLING_STRAPI_URL=http://127.0.0.1:1346`. The alternate CMS URL does not inherit production API credentials. The local API has read-only public permissions for the three new types; production should use a server-only read token.

## Controlled form tests

Production retains the existing Strapi recipient configuration. Preview/local builds disable sending and ad tracking by default. Set server build variable `PREVIEW_FORM_TESTS_ENABLED=true` only for an approved test, then remove it/restart after testing. Every non-production test is prefixed **SAINT6 PREVIEW TEST — DO NOT ACTION** and uses test attribution. It creates a record and may send an email through the normal configured API, so use it sparingly. This pass authorized one contact and one booking.

Success means the API accepted the enquiry. Separately confirm email delivery in the configured inbox; an accepted enquiry can be saved even if the email provider fails. Never infer inbox delivery from the success screen alone.

## Launch and rollback

1. Keep production untouched while reviewing the Vercel preview. Finish device, social-card, speed and notification checks.
2. Immediately before any hosted CMS migration, take a fresh encrypted content/media/configuration export and verify it. The September 21 production backup is historical, not a substitute for a current export.
3. Deploy schema changes without replacing the production database. Import only missing approved Styling entries/media and preserve existing business records. Removing the obsolete Styling Page contact fields should happen only after the export.
4. Grant the frontend server token read access to Styling Page, Styling Project and Shared Contact Section; no content writes. Publish both locales and verify the media host, API permissions and all routes against the intended CMS.
5. Set production `STYLING_CONTENT_SOURCE=cms` and, only after launch approval, `STYLING_PUBLIC_ENABLED=true`. Never enable `PREVIEW_FORM_TESTS_ENABLED` for public testing.
6. Record both the exact previous Vercel production deployment and CMS commit/export. If the frontend fails, promote the previous deployment or disable the Styling feature flag and redeploy. Do not delete CMS records as a frontend rollback.
7. If a CMS rollback is necessary, stop writes, rehearse restoration against an isolated database/media directory, and verify counts and assets before restoring production. Restoring an older database would discard later enquiries; reconcile them first.

The local recovery checkpoint is under `.backups/2026-09-29-before-styling-readiness`, with a tracked-source archive, SQLite snapshot, upload archive and checksums. Source commit `4261fde2f6b743c8f97a20ae80c17a386c22c331` is the pre-readiness preview. The database restore check returned `ok` with 454 published localized project rows.

For an intentional URL change, prepare permanent redirects for **both languages**, update internal links and metadata, and test the old URLs before an administrator changes the protected slug. This release intentionally blocks that operation instead of silently breaking shared links.

## iPhone / Safari review

Open the final Vercel preview on the iPhone, in English and Vietnamese:

1. Check the main hero, project images and footer at portrait and landscape widths; no horizontal scrolling or cut-off controls.
2. Use Explore the work, archive search/filter, pagination and a project’s language switch.
3. On the Đen Vâu project, play the film, enter/exit fullscreen and test Open on YouTube.
4. Open/close the booking dialog; check the calendar, time controls and keyboard visibility. Ordinary preview form sending should be disabled.
5. Tap Messenger and Zalo; confirm they open the correct destination. Do not send extra test messages.

Browser viewport testing does not replace a real iPhone or Android device check. Record any device-specific issue before production approval.
