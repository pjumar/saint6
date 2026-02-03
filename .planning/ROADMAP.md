# Roadmap: Saint 6 Studio

## Overview

Build a complete multi-page portfolio website for Saint 6 Studio, a creative agency. Start with polishing the homepage, then build out 8 service and info pages from the completed Figma design. After all UI is complete, add error handling/stability features, integrate a CMS backend for dynamic content, and launch.

## Milestones

- [v0.2 Homepage + First Service Page](milestones/v0.2-ROADMAP.md) (Phases 1-2) — SHIPPED 2026-01-24
- ✅ **v1.0 All Pages Complete** — Phases 3-6 — COMPLETE 2026-01-25
- 🚧 **v1.1 Production Ready** — Phases 7-9 (next)

## Completed Milestones

<details>
<summary>v0.2 Homepage + First Service Page (Phases 1-2) — SHIPPED 2026-01-24</summary>

- [x] Phase 1: Homepage Polish (3/3 plans) — completed 2026-01-12
- [x] Phase 2: Studio Rental (3/3 plans) — completed 2026-01-23

See full details: [milestones/v0.2-ROADMAP.md](milestones/v0.2-ROADMAP.md)

</details>

## Current Milestone: v1.0 All Pages Complete ✅

### Phases

- [x] **Phase 3: Set Design & Production Pages** - Two similar service pages using template
- [x] **Phase 4: Event Planning & Decoration Pages** - Two more service pages
- [x] **Phase 5: Creative Page** - Final service page
- [x] **Phase 6: About Us & Contact Pages** - Info and contact pages

### Phase Details

#### Phase 3: Set Design & Production Pages
**Goal**: Two additional service pages using established template pattern
**Depends on**: Phase 2
**Research**: Unlikely (template already established)
**Plans**: 2 plans

Plans:
- [x] 03-01: Build Set Design page — completed 2026-01-24
- [x] 03-02: Build Production page — completed 2026-01-24

#### Phase 4: Event Planning & Decoration Pages
**Goal**: Two more service pages, template fully validated
**Depends on**: Phase 3
**Research**: Unlikely (template pattern working)
**Plans**: 2 plans

Plans:
- [x] 04-01: Build Event Planning page — completed 2026-01-24
- [x] 04-02: Build Decor page — completed 2026-01-24

#### Phase 5: Creative Page
**Goal**: Final service page, complete all service offerings
**Depends on**: Phase 4
**Research**: Unlikely (template established and proven)
**Plans**: 1 plan

Plans:
- [x] 05-01: Build Creative page — completed 2026-01-25

#### Phase 6: About Us & Contact Pages
**Goal**: Info pages complete, all main navigation pages done
**Depends on**: Phase 5
**Research**: Unlikely (different layout but established patterns)
**Plans**: 2 plans

Plans:
- [x] 06-01: Build About Us page — completed 2026-01-25
- [x] 06-02: Build Contact Us page — completed 2026-01-25

## Future Milestone: v1.1 Production Ready

### Phase 7: Error Handling & Stability
**Goal**: Production-ready stability: error boundaries, image handling, code cleanup
**Depends on**: Phase 6 (all UI complete)
**Research**: Unlikely (internal patterns and React best practices)
**Plans**: 3 plans

Plans:
- [x] 07-01: Add error boundary component and wrap app — completed 2026-02-03
- [x] 07-02: Add image error handlers and fallbacks — completed 2026-02-03
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

| Phase                          | Milestone | Plans Complete | Status      | Completed  |
|--------------------------------|-----------|----------------|-------------|------------|
| 1. Homepage Polish             | v0.2      | 3/3            | Complete    | 2026-01-12 |
| 2. Studio Rental               | v0.2      | 3/3            | Complete    | 2026-01-23 |
| 3. Set Design & Production     | v1.0      | 2/2            | Complete    | 2026-01-24 |
| 4. Event Planning & Decoration | v1.0      | 2/2            | Complete    | 2026-01-24 |
| 5. Creative                    | v1.0      | 1/1            | Complete    | 2026-01-25 |
| 6. About Us & Contact          | v1.0      | 2/2            | Complete    | 2026-01-25 |
| 7. Error Handling & Stability  | v1.1      | 1/3            | In progress | -          |
| 8. CMS Integration             | v1.1      | 0/4            | Not started | -          |
| 9. Polish & Launch             | v1.1      | 0/2            | Not started | -          |

---

*Roadmap created: 2026-01-12*
*Total: 9 phases, ~22 plans*
*v0.2 shipped: 2026-01-24*
