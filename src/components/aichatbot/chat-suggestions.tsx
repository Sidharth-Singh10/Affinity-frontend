"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Users, Lightbulb } from "lucide-react"

const suggestions = [
  {
    category: "Conversation Starters",
    icon: MessageCircle,
    items: [
      "How to start a conversation?",
      "Best opening lines for dating apps",
      "Questions to ask on a first date",
      "How to keep conversations interesting",
    ],
  },
  {
    category: "Dating Advice",
    icon: Heart,
    items: [
      "Red flags to watch out for",
      "How to build confidence",
      "Planning the perfect first date",
      "When to make it official",
    ],
  },
  {
    category: "Profile Tips",
    icon: Users,
    items: [
      "Writing an attractive bio",
      "Choosing the best photos",
      "Optimizing for more matches",
      "Standing out from the crowd",
    ],
  },
]

export function ChatSuggestions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-5 w-5 text-[#FF0059]" />
        <h3 className="text-lg font-semibold text-white">Quick Suggestions</h3>
      </div>

      <div className="space-y-6">
        {suggestions.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <category.icon className="h-4 w-4 text-[#FF0059]" />
              <h4 className="font-medium text-white text-sm">{category.category}</h4>
            </div>
            <div className="space-y-2">
              {category.items.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-sm"
                >
                  {item}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
