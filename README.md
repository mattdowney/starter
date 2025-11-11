# Starter

A production-ready Next.js 14 starter template for building landing pages with pluggable features.

## Features

- ✅ **Next.js 14** - App Router, Server Components, Server Actions
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling with custom design tokens
- ✅ **Shadcn/ui** - Beautiful, accessible components
- ✅ **Newsletter** - Email capture with Resend integration
- ✅ **Database** - Neon Postgres with Drizzle ORM
- ✅ **Analytics** - Vercel Analytics built-in
- ✅ **Auth Ready** - NextAuth.js configured (inactive by default)
- ✅ **MDX Support** - For long-form content
- ✅ **ESLint + Prettier** - Code quality and formatting

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
│   │   └── auth/            # NextAuth (inactive)
│   ├── components/
│   │   ├── ui/              # Wrapped Shadcn components
│   │   ├── layout/          # Layout components
│   │   └── marketing/       # Landing page components
│   ├── lib/
│   │   ├── db/              # Database client & schema
│   │   └── email/           # Email client & templates
│   └── content/             # MDX content files
├── docs/                    # Documentation
└── public/                  # Static assets
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

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript compiler
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

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

Edit `tailwind.config.ts` and `src/app/globals.css` to customize colors, spacing, typography.

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

- **Framework:** [Next.js 14](https://nextjs.org)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Components:** [Shadcn/ui](https://ui.shadcn.com)
- **Database:** [Neon](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team)
- **Email:** [Resend](https://resend.com)
- **Auth:** [NextAuth.js](https://next-auth.js.org)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)
- **Forms:** [React Hook Form](https://react-hook-form.com)
- **Validation:** [Zod](https://zod.dev)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
