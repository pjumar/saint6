# Business identity and search indexing

The frontend publishes JSON-LD in the server-rendered HTML. No new Strapi content type is needed: the public facts remain editable through the existing CMS entries.

| Structured information | Strapi source |
| --- | --- |
| Business name and representative image | SEO Metadata: `site_name`, `og_image` |
| Venue address | Contact Page: `info.address_line_1`, `info.address_line_2`; Footer address is a fallback |
| Public phone numbers and email | Footer, with Contact Page as a fallback |
| Official profiles | Social Links |
| Business description | Studio & Search Content: home introduction |
| Rental and production service names/descriptions | The same headings and introductions rendered visibly on those pages |
| Rental offers | The same transformed room titles, descriptions, images and rates rendered visibly on the rental page |
| Full-venue offer | Studio Rental Page: full-rental rate; Studio & Search Content: full-venue title and description |
| Currency | Studio & Search Content: `currency` |

Publish each locale after editing. Existing ISR revalidation updates the website. Both languages identify the same business at `https://www.saint6.studio/#studio`, and both services reference that identity. Rates are explicitly per hour, and unparseable or unconfirmed rates are omitted. Booking options are represented as services rather than distinct physical rooms; the full venue is not represented as a single 900 m² shooting room. Reviews, availability, opening hours and coordinates are not invented.

CMS text is serialized with `<` escaped before insertion into the JSON-LD script. The business graph is omitted if its name or address is absent.

The sitemap includes English/Vietnamese alternatives for every core page. It does not manufacture a modification date on each build.

## Ownership and crawler access

The localized root metadata includes the public `msvalidate.01` ownership code for the Bing property `https://www.saint6.studio/` belonging to the user-confirmed `petr@conceptual.studio` account. This is a public verification value, not an API credential; keep it deployed to retain verification.

`public/robots.txt` allows all crawlers, including OAI-SearchBot. Vercel's project firewall should continue allowing AI bots. The audit on 7 October 2026 found AI Bots set to Allow, Bot Protection off, no custom or IP blocking rules, and six allowed requests with an OAI-SearchBot user agent in the preceding day. No security bypass rule was needed or added.

Google Search Console already has the `sc-domain:saint6.studio` property. Its production sitemap was successful and last read on 5 October 2026. The English rental page was crawled but not indexed, last crawled 21 August; the Vietnamese rental page was indexed, last crawled 24 July. These observations precede this update. Submitting indexing requests means requesting a crawl, not confirming indexing or guaranteeing inclusion in recommendations.

For subsequent releases, inspect and request a refresh for the affected canonical URLs and verify sitemap processing. Check the current indexing verdict and selected canonical in Search Console and Bing Webmaster Tools rather than inferring indexing from search-result snippets.

## Validation

Run `node --import tsx --test tests/business-seo.test.ts tests/studio-discovery.test.ts`, then a production build using the published CMS sources. Verify the live HTML for both languages, prices and hourly units, provider references, canonical URLs, ownership tag and sitemap language alternatives. Validate the live rental page with Google's Rich Results Test or Schema.org's validator. Optional rich-result recommendations do not imply an indexing failure.
