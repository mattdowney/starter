export const newsletterConfig = {
  enabled: true,
  tableName: 'newsletter_subscribers',
  requireDoubleOptIn: false,
  env: ['RESEND_API_KEY', 'DATABASE_URL'] as const,
} as const

export type NewsletterConfig = typeof newsletterConfig
