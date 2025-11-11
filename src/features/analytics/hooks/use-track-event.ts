'use client'

import { track } from '@vercel/analytics'

export function useTrackEvent() {
  return {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      track(eventName, properties)
    },
  }
}
