# Saint 6 Studio

An exclusive destination for elevated productions, private events, and visionary experiences tailored to your every need.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + CSS Modules
- **Fonts:** 
  - Spectral (headings) - Google Fonts
  - Public Sans (body) - Google Fonts
  - JetBrains Mono (captions) - Google Fonts
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm
- **React Compiler:** Enabled

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Code Quality

```bash
# Run linter
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
saint6/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with font configuration
│   ├── page.tsx             # Homepage component
│   └── page.module.css      # Homepage styles
├── public/
│   ├── assets/              # Static assets (logos, SVGs)
│   └── images/              # Image assets
│       ├── hero/            # Hero section images
│       ├── gallery/          # Gallery images
│       ├── project/          # Project section images
│       ├── brands/           # Brand logos
│       └── key-project/     # Key project section assets
├── .cursorrules             # Cursor IDE rules and conventions
└── biome.json               # Biome configuration
```

## Design System

### Colors

- Primary: `#880300`
- Text Primary: `#231D1D`
- Text Tertiary: `#080707`
- Background Container: `#F5F4F4`
- Text Invert (100/80/40): White with varying opacity

### Typography

- **Desktop Heading:** Spectral, 40px, weight 400
- **Desktop Main Text:** Spectral, 36px, weight 300
- **Desktop Title:** Spectral, 28px, weight 300
- **Mobile Heading:** Spectral, 32px, weight 400
- **Mobile Main Text:** Spectral, 28px, weight 300
- **Mobile Title:** Spectral, 26px, weight 300
- **Body Regular:** Public Sans, 16px, weight 400
- **Body Bold:** Public Sans, 16px, weight 500
- **Caption:** JetBrains Mono, 12px, weight 700, uppercase

### CSS Variables

All design tokens are defined as CSS variables in `app/globals.css` and exposed to Tailwind via `@theme inline`.

## Features

- Responsive design (desktop and mobile)
- Hero section with background image and overlay
- Gallery grid with 18 images
- Key Project sticky section
- Project showcase with detailed metadata
- Testimonial section
- Brand logos showcase

## Development Guidelines

See `.cursorrules` for detailed coding standards, including:

- TypeScript best practices
- React component patterns
- Next.js conventions
- Code style and comments
- Accessibility requirements

## License

Private project - All rights reserved.
