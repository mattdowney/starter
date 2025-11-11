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
