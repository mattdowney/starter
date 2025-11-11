export interface SubscribeFormData {
  email: string
}

export interface SubscribeResponse {
  success: boolean
  message: string
  error?: string
}

export type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error'
