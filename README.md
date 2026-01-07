# Starter

A production-ready Next.js 16 starter template for building landing pages with pluggable features.

## Features

- ✅ **Next.js 16** - App Router, Server Components, Server Actions, Turbopack
- ✅ **TypeScript 5** - Strict mode, full type safety
- ✅ **Tailwind CSS v4** - CSS-first configuration, 5x faster builds
- ✅ **Shadcn/ui** - Beautiful, accessible components
- ✅ **Database** - Neon Postgres with Drizzle ORM
- ✅ **Email** - Resend + React Email templates
- ✅ **Analytics** - Vercel Analytics built-in
- ✅ **Auth Ready** - NextAuth.js v5 configured (inactive by default)
- ✅ **Testing** - Vitest + React Testing Library
- ✅ **Env Validation** - Type-safe environment variables with Zod
- ✅ **Toast Notifications** - Sonner for user feedback
- ✅ **CI/CD** - GitHub Actions pipeline
- ✅ **MDX Support** - For long-form content
- ✅ **Code Quality** - ESLint 9, Prettier, Husky pre-commit hooks

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url> my-project
cd my-project
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```bash
# Required
DATABASE_URL="your-neon-postgres-url"
RESEND_API_KEY="your-resend-api-key"

# Optional
RESEND_AUDIENCE_ID="your-audience-id"
```

### 3. Set Up Database

Generate and run migrations:

```bash
pnpm db:generate
pnpm db:push
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
starter/
├── src/
│   ├── app/                  # Next.js App Router
│   ├── features/             # Pluggable features
│   │   ├── newsletter/       # Email capture
│   │   ├── analytics/        # Vercel Analytics
│   │   └── auth/             # NextAuth (inactive)
│   ├── components/
│   │   ├── ui/               # Wrapped Shadcn components
│   │   ├── layout/           # Layout components
│   │   └── marketing/        # Landing page components
│   ├── lib/
│   │   ├── db/               # Database client & schema
│   │   └── email/            # Email client & templates
│   ├── test/                 # Test setup
│   ├── content/              # MDX content files
│   └── env.ts                # Environment validation
├── .github/workflows/        # CI/CD pipeline
├── docs/                     # Documentation
└── public/                   # Static assets
```

## Features Guide

### Newsletter

The newsletter feature is self-contained in `src/features/newsletter/`.

**To use:**

```tsx
import { NewsletterForm } from '@/features/newsletter'

<NewsletterForm />
```

**To remove:**

1. Delete `src/features/newsletter/`
2. Remove imports from components
3. Drop table: `DROP TABLE newsletter_subscribers`

### Analytics

Vercel Analytics is automatically configured in the root layout.

**Track custom events:**

```tsx
'use client'
import { useTrackEvent } from '@/features/analytics'

const { trackEvent } = useTrackEvent()
trackEvent('button_click', { button: 'cta' })
```

### Authentication (Optional)

Auth is configured but inactive by default.

**To enable:**

1. Add credentials to `.env.local`:
   ```bash
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   NEXTAUTH_URL="http://localhost:3000"
   GITHUB_ID="your-github-oauth-id"
   GITHUB_SECRET="your-github-oauth-secret"
   ```

2. Enable in `src/features/auth/config.ts`:
   ```typescript
   export const authConfig = {
     enabled: true, // Change to true
     // ...
   }
   ```

3. Uncomment providers as needed

### Toast Notifications

Sonner is configured globally in the root layout.

```tsx
import { toast } from 'sonner'

// Success
toast.success('Changes saved!')

// Error
toast.error('Something went wrong')

// Promise
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
})
```

## Testing

Run tests with Vitest:

```bash
pnpm test           # Run once
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage
```

Tests are located alongside source files (`*.test.ts`) or in `src/test/`.

## Database Management

### Generate Migrations

After changing schema in `src/lib/db/schema.ts`:

```bash
pnpm db:generate
```

### Push to Database

```bash
pnpm db:push
```

### View Database

```bash
pnpm db:studio
```

Opens Drizzle Studio at `http://localhost:4983`

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript compiler |
| `pnpm format` | Format code with Prettier |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any Node.js host (Railway, Render, Fly.io, etc.)

Requirements:
- Node.js 18+
- Environment variables configured
- Database accessible

## Customization

### Design Tokens

Edit `src/app/globals.css` to customize colors, spacing, and typography. Tailwind v4 uses CSS-first configuration with `@theme inline` blocks.

### Components

- Common components in `src/components/ui/`
- Wrapped components can be customized
- Add new Shadcn components: browse [ui.shadcn.com](https://ui.shadcn.com)

### Features

Add new features in `src/features/`:

1. Create feature folder
2. Add `config.ts` with dependencies
3. Export public API via `index.ts`
4. Document in feature README

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `RESEND_API_KEY` | Yes | Resend API key for emails |
| `RESEND_AUDIENCE_ID` | No | Resend audience for list management |
| `NEXTAUTH_SECRET` | No* | Auth session encryption key |
| `NEXTAUTH_URL` | No* | App URL for auth callbacks |
| `GITHUB_ID` | No* | GitHub OAuth app ID |
| `GITHUB_SECRET` | No* | GitHub OAuth app secret |

\* Required only when auth feature is enabled

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [Shadcn/ui](https://ui.shadcn.com) |
| **Database** | [Neon Postgres](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) |
| **Email** | [Resend](https://resend.com) + [React Email](https://react.email) |
| **Auth** | [NextAuth.js v5](https://authjs.dev) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod v4](https://zod.dev) |
| **Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| **Env Validation** | [@t3-oss/env-nextjs](https://env.t3.gg) |
| **Toast** | [Sonner](https://sonner.emilkowal.ski) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) |
| **Linting** | [ESLint 9](https://eslint.org) + [Prettier](https://prettier.io) |

## CI/CD

GitHub Actions runs on every push/PR to `main`:

1. **Lint** - ESLint checks
2. **Type Check** - TypeScript validation
3. **Test** - Vitest test suite
4. **Build** - Production build verification

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
