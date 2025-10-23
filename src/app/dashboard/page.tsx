"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CardStack } from "@/components/dashboard/card-stack"
import { LoadingState } from "@/components/dashboard/loading-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { RecentMatchesCard } from "@/components/dashboard/recent-matches-card"
import { DailyTipCard } from "@/components/dashboard/daily-tip-card"
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card"
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"
import { RecommendationFiltersComponent } from "@/components/dashboard/recommendation-filters"
import { useState, useEffect } from "react"
import { useRecommendations, type Candidate } from "@/hooks/use-recommendations"
import { useUserData } from "@/hooks/use-user-data"
import { useCardActions } from "@/hooks/use-card-actions"
import { convertCandidateToUserCard } from "@/utils/user-card-converter"
import { DAILY_TIP } from "@/constants/dashboard-tips"


export default function DashboardPage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch dashboard statistics from context
  const { dashboardStats, isLoading: userDataLoading, isInitialized: userDataInitialized, matches: recentMatches, isLoading: loadingMatches } = useUserData()

  // Use recommendations context
  const {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    removeRecommendation,
    refreshRecommendations,
    rejectUser,
  } = useRecommendations()

  // Use card actions hook
  const {
    isAnimating,
    handleLike,
    handleReject,
  } = useCardActions()

  const currentUser = recommendations[currentUserIndex]

  // Reset index when recommendations change completely
  useEffect(() => {
    if (currentUserIndex >= recommendations.length && recommendations.length > 0) {
      setCurrentUserIndex(0)
    }
  }, [recommendations.length, currentUserIndex])

  // Auto-refresh recommendations when they run low
  useEffect(() => {
    if (recommendations.length > 0 && 
        recommendations.length - currentUserIndex <= 2 && 
        recommendations.length - currentUserIndex > 0 &&
        !isLoading) {
      const timer = setTimeout(() => {
        fetchRecommendations(undefined, true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserIndex, recommendations.length, isLoading])

  const handleStartOver = async () => {
    setCurrentUserIndex(0)
    if (refreshRecommendations) {
      await refreshRecommendations()
    }
  }

  const handleAdjustFilters = () => {
    setShowFilters(true)
  }

  const handleFiltersApplied = () => {
    setCurrentUserIndex(0)
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <DashboardNav />

        <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {(userDataLoading || !userDataInitialized) ? (
              <DashboardLoading />
            ) : (
              <div className="flex flex-wrap gap-6 lg:gap-8">
                {/* Left Sidebar - Stats & Activity */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6 order-2 lg:order-1">
                  <QuickStats 
                    likes={dashboardStats?.activity_stats?.likes || 0} 
                    matches={dashboardStats?.activity_stats?.matches || 0} 
                    views={dashboardStats?.activity_stats?.profile_views || 0} 
                  />
                  <ActivityFeed />
                </div>

                {/* Center - Main Card Area */}
                <div className="flex-1 min-w-0 flex flex-col items-center justify-start order-1 lg:order-2">
                  <div className="w-full max-w-md mx-auto">
                    {isLoading && recommendations.length === 0 ? (
                      <LoadingState />
                    ) : error ? (
                      <ErrorState error={error} onRetry={() => refreshRecommendations?.()} />
                    ) : currentUser ? (
                      <CardStack
                        currentUser={currentUser}
                        recommendations={recommendations}
                        currentUserIndex={currentUserIndex}
                        isAnimating={isAnimating}
                        likedUsers={[]}
                        onLike={() => handleLike(currentUser, () => {
                          removeRecommendation?.(currentUser.user.id)
                          setCurrentUserIndex(prev => Math.min(prev + 1, recommendations.length - 1))
                        })}
                        onReject={() => handleReject(currentUser, () => {
                          rejectUser?.(currentUser.user.id)
                          removeRecommendation?.(currentUser.user.id)
                          setCurrentUserIndex(prev => Math.min(prev + 1, recommendations.length - 1))
                        })}
                        convertToUserCardFormat={convertCandidateToUserCard}
                      />
                    ) : (
                      <EmptyState 
                        onStartOver={handleStartOver}
                        onAdjustFilters={handleAdjustFilters}
                      />
                    )}
                  </div>
                </div>

                {/* Right Sidebar - Recent Matches & Tips */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6 order-3">
                  <RecentMatchesCard 
                    matches={recentMatches}
                    isLoading={loadingMatches}
                  />
                  <DailyTipCard tip={DAILY_TIP} />
                  <QuickActionsCard onFilterClick={handleAdjustFilters} />
                </div>
              </div>
            )}
          </div>
        </main>
   
        <RecommendationFiltersComponent 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)}
          onFiltersApplied={handleFiltersApplied}
        />
      </div>
    </ProtectedRoute>
  )
}
