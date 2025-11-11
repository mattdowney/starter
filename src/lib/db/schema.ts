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
