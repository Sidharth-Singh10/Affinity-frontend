"use client"

import { motion } from "framer-motion"

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0059] mx-auto mb-4"></div>
      <p className="text-white/70">Finding perfect matches for you...</p>
    </motion.div>
  )
}
