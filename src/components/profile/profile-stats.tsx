"use client"

import { motion } from "framer-motion"
import { TrendingUp, Heart, Users, MessageCircle, Eye, Star, Zap, Calendar, Brain, Sparkles } from "lucide-react"
import { useWeeklyActivity, useProfileAnalytics } from "@/hooks/use-stats"

// User profile interface to match actual API response
interface UserProfile {
  ID: number
  Name: string
  Age: number
  City: string
  Gender: string
  Lat: number
  Lon: number
  Communication: number
  Confidence: number
  Emotional: number
  Personality: number
  TotalScore: number
}

interface ProfileStatsProps {
  userProfile?: UserProfile | null
}

export function ProfileStats({ userProfile }: ProfileStatsProps) {
  // Fetch real analytics and weekly activity data
  const { analytics, isLoading: analyticsLoading } = useProfileAnalytics()
  const { weeklyActivity, isLoading: weeklyLoading } = useWeeklyActivity()

  // Use real data from API or fallback to userProfile prop
  const communication = analytics?.communication || userProfile?.Communication || 0
  const confidence = analytics?.confidence || userProfile?.Confidence || 0
  const emotional = analytics?.emotional || userProfile?.Emotional || 0
  const personality = analytics?.personality || userProfile?.Personality || 0
  const totalScore = analytics?.total_score || userProfile?.TotalScore || 0
  const profileRating = analytics?.profile_rating || 4.8

    // Create stats array with real data
  const stats = [
    { label: "Communication", value: communication, icon: MessageCircle, color: "text-[#FF0059]", bg: "bg-[#FF0059]/20", change: "+12%", max: 10 },
    { label: "Confidence", value: confidence, icon: Zap, color: "text-green-400", bg: "bg-green-400/20", change: "+8%", max: 10 },
    { label: "Emotional IQ", value: emotional, icon: Heart, color: "text-blue-400", bg: "bg-blue-400/20", change: "+15%", max: 10 },
    { label: "Personality", value: personality, icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/20", change: "+23%", max: 10 },
    { label: "Total Score", value: totalScore, icon: Brain, color: "text-yellow-400", bg: "bg-yellow-400/20", change: "+5%", max: 40 },
    { label: "Profile Rating", value: profileRating, icon: Star, color: "text-orange-400", bg: "bg-orange-400/20", change: "+0.2", max: 5 },
  ]

  // Show loading state
  if (analyticsLoading || weeklyLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Profile Analytics</h3>
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{stat.label}</div>
                  <div className="text-xs text-white/60">This month</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-lg">
                  {stat.value}/{stat.max}
                </div>
                <div
                  className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-[#FF0059]" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Weekly Activity</h3>
        </div>

        <div className="space-y-4">
          {weeklyActivity && weeklyActivity.length > 0 ? (
            weeklyActivity.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-8 text-xs font-medium text-white/60">{day.day}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF0059] to-[#FF0059]/80 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((day.likes / 30) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/70 w-8 text-right">{day.likes}</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-6 text-center text-white/60 text-sm">
              No activity data yet. Start swiping!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
