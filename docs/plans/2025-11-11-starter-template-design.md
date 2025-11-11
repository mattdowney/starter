# Next.js Starter Template Design

**Date:** 2025-11-11
**Project Name:** starter
**Purpose:** General-purpose Next.js landing page template with pluggable features

## Overview

A flexible Next.js 14+ starter template for landing pages with modular feature architecture. Designed for quick project initialization with common features (newsletter, analytics, auth) that can be easily toggled on/off.

## Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Component Libraries:**
  - Shadcn/ui (primary)
  - Headless UI (complex accessible components)
  - React Icons or Lucide
- **Database:** Neon Postgres
- **ORM:** Drizzle
- **Email:** Resend
- **Auth:** NextAuth.js v5 (configured but inactive by default)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel (optimized)

## Project Structure

```
starter/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with analytics
│   │   ├── page.tsx              # Landing page
│   │   └── api/                  # API routes
│   │       └── newsletter/       # Newsletter feature API
│   ├── features/                 # Self-contained feature modules
│   │   ├── newsletter/           # Email capture feature
│   │   │   ├── components/       # Feature-specific components
│   │   │   ├── hooks/           # Feature-specific hooks
│   │   │   ├── actions/         # Server actions
│   │   │   ├── config.ts        # Feature config & toggles
│   │   │   └── index.ts         # Public API
│   │   ├── analytics/           # Vercel Analytics wrapper
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── config.ts
│   │   └── auth/                # NextAuth setup (ready but unused)
│   │       ├── config.ts
│   │       ├── providers/
│   │       ├── components/
│   │       └── middleware.ts
│   ├── components/              # Shared/common components
│   │   ├── ui/                  # Wrapped components (Button, Input, Card)
│   │   ├── layout/              # Layout components (Header, Footer)
│   │   └── marketing/           # Landing-specific components
│   ├── lib/                     # Shared utilities
│   │   ├── db/                  # Neon Postgres client & schema
│   │   │   ├── index.ts
│   │   │   ├── schema.ts
│   │   │   └── migrations/
│   │   └── email/               # Resend client
│   │       ├── client.ts
│   │       └── templates/
│   └── content/                 # MDX content files
│       ├── pages/               # Long-form pages (privacy, terms, about)
│       ├── blog/                # Optional blog posts
│       └── config.ts
├── public/                      # Static assets
├── docs/                        # Documentation
│   ├── plans/                   # Design documents
│   └── adr/                     # Architecture decision records
├── .env.example                 # Environment template
└── package.json
```

## Architecture Principles

### Modular Feature-Based Structure

Each feature in `features/` is:
- **Self-contained:** All components, hooks, and logic in one folder
- **Configurable:** Exports a config object declaring dependencies and env vars
- **Removable:** Delete folder + remove import to disable feature
- **Documented:** Each feature has a config.ts explaining purpose and setup

Example feature config:
```typescript
// features/newsletter/config.ts
export const newsletterConfig = {
  enabled: true,
  tableName: 'newsletter_subscribers',
  requireDoubleOptIn: false,
  env: ['RESEND_API_KEY', 'DATABASE_URL']
}
```

### Component Organization Strategy

**Hybrid Wrapper Approach:**
- Common components (Button, Input, Card) wrapped in `components/ui/`
- Specialized components imported directly from libraries
- Wrapped components provide consistent API and easy library swapping

```typescript
// Common wrapped components
import { Button, Input, Card } from '@/components/ui'

// Specialized - direct import
import { Combobox } from '@headlessui/react'
```

**Component Categories:**
- `components/ui/` - Wrapped Shadcn components with custom defaults
- `components/layout/` - Shared layout components (Header, Footer, Container)
- `components/marketing/` - Landing page specific components (Hero, etc.)
- `features/*/components/` - Feature-specific components

## Features

### 1. Newsletter Capture

**Location:** `src/features/newsletter/`

**Functionality:**
- Email collection form with validation (React Hook Form + Zod)
- Server action for submission
- Stores to Neon Postgres
- Syncs to Resend audience list
- Duplicate prevention
- Success/error states with accessible messaging

**Database Schema:**
```typescript
newsletterSubscribers {
  id: serial
  email: varchar(255) unique
  subscribedAt: timestamp
  source: varchar(100)
  status: varchar(20) default 'active'
}
```

**Configuration:**
- `RESEND_API_KEY` - Required
- `DATABASE_URL` - Required
- `RESEND_AUDIENCE_ID` - Optional

**Removal:** Delete `features/newsletter/`, remove from landing page, drop table

### 2. Analytics

**Location:** `src/features/analytics/`

**Implementation:**
- Vercel Analytics via `@vercel/analytics/react`
- Web Vitals monitoring (CLS, FID, LCP)
- Custom event tracking wrapper
- Zero-config on Vercel
- GDPR-compliant, cookieless

**Usage:**
```typescript
import { track } from '@vercel/analytics'
track('newsletter_signup', { source: 'hero' })
```

### 3. Authentication (Ready but Inactive)

**Location:** `src/features/auth/`

**Setup:**
- NextAuth.js v5 (Auth.js)
- Multiple provider support (GitHub, Google examples)
- JWT sessions (stateless)
- Optional database sessions via Drizzle adapter
- Route protection middleware helpers

**To Enable:**
1. Uncomment auth provider in `app/layout.tsx`
2. Add credentials to `.env.local`
3. Import sign-in components

**Environment Variables:**
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GITHUB_ID` / `GITHUB_SECRET` (or other providers)

## Content Management

### Hardcoded Content (Default)

Components render static content directly:
```typescript
<Hero
  title="Your Product Name"
  subtitle="Transform your workflow with..."
/>
```

### MDX for Long-Form Content

**Location:** `src/content/`

**Configuration:**
- Next.js MDX plugin (`@next/mdx`)
- Custom components available in MDX
- Frontmatter support for metadata
- Syntax highlighting via `rehype-highlight`
- Auto-generated meta tags

**Usage:**
```typescript
// app/privacy/page.tsx
import PrivacyContent from '@/content/pages/privacy.mdx'

export default function PrivacyPage() {
  return <PrivacyContent />
}
```

**Structure:**
```
src/content/
├── pages/          # Privacy, terms, about
├── blog/           # Optional blog posts
└── config.ts       # Content metadata
```

## Database & Backend

### Neon Postgres

- Serverless Postgres with connection pooling
- Free tier suitable for landing pages
- Two connection strings: pooled and direct

**Environment Variables:**
- `DATABASE_URL` - Pooled connection (for serverless functions)
- `DATABASE_URL_UNPOOLED` - Direct connection (for migrations)

### Drizzle ORM

**Location:** `src/lib/db/`

**Structure:**
```
lib/db/
├── index.ts           # Client initialization
├── schema.ts          # Type-safe schema definitions
└── migrations/        # SQL migration files
```

**Benefits:**
- Type-safe queries
- Automatic TypeScript types from schema
- SQL-like syntax
- Lightweight and fast

### Resend Email

**Location:** `src/lib/email/`

**Configuration:**
- Client instance in `client.ts`
- React Email templates in `templates/`
- Welcome email template included

**Environment:**
- `RESEND_API_KEY` - Required
- `RESEND_AUDIENCE_ID` - Optional (for list management)

### API Routes

- `/api/newsletter/subscribe` - Backup to server actions
- Rate limiting via simple in-memory store or Vercel Edge Config
- Zod validation on all inputs
- Type-safe responses

## Styling System

### Tailwind Configuration

**Custom Design Tokens:**
- Color palette with CSS custom properties
- Typography scale
- Spacing system
- Responsive breakpoints

**Features:**
- Dark mode support (class strategy)
- Shadcn theme variables
- Plugin ecosystem (typography, forms, aspect-ratio)

**Prettier Integration:**
- Automatic class sorting via `prettier-plugin-tailwindcss`

### Shadcn/ui Integration

- Components copied to `components/ui/`
- Customized with project design tokens
- Themeable via CSS variables
- Accessible by default

## Developer Experience

### TypeScript

- Strict mode enabled
- Path aliases (`@/*` = `src/*`)
- Pre-commit type checking

### Code Quality

**Tools:**
- ESLint with Next.js recommended rules
- Prettier for formatting
- Husky for git hooks
- lint-staged for pre-commit checks

**Pre-commit Hooks:**
- Lint staged files
- Type check
- Format with Prettier

### Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

### Documentation

- README with quick start guide
- Architecture decision records (ADRs)
- Feature toggle documentation
- Environment variable guide in `.env.example`

## Deployment

### Vercel (Primary Target)

**Benefits:**
- Zero-config Next.js deployment
- Automatic preview deployments
- Edge network with global CDN
- Built-in SSL and custom domains
- Vercel Analytics auto-configured

**Setup:**
1. Connect GitHub repo
2. Configure environment variables in dashboard
3. Deploy

### Alternative Hosting

**Compatible with:**
- Railway
- Render
- Fly.io
- Any Node.js host
- Docker (add Dockerfile if needed)

**Requirements:**
- Node.js 18+
- Environment variables configured
- Database accessible from host

## Environment Configuration

### `.env.example` Template

```bash
# Database
DATABASE_URL="postgresql://user:pass@host/db"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host/db"

# Email
RESEND_API_KEY="re_xxx"
RESEND_AUDIENCE_ID="optional"

# Auth (when enabled)
NEXTAUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"

# Analytics
# VERCEL_ANALYTICS_ID - automatically set by Vercel
```

### Local Development Setup

1. Clone repository
2. Copy `.env.example` to `.env.local`
3. Fill in actual credentials
4. Install dependencies: `pnpm install`
5. Run migrations: `pnpm db:migrate`
6. Start dev server: `pnpm dev`

## Git Configuration

### `.gitignore`

Standard Next.js gitignore plus:
- `.env.local`
- `.env*.local`
- `*.db` (if using local SQLite for testing)

### Repository Setup

- Clean initial commit
- `.env.example` committed
- README with setup instructions
- License file (MIT suggested)

## Security Considerations

### Input Validation

- All user inputs validated with Zod
- SQL injection prevented by Drizzle parameterization
- XSS prevention via React's default escaping

### Rate Limiting

- Newsletter submission rate limited
- IP-based throttling on API routes
- Vercel Edge Config for distributed rate limiting

### Environment Variables

- Never commit `.env.local`
- Secrets stored in Vercel dashboard
- Separate preview and production variables

### Authentication

- NextAuth.js handles session security
- JWT secrets generated with `openssl rand -base64 32`
- HTTPS required in production

## Future Extensibility

### Easy to Add

- Blog with MDX
- Contact form (similar to newsletter)
- Multi-language support (next-intl)
- Additional auth providers
- Payment integration (Stripe)
- Additional analytics (PostHog, Plausible)

### Plugin Architecture

Each feature follows the same pattern:
1. Self-contained folder in `features/`
2. Config file with dependencies
3. Public API via `index.ts`
4. Database migrations if needed
5. Environment variables documented

## Success Criteria

Template is successful when:
- ✅ New project setup takes < 5 minutes
- ✅ Features can be removed without breaking
- ✅ First deployment works without debugging
- ✅ Developers can understand structure immediately
- ✅ Production-ready code quality from start
- ✅ Type safety enforced throughout
- ✅ Accessible UI components by default
- ✅ Performance optimized (Core Web Vitals in green)

## Package Manager

**Recommended:** pnpm (faster, more disk-efficient)
**Alternative:** npm

Both supported with lockfiles committed to git.

## Migration Path

To use this template for a new project:

1. Clone or fork repository
2. Search and replace "starter" with project name
3. Update package.json metadata
4. Configure environment variables
5. Remove unwanted features
6. Customize design tokens in Tailwind config
7. Deploy to Vercel

Time estimate: 10-15 minutes to production.
