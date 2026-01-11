# Design Audit: Saint 6 Studio Homepage

**Phase:** 01-Homepage Polish
**Plan:** 01-01
**Date:** 2026-01-12
**Auditor:** Design & Implementation Analysis

## Executive Summary

This document outlines the comprehensive design specifications for the Saint 6 Studio homepage based on the Figma design file and current implementation. The audit identifies layout structure, typography, spacing, colors, animations, and responsive behavior.

## Current Implementation Overview

The homepage consists of 5 main sections:

1. **Hero Section** - Full-height hero with navigation, logo, and call-to-action
2. **Trusted By Section** - Logo carousel with brand affiliations
3. **Gallery Section** - Multi-column image gallery
4. **Key Project Section** - Featured project showcase with details
5. **Footer** - Contact information and social links

---

## Section-by-Section Design Breakdown

### 1. HERO SECTION

#### Mobile (375px width)
- **Height:** 59.75rem (956px) - CRITICAL ISSUE: This is 2.5x the typical mobile viewport height
- **Structure:** Absolute positioning with centered layout
- **Background:** Full-bleed image with dark overlay (rgba(0, 0, 0, 0.2))
- **Image Handling:** Hero background image scaled at 325.91% width

**Content Layers (Mobile):**
1. **Header** - Positioned absolutely at top
   - Logo: 10.6875rem × 2.25rem (170.8px × 36px)
   - Hamburger menu visible
   - Positioned: top: 2rem, z-index: 2

2. **Hero Content Wrapper** - Centered section
   - Positioned: absolute, bottom: 2rem
   - Contains heading centered
   - Heading: 2rem font size, line-height: 1.2

3. **Scroll Indicator**
   - Icon: 16×16px
   - Text: Caption style (0.625rem, 2px letter-spacing)
   - Positioned at bottom of viewport

4. **Hero Links/Decorative Line** (Mobile)
   - Position: 50% transform Y
   - Contains: Social links (left), Contact/Language (right)
   - Decorative line SVG

**Typography (Mobile):**
- Heading: 2rem / 1.2 line-height / Spectral font / -0.64px letter-spacing
- Caption: 0.625rem / 1.1 line-height / JetBrains Mono / 0.125rem letter-spacing

**Spacing (Mobile):**
- Padding: 1.5rem (24px) horizontal
- Gap between elements: 1.5rem
- Hero content bottom: 3rem
- Logo top: 2rem

#### Desktop (1440px+)
- **Height:** 48.125rem (769px)
- **Layout:** Horizontal split
  - Logo on left
  - Heading/content on right
  - Navigation on right side

**Content Layers (Desktop):**
1. **Header** - Left-aligned
   - Logo unchanged
   - Navigation: Right side, 6 menu items + separator + social/links
   - Desktop nav width: 18.5rem

2. **Hero Content** - Right-aligned
   - Position: static (not absolute)
   - Heading: 2.25rem / 1.2 line-height / Spectral / weight: 300 / -0.045rem letter-spacing
   - Right-aligned text: text-align: right
   - Max-width: 34.0625rem

3. **Hero Links** - Same as mobile but visible in desktop nav

**Typography (Desktop):**
- Heading: 2.25rem / 1.2 line-height / weight: 300
- Navigation items: 1.75rem / 1.5 line-height / weight: 300
- Navigation uses pseudo-elements (::before, ::after) for visual effects on hover

**Spacing (Desktop):**
- Header padding: 1.5rem
- Hero content max-width: 34.0625rem
- Heading margin-left: auto (right-aligned)

#### Responsive Breakpoint
- **Mobile:** < 48.0625rem (768px)
- **Desktop:** >= 48.0625rem (768px)

#### Animation/Interactions
- Menu open/close: 300ms duration with state management
- Hamburger menu: Toggle visibility
- Social links: Hover color transitions

#### Issues Identified:
- **CRITICAL:** Hero section height (59.75rem) exceeds mobile viewport height (typically 812px or less on modern phones)
- **CONCERN:** First section should fit entirely in mobile screen without scrolling
- **OBSERVATION:** Content positioned absolutely may cause overflow on small screens

---

### 2. TRUSTED BY SECTION

#### Mobile (375px width)
- **Height:** Auto (content-based)
- **Padding:** 3.5rem 1rem (56px 16px)
- **Background:** Light (--color-bg-container)
- **Layout:** Vertical flex, centered alignment

**Structure:**
1. **Header Content**
   - Centered layout
   - Flex column, aligned center
   - Gap: 1.5rem
   - Max-width: 57.5625rem
   - Caption: "Trusted by" in primary color
   - Heading: 2rem / mobile heading style

2. **Logo Carousel**
   - Horizontal scroll container
   - Width: 100%
   - Opacity: 0.5 (faded appearance)
   - Gap between logos: 1.5rem
   - Logos: Grayscale + brightness filter (brightness(0.5))
   - Horizontal scroll with GSAP animation
   - Overflow-x: hidden with hidden scrollbar

**Animation (Mobile):**
- GSAP timeline that animates scrollLeft
- Looping animation (repeat: -1)
- Speed: 30px per scroll duration unit
- Duplicate logos for seamless loop
- Scroll events prevented (wheel, touchmove)

**Typography:**
- Caption: 0.75rem / 1.1 line-height / 2px letter-spacing
- Heading: 2rem / mobile heading style

#### Desktop (768px+)
- **Padding:** 3.5rem 1rem
- **Max-width:** 90rem
- **Logo Layout:** Flex wrap enabled, center justified
- **Duplicate Logos:** Hidden (display: none)

**Structure Changes:**
- Logo carousel becomes flex-wrap layout
- No horizontal scroll
- Logos arranged in grid-like pattern
- All logos visible at once (no animation needed)

---

### 3. GALLERY SECTION

#### Mobile (375px width)
- **Padding:** 1.5rem 0 (24px top/bottom, 0 horizontal)
- **Background:** Light container color
- **Grid Layout:** 5 columns

**Structure:**
- Grid template columns: repeat(5, 1fr)
- Gap: 0.5rem (8px)
- Max-width: 87rem (constrained)
- Items: Aspect ratio 218.67/312 (portrait orientation)
- Image fill: cover, 100% width/height

**Typography:**
- No text elements in gallery

**Spacing:**
- Grid gap: 0.5rem
- Section padding: 1.5rem vertical

#### Desktop (768px+)
- **Padding:** 1.5rem
- **Grid Layout:** 6 columns
- **Gap:** 1.5rem (24px)

**Structure Changes:**
- More columns for landscape display
- Wider spacing between items
- Maintains aspect ratio

---

### 4. KEY PROJECT SECTION

#### Mobile (375px width)
- **Background:** Light container with rounded top (border-radius: 1rem 1rem 0 0)
- **Padding:** 2rem 1.5rem 1.5rem

**Project Header:**
1. **Project Number**
   - Display: flex
   - Font: JetBrains Mono, 700 weight, uppercase
   - Gap: 3.875rem between label and number
   - Font size: 0.75rem
   - Letter-spacing: 0.125rem
   - Color: tertiary with 0.4 opacity

2. **Project Content**
   - Flex column, gap: 3rem
   - Title: 2.5rem / 1.2 line-height / weight: 400 / -0.05rem letter-spacing

3. **Project Details**
   - Flex column, gap: 4rem
   - Info Section: Description text
   - Ekip Section: Team members list
   - Expertise/Client: Side-by-side layout

**Project Images Section:**
- Padding: 8rem 1.5rem
- Gap: 6rem between elements
- Main image container: height 18.5625rem
- Image: object-fit: cover

**Gallery Layout (Mobile):**
- Main large image: 10.0625rem width × 17.9375rem height
- Small images: 13.6875rem total width
  - First small: 8.625rem height
  - Second small: 8.5625rem height
- Flex layout with 0.75rem gap

**Testimonial:**
- Quote mark: 6rem font size, weight: 300
- Quote text: 1.75rem / 1.2 line-height
- Author: Name + role
- Decorative line element

#### Desktop (768px+)
- **Padding:** 3rem 2rem 2rem
- **Project Content:** Flex row, gap: 4rem
- **Project Title:** Max-width 50%, flex: 1
- **Project Images:** Flex row, gap: 3rem
- **Main Image:** Min-height 30rem, flex: 1

---

### 5. FOOTER

#### Mobile (375px width)
- **Height:** Min-height 47.625rem
- **Background:** Primary color (#880f00)
- **Padding:** 1.5rem
- **Border-radius:** 1rem 1rem 0 0
- **Position:** Relative with z-index layering

**Structure:**
1. **Decoration Layer**
   - Position: absolute, top: -16.4375rem, right: -16.25rem
   - Size: 37.5rem × 37.5rem
   - Rotation: 270deg
   - SVG graphics with overlay

2. **Contact Label**
   - Position: relative, z-index: 1
   - Font: JetBrains Mono, 0.75rem, 700 weight, uppercase
   - Color: Inverted-100 (white)
   - Opacity: 0.4
   - Margin-bottom: 1.5rem

3. **Logo Wrapper**
   - Width: 18.5625rem
   - Height: 3.9375rem
   - Margin-top: 6.8125rem
   - SVG logo

4. **Contact Info**
   - Display: flex column, gap: 1.5rem
   - Margin-top: auto, margin-bottom: 9.125rem
   - Font: Spectral, 1.625rem, weight: 300
   - Color: rgba(255, 255, 255, 0.81)
   - White-space: pre-wrap

5. **Footer Line**
   - Position: absolute, bottom: 2.3125rem
   - Height: 1px
   - Background: rgba(255, 255, 255, 0.4)

6. **Social Links**
   - Position: absolute, bottom: 3.8125rem
   - Display: flex, gap: 1.0625rem
   - Font: JetBrains Mono, 0.75rem, 700 weight, uppercase
   - Color: rgba(255, 255, 255, 0.8)
   - Hover: white color

#### Desktop (768px+)
- Same structure as mobile
- Maintained dimensions

#### Colors:
- **Primary Background:** #880f00 (deep red)
- **Text:** rgba(255, 255, 255, 0.81) and variations
- **Decorative Elements:** SVG graphics positioned off-canvas

---

## Typography System

### Font Families
- **Heading:** Spectral (var(--font-heading))
- **Body:** Public Sans (var(--font-body))
- **Mono:** JetBrains Mono (var(--font-mono))

### Font Scale
| Role | Mobile | Desktop | Weight | Line Height | Letter Spacing |
|------|--------|---------|--------|-------------|---|
| Heading | 2rem | 2.5rem | 400 | 1.2 | -0.64px / -2px |
| Main Text | 1.75rem | 2.25rem | 300 | 1.2 | -2px |
| Title | 1.625rem | 1.75rem | 300 | 1.5 | -2px |
| Body | 1rem | 1rem | 400 | 1.5 | -2px |
| Caption | 0.75rem | 0.75rem | 700 | 1.1 | 2px |

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | #880f00 | Footer, accents |
| --color-text-primary | #231D1D | Main text |
| --color-text-tertiary | #080707 | Secondary labels |
| --color-bg-container | #F5F4F4 | Section backgrounds |
| --color-text-invert-100 | #FFFFFF | White text |
| --color-text-invert-80 | #F5F5F5 | Off-white text |
| --color-text-invert-40 | #CCCCCC | Gray text |
| --color-overlay-dark | rgba(0,0,0,0.2) | Hero overlay |

---

## Spacing System

### Gap Values
- 0.5rem (8px) - Gallery grid
- 0.75rem (12px) - Small gaps, logo spacing
- 1rem (16px) - Standard gap
- 1.5rem (24px) - Common padding/gap
- 2rem (32px) - Large gaps
- 3rem (48px) - Extra large gaps
- 3.5rem (56px) - Section padding
- 4rem (64px) - Major gaps
- 6rem (96px) - Very large gaps

### Section Padding
- Mobile: 1.5rem to 3.5rem horizontal
- Desktop: 1.5rem to 2rem (within max-width container)
- Vertical: Varies by section (1.5rem to 8rem)

---

## Responsive Breakpoints

### Breakpoint: 48.0625rem (768px / 768px)
- **Desktop threshold**
- Layout shifts: Flex directions change
- Typography: Scales up to desktop sizes
- Gallery: 5 columns → 6 columns
- Navigation: Hamburger → Desktop nav
- Hero: Centered → Right-aligned split

---

## Animations & Interactions

### Hero Section
- Menu toggle: 300ms animation
- Scroll indicator: Visible at bottom
- Header: Fixed position navigation

### Trusted By Section
- Logo carousel animation (GSAP)
  - Linear scrolling animation
  - Infinite loop with duplicate logos
  - Mobile-only (desktop uses static grid)

### Hover States
- Navigation items: Color transition + pseudo-element reveal
- Social links: Color fade transitions
- Links: 0.3s ease color transitions

### Transitions
- Duration: 0.3s ease for most interactions
- Color changes: Smooth transitions
- Menu open/close: 300ms state animations

---

## Key Concerns & Issues

### CRITICAL ISSUE: Mobile Hero Height
- **Current:** 59.75rem (956px)
- **Typical Mobile Viewport:** 667px - 812px
- **Impact:** Hero section requires significant scrolling on mobile devices
- **User Feedback:** "First section should fit in mobile screen"
- **Recommendation:** Reduce hero height to fit within standard mobile viewport (< 100vh)

### Additional Observations
1. **Mobile Gallery:** 5 columns may be too narrow (individual images very small)
2. **Logo Animation:** GSAP animation only on mobile, which is appropriate
3. **Spacing:** Generally consistent but some large gaps (8rem) in project section
4. **Typography:** Well-structured, scales appropriately

---

## Responsive Behavior Summary

| Aspect | Mobile | Desktop |
|--------|--------|---------|
| Hero Height | 59.75rem ❌ | 48.125rem ✓ |
| Gallery Columns | 5 | 6 |
| Layout | Vertical stack | Split/Row layout |
| Navigation | Hamburger menu | Desktop nav bar |
| Logo Animation | GSAP carousel | Static grid |
| Max-width | 100% | 90rem |
| Logo Carousel | Animated scroll | Static flex-wrap |
| Project Section | Single column | Two columns |

---

## Next Steps

1. **Verify with Figma:** Confirm mobile hero section target height in design
2. **Identify Gaps:** Compare against implementation for discrepancies
3. **Prioritize Fixes:** Create action list based on severity and impact

