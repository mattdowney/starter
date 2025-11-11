# Architecture Documentation

## Overview

This starter template uses a modular, feature-based architecture designed for maintainability and extensibility.

## Core Principles

### 1. Feature Isolation

Each feature is self-contained in `src/features/`:

- All components, hooks, actions in one folder
- Public API via `index.ts`
- Configuration via `config.ts`
- Can be removed by deleting folder

### 2. Component Organization

**Hybrid Wrapper Strategy:**

- Common components (Button, Input, Card) wrapped in `components/ui/`
- Provides consistent API
- Easy to swap underlying libraries
- Specialized components imported directly

### 3. Type Safety

- Strict TypeScript mode
- Zod for runtime validation
- Drizzle for database type safety
- Type inference over explicit types

### 4. Server-First

- Server Components by default
- Server Actions for mutations
- Client Components only when needed
- Minimal JavaScript to browser

## Directory Structure

### `/src/app` - Next.js App Router

- Route handlers
- Page components
- Layouts
- API routes

### `/src/features` - Business Features

Self-contained feature modules:

```
features/
├── newsletter/
│   ├── components/       # Feature UI
│   ├── hooks/           # Client hooks
│   ├── actions/         # Server actions
│   ├── types.ts         # Feature types
│   ├── config.ts        # Configuration
│   └── index.ts         # Public API
```

### `/src/components` - Shared Components

**ui/** - Wrapped library components
- Shadcn/ui components with custom defaults
- Consistent API across app
- Easy to customize

**layout/** - Layout components
- Header, Footer, Container
- Shared across all pages

**marketing/** - Domain components
- Hero, Newsletter Section
- Landing page specific

### `/src/lib` - Shared Utilities

**db/** - Database layer
- Client initialization
- Schema definitions
- Migrations

**email/** - Email service
- Client configuration
- Email templates

**utils.ts** - Utility functions
- Class name merging
- Date formatting
- Etc.

### `/src/content` - Content Files

- MDX files for long-form content
- Organized by type (pages, blog, etc.)

## Data Flow

### Newsletter Subscription Example

1. User enters email in `NewsletterForm` (client component)
2. Form validated with Zod schema
3. `subscribeToNewsletter` server action called
4. Action validates, inserts to DB, sends email
5. Response returned to form
6. Success/error state displayed

```
[Client] NewsletterForm
    ↓ form submission
[Client] useNewsletterForm hook
    ↓ validation (Zod)
[Server] subscribeToNewsletter action
    ↓ database insert
[Server] Drizzle → Neon Postgres
    ↓ send email
[Server] Resend API
    ↓ response
[Client] Display result
```

## Feature Configuration

Each feature exports a config object:

```typescript
// features/newsletter/config.ts
export const newsletterConfig = {
  enabled: true,
  tableName: 'newsletter_subscribers',
  requireDoubleOptIn: false,
  env: ['RESEND_API_KEY', 'DATABASE_URL']
}
```

This allows:
- Feature toggles
- Environment validation
- Documentation of dependencies
- Conditional loading

## Database Architecture

### Schema Definition

Using Drizzle ORM:

```typescript
// lib/db/schema.ts
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  // ...
})
```

### Migrations

- Generated via `pnpm db:generate`
- SQL files in `lib/db/migrations/`
- Applied via `pnpm db:push`
- Version controlled

### Type Safety

Types automatically inferred from schema:

```typescript
type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert
```

## Authentication (Optional)

NextAuth.js v5 configured but inactive:

- Configuration in `features/auth/`
- Providers defined separately
- Can be enabled by updating config
- Uses JWT sessions (stateless)

## Styling System

### Tailwind + CSS Variables

Design tokens defined as CSS variables:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}
```

Used in Tailwind config:

```typescript
colors: {
  primary: 'hsl(var(--primary))'
}
```

Benefits:
- Runtime theme switching
- Dark mode support
- Consistent across components

## Performance Considerations

### Server Components

- Default to Server Components
- Reduces JavaScript sent to browser
- Better initial page load

### Code Splitting

- Features loaded only when used
- Dynamic imports for heavy components
- Route-based splitting automatic

### Database Connection

- Connection pooling via Neon
- Serverless-optimized
- Automatic scaling

## Security

### Input Validation

- All inputs validated with Zod
- Client and server validation
- Type-safe schemas

### SQL Injection Prevention

- Drizzle uses parameterized queries
- No raw SQL strings
- Type-checked queries

### Environment Variables

- Never committed to git
- Validated at build time
- Type-safe access

## Testing Strategy

### Unit Tests

- Test utilities and helpers
- Test hooks in isolation
- Mock server actions

### Integration Tests

- Test feature flows end-to-end
- Test database interactions
- Test email sending

### E2E Tests

- Test critical user journeys
- Newsletter subscription
- Page navigation

## Deployment

### Vercel (Recommended)

- Zero-config deployment
- Environment variables in dashboard
- Automatic previews
- Edge network

### Self-Hosted

- Node.js 18+ required
- Environment variables configured
- Database accessible
- HTTPS recommended

## Adding New Features

1. Create folder in `features/`
2. Add `config.ts` with dependencies
3. Create components, hooks, actions
4. Export public API via `index.ts`
5. Add to relevant pages
6. Document in README

## Removing Features

1. Delete feature folder
2. Remove imports from components
3. Drop database tables if any
4. Remove environment variables
5. Update documentation

## Future Enhancements

Potential additions:

- Blog with MDX
- Contact form
- Multi-language support
- Payment integration
- Advanced analytics
- A/B testing
