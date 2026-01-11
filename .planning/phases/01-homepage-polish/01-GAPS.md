# Gap Analysis: Design vs Implementation

**Phase:** 01-Homepage Polish
**Plan:** 01-01
**Date:** 2026-01-12
**Status:** Complete Analysis

## Summary

Detailed comparison between Figma design specifications and current implementation. Gaps are organized by component and prioritized by severity (HIGH/MEDIUM/LOW).

---

## Critical Findings

### PRIMARY ISSUE: Hero Section Height (Mobile)

**Severity:** 🔴 **CRITICAL**

**Gap Description:**
The hero section is significantly taller than the mobile viewport, forcing users to scroll to see content below the hero on mobile devices.

**Component:** HeroSection
**File:** `/Users/po/code4po/saint6/app/components/hero-section/HeroSection.module.css`

**Current State:**
```css
.hero {
  height: 59.75rem;  /* 956px - too tall for mobile */
  /* ... */
}
```

**Desired State (Figma Design):**
- Mobile hero should fit within typical mobile viewport height
- Target: ~100vh or ≤ ~60-65% of viewport height
- Allows first section to be fully visible without scrolling

**Impact:**
- ⚠️ User Experience: Users must scroll immediately to see content below hero
- ⚠️ Mobile UX: Not suitable for small screens
- ⚠️ First Impression: Doesn't showcase first section completely

**Effort Estimate:** 2-3 hours
- Adjust height value
- Test responsive behavior
- Verify spacing adjustments
- Mobile QA testing

**Remediation Steps:**
1. Reduce `.hero` height on mobile to fit viewport
2. Adjust hero content positioning (currently absolute with specific bottom values)
3. Verify scroll indicator remains visible
4. Test on actual devices (375px, 414px, 430px widths)

**Recommended Fix:**
```css
.hero {
  height: 90vh;  /* Or specific pixel value ~500-600px */
  /* Adjust other dimensions accordingly */
}
```

---

## Gap Listing by Component

---

## 1. HERO SECTION GAPS

### Gap 1.1: Hero Section - Mobile Viewport Height

**Severity:** 🔴 **CRITICAL**
**Category:** Layout/Responsive
**Component File:** `/Users/po/code4po/saint6/app/components/hero-section/HeroSection.module.css`

**Description:**
Hero section height (59.75rem) is 1.5-2x the mobile viewport height, preventing full viewport display on mobile.

**Current Behavior:**
- Mobile hero: 59.75rem (956px)
- Mobile viewport (iPhone): ~667px-812px
- Result: ~400px additional scroll needed to see next section

**Desired Behavior:**
- Hero section should fit entirely within mobile viewport
- Users should see hero section + beginning of next section
- Reduce to approximately 500-600px height on mobile

**Files to Modify:**
- `app/components/hero-section/HeroSection.module.css` (line 3)
- Possibly: `app/components/hero-section/HeroSection.tsx` (spacing/content)

**Risk Assessment:**
- Visual balance: Hero might feel cramped if reduced too much
- Typography: Heading text fitting in smaller space
- Content spacing: Internal gaps may need reduction

**Dependencies:**
- None (standalone fix)

**Blocks:** Other sections from being visible on mobile without scrolling

---

### Gap 1.2: Hero Content Positioning - Mobile Centering

**Severity:** 🟡 **MEDIUM**
**Category:** Layout/Spacing
**Component File:** `/Users/po/code4po/saint6/app/components/hero-section/HeroSection.module.css`

**Description:**
Hero content uses absolute positioning with fixed bottom values, which may not scale well if hero height is reduced.

**Current Behavior:**
```css
.heroContentWrapper {
  bottom: 2rem;  /* Fixed value */
}

.heroContent {
  bottom: 3rem;  /* Fixed absolute position */
  gap: 5.5rem;   /* Large gap between logo and heading */
}
```

**Desired Behavior:**
- Content should center vertically when hero height changes
- Spacing between elements should maintain proportions
- Scroll indicator should remain visible at bottom

**Files to Modify:**
- `app/components/hero-section/HeroSection.module.css` (lines 54-82)

**Implementation Notes:**
- May need to switch from absolute to flex positioning for centering
- Or adjust bottom values based on new hero height
- Verify scrollIndicator remains positioned correctly

---

### Gap 1.3: Hero Links Mobile Visibility

**Severity:** 🟡 **MEDIUM**
**Category:** Layout
**Component File:** `/Users/po/code4po/saint6/app/components/hero-section/HeroSection.module.css`

**Description:**
Hero links/social section positioned at 50% transform-Y (middle of hero), which is problematic if hero height changes significantly.

**Current Behavior:**
```css
.heroMiddleSection {
  top: 50%;
  transform: translateY(-50%);  /* Middle positioning */
}
```

**Desired Behavior:**
- Links should remain visible and accessible
- Positioning should be flexible if hero height changes
- Ensure links don't overlap content

**Files to Modify:**
- `app/components/hero-section/HeroSection.module.css` (lines 100-112)

**Related Change:**
- Dependent on Gap 1.1 hero height fix

---

### Gap 1.4: Hero Background Image Scaling

**Severity:** 🟡 **MEDIUM**
**Category:** Visual/Asset
**Component File:** `/Users/po/code4po/saint6/app/components/hero-section/HeroSection.module.css`

**Description:**
Hero background image uses 325.91% scale and negative left offset, which may not work well with adjusted height.

**Current Behavior:**
```css
.heroBackgroundImage {
  width: 325.91%;   /* Massive scale */
  left: -163.91%;   /* Offset for positioning */
}
```

**Desired Behavior:**
- Image should maintain proper aspect ratio with new height
- No artificial scaling that distorts image
- Should work across all viewport sizes

**Files to Modify:**
- `app/components/hero-section/HeroSection.module.css` (lines 24-30)

**Implementation Notes:**
- May need to adjust image itself or asset ratio
- Verify object-fit: cover still works correctly
- Test on various devices

---

### Gap 1.5: Scroll Indicator Positioning

**Severity:** 🟡 **MEDIUM**
**Category:** UX/Layout
**Component File:** `/Users/po/code4po/saint6/app/components/hero-section/HeroSection.module.css`

**Description:**
Scroll indicator positioned within hero section but may not be visible if height is significantly reduced.

**Current Behavior:**
```css
.scrollIndicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* Part of heroContentWrapper */
}
```

**Desired Behavior:**
- Scroll indicator should remain visible and positioned at bottom of hero
- Should indicate more content below
- Responsive across all device sizes

**Files to Modify:**
- `app/components/hero-section/HeroSection.module.css` (lines 138-146)
- Possibly: `app/components/hero-section/HeroSection.tsx` (if repositioning in DOM)

---

## 2. HERO SECTION - HEADER/NAVIGATION GAPS

### Gap 2.1: Desktop Navigation Visibility

**Severity:** 🟡 **MEDIUM**
**Category:** Layout/Responsive
**Component File:** `/Users/po/code4po/saint6/app/components/header/Header.module.css`

**Description:**
Desktop navigation positioned absolutely with fixed styling that may not adapt well to hero height changes.

**Current Behavior:**
```css
.desktopNavWrapper {
  display: none;  /* Hidden on mobile */
  position: absolute;
  right: 1.5rem;
  top: 2rem;      /* Fixed top position */
}
```

**Desired Behavior:**
- Navigation should maintain consistent positioning with hero changes
- Should work with new hero proportions
- Desktop breakpoint should remain at 48.0625rem

**Files to Modify:**
- `app/components/header/Header.module.css` (lines 19-26, 129-156)

**Notes:**
- Less critical if hero height only changes on mobile
- May be unaffected if desktop hero height remains at 48.125rem

---

## 3. TRUSTED BY SECTION GAPS

### Gap 3.1: Logo Animation - Mobile/Desktop Consistency

**Severity:** 🟡 **MEDIUM**
**Category:** Animation/Responsive
**Component File:** `/Users/po/code4po/saint6/app/components/trusted-by-section/TrustedBySection.tsx`
**CSS File:** `/Users/po/code4po/saint6/app/components/trusted-by-section/TrustedBySection.module.css`

**Description:**
Logo carousel animation uses JavaScript GSAP library which adds complexity and potential performance issues. Animation only works on mobile but CSS could be used for consistency.

**Current Behavior:**
- GSAP animation calculates scroll width and creates timeline
- Animation only triggers if screen width <= 768px
- Duplicate logos created in DOM for seamless loop
- Scroll events prevented (wheel, touchmove)

**Desired Behavior:**
- Verify animation matches design intent (if design specifies animation)
- Ensure animation is smooth and doesn't cause jank
- Performance: Verify GSAP doesn't create unnecessary DOM listeners

**Files to Modify:**
- `app/components/trusted-by-section/TrustedBySection.tsx` (lines 14-99)
- `app/components/trusted-by-section/TrustedBySection.module.css` (lines 26-83)

**Risk Assessment:**
- Current implementation seems sound for animations
- Potential issue: Event listeners not properly cleaned up in all scenarios
- Performance: GSAP creating/destroying timelines on resize

**Recommendation:**
- Verify GSAP animation matches design specifications
- Test on low-end devices for performance
- Verify event listener cleanup

---

### Gap 3.2: Logo Styling - Opacity and Filters

**Severity:** 🟢 **LOW**
**Category:** Visual/Styling
**Component File:** `/Users/po/code4po/saint6/app/components/trusted-by-section/TrustedBySection.module.css`

**Description:**
Logos have opacity: 0.5 and filter: grayscale(100%) brightness(0.5), which may differ from Figma design intent.

**Current Behavior:**
```css
.brandLogos {
  opacity: 0.5;  /* Overall container opacity */
}

.brandLogo {
  filter: grayscale(100%) brightness(0.5);  /* Individual logo filtering */
}
```

**Desired Behavior:**
- Verify opacity values match Figma specifications
- Confirm filter effects are intentional (darkening logos)
- May want to adjust based on design

**Files to Modify:**
- `app/components/trusted-by-section/TrustedBySection.module.css` (lines 32, 58)

**Note:** Low priority but worth verifying against design

---

### Gap 3.3: Mobile Logo Carousel - Horizontal Scroll Behavior

**Severity:** 🟡 **MEDIUM**
**Category:** UX/Animation
**Component File:** `/Users/po/code4po/saint6/app/components/trusted-by-section/TrustedBySection.module.css`

**Description:**
Logo carousel uses overflow-x: hidden and scroll animation, but scrollbar behavior may vary across devices.

**Current Behavior:**
```css
.brandLogos {
  overflow-x: hidden;
  overflow-y: hidden;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE/Edge */
  scroll-behavior: auto;
  pointer-events: none;  /* Prevents interaction */
}
```

**Desired Behavior:**
- Carousel should animate smoothly
- No visible scrollbars
- Animation should work consistently across browsers

**Files to Modify:**
- `app/components/trusted-by-section/TrustedBySection.module.css` (lines 26-42)
- `app/components/trusted-by-section/TrustedBySection.tsx` (lines 47-54)

**Note:** Currently seems well-implemented with cross-browser support

---

## 4. GALLERY SECTION GAPS

### Gap 4.1: Gallery Grid - Mobile Column Count

**Severity:** 🟡 **MEDIUM**
**Category:** Layout/Responsive
**Component File:** `/Users/po/code4po/saint6/app/components/gallery-section/GallerySection.module.css`

**Description:**
Mobile gallery displays 5 columns which may be too narrow for images, resulting in very small image previews.

**Current Behavior:**
```css
.galleryGrid {
  grid-template-columns: repeat(5, 1fr);  /* 5 columns on mobile */
  gap: 0.5rem;  /* 8px gap */
}
```

**Desired Behavior:**
- Verify image column count against Figma design
- May need 3-4 columns for better mobile viewing
- Check if design specifies specific column layout

**Files to Modify:**
- `app/components/gallery-section/GallerySection.module.css` (lines 7-9)

**Implementation Options:**
- Option 1: Change to 3-4 columns on mobile
- Option 2: Add additional breakpoint (e.g., tablet at 600px)
- Option 3: Keep current if design specifies

---

### Gap 4.2: Gallery Padding - Horizontal Spacing

**Severity:** 🟢 **LOW**
**Category:** Spacing
**Component File:** `/Users/po/code4po/saint6/app/components/gallery-section/GallerySection.module.css`

**Description:**
Gallery has padding: 1.5rem 0 on mobile (no horizontal padding), which means images extend to edge of screen.

**Current Behavior:**
```css
.gallery {
  padding: 1.5rem 0;  /* No horizontal padding */
}
```

**Desired Behavior:**
- Verify if images should have padding to screen edges
- Check Figma for gallery edge treatment
- May need to add horizontal padding for consistency

**Files to Modify:**
- `app/components/gallery-section/GallerySection.module.css` (lines 1-4)

---

## 5. KEY PROJECT SECTION GAPS

### Gap 5.1: Project Section - Top Padding and Border Radius

**Severity:** 🟡 **MEDIUM**
**Category:** Visual/Spacing
**Component File:** `/Users/po/code4po/saint6/app/components/key-project-section/KeyProjectSection.module.css`

**Description:**
Section has rounded corners (border-radius: 1rem 1rem 0 0) which creates visual separation from gallery section above.

**Current Behavior:**
```css
.keyProjectSection {
  border-radius: 1rem 1rem 0 0;  /* Rounded top corners */
}
```

**Desired Behavior:**
- Verify rounded corners match Figma design
- Confirm visual separation is intentional
- Check if spacing/padding creates proper visual hierarchy

**Files to Modify:**
- `app/components/key-project-section/KeyProjectSection.module.css` (line 3)

**Note:** This might be intentional for design, verify with Figma

---

### Gap 5.2: Project Images - Large Padding

**Severity:** 🟡 **MEDIUM**
**Category:** Spacing
**Component File:** `/Users/po/code4po/saint6/app/components/key-project-section/KeyProjectSection.module.css`

**Description:**
Project images section has 8rem top padding (128px) which creates very large space before images.

**Current Behavior:**
```css
.projectImages {
  padding: 8rem 1.5rem;  /* 128px top padding */
  gap: 6rem;  /* 96px gap between images */
}
```

**Desired Behavior:**
- Verify padding values match Figma design
- May be intentional for visual spacing
- Check if proportional spacing works on mobile

**Files to Modify:**
- `app/components/key-project-section/KeyProjectSection.module.css` (lines 149-154)

**Note:** Large padding may be from design; verify before changing

---

### Gap 5.3: Project Number - Typography and Layout

**Severity:** 🟢 **LOW**
**Category:** Typography
**Component File:** `/Users/po/code4po/saint6/app/components/key-project-section/KeyProjectSection.module.css`

**Description:**
Project number uses specific gap (3.875rem) and complex spacing that may not adapt well to content changes.

**Current Behavior:**
```css
.projectNumber {
  gap: 3.875rem;  /* Very specific gap */
  justify-content: space-between;
  font-size: 0.75rem;
  opacity: 0.4;
}
```

**Desired Behavior:**
- Verify spacing matches Figma
- Ensure responsive behavior on smaller screens
- Typography should be clear and readable

**Files to Modify:**
- `app/components/key-project-section/KeyProjectSection.module.css` (lines 16-33)

---

### Gap 5.4: Testimonial Quote Mark - Size and Positioning

**Severity:** 🟢 **LOW**
**Category:** Typography/Design
**Component File:** `/Users/po/code4po/saint6/app/components/key-project-section/KeyProjectSection.module.css`

**Description:**
Quote mark has very large font size (6rem) with height: 2.375rem, which may overflow or not display correctly.

**Current Behavior:**
```css
.quoteMark {
  font-size: 6rem;  /* Very large */
  height: 2.375rem;  /* Constrained height */
  line-height: normal;
}
```

**Desired Behavior:**
- Verify quote mark styling matches Figma
- Ensure proper alignment and sizing
- Check mobile display doesn't overflow

**Files to Modify:**
- `app/components/key-project-section/KeyProjectSection.module.css` (lines 190-198)

---

## 6. FOOTER SECTION GAPS

### Gap 6.1: Footer - Decoration Positioning

**Severity:** 🟢 **LOW**
**Category:** Visual/Asset
**Component File:** `/Users/po/code4po/saint6/app/components/footer/Footer.module.css`

**Description:**
Footer has decorative elements positioned absolutely off-canvas with rotation and complex positioning.

**Current Behavior:**
```css
.footerDecoration {
  position: absolute;
  top: -16.4375rem;  /* Positioned off-canvas */
  right: -16.25rem;
  transform: rotate(270deg);  /* Rotated for effect */
}
```

**Desired Behavior:**
- Verify decoration positioning matches Figma
- Ensure SVG graphics display correctly
- Check overflow handling

**Files to Modify:**
- `app/components/footer/Footer.module.css` (lines 15-25)

**Note:** Currently seems intentional for design effect

---

### Gap 6.2: Footer - Contact Information Styling

**Severity:** 🟢 **LOW**
**Category:** Typography/Spacing
**Component File:** `/Users/po/code4po/saint6/app/components/footer/Footer.module.css`

**Description:**
Contact information uses large font (1.625rem) with specific styling that may not match Figma exactly.

**Current Behavior:**
```css
.contactText {
  font-size: 1.625rem;
  line-height: 1.1;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.81);
  white-space: pre-wrap;
}
```

**Desired Behavior:**
- Verify typography matches Figma specifications
- Ensure color and opacity are correct
- Check spacing and alignment

**Files to Modify:**
- `app/components/footer/Footer.module.css` (lines 90-99)

---

## 7. GLOBAL/LAYOUT GAPS

### Gap 7.1: Homepage Container - Max-width

**Severity:** 🟢 **LOW**
**Category:** Layout/Responsive
**Component File:** `/Users/po/code4po/saint6/app/page.module.css`

**Description:**
Content container has max-width: 100% on mobile and 90rem on desktop, which is correct but verify against design.

**Current Behavior:**
```css
.contentContainer {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

@media (min-width: 48.0625rem) {
  .contentContainer {
    max-width: 90rem;  /* 1440px */
    padding: 0 1.5rem;
  }
}
```

**Desired Behavior:**
- Verify max-width matches design specifications
- 90rem (1440px) seems standard for modern design
- Check padding is consistent

**Files to Modify:**
- `app/page.module.css` (lines 9-21)

**Note:** Currently appears correct

---

### Gap 7.2: Overall Responsive Breakpoint

**Severity:** 🟢 **LOW**
**Category:** Responsive/Layout
**Files Affected:** All component CSS modules

**Description:**
Primary breakpoint is 48.0625rem (768px), which is tablet-sized. Verify this matches design breakpoints.

**Current Behavior:**
- Mobile: < 768px
- Desktop: >= 768px
- Only two breakpoints (no tablet-specific layouts)

**Desired Behavior:**
- Verify breakpoint matches Figma design
- May need additional breakpoints for large screens
- Ensure consistency across all components

**Files to Modify:**
- All component CSS modules where media queries appear

---

## Summary of Gaps by Severity

### 🔴 CRITICAL (1)
1. **Hero Section Mobile Height** - 59.75rem exceeds viewport
   - File: `HeroSection.module.css` line 3
   - Impact: Forces scroll on mobile immediately
   - Effort: 2-3 hours

### 🟡 MEDIUM (7)
2. Hero Content Positioning
3. Hero Links Mobile Visibility
4. Hero Background Image Scaling
5. Scroll Indicator Positioning
6. Desktop Navigation Visibility
7. Logo Animation Consistency
8. Gallery Grid Mobile Columns
9. Project Section Padding
10. Project Images Padding

### 🟢 LOW (6)
11. Logo Styling Opacity/Filters
12. Mobile Carousel Scroll Behavior
13. Gallery Padding Horizontal
14. Project Number Spacing
15. Testimonial Quote Mark Sizing
16. Footer Decoration Positioning
17. Footer Contact Typography
18. Homepage Container Max-width
19. Overall Responsive Breakpoint

---

## Recommended Fix Priority

### Phase 1 (Blocking Issues - Do First)
1. **Hero Section Height** - CRITICAL
2. **Hero Content Positioning** - Dependent on #1
3. **Hero Links Positioning** - Dependent on #1
4. **Hero Background Scaling** - Dependent on #1

### Phase 2 (High Impact UX)
5. Scroll Indicator Positioning
6. Gallery Grid Mobile Columns
7. Desktop Navigation Consistency

### Phase 3 (Polish & Refinement)
8-19. Remaining low-priority gaps

---

## Testing Checklist

- [ ] Test hero section on iPhone SE (375px)
- [ ] Test hero section on iPhone 12 Pro (390px)
- [ ] Test hero section on iPhone 14 Pro Max (430px)
- [ ] Test hero section on iPad (768px+)
- [ ] Test hero section on desktop (1440px)
- [ ] Verify scroll behavior smooth
- [ ] Verify GSAP animations perform well
- [ ] Check for layout shifts during load
- [ ] Verify footer displays correctly
- [ ] Check all links functional

