# Service Page Template

**Created:** Phase 2 (Studio Rental)
**Purpose:** Template pattern for replicating service pages in Phases 3-5

## Component Inventory

### Service-Specific Components (Created in Phase 2)

| Component | Path | Purpose | Reusable |
|-----------|------|---------|----------|
| StudioHeroSection | `studio-hero-section/` | Hero banner with image and tagline | Partially - rename for each service |
| StudioStats | `studio-stats/` | Stats grid (5-column desktop) | Yes - accepts stats array prop |
| StudioIntro | `studio-intro/` | Title, description, CTA button | Yes - accepts content props |
| RoomCard | `room-card/` | Room display with image, specs, price | Yes - generic card component |
| ConceptRoomCard | `concept-room-card/` | Extended room card with specs grid | Yes - for detailed item displays |
| ConceptRoomsShowcase | `concept-rooms-showcase/` | Header + carousel container | Partially - rename for context |
| FAQAccordion | `faq-accordion/` | Expandable Q&A section | Yes - fully reusable |
| InquiryForm | `inquiry-form/` | Contact form with validation | Yes - fully reusable |

### Shared Components (From Phase 1)

| Component | Path | Purpose |
|-----------|------|---------|
| Header | `header/` | Site navigation with language toggle |
| Footer | `footer/` | Contact info and social links |
| LanguageSelector | `language-selector/` | EN/VI language toggle |

## Page Structure Pattern

```
/app/[locale]/[service-name]/page.tsx
```

### Section Order

1. **Hero Section** - Full-width banner with service tagline
2. **Stats Section** - Key metrics (optional)
3. **Intro Section** - Title, description, CTA
4. **Primary Content** - Room cards, service cards, etc.
5. **Showcase Section** - Featured items carousel
6. **FAQ Section** - Common questions
7. **Form Section** - Contact/inquiry form

### Standard Page Layout

```tsx
export default function ServicePage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main>
        <ServiceHeroSection />
        <StudioStats stats={...} />          {/* Optional */}
        <StudioIntro title={...} />
        <section className={styles.cards}>
          {items.map(item => <RoomCard {...item} />)}
        </section>
        <ConceptRoomsShowcase items={...} /> {/* Optional */}
        <FAQAccordion items={faqItems} title={...} />
        <InquiryForm />
      </main>
      <Footer />
    </>
  );
}
```

## Spacing System

| Gap | Value | Usage |
|-----|-------|-------|
| Section gap | `10rem` (160px) | Between major sections |
| Card gap | `2rem` (32px) | Between cards in grid |
| Content gap | `1.5rem` (24px) | Within card content |
| Small gap | `0.5rem` (8px) | Between related text elements |

### Container Widths

- **Max container:** `87.5rem` (1400px)
- **Content container:** `62.5rem` (1000px) for text-heavy sections
- **Card container:** `100%` with padding `5rem` (80px) on desktop

## Responsive Breakpoints

| Breakpoint | Width | Grid Columns |
|------------|-------|--------------|
| Mobile | `< 48.0625rem` (769px) | 1 column |
| Tablet | `48.0625rem - 64rem` | 2 columns |
| Desktop | `> 64rem` (1024px) | 3 columns |

### Media Query Pattern

```css
/* Mobile-first base styles */
.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* Tablet */
@media (min-width: 48.0625rem) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 64rem) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## i18n Integration Pattern

### Translation File Structure

```json
{
  "SERVICE_NAME": {
    "HERO": {
      "TAGLINE": "Service tagline text"
    },
    "INTRO": {
      "TITLE": "How It Works",
      "DESCRIPTION": "Service description...",
      "CTA": "Get in touch"
    },
    "STATS": {
      "STAT_1": "Label 1",
      "STAT_2": "Label 2"
    },
    "ROOMS": {
      "MAKE_BOOKING": "Make a Booking",
      "GALLERY": "Gallery",
      "ENTER_ROOM": "Enter the Room",
      "PER_HOUR": "/hour"
    },
    "FAQ": {
      "TITLE": "Frequently Asked Questions",
      "Q1": "Question 1?",
      "A1": "Answer 1..."
    },
    "FORM": {
      "TITLE": "Send an Inquiry",
      "NAME": "Name",
      "EMAIL": "Email",
      "SUBMIT": "Send Inquiry"
    }
  }
}
```

### Component Integration

```tsx
"use client";
import { useTranslation } from "@/app/contexts/TranslationContext";

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <h2>{t.SERVICE_NAME.INTRO.TITLE}</h2>
  );
}
```

**Note:** Components using `useTranslation()` must have `"use client"` directive.

## Customization Guide for New Service Pages

### Step 1: Create Route

```bash
mkdir -p app/[locale]/[service-name]
touch app/[locale]/[service-name]/page.tsx
touch app/[locale]/[service-name]/page.module.css
```

### Step 2: Add Translations

1. Add service section to `app/translations/en.json`
2. Add matching section to `app/translations/vi.json`
3. Follow the structure pattern above

### Step 3: Customize Hero

Copy and rename `StudioHeroSection`:
- Update background image path
- Update tagline translation key

### Step 4: Configure Content

- Define items array for cards
- Set stats data (if applicable)
- Add FAQ items with translation keys

### Step 5: Reuse Components

Most components can be reused directly:
- `StudioStats` - Pass different stats array
- `StudioIntro` - Pass different content props
- `RoomCard` / `ConceptRoomCard` - Pass item data
- `FAQAccordion` - Pass FAQ items array
- `InquiryForm` - Reuse as-is

## Common Pitfalls

### 1. Missing "use client" Directive

**Problem:** Component uses hooks but doesn't have client directive
**Solution:** Add `"use client"` at top of file before imports

### 2. Translation Key Not Found

**Problem:** `t.SERVICE.KEY` shows undefined or key string
**Solution:** Ensure key exists in both en.json and vi.json

### 3. Layout Break with Long Text

**Problem:** Vietnamese text is longer and breaks layout
**Solution:** Use flexible containers, `flex-wrap`, or constrained widths

### 4. Image Aspect Ratio Issues

**Problem:** Images stretch or compress incorrectly
**Solution:** Use `aspect-ratio` CSS property and `object-fit: cover`

### 5. Grid Alignment Issues

**Problem:** Cards don't align on last row
**Solution:** Use CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`

### 6. Form Not Submitting

**Problem:** Form submission doesn't work
**Solution:** Implement form action or API route handler

## File Checklist for New Service Page

- [ ] `app/[locale]/[service-name]/page.tsx`
- [ ] `app/[locale]/[service-name]/page.module.css`
- [ ] Translation keys in `en.json`
- [ ] Translation keys in `vi.json`
- [ ] Hero background image in `public/images/`
- [ ] Service-specific images in `public/images/`
- [ ] Update navigation if needed

## Performance Considerations

- Use Next.js `Image` component for automatic optimization
- Lazy load below-fold images with `loading="lazy"`
- Keep FAQ content concise to avoid layout shift
- Test with Lighthouse for Core Web Vitals

---

*Template validated in Phase 2 (Studio Rental) - Ready for Phases 3-5*
