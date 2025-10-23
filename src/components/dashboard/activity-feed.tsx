"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Star, UserPlus } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "like",
    message: "Sarah liked your profile",
    time: "2 minutes ago",
    icon: Heart,
    color: "text-[#FF0059]",
  },
  {
    id: 2,
    type: "match",
    message: "New match with Alex!",
    time: "1 hour ago",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    id: 3,
    type: "message",
    message: "Jordan sent you a message",
    time: "3 hours ago",
    icon: MessageCircle,
    color: "text-blue-400",
  },
  {
    id: 4,
    type: "view",
    message: "5 people viewed your profile",
    time: "6 hours ago",
    icon: UserPlus,
    color: "text-green-400",
  },
]

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <activity.icon className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{activity.message}</p>
              <p className="text-white/60 text-xs mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
