# Saint 6 Messenger publication

Prepared 21 September 2026 for Saint6 Messenger Attribution, app `1612647403841382`, owned by `saint6.studios`. Only the SAINT 6 STUDIOS Page (`103955275891976`) is subscribed.

## Public app information

The owner supplied **Cong Ty TNHH Haus Of Trang** and approved **saint6studios@gmail.com** for privacy and deletion requests.

- Privacy: `https://www.saint6.studio/messenger-privacy.html`
- Deletion: `https://www.saint6.studio/messenger-data-deletion.html`
- Existing icon: `public/web-app-manifest-512x512.png` (512 × 512).
- Both pages contain English and Vietnamese and work without CMS access or login. They load no analytics or Messenger tracking code.
- The deletion page displays an existing browser reference only on request. It does not create a visit, transmit that reference or automatically delete anything.

These app-specific notices do not replace policies for booking, enquiry forms or other analytics systems.

## Publication route and remaining verification

The app is unpublished. Its Publish page identifies a missing privacy-policy URL. Basic settings also contain placeholder Facebook URLs for terms and deletion and lack an icon/category.

The newer Messenger use-case guide distinguishes publishing an own-business app from Tech Provider enrollment for access to other business portfolios. “Add to App Review” currently presents irreversible Tech Provider enrollment. Do not enroll Saint 6 solely to publish this own-Page integration.

1. Approve and publish the notice pages, with the named mailbox staffed for requests. The isolated deletion drill passed on 21 September 2026.
2. Set privacy/deletion URLs, icon, category, domain and contact details. Remove the unrelated Facebook terms URL. Do not invent a Data Protection Officer.
3. Inspect the final Publish screen and new conditions. Obtain approval before publication, new access grants or accepting new terms.
4. Keep website tracking in test mode. Test a real Facebook account with **no app role**: one incoming message must produce one match; opening alone must produce none. Include a new conversation and a supported mobile browser.
5. If non-role events are withheld, resolve the applicable Meta review/access requirement before public rollout. Publication alone is not proof of delivery.
6. After successful tests and public rollout approval, set the public website flag and live server mode. Confirm the GA4 click trigger handles Messenger URLs containing a reference and recheck production. Message-conversion exports to Ads/GA4/CAPI remain separate work.

Sources checked on 21 September 2026:

- https://developers.facebook.com/documentation/development/create-an-app/messenger-use-case
- https://developers.facebook.com/documentation/business-messaging/messenger-platform/discovery/m-me-links
- https://developers.facebook.com/documentation/business-messaging/messenger-platform/app-review
- https://developers.facebook.com/docs/development/release/tech-providers/

The generic Messenger guide says public use requires review/Advanced Access, while the newer use-case guide provides an own-business publishing flow. Follow the actual app's requirements and verify delivery with a non-role account. The older access-level guide explicitly applies to App Type apps.

## Current test evidence

Production fix: `31716df52db24ad67e200636134a2a31f7cc69be` (PR #6).

- Meta referrals used seconds; the receiver now normalizes seconds and milliseconds without relaxing age/signature checks.
- Page subscriptions: messages, messaging_postbacks, messaging_referrals, standby.
- Existing Petr administrator conversation: one confirmed lead / one person for `messenger_fixed_test_20260921`.
- Separate `messenger_open_only_test_20260921` entry produced no lead.
- Store contained two referrals and one message signal; message contents were discarded.
- 20 Messenger tests and frontend TypeScript passed.
- Public flag remains unset; server mode remains `test`.

## Manual deletion operating procedure

1. Acknowledge the request through the approved mailbox. Ask only for necessary matching/verification details; never request passwords, tokens, payment information or identity documents.
2. Locate a supplied opaque reference in the private Strapi visits collection and associated referral signals. Verify the connection to the requester before acting on all records sharing a coded sender identifier. A display name or approximate timestamp alone is insufficient.
3. If no reference is available, an authorized technical operator must establish a reliable match through controlled verification with the same Messenger account. Do not assume no data exists. Obtain approval before granting any additional API access needed for a lookup.
4. Record the exact verified record identifiers and scope privately. Delete only the matching tracking signals and associated visit records, respecting other people if a reference was shared. Obtain operator confirmation before irreversible deletion.
5. Regenerate the private report and verify the records no longer contribute. Do not delete Messenger conversations, bookings or enquiries as part of an attribution-only request.
6. Maintain a minimal restricted deletion ledger and reapply outstanding deletions after restoring an older backup. Handle backup copies under their retention process; do not promise immediate removal from every backup.
7. Confirm the outcome and limitations to the requester. Daily cleanup removes active records older than 30 days. A later visit or message can create new records; deletion of existing data is not an ongoing opt-out.

No production records have been deleted during this preparation. The disposable-record drill in `tests/messenger-store.integration.mjs` passed on Node 24: it created two people's distinct campaign matches, deleted one verified fixture's signals and visit, confirmed those records were absent, and regenerated a report containing only the unaffected person's campaign. The procedure still requires human identity verification before any real deletion.
