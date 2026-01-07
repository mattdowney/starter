# Project Log

## 2026-01-06: Tailwind v4 Migration & Dependency Updates

**Goal:** Update starter project to 2025 best practices

**Changes:**
- Migrated from Tailwind v3/v4 hybrid to clean Tailwind v4 CSS-first configuration
- Removed `tailwind.config.ts` in favor of `@theme inline` in globals.css
- Updated postcss.config.mjs for v4 (`@tailwindcss/postcss`)
- Updated all dependencies to latest stable versions
- Fixed Next.js security vulnerability (16.0.1 → 16.1.1)
- Fixed lint errors (empty interface, unused imports, unescaped entities)
- Changed lint script from `next lint` to `eslint .` (Next.js 16 compatibility)

## 2026-01-06: Added Testing, Env Validation, Toast, CI/CD

**Goal:** Add essential starter features

**Changes:**
- Added `@t3-oss/env-nextjs` for type-safe environment variable validation
- Created `src/env.ts` with Zod schemas for all env vars
- Updated db/email clients to use typed env instead of raw process.env
- Added `sonner` for toast notifications (configured in root layout)
- Added Vitest + Testing Library for unit/integration testing
- Created example test for `cn` utility function
- Added GitHub Actions CI pipeline (lint, type-check, test, build)
- Added `test`, `test:watch`, `test:coverage` scripts

**Next steps:** Ready for use as starter template
