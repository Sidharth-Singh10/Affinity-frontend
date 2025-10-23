"use client"

import { motion } from "framer-motion"
import { Heart, Users, Eye } from "lucide-react"

interface QuickStatsProps {
  likes: number
  matches: number
  views: number
}

export function QuickStats({ likes, matches, views }: QuickStatsProps) {
  const stats = [
    { label: "Likes", value: likes, icon: Heart, color: "text-[#FF0059]", bg: "bg-[#FF0059]/20" },
    { label: "Matches", value: matches, icon: Users, color: "text-green-400", bg: "bg-green-400/20" },
    { label: "Profile Views", value: views, icon: Eye, color: "text-purple-400", bg: "bg-purple-400/20" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Your Activity</h3>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex-1 min-w-[calc(50%-0.375rem)] text-center p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-2`}
            >
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/60 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
