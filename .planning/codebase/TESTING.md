# Testing Patterns

**Analysis Date:** 2026-01-12

## Test Framework

**Status:** NO TEST FRAMEWORK CONFIGURED

**Not Installed:**
- No Jest, Vitest, or other test runner
- No test dependencies in `package.json`
- No test configuration files (`jest.config.js`, `vitest.config.ts`, etc.)

**Quality Assurance:**
- Code linting via Biome 2.2.0
- Type checking via TypeScript strict mode
- Manual testing only (no automated tests)

**Run Commands:**
```bash
pnpm lint       # Check code with Biome
pnpm format     # Auto-format with Biome
npm run dev     # Start development server for manual testing
npm run build   # Verify production build succeeds
```

## Test Architecture Readiness

While no tests exist, the codebase is designed with testability in mind:

**Testable Elements:**
- Pure utility functions in `app/lib/` (easy to unit test)
  - `app/lib/navigation.ts` - locale path manipulation
  - `app/lib/utils.ts` - CSS class merging
- Context providers with clear contracts
  - `app/contexts/TranslationContext.tsx` - translation state injection
- Functional components with prop-based configuration
- TypeScript interfaces document expected data structures

**Component Testing Approach (If Added):**
- Unit tests with Vitest (recommended for Next.js)
- Integration tests for locale switching
- E2E tests for user workflows
- Test location: `app/components/**/*.test.tsx` (co-located with components)

## Code Quality Tools

**Biome Configuration (`biome.json`):**
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "react": { "recommended": true },
      "nextjs": { "recommended": true }
    }
  },
  "formatter": {
    "enabled": true,
    "indentSize": 2,
    "indentStyle": "space"
  }
}
```

**Linting:**
- Biome recommends React and Next.js rules
- Import organization (`assist.actions.source.organizeImports: "on"`)
- Suspicious patterns detected (unused variables, unreachable code)
- VCS integration enabled (respects .gitignore)

**Type Checking:**
- TypeScript strict mode enabled (`tsconfig.json`)
- Strict null checks required
- No implicit any
- No unused variables allowed

## Testing Gaps

**Critical Paths Not Covered:**
1. **Locale Switching Logic** - `app/lib/navigation.ts` functions not tested
2. **Translation Context** - useTranslation hook behavior untested
3. **Component Composition** - Section components not tested for correct rendering
4. **Image Loading** - No error handling or loading states tested
5. **Menu State Management** - Open/close behavior untested
6. **Responsive Behavior** - Mobile/desktop breakpoints untested
7. **GSAP Animations** - Animation logic in TrustedBySection untested

## Future Testing Setup

**Recommended Framework:** Vitest (Next.js compatible)

**Setup Steps:**
1. Install: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom`
2. Configure: Create `vitest.config.ts` with Next.js support
3. Add test scripts: `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`
4. Create test files: `app/**/*.test.tsx` co-located with components

**Test Pattern Example:**
```typescript
// app/lib/navigation.test.ts
import { describe, it, expect } from 'vitest';
import { getLocalizedPath, switchLocale } from './navigation';

describe('navigation utilities', () => {
  it('should add locale prefix to path', () => {
    expect(getLocalizedPath('/about', 'en')).toBe('/en/about');
    expect(getLocalizedPath('/about', 'vi')).toBe('/vi/about');
  });

  it('should switch locale in current path', () => {
    const result = switchLocale('/en/about', 'vi');
    expect(result).toBe('/vi/about');
  });
});
```

**Component Test Pattern Example:**
```typescript
// app/components/header/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should render navigation items', () => {
    render(<Header isMenuOpen={false} onMenuToggle={() => {}} />);
    expect(screen.getByText('Studio Rental')).toBeInTheDocument();
  });
});
```

## Test Organization (When Implemented)

**File Structure:**
```
app/
├── components/
│   ├── header/
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   └── Header.test.tsx          # Co-located test file
│   └── [other components with .test.tsx files]
├── lib/
│   ├── navigation.ts
│   └── navigation.test.ts           # Utility tests
└── contexts/
    ├── TranslationContext.tsx
    └── TranslationContext.test.tsx  # Context tests
```

**Coverage Target (Suggested):**
- Utility functions: 100% (easy to test, pure functions)
- Components: 70%+ (focus on critical interactions)
- No arbitrary coverage targets (coverage ≠ quality)

## Linting & Format Commands

```bash
# Check code with Biome
pnpm lint

# Auto-format code with Biome (fixes issues automatically)
pnpm format

# Verify build succeeds
npm run build

# Type checking
npx tsc --noEmit
```

## CI/CD Considerations

**Current Pipeline:**
- Git commits are the only checkpoint
- No automated testing in CI
- Build succeeds if TypeScript compiles and Biome passes

**Recommended Additions:**
- Add Biome check in CI: `pnpm lint --error-on-warnings`
- Add type check: `npx tsc --noEmit`
- Add test suite: `pnpm test` (once tests exist)
- Add build verification: `npm run build`

---

*Testing analysis: 2026-01-12*
*Update when test patterns change*
