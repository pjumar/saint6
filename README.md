# Saint 6 Studio

An exclusive destination for elevated productions, private events, and visionary experiences.

Bilingual (EN/VI) marketing site. Next.js 16 App Router on Vercel, content from Strapi 5 on Strapi Cloud.

## Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript, React Compiler
- **CMS:** [Strapi 5](https://strapi.io) on Strapi Cloud
- **Styling:** Tailwind CSS v4 + CSS Modules
- **UI:** [shadcn/ui](https://ui.shadcn.com) on Radix
- **Animations:** [GSAP](https://gsap.com) (lazy-loaded singleton)
- **Tooling:** [Biome](https://biomejs.dev), pnpm, tsx

## Getting Started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.local.example .env.local
# fill: NEXT_PUBLIC_STRAPI_URL, STRAPI_API_TOKEN

pnpm dev                     # Next at :3000
cd strapi && npm run dev     # optional local Strapi

pnpm build && pnpm start
pnpm lint && pnpm format

# Strapi data
pnpm strapi:seed
pnpm strapi:reset
pnpm strapi:pull
```

## Project Layout

```
app/             # Next.js App Router (locale-segmented under [locale]/)
  components/    # UI primitives + feature components
  lib/           # Strapi client, transformers, fallback data, SEO, translations
  translations/  # en.json, vi.json
strapi/          # Strapi 5 workspace (separate deployment)
scripts/         # CMS seed / reset / pull scripts
public/          # Static assets (images, SVG logos)
```

## Documentation

Full project notes live in the CCLY Obsidian vault at `~/Nextcloud/CCLY/Projects/saint6/`:

- **`saint6.md`** — project hub (architecture, components, design tokens, run instructions, status)
- **`strapi-cms-guide.md`** — content model, seeding/syncing workflow, localization, Next.js integration
- **`performance.md`** — Lighthouse 90+ playbook (polyfill aliasing, inline CSS, GSAP lazy-load, GTM deferral, hero LCP, ISR + cron warmup)
- **`Planning.md`** — consolidated project plan, state, and roadmap (v1.1 shipped 2026-02-10)
- **`Milestones.md`** — per-milestone delivery log
- **`Codebase.md`** — codebase analysis (stack, architecture, structure, conventions, integrations, testing, concerns)

## License

Private project — All rights reserved.
