"use client"

import { motion } from "framer-motion"
import { Users, Sparkles, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface QuickAction {
  icon: LucideIcon
  label: string
  action: string
}

interface QuickActionsCardProps {
  onFilterClick: () => void
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Users, label: "Browse by Location", action: "location" },
  { icon: Sparkles, label: "Boost My Profile", action: "boost" },
]

export function QuickActionsCard({ onFilterClick }: QuickActionsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Quick Actions</h3>

      <div className="space-y-3">
        {QUICK_ACTIONS.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-sm"
          >
            <action.icon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{action.label}</span>
          </Button>
        ))}
        
        {/* Filter Button */}
        <Button
          onClick={onFilterClick}
          variant="outline"
          className="w-full justify-start border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10 text-sm"
        >
          <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Filter Preferences</span>
        </Button>
      </div>
    </motion.div>
  )
}
