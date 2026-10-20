# OpenAI rental enquiry measurement

The public Saint 6 website uses the OpenAI Measurement Pixel to report completed rental enquiries. The standard event is `lead_created`, with data `{ type: "customer_action" }`. It carries the saved Strapi submission identifier as `event_id` and `opt_out: true`; it has no monetary value, form contents or manually supplied customer identifiers.

## What counts

- A booking enquiry counts only after the existing Strapi booking endpoint responds successfully with a saved ID. It remains an enquiry, not a confirmed or paid booking.
- A contact enquiry counts only when submitted on an English or Vietnamese studio-rental page, including room detail pages, and the successful response contains a saved ID.
- Form openings, outbound Messenger/Zalo clicks, validation errors, failed requests and responses without an ID are not OpenAI lead conversions.
- The stable `booking-<id>` / `contact-<id>` identifiers prevent collisions between Strapi collections. The browser deduplicates identifiers per Pixel and tab session, with an in-memory fallback when session storage is unavailable.

No Strapi schema migration or controller change is required: the existing endpoint already responds after saving the enquiry and returns the needed ID. Existing email notifications and Google Tag Manager events retain their behavior.

## Consent and deployment boundaries

Set the public `NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID` configuration for the Production environment of the existing Vercel project. The Pixel runs only when the build environment is `production` and the hostname is exactly `saint6.studio` or `www.saint6.studio`. Local, preview and deployment aliases never load the SDK or emit events, even if a Pixel ID is present.

The bilingual notice requires opt-in before loading the SDK. A supported Global Privacy Control signal overrides an opt-in. Visitors can reopen their choice from the footer; revocation sends `oaiq("consent", false)`, removes pending queued events and asks the SDK to clear its attribution cookies. Changes to consent in another tab are synchronized. An enquiry blocked without permission is never replayed later.

The SDK handles `oppref` capture and its attribution cookies after consent. Do not append reserved click-reference parameters to ad URLs. The existing UTM parameters remain unchanged.

The account UI describes automatic advanced matching but currently exposes no switch, so its effective default has not been verified. The notice explicitly covers possible hashed contact identifiers, and the website privacy notice explains the provider and cookies. The integration itself does not supply raw or hashed contact fields. Do not claim that SDK-side matching is disabled.

## Ads Manager configuration

The intended source is **Saint 6 website**, with **Completed rental enquiries** selecting standard `lead_created` events from that source. It is attached to **Saint 6 Studio Rental — October 2026** for reporting. Adding measurement does not change the campaign's clicks objective, CPC billing, Maximize Clicks bidding, daily budget, location or end date.

## Verification

Run the repository's local executables directly:

```sh
node --import tsx --test tests/openai-ads.test.ts tests/form-tracking.test.ts
node_modules/.bin/tsc --noEmit
node_modules/.bin/biome check app/lib/openai-ads.ts app/components/openai-ads-consent tests/openai-ads.test.ts
```

Use mocked SDK calls for automated success, failure, consent and deduplication tests. Preview forms stay disabled by default. Do not send synthetic production leads or test enquiry emails to verify this integration. On production, inspect the notice and SDK loading after opt-in without submitting a form. Then confirm the first genuine, consented rental enquiry in the source's recent event diagnostics; recent events are a bounded sample, not attributed campaign totals. Ads must pass review and get eligible traffic before attributed lead results can be evaluated.

Official references: [Measurement Pixel](https://developers.openai.com/ads/measurement-pixel), [Supported Events](https://developers.openai.com/ads/supported-events), [Conversion Tracking](https://developers.openai.com/ads/conversion-tracking).
