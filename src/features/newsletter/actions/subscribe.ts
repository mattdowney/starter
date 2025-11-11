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
        message: result.error.issues[0].message,
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
