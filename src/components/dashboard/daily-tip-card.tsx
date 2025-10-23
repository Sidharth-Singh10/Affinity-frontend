"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DailyTipCardProps {
  tip: {
    text: string
    buttonLabel: string
  }
}

export function DailyTipCard({ tip }: DailyTipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-[#FF0059]/10 to-[#FF0059]/5 backdrop-blur-sm border border-[#FF0059]/20 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF0059] flex-shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold text-white">Daily Tip</h3>
      </div>

      <p className="text-white/80 text-sm leading-relaxed mb-4">
        {tip.text}
      </p>

      <Button className="w-full bg-[#FF0059]/20 hover:bg-[#FF0059]/30 border border-[#FF0059]/30 text-[#FF0059] text-sm font-medium">
        {tip.buttonLabel}
      </Button>
    </motion.div>
  )
}
