import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import Providers from '@/components/providers'
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { DebugPanel } from "@/components/debug-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Affinity - Where Minds Meet",
  description: "AI-powered intellectual matchmaking platform for developers and tech enthusiasts",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
            <Footer />
            <DebugPanel />
            <Toaster 
              theme="dark" 
              position="top-right"
              richColors
              closeButton
              duration={3000}
              toastOptions={{
                style: {
                  background: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                },
              }}
            />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
