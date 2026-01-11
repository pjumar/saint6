# Technology Stack

**Analysis Date:** 2026-01-12

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code in `app/` directory

**Secondary:**
- JavaScript/JSX - via React and Next.js framework
- CSS3 with Tailwind - Styling via `app/globals.css` and CSS Modules

## Runtime

**Environment:**
- Node.js 20+ (inferred from Next.js 16 compatibility, no `.nvmrc` file)

**Package Manager:**
- pnpm (monorepo/workspace package manager)
- Lockfile: `pnpm-lock.yaml` present and locked

## Frameworks

**Core:**
- Next.js 16.1.1 - React/TypeScript web framework with App Router
  - React Server Components enabled
  - React Compiler enabled for automatic memoization
  - Dynamic locale routing via `[locale]` segments

**UI Framework:**
- React 19.2.3 - UI library for components
- React DOM 19.2.3 - DOM rendering layer

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework
- Tailwind CSS PostCSS 4.1.18 - PostCSS plugin integration
- shadcn/ui components - Component library built on Radix UI

**Animation & Interaction:**
- GSAP 3.14.2 - GreenSock Animation Platform for complex animations
- Radix UI (via shadcn/ui) - Accessible component primitives

## Key Dependencies

**Critical:**
- @radix-ui/react-separator 1.1.8 - Accessible separator components
- @radix-ui/react-slot 1.2.4 - Composition utilities for Radix
- lucide-react 0.562.0 - Icon library with 300+ SVG icons
- class-variance-authority 0.7.1 - CSS variable composition for component variants
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.4.0 - Smart Tailwind CSS class merging

**Build & Development:**
- TypeScript 5.9.3 - Static type checking
- Biome 2.2.0 - Code linter and formatter combined
- babel-plugin-react-compiler 1.0.0 - React compiler plugin for performance
- @types/node 20.19.27 - Node.js type definitions
- @types/react 19.2.7 - React type definitions
- @types/react-dom 19.2.3 - React DOM type definitions

## Configuration

**TypeScript:**
- Target: ES2017
- Module: ES2020
- Strict mode: enabled
- Path aliases: `@/*` points to project root
- React JSX transform: `react-jsx`
- Module resolution: bundler strategy (`tsconfig.json`)

**Build Configuration:**
- `next.config.ts` - React Compiler enabled, standard Next.js setup
- `tsconfig.json` - TypeScript compiler options with strict mode
- `biome.json` - Code linting and formatting rules (React + Next.js domains)
- `components.json` - shadcn/ui configuration with Tailwind
- `postcss.config.mjs` - PostCSS plugins for Tailwind CSS
- `pnpm-workspace.yaml` - Workspace configuration

**Fonts:**
- Google Fonts integration via `next/font/google`:
  - Public Sans (body text)
  - Spectral (headings)
  - JetBrains Mono (captions/code)

**Environment:**
- NEXT_PUBLIC_SITE_URL - Base URL for metadata and redirects
- No .env or .env.example file exists

## Platform Requirements

**Development:**
- Node.js 20+
- pnpm 9.x
- Any platform (macOS, Linux, Windows)
- Git for version control

**Production:**
- Deployment platform: Vercel (inferred from Next.js App Router + static generation)
- Static export capable (no dynamic server requirements)
- CDN compatible with static assets

---

*Stack analysis: 2026-01-12*
*Update after major dependency changes*
