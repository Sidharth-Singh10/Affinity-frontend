"use client"

import { useApp } from "@/contexts/app-context"

/**
 * Unified stats hook that uses the app context
 */
export function useStats() {
  const { stats, isLoading, fetchStats } = useApp()

  return {
    activityStats: stats?.activity_stats || null,
    requestStats: stats?.request_stats || null,
    isLoading,
    refetch: fetchStats,
  }
}

/**
 * Hook for weekly activity data
 */
export function useWeeklyActivity() {
  const { stats, isLoading } = useApp()
  
  // Generate weekly activity from stats or use mock data
  const weeklyActivity = [
    { day: "Mon", likes: stats?.activity_stats?.likes || 0 },
    { day: "Tue", likes: Math.floor((stats?.activity_stats?.likes || 0) * 0.8) },
    { day: "Wed", likes: Math.floor((stats?.activity_stats?.likes || 0) * 1.2) },
    { day: "Thu", likes: Math.floor((stats?.activity_stats?.likes || 0) * 0.9) },
    { day: "Fri", likes: Math.floor((stats?.activity_stats?.likes || 0) * 1.1) },
    { day: "Sat", likes: Math.floor((stats?.activity_stats?.likes || 0) * 0.7) },
    { day: "Sun", likes: Math.floor((stats?.activity_stats?.likes || 0) * 0.6) },
  ]

  return {
    weeklyActivity,
    isLoading,
  }
}

/**
 * Hook for profile analytics
 */
export function useProfileAnalytics() {
  const { user, isLoading } = useApp()
  
  const analytics = user ? {
    communication: user.communication || 0,
    confidence: user.confidence || 0,
    emotional: user.emotional || 0,
    personality: user.personality || 0,
    total_score: user.totalScore || 0,
    profile_rating: 4.8, // Could be calculated based on user data
  } : null

  return {
    analytics,
    isLoading,
  }
}
