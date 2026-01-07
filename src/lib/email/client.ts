import { Resend } from 'resend'
import { env } from '@/env'

export const resend = new Resend(env.RESEND_API_KEY)

export const AUDIENCE_ID = env.RESEND_AUDIENCE_ID ?? ''
