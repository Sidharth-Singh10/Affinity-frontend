'use client'

import React from 'react'
import { AppProvider } from '@/contexts/app-context'
import { PeroxoWebSocketProvider } from '@/contexts/peroxo-context'

// Single unified provider for the entire app
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <PeroxoWebSocketProvider>
        {children}
      </PeroxoWebSocketProvider>
    </AppProvider>
  )
}