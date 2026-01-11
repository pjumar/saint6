# Implementation Roadmap: Phase 1 Execution Plan

**Phase:** 01-Homepage Polish
**Plans Included:** 01-02, 01-03, and optional 01-04
**Date:** 2026-01-12
**Status:** Planning & Prioritization

---

## Executive Summary

Based on the gap analysis, the homepage has **1 CRITICAL issue** and **18 additional gaps** ranging from HIGH to LOW priority. This roadmap proposes breaking implementation into 2-3 focused plans, each addressing specific component groups.

**Primary Blocker:** Hero section height on mobile prevents first section from fitting in viewport.

**Estimated Total Effort:** 15-20 hours
- Plan 01-02: 6-8 hours (Critical fixes + Hero/Header)
- Plan 01-03: 4-6 hours (Responsive behavior verification)
- Plan 01-04: 3-4 hours (Optional Polish)

---

## Gap Grouping Strategy

Gaps have been grouped into **4 logical task groups** based on:
1. **Dependencies** - Which fixes must happen first
2. **Component Scope** - Related component fixes together
3. **Effort Estimation** - Keeping plans to reasonable size
4. **User Impact** - Visual/UX impact prioritized

---

## GROUP A: CRITICAL FIX - Hero Section & Layout

**Focus:** Fix the primary blocker preventing mobile viewport fit
**Severity:** 🔴 CRITICAL + 🟡 MEDIUM
**Estimated Effort:** 6-8 hours
**Proposed Plan:** 01-02

### Gaps Included

| Gap ID | Title | Severity | Effort |
|--------|-------|----------|--------|
| 1.1 | Hero Section Mobile Height | 🔴 CRITICAL | 2-3h |
| 1.2 | Hero Content Positioning | 🟡 MEDIUM | 1-2h |
| 1.3 | Hero Links Mobile Visibility | 🟡 MEDIUM | 0.5h |
| 1.4 | Hero Background Image Scaling | 🟡 MEDIUM | 1-2h |
| 1.5 | Scroll Indicator Positioning | 🟡 MEDIUM | 0.5h |
| 2.1 | Desktop Navigation Consistency | 🟡 MEDIUM | 1h |

### Why These Together?
- All hero section related
- Fixing height cascades to other hero issues
- Must complete before addressing other sections
- Single component means focused testing

### Implementation Approach

**Step 1: Reduce Hero Height (Gap 1.1)**
```
Current: height: 59.75rem (956px)
Target:  height: 90vh or ~550px max
Action:  Update .hero class in HeroSection.module.css
```

**Step 2: Adjust Content Positioning (Gaps 1.2, 1.3, 1.5)**
```
Current: Absolute positioning with fixed bottom values
Target:  Flexible positioning that adapts to new height
Action:  Update .heroContent, .heroContentWrapper, .scrollIndicator
```

**Step 3: Verify Background Scaling (Gap 1.4)**
```
Current: Width 325.91%, left -163.91%
Action:  Test with new height, adjust if needed
```

**Step 4: Desktop Navigation (Gap 2.1)**
```
Action:  Verify desktop nav works with new heights
```

### Success Criteria
- [ ] Hero fits within iPhone 12 Pro viewport (812px) without scrolling below hero
- [ ] Content visible on mobile: Hero + top of next section
- [ ] Scroll indicator positioned correctly at bottom of hero
- [ ] Desktop hero height remains ~769px
- [ ] No layout shifts or overflow issues
- [ ] Navigation appears correctly on both mobile and desktop
- [ ] Background image displays without distortion

### Testing Requirements
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px)
- [ ] Desktop (1440px+)
- [ ] Browser developer tools responsive mode

### Deliverables
1. Updated `HeroSection.module.css` with new heights and positioning
2. Verification document showing measurements
3. Screenshots from testing across devices

---

## GROUP B: RESPONSIVE BEHAVIOR & VERIFICATION

**Focus:** Verify responsive behavior across all breakpoints
**Severity:** 🟡 MEDIUM + 🟢 LOW
**Estimated Effort:** 4-6 hours
**Proposed Plan:** 01-03

### Gaps Included

| Gap ID | Title | Severity | Effort |
|--------|-------|----------|--------|
| 3.1 | Logo Animation Consistency | 🟡 MEDIUM | 1-2h |
| 3.2 | Logo Styling Opacity | 🟢 LOW | 0.5h |
| 3.3 | Mobile Carousel Scroll | 🟡 MEDIUM | 1h |
| 4.1 | Gallery Grid Mobile Columns | 🟡 MEDIUM | 1h |
| 5.1 | Project Section Border Radius | 🟡 MEDIUM | 0.5h |
| 5.2 | Project Images Padding | 🟡 MEDIUM | 1h |
| 7.2 | Overall Responsive Breakpoint | 🟢 LOW | 0.5h |

### Why These Together?
- All involve testing and verifying responsive behavior
- Can be tested comprehensively after hero fix
- Lower risk (mostly verification, not major changes)
- Performance and animation quality focus

### Implementation Approach

**Step 1: Test Logo Animation (Gap 3.1, 3.2, 3.3)**
```
Action:  Run GSAP animation on mobile/desktop
Verify:  Smooth performance, no jank
Check:   Opacity and filters match design
```

**Step 2: Verify Gallery Grid (Gap 4.1)**
```
Current: 5 columns on mobile
Action:  Compare against design, adjust if needed
Target:  3-4 columns may be better for mobile UX
```

**Step 3: Check Project Section (Gap 5.1, 5.2)**
```
Verify:  Border-radius displays correctly
Check:   Padding proportions work on different screens
```

**Step 4: Test Overall Breakpoints (Gap 7.2)**
```
Action:  Test across multiple device sizes
Verify:  Transitions work smoothly
```

### Success Criteria
- [ ] GSAP animations perform at 60fps
- [ ] No performance issues on low-end devices
- [ ] Gallery displays appropriately on mobile
- [ ] Spacing remains consistent after hero fix
- [ ] All sections visible without layout shift
- [ ] Breakpoint transitions smooth

### Testing Requirements
- [ ] Chrome DevTools Performance tab
- [ ] iPhone 12 Pro simulator
- [ ] Safari mobile testing
- [ ] Android device if possible
- [ ] Network throttling (slow 3G)

### Deliverables
1. Performance testing results
2. Browser compatibility report
3. Updated CSS for gallery columns (if needed)
4. Animation timing documentation

---

## GROUP C: POLISH & REFINEMENT (OPTIONAL)

**Focus:** Fine-tuning typography, spacing, and visual details
**Severity:** 🟢 LOW
**Estimated Effort:** 3-4 hours
**Proposed Plan:** 01-04 (Optional - May defer to Phase 2)

### Gaps Included

| Gap ID | Title | Severity | Effort |
|--------|-------|----------|--------|
| 5.3 | Project Number Typography | 🟢 LOW | 0.5h |
| 5.4 | Testimonial Quote Mark | 🟢 LOW | 0.5h |
| 6.1 | Footer Decoration Positioning | 🟢 LOW | 0.5h |
| 6.2 | Footer Contact Typography | 🟢 LOW | 0.5h |
| 7.1 | Homepage Container Max-width | 🟢 LOW | 0.5h |

### Why These Together?
- All low-priority visual/polish items
- Can be addressed after major issues fixed
- Good for incremental improvements
- Could be deferred to future phases if needed

### Implementation Approach

**Step 1: Review Typography (Gap 5.3, 5.4, 6.2)**
```
Action:  Compare against Figma specifications
Verify:  Font sizes, weights, colors, spacing
Adjust:  Any mismatches in CSS
```

**Step 2: Check Footer & Layout (Gap 6.1, 7.1)**
```
Action:  Verify visual balance and spacing
Adjust:  If needed based on Figma
```

### Success Criteria
- [ ] All typography matches Figma specifications
- [ ] Visual hierarchy maintained
- [ ] No unexpected color or spacing changes
- [ ] Consistent with design intent

### Deliverables
1. Updated CSS with refinements
2. Before/after comparison (if visual changes)

---

## Implementation Timeline

### Phase 1 Execution Plan

```
Week 1 (Now - 2026-01-12 to 2026-01-18)
├── Plan 01-02: Critical Fixes (Hero & Header)
│   ├── Day 1: Gap 1.1 - Reduce hero height
│   ├── Day 2-3: Gaps 1.2-1.5 - Adjust positioning
│   ├── Day 3-4: Gap 2.1 - Verify desktop nav
│   ├── Day 4: Testing & QA across devices
│   └── Deliverable: Merged to main, tested

├── Plan 01-03: Responsive Behavior (Mid-week)
│   ├── Day 2: Gaps 3.1-3.3 - Animation testing
│   ├── Day 3: Gap 4.1 - Gallery verification
│   ├── Day 4: Gap 5.1-5.2 - Project section
│   ├── Day 4-5: Performance testing
│   └── Deliverable: Verified responsive

└── Plan 01-04 (Optional): Polish (If time)
    ├── Day 5-6: Typography & spacing review
    ├── Day 6: Footer & layout tweaks
    └── Deliverable: Design refinements
```

---

## Risk Assessment

### HIGH RISK Items
1. **Hero Height Adjustment** - Could break visual balance
   - Mitigation: Test extensively across devices
   - Fallback: If design too cramped, reconsider height value

2. **GSAP Animation** - Performance issues possible
   - Mitigation: Test on low-end devices
   - Fallback: Simplify animation if needed

### MEDIUM RISK Items
3. Background image scaling might distort
4. Content spacing might not work at new heights

### LOW RISK Items
5. Typography/spacing refinements
6. Footer and lower sections unchanged

---

## Success Metrics

### Quantitative
- [ ] Hero section displays in viewport on 100% of mobile devices tested
- [ ] No layout shifts (CLS = 0)
- [ ] GSAP animations run at 60fps minimum
- [ ] All sections render without overflow errors

### Qualitative
- [ ] Design matches Figma specifications
- [ ] User experience improved (no immediate scroll needed)
- [ ] Mobile and desktop experiences feel balanced
- [ ] Animations feel smooth and intentional

---

## Decision Points

### Should We Implement All Gaps?

**Recommendation:** YES for Plans 01-02 and 01-03

- Gap 1.1 (Hero height) is CRITICAL and blocking
- Gaps in 01-02 are all dependent on Gap 1.1
- Gaps in 01-03 are important for polish and performance

**Optional:** Plan 01-04 (Polish)

- Could defer to future phases if time-constrained
- Low impact on user experience
- Can be addressed incrementally

### Should Hero Height Be 90vh or Fixed Pixel Value?

**Recommendation:** Use fixed pixel value (550-600px)

**Reasoning:**
- More predictable across devices
- Easier to test and verify
- Responsive to design specifications
- Avoid viewport unit quirks on mobile

**Implementation:**
- Test with 550px first (conservative)
- If feels cramped, try 600px
- Match to actual design specifications

### Should We Add More Breakpoints?

**Recommendation:** NO for now

- Current 768px breakpoint seems adequate
- Desktop designs are similar
- Additional breakpoints add complexity
- Revisit after user testing feedback

---

## Post-Implementation Review

### After Plan 01-02 Complete
1. Collect screenshot proof across devices
2. Verify no regressions in other sections
3. Measure improvement metrics
4. Get user feedback on mobile experience

### After Plan 01-03 Complete
1. Performance testing results
2. Animation quality assessment
3. Responsive behavior verification

### After Plan 01-04 (if executed)
1. Final design comparison against Figma
2. User acceptance testing
3. Ready for production deployment

---

## Deferred Work (Phase 2+)

The following items are NOT included in Phase 1 and may be addressed later:

1. CMS Integration - Requires backend setup
2. Error Boundaries - Add after CMS integration
3. Image Optimization - Could improve performance
4. Accessibility Audit - WCAG compliance testing
5. SEO Optimization - Meta tags, structured data
6. Additional Pages - About, Services, Contact forms

---

## Next Steps

1. **User Approval:** Review this roadmap and prioritization
2. **Schedule Planning:** Assign developer time for Plans 01-02 and 01-03
3. **Device Access:** Ensure testing devices available
4. **Start Plan 01-02:** Begin with hero height fix

---

## Related Documents

- **01-DESIGN-AUDIT.md** - Complete design specifications
- **01-GAPS.md** - Detailed gap descriptions and fixes
- **PROJECT.md** - Overall project context
- **ROADMAP.md** (this file) - Implementation plan

---

## Appendix: Detailed Component Change List

### HeroSection.module.css
```css
Changes:
- Line 3: height: 59.75rem → height: 550px (or 90vh)
- Line 54-82: Review absolute positioning for new height
- Line 138-146: Verify scroll indicator positioning
- Line 24-30: Verify background image scaling
```

### TrustedBySection
```css
Changes:
- Review GSAP animation timing
- Verify opacity and filters match design
```

### GallerySection.module.css
```css
Possible Changes:
- Line 8: grid-template-columns: repeat(5, 1fr) → repeat(3-4, 1fr)?
- Line 9: gap: 0.5rem → consider adjusting
- Line 2: padding: 1.5rem 0 → consider adding horizontal padding
```

### KeyProjectSection.module.css
```css
Possible Changes:
- Line 3: border-radius positioning verification
- Line 153: padding: 8rem 1.5rem → verify spacing
```

### Header.module.css
```css
Changes:
- Verify desktop navigation positioning with new hero height
- Line 22-25: Check positioning is still correct
```

---

## Questions & Clarifications Needed

1. **Hero Height Target:** What is the exact target height from Figma? (550px vs 600px vs 90vh)
2. **Gallery Columns:** Does Figma specify 5 columns on mobile, or should it be different?
3. **Logo Animation:** Should desktop version also have animation, or stay static?
4. **Project Section Padding:** Is the 8rem top padding intentional in design?
5. **Animation Performance:** Are there performance requirements for GSAP animations?

---

*Last updated: 2026-01-12*
*Prepared for: Phase 01-Homepage Polish Execution*

