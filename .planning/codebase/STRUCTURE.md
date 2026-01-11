# Codebase Structure

**Analysis Date:** 2026-01-12

## Directory Layout

```
saint6/
├── app/                                    # Next.js App Router root
│   ├── [locale]/                          # Dynamic locale segment (en, vi)
│   │   ├── layout.tsx                    # Locale-specific layout wrapper
│   │   └── page.tsx                      # Homepage - main page component
│   ├── components/                        # Reusable React components
│   │   ├── ui/                           # Base UI primitives (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── separator.tsx
│   │   ├── header/                       # Navigation header
│   │   ├── footer/                       # Footer section
│   │   ├── hero-section/                 # Landing hero section
│   │   ├── menu-overlay/                 # Mobile menu overlay
│   │   ├── hamburger-menu/               # Menu toggle button
│   │   ├── language-selector/            # Language/locale switcher
│   │   ├── social-links/                 # Social media links
│   │   ├── trusted-by-section/           # Brand logos carousel
│   │   ├── gallery-section/              # Image gallery grid
│   │   ├── key-project-section/          # Featured project showcase
│   │   └── project-section/              # Additional project section
│   │
│   ├── contexts/                          # React Context providers
│   │   └── TranslationContext.tsx        # i18n state and hooks
│   │
│   ├── lib/                               # Utility functions
│   │   ├── navigation.ts                 # Locale path utilities
│   │   └── utils.ts                      # CSS class merger (cn)
│   │
│   ├── translations/                      # Translation dictionaries
│   │   ├── en.json                       # English translations
│   │   └── vi.json                       # Vietnamese translations
│   │
│   ├── types.ts                           # Type definitions (Locale)
│   ├── layout.tsx                         # Root layout (passthrough)
│   ├── page.module.css                   # Homepage styles
│   ├── globals.css                        # Global styles + CSS variables
│   └── [icons and metadata files]
│
├── public/                                # Static assets (served as-is)
│   ├── assets/                           # SVG logos
│   ├── images/                           # PNG, JPG images
│   │   ├── hero/                         # Hero section images
│   │   ├── brands/                       # Brand logos
│   │   ├── gallery/                      # Gallery images (15 files)
│   │   ├── project/                      # Project showcase images
│   │   └── decoration/                   # Decorative assets
│   ├── favicon.ico
│   ├── manifest.json
│   └── [other static files]
│
├── .next/                                # Next.js build output (generated)
├── node_modules/                         # Dependencies (generated)
├── package.json                          # npm configuration and scripts
├── pnpm-lock.yaml                        # pnpm dependency lock
├── pnpm-workspace.yaml                   # pnpm workspace config
├── tsconfig.json                         # TypeScript configuration
├── next.config.ts                        # Next.js configuration
├── postcss.config.mjs                    # PostCSS/Tailwind config
├── biome.json                            # Biome linter/formatter config
├── components.json                       # shadcn/ui configuration
├── proxy.ts                              # Locale middleware (unused?)
├── .cursorrules                          # AI assistant guidelines
├── README.md                             # Project documentation
└── .gitignore                            # Git ignore patterns
```

## Directory Purposes

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router application source |
| `app/[locale]/` | Dynamic locale routing segment |
| `app/components/` | All React components organized by feature/type |
| `app/components/ui/` | Base UI primitives from shadcn/ui |
| `app/contexts/` | React Context providers for global state |
| `app/lib/` | Utility functions and helpers |
| `app/translations/` | JSON translation files (en.json, vi.json) |
| `public/` | Static assets served directly without processing |
| `public/images/` | Image gallery, hero, project, brand assets |

## Key File Locations

**Entry Points:**
- `app/[locale]/page.tsx` - Homepage component (main entry point)
- `app/[locale]/layout.tsx` - Locale-specific layout with metadata
- `app/layout.tsx` - Root layout (minimal passthrough)

**Global Configuration:**
- `app/globals.css` - Global styles, CSS variables, Tailwind directives
- `tsconfig.json` - TypeScript configuration with strict mode
- `next.config.ts` - Next.js configuration with React Compiler
- `biome.json` - Code linting and formatting rules

**Translation & Localization:**
- `app/contexts/TranslationContext.tsx` - i18n state and hooks
- `app/translations/en.json` - English translations
- `app/translations/vi.json` - Vietnamese translations
- `app/lib/navigation.ts` - Locale path utilities (getLocalizedPath, switchLocale)

**Components (by type):**
- Header: `app/components/header/Header.tsx`
- Footer: `app/components/footer/Footer.tsx`
- Sections: `app/components/{hero,gallery,trusted-by,key-project}-section/`
- Features: `app/components/{language-selector,hamburger-menu,menu-overlay}/`
- Primitives: `app/components/ui/{button,card,badge,separator}.tsx`

**Styling:**
- Global: `app/globals.css`
- Component-scoped: `app/components/**/*.module.css` (one per component)
- Example: `app/components/header/Header.module.css`

## Naming Conventions

**Directories:**
- Kebab-case for all directories: `hero-section`, `key-project-section`, `hamburger-menu`
- Logical grouping by feature: Components grouped by responsibility
- Plural for collections: `components`, `translations`, `contexts`

**Files:**
- PascalCase for React components: `Header.tsx`, `HeroSection.tsx`, `LanguageSelector.tsx`
- lowercase for utilities: `navigation.ts`, `utils.ts`, `types.ts`
- UPPERCASE for entry points: `README.md`, `.cursorrules`, `.gitignore`
- CSS Modules: `ComponentName.module.css` (paired with component)
- Translation files: `{locale}.json` (e.g., `en.json`, `vi.json`)

**Component Props:**
- PascalCase interfaces: `HeaderProps`, `LanguageSelectorsProps`, `KeyProjectData`
- Semantic naming: `isMenuOpen`, `onMenuToggle`, `locale`, `items`
- Optional properties: `isClosing?: boolean`, `testimonial?: Object`

**CSS Classes (within modules):**
- BEM-like structure within module scope: `.header`, `.headerLogo`, `.mobileNav`
- No global class namespace pollution (CSS Module scoped)
- Utility classes via Tailwind for responsive design

## Where to Add New Code

**New Page/Route:**
- Create directory: `app/[locale]/path/page.tsx`
- Layout if needed: `app/[locale]/path/layout.tsx`
- Styles: `app/path/page.module.css`

**New Component:**
- Directory: `app/components/{kebab-case-name}/`
- Component file: `app/components/{kebab-case-name}/{PascalCase}.tsx`
- Styles: `app/components/{kebab-case-name}/{PascalCase}.module.css`
- Props interface: Define in component file or `app/types.ts` if reused

**New Translation Key:**
- Add to both: `app/translations/en.json`, `app/translations/vi.json`
- Use path notation: `"SECTION": { "KEY": "text" }`
- Access via: `const { t } = useTranslation()`

**New Utility Function:**
- Feature-specific: Create `app/lib/{feature}.ts`
- Shared: Add to `app/lib/utils.ts` or `app/lib/navigation.ts`
- Export as named export for clarity

**New Context Provider:**
- Create: `app/contexts/{FeatureName}Context.tsx`
- Export: Provider component + custom hook
- Pattern: TranslationContext serves as template

## Module Boundaries

**Clear Separation:**
1. **Components** - No business logic, pure presentation
2. **Contexts** - State management and hooks
3. **Lib/Utils** - Pure functions, no side effects
4. **Types** - Shared type definitions

**No Circular Dependencies:**
- Components can import utils and contexts
- Utils cannot import components
- Contexts can import utils and types
- All can import from types.ts

**Import Style (Mandatory):**
- Absolute paths with `@/` alias (configured in tsconfig.json)
- Examples:
  - `import { useTranslation } from "@/app/contexts/TranslationContext"`
  - `import { cn } from "@/app/lib/utils"`
  - `import styles from "./Header.module.css"`

## Special Directories

**node_modules/**
- Purpose: Installed dependencies
- Source: pnpm install
- Committed: No (in .gitignore)

**.next/**
- Purpose: Next.js build output
- Source: `npm run build` or `npm run dev`
- Committed: No (in .gitignore)

**public/**
- Purpose: Static assets served directly
- Source: Manual uploads of images, icons, etc.
- Committed: Yes (tracked in git)

**app/translations/**
- Purpose: i18n translation files
- Format: JSON with hierarchical structure
- Language pairs: English (en), Vietnamese (vi)

---

*Structure analysis: 2026-01-12*
*Update when directory structure changes*
