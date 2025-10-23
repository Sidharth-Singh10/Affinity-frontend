/**
 * Toast notification utility
 * Wrapper around Sonner for consistent notifications
 */

import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 3000,
    })
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 4000,
    })
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 3000,
    })
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 3500,
    })
  },

  loading: (message: string) => {
    return sonnerToast.loading(message)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },
}

// Common toast messages
export const commonToasts = {
  networkError: () => toast.error('Network Error', 'Please check your connection and try again'),
  unauthorized: () => toast.error('Unauthorized', 'Please log in again'),
  serverError: () => toast.error('Server Error', 'Something went wrong. Please try again later'),
  success: (action: string) => toast.success('Success', `${action} completed successfully`),
  copied: () => toast.success('Copied to clipboard'),
}
