import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are only available on the server.
   */
  server: {
    DATABASE_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1),
    RESEND_AUDIENCE_ID: z.string().optional(),
    // Auth (optional - uncomment when enabled)
    // NEXTAUTH_SECRET: z.string().min(1),
    // NEXTAUTH_URL: z.string().url(),
    // GITHUB_ID: z.string().min(1),
    // GITHUB_SECRET: z.string().min(1),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },

  /**
   * Client-side environment variables schema.
   * These are exposed to the browser via NEXT_PUBLIC_ prefix.
   */
  client: {
    // NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * Manual destructuring of process.env for Next.js edge runtime.
   * Required for both server and client variables.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    NODE_ENV: process.env.NODE_ENV,
    // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // GITHUB_ID: process.env.GITHUB_ID,
    // GITHUB_SECRET: process.env.GITHUB_SECRET,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation in certain environments.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined for optional vars.
   */
  emptyStringAsUndefined: true,
})
