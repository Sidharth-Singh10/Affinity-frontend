"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onStartOver: () => void
  onAdjustFilters: () => void
}

export function EmptyState({ onStartOver, onAdjustFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 sm:py-20"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FF0059]/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-[#FF0059]" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">You're all caught up!</h2>
      <p className="text-white/60 text-base sm:text-lg mb-8 max-w-md mx-auto px-4">
        No more profiles to show right now. Check back later for new matches or expand your search criteria.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
        <Button
          onClick={onStartOver}
          className="bg-[#FF0059] hover:bg-[#FF0059]/90 px-6 sm:px-8 py-3 rounded-xl font-semibold"
        >
          Start Over
        </Button>
        <Button
          onClick={onAdjustFilters}
          variant="outline"
          className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 px-6 sm:px-8 py-3 rounded-xl"
        >
          Adjust Filters
        </Button>
      </div>
    </motion.div>
  )
}
