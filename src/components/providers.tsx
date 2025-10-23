'use client'

import React from 'react'
import { AppProvider } from '@/contexts/app-context'

// Single unified provider for the entire app
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
}