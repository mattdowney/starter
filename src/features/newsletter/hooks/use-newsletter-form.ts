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
