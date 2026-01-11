# Coding Conventions

**Analysis Date:** 2026-01-12

## Naming Patterns

**Files:**
- PascalCase for React components: `Header.tsx`, `HeroSection.tsx`, `KeyProjectSection.tsx`
- kebab-case for directories: `hero-section/`, `key-project-section/`, `hamburger-menu/`
- lowercase for utilities: `navigation.ts`, `utils.ts`
- UPPERCASE for important docs: `README.md`
- CSS Modules: `ComponentName.module.css` (paired with component)

**Components:**
- Export as named exports (not default)
- Interface for props: `export interface ComponentNameProps { ... }`
- Component name matches file name: `Header.tsx` exports `Header` function

**Functions:**
- camelCase for all functions: `getLocalizedPath()`, `switchLocale()`, `cn()`
- No special prefix for async functions
- Event handlers: `handleEventName` pattern (e.g., `handleMenuToggle`, `handleLanguageChange`)

**Variables:**
- camelCase for variables and state: `isMenuOpen`, `locale`, `items`
- UPPER_SNAKE_CASE for constants (in JSON files): `"NAVIGATION"`, `"HERO"`

**Types & Interfaces:**
- PascalCase for interfaces: `HeaderProps`, `KeyProjectData`, `ProjectImage`
- PascalCase for type aliases: `Locale` (union type: `"en" | "vi"`)
- No `I` prefix for interfaces (modern convention)

## Code Style

**Formatting:**
- Formatter: Biome 2.2.0 with `biome.json` configuration
- Indentation: 2 spaces
- Line length: Not explicitly configured (Biome default ~80)
- Quotes: Double quotes for strings (Biome default)
- Semicolons: Required at end of statements
- Trailing commas: In objects and arrays

**Linting:**
- Tool: Biome 2.2.0
- Config: `biome.json` with `recommended` rules
- Domains: React and Next.js rules enabled
- Run: `pnpm lint` for checking, `pnpm format` for auto-fix

**ESLint Rules:**
- No `console.log` in production code (should use logger if added)
- No `debugger` statements
- Unused variables not allowed
- Unused imports auto-cleanup via Biome

## Import Organization

**Order:**
1. External packages: `react`, `next`, `clsx`, `gsap`
2. Internal components: `@/app/components/*`
3. Internal contexts: `@/app/contexts/*`
4. Internal utilities: `@/app/lib/*`
5. Types: `import type { ... } from "@/app/types"`
6. Styles: `import styles from "./Component.module.css"`

**Grouping:**
- Blank line between groups
- No explicit alphabetical sort (but consistent order)
- Type imports last or inline as `import type`

**Path Aliases:**
- `@/` points to project root
- Configured in `tsconfig.json`
- Mandatory: Always use `@/` prefix for internal imports
- Never use relative imports like `../`, `./`

## Error Handling

**Patterns:**
- Throw errors for exceptional conditions
- Catch at component boundaries (event handlers, effects)
- No try/catch chains (prefer async/await with single try)
- Error logging (minimal - no logger configured yet)

**Custom Errors:**
- Extend Error class for custom error types (not currently used)
- Include context in error message
- Use Error `cause` property for chaining: `new Error('msg', { cause: originalError })`

**Error Types:**
- Throw on invalid input, missing data, invariant violations
- Return error in data structures if expected (Result pattern not used)

## Logging

**Framework:**
- No logging library configured
- No `console.log` in components (per `.cursorrules`)
- Development debugging via browser DevTools only

**Patterns:**
- Remove debug logs before commit
- No `console.error` or `console.warn` in production code
- If logger added in future: structured logging with context objects

## Comments

**When to Comment:**
- Explain WHY, not WHAT: Code should be self-documenting
- Document non-obvious algorithms or business logic
- Explain NEXT steps (// TODO: comments)
- Avoid obvious comments: "// set count to 0" - don't do this

**TODO Comments:**
- Format: `// TODO: Description of what needs to be done`
- Example: `// TODO: Replace with actual CMS data fetching` (in `app/[locale]/page.tsx`)
- Link to issue if exists: `// TODO(#123): Fix race condition`

**JSDoc/TSDoc:**
- Not required (components are self-documenting via TypeScript)
- Optional for complex utilities or public APIs
- Use if function signature alone doesn't explain purpose

## Function Design

**Size:**
- Keep under 50 lines (guideline, not strict rule)
- Extract helpers for complex logic
- One level of abstraction per function

**Parameters:**
- Max 3 parameters (guideline)
- Use object for 4+ parameters: `function create(options: CreateOptions)`
- Destructure in parameter list: `function process({ id, name }: Props)`

**Return Values:**
- Explicit return statements (no implicit undefined)
- Return early for guard clauses
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## Module Design

**Exports:**
- Named exports preferred (not default)
- Exception: Pages and layouts use default export (Next.js convention)
- Exception: React components can default export (but named is preferred)
- One component per file (no multi-export modules)

**Barrel Files:**
- Use index.ts if directory has public API
- Example: `app/components/ui/index.ts` could re-export all UI components
- Currently not used (import directly from component files)

**Component Composition:**
- Props-based configuration over conditional rendering
- Avoid prop drilling (use Context for global state)
- Prefer composition over inheritance

## TypeScript Patterns

**Strict Mode:**
- Enabled in `tsconfig.json`
- No `any` types allowed
- Null/undefined safety required
- No implicit `any`

**Type Annotations:**
- Explicit return types on functions
- Props interfaces always defined
- Type exports with `export type`
- Avoid `as` type assertions (use proper types)

## React Patterns

**Functional Components Only:**
- All components are function components
- Hooks for state management (useState, useContext, useEffect)
- No class components

**Hooks Usage:**
- `useState` for component state
- `useContext` with TranslationProvider for global state
- `useEffect` for side effects (animations, event listeners)
- Cleanup functions in useEffect return

**Event Handlers:**
- Named handlers: `handleMenuToggle`, `handleLanguageChange`
- Arrow functions preferred for type safety
- Proper event typing: `React.MouseEvent<HTMLButtonElement>`

**Key Props:**
- Use unique identifiers for list keys (not index)
- Current codebase uses `index` as key (anti-pattern, but stable data)
- Issue: Breaks list reordering, filtering

---

*Convention analysis: 2026-01-12*
*Update when patterns change*
