# Strapi field audit — 14 October 2026

Scope: changes merged on 13–14 October 2026, compared with the published English and Vietnamese Strapi API. Navigation, layout, filtering, cache, and upload-size releases did not add content fields.

| Recent field or content update | Live CMS state | Website connection |
| --- | --- | --- |
| `event-project.summary`, `body`, `credits` | Fields exist; all published values are empty (EN: 4 projects, VI: 5). | Portfolio detail pages read these fields. Event page queries now explicitly populate credits. Editors need to supply content before it can appear. |
| `portfolio-item.summary`, `body`, `gallery`, `credits` | Fields exist; all published values are empty (87 projects in each locale). | Portfolio detail pages read these fields. Set design, decor, creative, and direct item queries now explicitly populate gallery and credits. Editors need to supply content before it can appear. |
| `studio-room.hero_image` | Populated for all 6 published rooms in both locales. | Room queries explicitly populate it; room detail pages prefer the CMS hero. |
| `styling-project.video_files` | Field exists; 7 of 257 published projects have files in each locale. | Styling project detail queries already populate it, with compatibility handling during schema rollout. |
| Six refreshed Drive project covers | The expected cover files are published for all 6 projects in both locales. | Styling cards and detail pages read the CMS cover. |
| `styling-project.thumbnail` for ELISE, MB PriFlexi, and Thiều Bảo Trâm | Not yet deployed: the live API rejects `populate[thumbnail]`. | This branch adds the optional media field and makes cards prefer it while retaining the existing cover for detail pages. Cards use the cover until CMS thumbnails are published. |

Strapi has saved Content Manager layouts. This branch also adds any missing recent fields to their editing forms without resetting editors' existing field order. The thumbnail is placed beside the Styling project cover.

The selected images are kept in the ignored `.backups/styling-thumbnail-source/` directory on the operator's computer. They are not committed to GitHub. Set `STYLING_THUMBNAIL_SOURCE_DIR` if running elsewhere. After the Strapi schema is deployed, run `node scripts/styling/update-project-thumbnails.cjs --plan`, then `node scripts/styling/update-project-thumbnails.cjs --apply` with a server-only Strapi token. The apply command uploads the three approved images directly to Strapi, updates EN and VI published records, saves previous thumbnail IDs in `.backups/styling-thumbnails.json`, and verifies each result. Refresh the styling cache or allow its normal one-hour revalidation window before checking the live cards.
