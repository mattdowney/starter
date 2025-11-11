# Next.js Starter Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready Next.js starter template with pluggable features (newsletter, auth, analytics) for landing pages.

**Architecture:** Modular feature-based structure with self-contained features in `features/` folder. Each feature exports a config declaring dependencies. Hybrid component approach with wrapped common components and direct imports for specialized ones.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui, Drizzle ORM, Neon Postgres, Resend, NextAuth.js v5, Vercel Analytics

---

## Prerequisites

**Current State:**
- Working directory: `/Users/mattdowney/Library/CloudStorage/Dropbox/Code/Personal/lander`
- Folder name needs to be renamed to `starter`

**Required Accounts/Services:**
- Vercel account (for deployment)
- Neon account (Postgres database)
- Resend account (email service)
- GitHub OAuth app (for auth, optional)

---

## Task 1: Rename Project Folder and Initialize

**Files:**
- Rename folder: `lander/` → `starter/`
- Working directory will become: `/Users/mattdowney/Library/CloudStorage/Dropbox/Code/Personal/starter`

**Step 1: Rename the project folder**

```bash
cd /Users/mattdowney/Library/CloudStorage/Dropbox/Code/Personal
mv lander starter
cd starter
```

**Step 2: Verify the rename**

Run: `pwd`
Expected: `/Users/mattdowney/Library/CloudStorage/Dropbox/Code/Personal/starter`

**Step 3: Check existing files**

Run: `ls -la`
Expected: See `docs/` folder with plans

---

## Task 2: Initialize Next.js Project

**Files:**
- Create: All Next.js base files via `create-next-app`
- Create: `package.json` with project metadata

**Step 1: Initialize Next.js with TypeScript and Tailwind**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src --import-alias "@/*"
```

When prompted:
- Would you like to use ESLint? → Yes
- Would you like to use Turbopack? → No
- Use src/ directory? → Yes (override the --no-src flag if prompted again)

**Step 2: Verify installation**

Run: `ls -la`
Expected: See `package.json`, `tsconfig.json`, `next.config.js`, `src/` folder

**Step 3: Update package.json metadata**

Modify: `package.json`

```json
{
  "name": "starter",
  "version": "0.1.0",
  "description": "Production-ready Next.js starter template for landing pages",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

**Step 4: Commit initial Next.js setup**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

## Task 3: Install Core Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install UI and styling dependencies**

```bash
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D @tailwindcss/typography prettier prettier-plugin-tailwindcss
```

**Step 2: Install database dependencies**

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

**Step 3: Install email dependencies**

```bash
pnpm add resend react-email @react-email/components
```

**Step 4: Install form and validation dependencies**

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

**Step 5: Install analytics**

```bash
pnpm add @vercel/analytics
```

**Step 6: Install auth dependencies (ready but unused)**

```bash
pnpm add next-auth@beta
```

**Step 7: Add Headless UI**

```bash
pnpm add @headlessui/react
```

**Step 8: Verify installation**

Run: `pnpm list --depth=0`
Expected: All packages listed above

**Step 9: Commit dependencies**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: install core dependencies"
```

---

## Task 4: Configure Prettier and ESLint

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `.eslintrc.json`

**Step 1: Create Prettier config**

Create: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Step 2: Create Prettier ignore file**

Create: `.prettierignore`

```
node_modules
.next
out
dist
build
*.md
pnpm-lock.yaml
```

**Step 3: Update ESLint config**

Modify: `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Step 4: Add format script to package.json**

Modify: `package.json` (add to scripts section)

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Step 5: Format all files**

Run: `pnpm format`
Expected: Files formatted successfully

**Step 6: Commit configuration**

```bash
git add .prettierrc .prettierignore .eslintrc.json package.json
git commit -m "feat: configure Prettier and ESLint"
```

---

## Task 5: Configure Tailwind with Design Tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Update Tailwind config with theme**

Modify: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
```

**Step 2: Update global CSS with theme variables**

Modify: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 3: Verify Tailwind setup**

Run: `pnpm dev`
Navigate to: `http://localhost:3000`
Expected: Default Next.js page with Tailwind styles

Stop server: `Ctrl+C`

**Step 4: Commit Tailwind configuration**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: configure Tailwind with design tokens"
```

---

## Task 6: Set Up Project Structure

**Files:**
- Create: `src/components/ui/` directory
- Create: `src/components/layout/` directory
- Create: `src/components/marketing/` directory
- Create: `src/features/` directory
- Create: `src/lib/` directory
- Create: `src/content/` directory
- Create: `src/lib/utils.ts`

**Step 1: Create directory structure**

```bash
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/marketing
mkdir -p src/features
mkdir -p src/lib/db
mkdir -p src/lib/email
mkdir -p src/content/pages
```

**Step 2: Create utility functions file**

Create: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 3: Verify structure**

Run: `tree src -L 2` or `find src -type d`
Expected: All directories created

**Step 4: Commit structure**

```bash
git add src/
git commit -m "feat: create project directory structure"
```

---

## Task 7: Add Shadcn/ui Button Component

**Files:**
- Create: `src/components/ui/button.tsx`

**Step 1: Create Button component**

Create: `src/components/ui/button.tsx`

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Step 2: Create barrel export**

Create: `src/components/ui/index.ts`

```typescript
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'
```

**Step 3: Test Button import**

Create temporary test file: `src/app/page.tsx`

```typescript
import { Button } from '@/components/ui'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Starter Template</h1>
      <Button>Click me</Button>
    </main>
  )
}
```

**Step 4: Verify in browser**

Run: `pnpm dev`
Navigate to: `http://localhost:3000`
Expected: See "Starter Template" heading and styled button

Stop server: `Ctrl+C`

**Step 5: Commit Button component**

```bash
git add src/components/ui/
git commit -m "feat: add Shadcn Button component"
```

---

## Task 8: Add Input and Card Components

**Files:**
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/card.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Create Input component**

Create: `src/components/ui/input.tsx`

```typescript
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

**Step 2: Create Card component**

Create: `src/components/ui/card.tsx`

```typescript
import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Step 3: Update barrel export**

Modify: `src/components/ui/index.ts`

```typescript
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'

export { Input } from './input'
export type { InputProps } from './input'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card'
```

**Step 4: Commit components**

```bash
git add src/components/ui/
git commit -m "feat: add Input and Card components"
```

---

## Task 9: Set Up Database Configuration

**Files:**
- Create: `src/lib/db/index.ts`
- Create: `src/lib/db/schema.ts`
- Create: `drizzle.config.ts`
- Modify: `package.json`

**Step 1: Create database client**

Create: `src/lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool, neonConfig } from '@neondatabase/serverless'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

neonConfig.fetchConnectionCache = true

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
```

**Step 2: Create initial schema file**

Create: `src/lib/db/schema.ts`

```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  source: varchar('source', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
})

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert
```

**Step 3: Create Drizzle config**

Create: `drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config
```

**Step 4: Add database scripts to package.json**

Modify: `package.json` (add to scripts)

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Step 5: Install dotenv for Drizzle config**

```bash
pnpm add -D dotenv
```

**Step 6: Commit database setup**

```bash
git add src/lib/db/ drizzle.config.ts package.json pnpm-lock.yaml
git commit -m "feat: set up database configuration with Drizzle"
```

---

## Task 10: Create Environment Variables Template

**Files:**
- Create: `.env.example`
- Modify: `.gitignore`

**Step 1: Create .env.example**

Create: `.env.example`

```bash
# Database (Neon Postgres)
DATABASE_URL="postgresql://user:password@host/database"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_AUDIENCE_ID=""

# Auth (NextAuth.js) - Optional, uncomment when needed
# NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
# NEXTAUTH_URL="http://localhost:3000"
# GITHUB_ID=""
# GITHUB_SECRET=""

# Analytics (Auto-configured on Vercel)
# VERCEL_ANALYTICS_ID=""
```

**Step 2: Verify .gitignore includes env files**

Modify: `.gitignore` (ensure these lines exist)

```
# env files
.env
.env.local
.env*.local
```

**Step 3: Commit environment template**

```bash
git add .env.example .gitignore
git commit -m "feat: add environment variables template"
```

---

## Task 11: Set Up Resend Email Client

**Files:**
- Create: `src/lib/email/client.ts`
- Create: `src/lib/email/templates/welcome.tsx`

**Step 1: Create Resend client**

Create: `src/lib/email/client.ts`

```typescript
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ''
```

**Step 2: Create welcome email template**

Create: `src/lib/email/templates/welcome.tsx`

```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
}

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={heading}>Welcome! 👋</Heading>
            <Text style={text}>
              Thanks for subscribing to our newsletter at {email}.
            </Text>
            <Text style={text}>
              We'll keep you updated with the latest news and updates.
            </Text>
            <Text style={footer}>
              If you didn't sign up for this, you can{' '}
              <Link href="#" style={link}>
                unsubscribe here
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const section = {
  padding: '0 48px',
}

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
}

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
}

const footer = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#9ca299',
  marginTop: '32px',
}

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
}
```

**Step 3: Commit email setup**

```bash
git add src/lib/email/
git commit -m "feat: set up Resend email client and templates"
```

---

## Task 12: Create Newsletter Feature - Configuration

**Files:**
- Create: `src/features/newsletter/config.ts`
- Create: `src/features/newsletter/types.ts`

**Step 1: Create feature config**

Create: `src/features/newsletter/config.ts`

```typescript
export const newsletterConfig = {
  enabled: true,
  tableName: 'newsletter_subscribers',
  requireDoubleOptIn: false,
  env: ['RESEND_API_KEY', 'DATABASE_URL'] as const,
} as const

export type NewsletterConfig = typeof newsletterConfig
```

**Step 2: Create feature types**

Create: `src/features/newsletter/types.ts`

```typescript
export interface SubscribeFormData {
  email: string
}

export interface SubscribeResponse {
  success: boolean
  message: string
  error?: string
}

export type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error'
```

**Step 3: Commit newsletter configuration**

```bash
git add src/features/newsletter/
git commit -m "feat: create newsletter feature configuration"
```

---

## Task 13: Create Newsletter Feature - Server Action

**Files:**
- Create: `src/features/newsletter/actions/subscribe.ts`

**Step 1: Create subscribe server action**

Create: `src/features/newsletter/actions/subscribe.ts`

```typescript
'use server'

import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { resend, AUDIENCE_ID } from '@/lib/email/client'
import WelcomeEmail from '@/lib/email/templates/welcome'
import type { SubscribeResponse } from '../types'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResponse> {
  try {
    // Validate email
    const result = subscribeSchema.safeParse({ email })

    if (!result.success) {
      return {
        success: false,
        message: result.error.errors[0].message,
      }
    }

    // Check if already subscribed
    const existing = await db.query.newsletterSubscribers.findFirst({
      where: (subscribers, { eq }) => eq(subscribers.email, email),
    })

    if (existing) {
      return {
        success: false,
        message: 'This email is already subscribed',
      }
    }

    // Insert into database
    await db.insert(newsletterSubscribers).values({
      email,
      source: 'website',
      status: 'active',
    })

    // Add to Resend audience (if configured)
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
      })
    }

    // Send welcome email
    await resend.emails.send({
      from: 'Newsletter <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to our newsletter!',
      react: WelcomeEmail({ email }),
    })

    return {
      success: true,
      message: 'Successfully subscribed! Check your email.',
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

**Step 2: Commit server action**

```bash
git add src/features/newsletter/actions/
git commit -m "feat: create newsletter subscribe server action"
```

---

## Task 14: Create Newsletter Feature - Form Hook

**Files:**
- Create: `src/features/newsletter/hooks/use-newsletter-form.ts`

**Step 1: Create form hook**

Create: `src/features/newsletter/hooks/use-newsletter-form.ts`

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { subscribeToNewsletter } from '../actions/subscribe'
import type { SubscribeStatus } from '../types'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof formSchema>

export function useNewsletterForm() {
  const [status, setStatus] = useState<SubscribeStatus>('idle')
  const [message, setMessage] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setMessage('')

    const result = await subscribeToNewsletter(data.email)

    if (result.success) {
      setStatus('success')
      setMessage(result.message)
      form.reset()
    } else {
      setStatus('error')
      setMessage(result.message)
    }
  }

  return {
    form,
    status,
    message,
    onSubmit,
  }
}
```

**Step 2: Commit form hook**

```bash
git add src/features/newsletter/hooks/
git commit -m "feat: create newsletter form hook"
```

---

## Task 15: Create Newsletter Feature - Form Component

**Files:**
- Create: `src/features/newsletter/components/newsletter-form.tsx`
- Create: `src/features/newsletter/index.ts`

**Step 1: Create form component**

Create: `src/features/newsletter/components/newsletter-form.tsx`

```typescript
'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNewsletterForm } from '../hooks/use-newsletter-form'

export function NewsletterForm() {
  const { form, status, message, onSubmit } = useNewsletterForm()

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            {...form.register('email')}
            disabled={status === 'loading'}
            className="flex-1"
            aria-label="Email address"
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}

        {message && (
          <p
            className={`text-sm ${
              status === 'success' ? 'text-green-600' : 'text-destructive'
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
```

**Step 2: Create feature public API**

Create: `src/features/newsletter/index.ts`

```typescript
export { NewsletterForm } from './components/newsletter-form'
export { newsletterConfig } from './config'
export type { NewsletterConfig } from './config'
export type { SubscribeFormData, SubscribeResponse, SubscribeStatus } from './types'
```

**Step 3: Commit form component**

```bash
git add src/features/newsletter/
git commit -m "feat: create newsletter form component"
```

---

## Task 16: Create Analytics Feature

**Files:**
- Create: `src/features/analytics/config.ts`
- Create: `src/features/analytics/components/analytics-provider.tsx`
- Create: `src/features/analytics/hooks/use-track-event.ts`
- Create: `src/features/analytics/index.ts`

**Step 1: Create analytics config**

Create: `src/features/analytics/config.ts`

```typescript
export const analyticsConfig = {
  enabled: true,
  provider: 'vercel',
} as const
```

**Step 2: Create analytics provider component**

Create: `src/features/analytics/components/analytics-provider.tsx`

```typescript
'use client'

import { Analytics } from '@vercel/analytics/react'

export function AnalyticsProvider() {
  return <Analytics />
}
```

**Step 3: Create event tracking hook**

Create: `src/features/analytics/hooks/use-track-event.ts`

```typescript
'use client'

import { track } from '@vercel/analytics'

export function useTrackEvent() {
  return {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      track(eventName, properties)
    },
  }
}
```

**Step 4: Create feature public API**

Create: `src/features/analytics/index.ts`

```typescript
export { AnalyticsProvider } from './components/analytics-provider'
export { useTrackEvent } from './hooks/use-track-event'
export { analyticsConfig } from './config'
```

**Step 5: Commit analytics feature**

```bash
git add src/features/analytics/
git commit -m "feat: create analytics feature with Vercel Analytics"
```

---

## Task 17: Create Layout Components

**Files:**
- Create: `src/components/layout/container.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/index.ts`

**Step 1: Create Container component**

Create: `src/components/layout/container.tsx`

```typescript
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
```

**Step 2: Create Header component**

Create: `src/components/layout/header.tsx`

```typescript
import Link from 'next/link'
import { Container } from './container'

export function Header() {
  return (
    <header className="border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Starter
          </Link>
          <nav className="flex gap-6">
            {/* Add navigation links here */}
          </nav>
        </div>
      </Container>
    </header>
  )
}
```

**Step 3: Create Footer component**

Create: `src/components/layout/footer.tsx`

```typescript
import { Container } from './container'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <Container>
        <div className="flex h-16 items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {currentYear} Starter. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Add footer links here */}
          </div>
        </div>
      </Container>
    </footer>
  )
}
```

**Step 4: Create layout barrel export**

Create: `src/components/layout/index.ts`

```typescript
export { Container } from './container'
export { Header } from './header'
export { Footer } from './footer'
```

**Step 5: Commit layout components**

```bash
git add src/components/layout/
git commit -m "feat: create layout components (Container, Header, Footer)"
```

---

## Task 18: Create Marketing Components

**Files:**
- Create: `src/components/marketing/hero.tsx`
- Create: `src/components/marketing/newsletter-section.tsx`
- Create: `src/components/marketing/index.ts`

**Step 1: Create Hero component**

Create: `src/components/marketing/hero.tsx`

```typescript
import { Container } from '@/components/layout'

interface HeroProps {
  title: string
  subtitle: string
  children?: React.ReactNode
}

export function Hero({ title, subtitle, children }: HeroProps) {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
          {children && <div className="mt-10">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
```

**Step 2: Create Newsletter Section component**

Create: `src/components/marketing/newsletter-section.tsx`

```typescript
import { Container } from '@/components/layout'
import { NewsletterForm } from '@/features/newsletter'

interface NewsletterSectionProps {
  title?: string
  description?: string
}

export function NewsletterSection({
  title = 'Stay updated',
  description = 'Get the latest updates delivered to your inbox.',
}: NewsletterSectionProps) {
  return (
    <section className="py-16 bg-muted/50">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
```

**Step 3: Create marketing barrel export**

Create: `src/components/marketing/index.ts`

```typescript
export { Hero } from './hero'
export { NewsletterSection } from './newsletter-section'
```

**Step 4: Commit marketing components**

```bash
git add src/components/marketing/
git commit -m "feat: create marketing components (Hero, Newsletter Section)"
```

---

## Task 19: Update Root Layout with Analytics

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Update root layout**

Modify: `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AnalyticsProvider } from '@/features/analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Starter - Your Next.js Template',
  description: 'A production-ready Next.js starter template',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  )
}
```

**Step 2: Update home page with components**

Modify: `src/app/page.tsx`

```typescript
import { Header, Footer } from '@/components/layout'
import { Hero, NewsletterSection } from '@/components/marketing'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="Welcome to Starter"
          subtitle="A production-ready Next.js template for building landing pages with ease."
        />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
```

**Step 3: Test the application**

Run: `pnpm dev`
Navigate to: `http://localhost:3000`
Expected: See complete landing page with header, hero, newsletter form, and footer

Stop server: `Ctrl+C`

**Step 4: Commit layout and page updates**

```bash
git add src/app/
git commit -m "feat: integrate analytics and update home page"
```

---

## Task 20: Create Auth Feature Configuration (Ready but Inactive)

**Files:**
- Create: `src/features/auth/config.ts`
- Create: `src/features/auth/providers/github.ts`
- Create: `src/features/auth/index.ts`

**Step 1: Create NextAuth config**

Create: `src/features/auth/config.ts`

```typescript
import NextAuth from 'next-auth'
import { githubProvider } from './providers/github'

export const authConfig = {
  enabled: false, // Set to true to enable
  providers: [
    // Uncomment providers as needed
    // githubProvider,
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

**Step 2: Create GitHub provider**

Create: `src/features/auth/providers/github.ts`

```typescript
import GitHub from 'next-auth/providers/github'

export const githubProvider = GitHub({
  clientId: process.env.GITHUB_ID ?? '',
  clientSecret: process.env.GITHUB_SECRET ?? '',
})
```

**Step 3: Create auth feature public API**

Create: `src/features/auth/index.ts`

```typescript
export { auth, signIn, signOut } from './config'
export { authConfig } from './config'
```

**Step 4: Commit auth configuration**

```bash
git add src/features/auth/
git commit -m "feat: create auth feature configuration (inactive)"
```

---

## Task 21: Create README Documentation

**Files:**
- Create: `README.md`

**Step 1: Create comprehensive README**

Create: `README.md`

```markdown
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
```

**Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: create comprehensive README"
```

---

## Task 22: Create Migration for Newsletter Table

**Files:**
- Create migration files via Drizzle

**Step 1: Generate initial migration**

Run: `pnpm db:generate`
Expected: Migration file created in `src/lib/db/migrations/`

**Step 2: Review generated migration**

Run: `ls src/lib/db/migrations/`
Expected: See migration files (`.sql` and metadata)

**Step 3: Commit migrations**

```bash
git add src/lib/db/migrations/
git commit -m "feat: add initial newsletter table migration"
```

**Note:** Actual database push will be done when user has DATABASE_URL configured.

---

## Task 23: Add TypeScript Configuration

**Files:**
- Modify: `tsconfig.json`

**Step 1: Update TypeScript config for strict mode**

Modify: `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 2: Verify type checking works**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit TypeScript config**

```bash
git add tsconfig.json
git commit -m "feat: configure TypeScript with strict mode"
```

---

## Task 24: Set Up Git Hooks with Husky

**Files:**
- Create: `.husky/pre-commit`
- Modify: `package.json`

**Step 1: Install Husky and lint-staged**

```bash
pnpm add -D husky lint-staged
```

**Step 2: Initialize Husky**

```bash
npx husky init
```

**Step 3: Create pre-commit hook**

Create: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

Make it executable:

```bash
chmod +x .husky/pre-commit
```

**Step 4: Add lint-staged config to package.json**

Modify: `package.json` (add lint-staged section)

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**Step 5: Test pre-commit hook**

Create a test file, stage it, and commit:

```bash
echo "test" > test.txt
git add test.txt
git commit -m "test: verify pre-commit hook"
```

Expected: Hook runs, formats files

Remove test file:

```bash
git rm test.txt
git commit -m "test: remove test file"
```

**Step 6: Commit Husky setup**

```bash
git add .husky/ package.json pnpm-lock.yaml
git commit -m "feat: set up Husky and lint-staged for pre-commit hooks"
```

---

## Task 25: Create Content Directory Structure

**Files:**
- Create: `src/content/pages/.gitkeep`
- Create: `next.config.mjs` (update for MDX)

**Step 1: Create content directories**

```bash
mkdir -p src/content/pages
touch src/content/pages/.gitkeep
```

**Step 2: Install MDX dependencies**

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

**Step 3: Update Next.js config for MDX**

Modify: `next.config.mjs`

```javascript
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
```

**Step 4: Create MDX components provider**

Create: `src/components/mdx-components.tsx`

```typescript
import type { MDXComponents } from 'mdx/types'
import { Button } from '@/components/ui'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Button,
    ...components,
  }
}
```

**Step 5: Commit MDX setup**

```bash
git add src/content/ next.config.mjs src/components/mdx-components.tsx package.json pnpm-lock.yaml
git commit -m "feat: set up MDX support for content pages"
```

---

## Task 26: Create Example MDX Content

**Files:**
- Create: `src/content/pages/example.mdx`
- Create: `src/app/example/page.tsx`

**Step 1: Create example MDX file**

Create: `src/content/pages/example.mdx`

```mdx
---
title: Example Page
description: This is an example MDX page
---

# Example MDX Page

This is an example of using MDX for long-form content.

## Features

- Write in Markdown
- Use React components
- Type-safe with TypeScript

## Example Component

You can use components directly in MDX:

<Button>Click me</Button>

## Code Example

\`\`\`typescript
const greeting = "Hello, MDX!"
console.log(greeting)
\`\`\`
```

**Step 2: Create page to render MDX**

Create: `src/app/example/page.tsx`

```typescript
import { Metadata } from 'next'
import { Header, Footer, Container } from '@/components/layout'
import ExampleContent from '@/content/pages/example.mdx'

export const metadata: Metadata = {
  title: 'Example Page - Starter',
  description: 'This is an example MDX page',
}

export default function ExamplePage() {
  return (
    <>
      <Header />
      <main className="py-12">
        <Container>
          <article className="prose prose-gray dark:prose-invert mx-auto">
            <ExampleContent />
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

**Step 3: Test example page**

Run: `pnpm dev`
Navigate to: `http://localhost:3000/example`
Expected: See rendered MDX content with styled button

Stop server: `Ctrl+C`

**Step 4: Commit example content**

```bash
git add src/content/pages/example.mdx src/app/example/
git commit -m "feat: add example MDX page"
```

---

## Task 27: Create Architecture Documentation

**Files:**
- Create: `docs/architecture.md`

**Step 1: Create architecture documentation**

Create: `docs/architecture.md`

```markdown
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
```

**Step 2: Commit architecture docs**

```bash
git add docs/architecture.md
git commit -m "docs: add architecture documentation"
```

---

## Task 28: Final Cleanup and Verification

**Files:**
- Verify all files are in place
- Run final checks

**Step 1: Run type check**

Run: `pnpm type-check`
Expected: No errors

**Step 2: Run linter**

Run: `pnpm lint`
Expected: No errors or warnings

**Step 3: Format all files**

Run: `pnpm format`
Expected: All files formatted

**Step 4: Test build**

Run: `pnpm build`
Expected: Build succeeds (may warn about missing env vars, that's ok)

**Step 5: Verify development server**

Run: `pnpm dev`
Navigate to: `http://localhost:3000`
Expected: Landing page loads with all components

Navigate to: `http://localhost:3000/example`
Expected: Example MDX page loads

Stop server: `Ctrl+C`

**Step 6: Review project structure**

Run: `tree src -L 2` or `find src -type d`
Expected: All directories present as designed

**Step 7: Final commit**

```bash
git add .
git commit -m "chore: final cleanup and verification"
```

---

## Post-Implementation Checklist

After completing all tasks, verify:

- [ ] Project folder renamed to "starter"
- [ ] All dependencies installed
- [ ] Directory structure matches design
- [ ] UI components (Button, Input, Card) working
- [ ] Newsletter feature complete and functional
- [ ] Analytics feature integrated
- [ ] Auth feature configured (but inactive)
- [ ] Database setup with Drizzle
- [ ] Email client configured
- [ ] Layout components created
- [ ] Marketing components created
- [ ] MDX support working
- [ ] TypeScript strict mode enabled
- [ ] ESLint and Prettier configured
- [ ] Git hooks set up
- [ ] README documentation complete
- [ ] Architecture documentation created
- [ ] .env.example created
- [ ] All code formatted and linted
- [ ] Build succeeds
- [ ] Dev server runs without errors

## Next Steps for User

After implementation:

1. **Set up external services:**
   - Create Neon Postgres database
   - Create Resend account and get API key
   - Update `.env.local` with real credentials

2. **Initialize database:**
   ```bash
   pnpm db:push
   ```

3. **Test newsletter:**
   - Run dev server
   - Submit test email
   - Verify database entry
   - Check email received

4. **Customize design:**
   - Update colors in `tailwind.config.ts`
   - Modify `globals.css` theme variables
   - Update logo and branding

5. **Deploy to Vercel:**
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy

6. **Optional enhancements:**
   - Enable authentication if needed
   - Add more MDX pages
   - Customize components
   - Add more features
