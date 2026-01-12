# Roadmap: Saint 6 Studio

## Overview

Build a complete multi-page portfolio website for Saint 6 Studio, a creative agency. Start with polishing the homepage, then build out 8 service and info pages from the completed Figma design. After all UI is complete, add error handling/stability features, integrate a CMS backend for dynamic content, and launch.

## Domain Expertise

None

## Phases

- [ ] **Phase 1: Homepage Polish** - Refine homepage to match Figma design exactly
- [ ] **Phase 2: Studio Rental Page** - Build first service page and establish page template
- [ ] **Phase 3: Set Design & Production Pages** - Two similar service pages using template
- [ ] **Phase 4: Event Planning & Decoration Pages** - Two more service pages
- [ ] **Phase 5: Creative Page** - Final service page
- [ ] **Phase 6: About Us & Contact Pages** - Info and contact pages
- [ ] **Phase 7: Error Handling & Stability** - Add error boundaries, image handling, cleanup
- [ ] **Phase 8: CMS Integration** - Choose and integrate headless CMS
- [ ] **Phase 9: Polish & Launch** - Social links, final QA, deployment

## Phase Details

### Phase 1: Homepage Polish
**Goal**: Homepage matches Figma design exactly with responsive layout and animations
**Depends on**: Nothing (first phase)
**Research**: Unlikely (using existing patterns and components)
**Plans**: 2-3 plans

Plans:
- [x] 01-01: Review Figma design, identify gaps from current implementation
- [x] 01-02: Update hero section, header, and layout to match design
- [ ] 01-03: Verify responsive behavior and GSAP animations

### Phase 2: Studio Rental Page
**Goal**: First service page complete, establish reusable page template pattern
**Depends on**: Phase 1
**Research**: Unlikely (using existing component patterns)
**Plans**: 3 plans

Plans:
- [ ] 02-01: Create page layout from Figma design
- [ ] 02-02: Build Studio Rental service components
- [ ] 02-03: Verify responsive design and i18n translations

### Phase 3: Set Design & Production Pages
**Goal**: Two additional service pages using established template pattern
**Depends on**: Phase 2
**Research**: Unlikely (template already established)
**Plans**: 2 plans

Plans:
- [ ] 03-01: Build Set Design page
- [ ] 03-02: Build Production page

### Phase 4: Event Planning & Decoration Pages
**Goal**: Two more service pages, template fully validated
**Depends on**: Phase 3
**Research**: Unlikely (template pattern working)
**Plans**: 2 plans

Plans:
- [ ] 04-01: Build Event Planning page
- [ ] 04-02: Build Decoration page

### Phase 5: Creative Page
**Goal**: Final service page, complete all service offerings
**Depends on**: Phase 4
**Research**: Unlikely (template established and proven)
**Plans**: 1 plan

Plans:
- [ ] 05-01: Build Creative page

### Phase 6: About Us & Contact Pages
**Goal**: Info pages complete, all main navigation pages done
**Depends on**: Phase 5
**Research**: Unlikely (different layout but established patterns)
**Plans**: 2 plans

Plans:
- [ ] 06-01: Build About Us page
- [ ] 06-02: Build Contact Us page (form structure, no backend yet)

### Phase 7: Error Handling & Stability
**Goal**: Production-ready stability: error boundaries, image handling, code cleanup
**Depends on**: Phase 6 (all UI complete)
**Research**: Unlikely (internal patterns and React best practices)
**Plans**: 3 plans

Plans:
- [ ] 07-01: Add error boundary component and wrap app
- [ ] 07-02: Add image error handlers and fallbacks
- [ ] 07-03: Clean up unused imports, fix React warnings

### Phase 8: CMS Integration
**Goal**: Choose and integrate headless CMS for dynamic content
**Depends on**: Phase 7
**Research**: Likely (new CMS integration, library choice)
**Research topics**: CMS options (Strapi, Contentful, Sanity, Supabase), data schema for projects/team/services, build-time content fetching pattern
**Plans**: 3-4 plans

Plans:
- [ ] 08-01: Evaluate and select CMS platform
- [ ] 08-02: Set up CMS project and content schema
- [ ] 08-03: Integrate CMS with Next.js build process
- [ ] 08-04: Migrate hardcoded data to CMS

### Phase 9: Polish & Launch
**Goal**: Final polish, social links, deployment ready
**Depends on**: Phase 8
**Research**: Unlikely (final touches using established patterns)
**Plans**: 2 plans

Plans:
- [ ] 09-01: Update social media links, final QA
- [ ] 09-02: Performance optimization, SEO verification, deploy

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase                          | Plans Complete | Status      | Completed  |
|--------------------------------|----------------|-------------|------------|
| 1. Homepage Polish             | 3/3            | Complete    | 2026-01-12 |
| 2. Studio Rental | 0/3 | Not started | - |
| 3. Set Design & Production | 0/2 | Not started | - |
| 4. Event Planning & Decoration | 0/2 | Not started | - |
| 5. Creative | 0/1 | Not started | - |
| 6. About Us & Contact | 0/2 | Not started | - |
| 7. Error Handling & Stability | 0/3 | Not started | - |
| 8. CMS Integration | 0/4 | Not started | - |
| 9. Polish & Launch | 0/2 | Not started | - |

---

*Roadmap created: 2026-01-12*
*Total: 9 phases, ~22 plans*
