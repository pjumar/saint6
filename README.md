# Saint 6 Studio

An exclusive destination for elevated productions, private events, and visionary experiences tailored to your every need.

## Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript
- **CMS:** [Strapi 5](https://strapi.io) (hosted on Strapi Cloud)
- **Styling:** Tailwind CSS v4 + CSS Modules
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- **Animations:** [GSAP](https://gsap.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **Fonts:** Saira Condensed (headings), Public Sans (body), JetBrains Mono (captions)
- **Linting/Formatting:** [Biome](https://biomejs.dev)
- **Package Manager:** pnpm
- **React Compiler:** Enabled
- **i18n:** English (en) and Vietnamese (vi)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.strapiapp.com
STRAPI_API_TOKEN=your_api_token_here
```

### Development

```bash
# Start Next.js dev server
pnpm dev

# Start local Strapi (from /strapi folder)
cd strapi && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
pnpm build
pnpm start
```

### Code Quality

```bash
pnpm lint
pnpm format
```

### Strapi Data Scripts

```bash
pnpm strapi:seed     # Seed all CMS data
pnpm strapi:reset    # Reset all CMS data
pnpm strapi:pull     # Pull CMS data locally
```

## Project Structure

```
saint6/
├── app/
│   ├── [locale]/                # Locale-based routing (en, vi)
│   │   ├── layout.tsx           # Locale layout with fonts, metadata, providers
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact page
│   │   ├── creative/            # Creative services
│   │   ├── production/          # Production services
│   │   ├── set-design/          # Set design services
│   │   ├── event-planning/      # Event planning services
│   │   ├── decor/               # Decor services
│   │   └── studio-rental/       # Studio rental (with sub-layout)
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── header/
│   │   ├── footer/
│   │   ├── hero-section/
│   │   ├── gallery-section/
│   │   ├── contact-form-section/
│   │   └── ...
│   ├── lib/
│   │   ├── strapi.ts            # Strapi API integration
│   │   ├── translations.ts      # Server-side translations
│   │   ├── seo.ts               # SEO metadata builder
│   │   ├── fallback-data.ts     # Fallback data when CMS unavailable
│   │   └── utils.ts
│   ├── contexts/
│   │   └── TranslationContext.tsx
│   ├── hooks/                   # Custom React hooks
│   ├── translations/
│   │   ├── en.json
│   │   └── vi.json
│   ├── types/
│   └── globals.css              # CSS variables and Tailwind config
├── strapi/                      # Strapi CMS project (separate deployment)
│   ├── src/api/                 # Content type definitions
│   └── config/
├── scripts/strapi/              # CMS seeding and data scripts
├── public/
│   ├── assets/                  # SVG assets
│   └── images/                  # Static images
├── next.config.ts
├── biome.json
├── components.json              # shadcn/ui config
└── pnpm-lock.yaml
```

## Strapi CMS

The CMS manages all dynamic content. Strapi is deployed separately on Strapi Cloud.

### Content Types

**Single Types (Pages):** Homepage, Studio Rental, Creative, Production, Set Design, Event Planning, Decor, About, Contact, SEO Metadata

**Collection Types:** Brand Logos, Key Projects, Studio Rooms, Event Projects, Equipment Items, FAQ Items, Portfolio Items, Testimonial Items, Service Items, Contact Submissions

All content types support both EN and VI locales.

## Design System

All design tokens are defined as CSS variables in `app/globals.css` and exposed to Tailwind via `@theme inline`.

### Colors

| Token                       | Value                  | Usage               |
| --------------------------- | ---------------------- | ------------------- |
| `--color-primary`           | `#880f00`              | Brand accent        |
| `--color-text-primary`      | `#231d1d`              | Body text           |
| `--color-text-tertiary`     | `#080707`              | Dark text           |
| `--color-bg-container`      | `#f5f4f4`              | Section backgrounds |
| `--color-text-invert-100`   | `#ffffff`              | Text on dark        |
| `--color-text-invert-80`    | `#f5f5f5`              | Muted light text    |
| `--color-text-invert-40`    | `#cccccc`              | Subtle light text   |
| `--color-decoration-fill`   | `#620a08`              | Decorative accents  |
| `--color-overlay-dark`      | `rgba(0, 0, 0, 0.2)`   | Image overlays      |

### Typography

| Style            | Font             | Size (Desktop) | Size (Mobile) | Weight |
| ---------------- | ---------------- | -------------- | ------------- | ------ |
| Heading          | Saira Condensed  | 2.5rem         | 2rem          | 400    |
| Main Text        | Saira Condensed  | 2.25rem        | 1.75rem       | 300    |
| Title            | Saira Condensed  | 1.75rem        | 1.625rem      | 300    |
| Body Regular     | Public Sans      | 1rem           | 1rem          | 400    |
| Body Bold        | Public Sans      | 1rem           | 1rem          | 500    |
| Caption          | JetBrains Mono   | 0.75rem        | 0.75rem       | 700    |

### Layout

- **Max width:** 90rem (1440px)
- **Container padding:** 1.5rem (24px)
- **Section padding:** 8rem top/bottom
- **Desktop breakpoint:** 48.0625rem (769px)

### Global CSS Classes

Responsive typography classes defined in `globals.css` — mobile-first, scaling up at the desktop breakpoint:

`heading-desktop` · `main-text-desktop` · `title-desktop` · `body-regular` · `body-bold` · `caption` · `container` · `section`

## Internationalization

- Locale-based routing via `[locale]` dynamic segment
- Server-side translations with `getTranslations(locale)`
- Client-side translations via `TranslationProvider` context
- Static params generated for both `en` and `vi`

## Caching

Pages use Incremental Static Regeneration (ISR) with 60-second revalidation.

## License

Private project - All rights reserved.
