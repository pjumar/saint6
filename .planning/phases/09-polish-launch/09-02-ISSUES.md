# UAT Issues: Phase 9 Plan 2

**Tested:** 2026-02-10
**Source:** .planning/phases/09-polish-launch/09-02-SUMMARY.md
**Tester:** User via /gsd:verify-work

## Open Issues

### UAT-001: Event Planning gallery carousel buttons flash and image transition not immediate

**Discovered:** 2026-02-10
**Phase/Plan:** 09-02
**Severity:** Minor
**Feature:** Event Project Gallery carousel (/en/event-planning)
**Description:** When clicking the prev/next arrows on the event project gallery, the buttons flash and the image doesn't change immediately. The transition feels sluggish.
**Expected:** Clicking prev/next should smoothly transition to the next image without a visible flash or delay.
**Actual:** Button flashes on click (opacity drop in :active state), and the image crossfade has a 700ms animation with a brief gap where the old image disappears before the new one fades in.
**Repro:**
1. Go to /en/event-planning
2. Scroll to the project gallery section
3. Click the left or right arrow button
4. Observe the button flash and delayed image change
**Note:** Pre-existing issue — EventProjectGallery component was NOT modified in 09-02. Found during UAT of 09-02 scope.

### UAT-002: Next.js Image aspect ratio warning in TestimonialCard

**Discovered:** 2026-02-10
**Phase/Plan:** 09-02
**Severity:** Cosmetic
**Feature:** TestimonialCard logo images (event-planning testimonials section)
**Description:** Next.js Image component emits dev-mode warning: "Image has either width or height modified, but not the other." The CSS already has `width: auto` and `height: auto` on the `.logo` class — the warning is triggered by `max-height`/`max-width` constraints changing rendered size from the `width={120} height={40}` intrinsic attributes.
**Expected:** No console warnings for Image components.
**Actual:** Warning appears in dev console for each testimonial card logo image.
**Repro:**
1. Go to /en/event-planning (or any page with TestimonialsSection)
2. Open browser DevTools > Console
3. See warning for each testimonial logo
**Note:** Pre-existing issue — TestimonialCard component was NOT modified in 09-02. Dev-mode only warning, does not affect production.

## Resolved Issues

[None yet]

---
*Phase: 09-polish-launch*
*Plan: 02*
*Tested: 2026-02-10*
