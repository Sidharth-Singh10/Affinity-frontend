"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-red-400 text-2xl">⚠</span>
      </div>
      <p className="text-red-400 mb-4">Failed to load recommendations</p>
      <p className="text-white/70 text-sm mb-6">{error}</p>
      <Button
        onClick={onRetry}
        className="bg-[#FF0059] hover:bg-[#FF0059]/90 px-6 py-3 rounded-xl"
      >
        Try Again
      </Button>
    </motion.div>
  )
}
