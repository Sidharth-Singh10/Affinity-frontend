/**
 * Statistics-related TypeScript interfaces
 */

export interface UserActivityStats {
  likes: number
  matches: number
  profile_views: number
}

export interface WeeklyActivityData {
  day: string
  likes: number
  matches: number
}

export interface RequestStatistics {
  total_requests: number
  accepted: number
  rejected: number
  pending: number
  this_week: number
  acceptance_rate: number
}

export interface ProfileAnalytics {
  communication: number
  confidence: number
  emotional: number
  personality: number
  total_score: number
  profile_rating: number
}

export interface DashboardStats {
  activity_stats: UserActivityStats
  weekly_activity: WeeklyActivityData[]
  request_stats: RequestStatistics
  profile_analytics: ProfileAnalytics
  incoming_requests: number
  outgoing_requests: number
}
