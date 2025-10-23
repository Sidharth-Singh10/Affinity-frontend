/**
 * Centralized logging utility
 * Only logs in development, silent in production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[App]', ...args)
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error('[Error]', ...args)
    }
    // In production, you could send to error tracking service (Sentry, etc.)
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[Warning]', ...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment && process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.debug('[Debug]', ...args)
    }
  },
  
  api: (method: string, endpoint: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[API ${method}]`, endpoint, data ? data : '')
    }
  }
}

// Export types for TypeScript
export type Logger = typeof logger
