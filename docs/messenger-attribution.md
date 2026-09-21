# Messenger message attribution

Status: implementation prepared; not enabled for public visitors. Meta app **Saint6 Messenger Attribution**, ID `1612647403841382`, belongs to business `525053939501454`. The only intended Page is **SAINT 6 STUDIOS**, ID `103955275891976`.

## What counts

The floating website link receives a random reference after the private Strapi store confirms that the visit was saved. The reference contains no campaign, click ID, person ID or message content. If preparation fails, the original Messenger link still works.

Meta sends a referral when an existing conversation opens, or a Get Started postback for a new conversation. Neither is a lead. A lead is the first subsequent inbound text or attachment, attributed to the most recent valid website referral. One reference can produce at most one lead and bind to one person. Distinct people use a keyed hash of the Page-scoped ID; reporting totals must not sum distinct people across campaigns.

Webhook signatures are verified against the original bytes before parsing. Only the configured Page is accepted. Raw message content, attachments, profile names and Page-scoped IDs are discarded before storage. Retries are deduplicated using a database unique key. Reports derive matches using event timestamps, so delayed or reordered notifications remain correct. Records are retained for 30 days, attribution lasts at most 7 days, and reports cover the latest 23 days to preserve a complete lookback.

## Deployment configuration

Vercel server variables:

- `MESSENGER_TRACKING_MODE`: `off` (default), `test`, or `live`.
- `MESSENGER_BRIDGE_SECRET`: a cryptographically random secret of at least 32 characters, identical in Strapi.
- `MESSENGER_HASH_SECRET`: an independent random secret of at least 32 characters. Keep stable during the retention period.
- `META_MESSENGER_VERIFY_TOKEN`: another independent random secret of at least 32 characters.
- `META_MESSENGER_APP_SECRET`: the existing Meta app secret, server-only.
- `META_MESSENGER_PAGE_ID`: `103955275891976`.
- Existing `NEXT_PUBLIC_STRAPI_URL` and `NEXT_PUBLIC_SITE_URL` keep their production values.
- `NEXT_PUBLIC_MESSENGER_TRACKING_ENABLED`: leave unset until public approval and validation; set `true` for a public rollout.

Strapi server variables:

- `MESSENGER_TRACKING_ENABLED=true` enables the authenticated internal endpoints.
- `MESSENGER_BRIDGE_SECRET`: same server secret as Vercel.

No access token or secret belongs in Git, public variables, GTM, browser links or analytics payloads. No additional public Strapi role permissions are required: every custom endpoint requires the bridge secret. The new collection types intentionally have no generated CRUD routes.

## Meta setup and test sequence

1. Confirm the Strapi repository connection, deployment branch `main`, base directory `strapi`, existing version 5.38.0, and an available backup. Deploy the two additive collection types and protected endpoints.
2. Deploy the frontend with tracking mode `test`. Visit a URL with `messenger_tracking_test=1` and clearly labelled test campaign parameters. Other visitors retain the ordinary link.
3. After authorization to grant the app Page messaging access, configure `https://www.saint6.studio/api/messenger/webhook` and the verify token. Subscribe only `messages`, `messaging_postbacks`, and `messaging_referrals` for the Saint 6 Page.
4. Configure/verify the Get Started button needed for new-conversation referrals. Verify conversation routing with Business Suite before changing any routing preference. Do not introduce automated outbound replies without approval.
5. With explicit permission to send test messages, test an existing conversation and a new conversation with app-role test accounts. Confirm one lead each in the private report, zero leads for opening alone, and continued normal replies in Business Suite. Test supported mobile and desktop flows.
6. Complete Meta App Review/Advanced Access for real visitors. The business currently appears unverified. Provide the app’s privacy/data-deletion information and any verification Meta requests; do not claim public readiness before approval.
7. Enable public tracking only after successful end-to-end validation and approval. The existing GA4 outbound click URL gains `?ref=...`; reports should match the Messenger URL prefix/domain instead of exact equality with the old bare URL.

## Reporting and limits

The private Strapi endpoint `GET /api/messenger/report?from=<ISO timestamp>&to=<ISO timestamp>` requires `Authorization: Bearer <MESSENGER_BRIDGE_SECRET>`. It returns confirmed leads and distinct people by source, medium, campaign name and Google campaign ID, plus a deduplicated overall total. Dates use a start-inclusive/end-exclusive window.

UTM campaign names and `gad_campaignid` are preserved when present. A Google click ID alone does **not** resolve a campaign name; unknown remains unknown. A Facebook click ID does **not** prove paid traffic. Configure tagged campaign URLs to populate those fields. This first integration does not yet forward conversions to Google Ads, GA4 or Meta Conversions API. Those exports must be validated separately, including consent and platform attribution windows.

Meta warns that m.me referrals may fail for some Android users or georestricted Pages. Unmatched messages must remain unattributed. Public referral data requires Advanced Access. New conversations require a Get Started button. Tracking cannot recover messages sent before the integration was active.

Sources verified in Meta’s official documentation:

- https://developers.facebook.com/documentation/business-messaging/messenger-platform/discovery/m-me-links
- https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks
- https://developers.facebook.com/documentation/business-messaging/messenger-platform/app-review

## Local verification

Run `node --import tsx --test tests/messenger*.test.ts`, the frontend type check, and the Strapi build. In a disposable local Strapi database, verify authentication, persistence across restarts, duplicate message handling and the private report before production deployment. Do not submit test bookings or enquiries for this integration.
