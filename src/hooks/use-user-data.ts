// Re-export from unified app context with enhanced functionality
import { useApp } from '@/contexts/app-context'
import { api } from '@/lib/api'
import { logger } from '@/lib/logger'

export type { 
  UserImage,
  MatchRequest,
  Match,
  DashboardStats,
  User,
  AppContextType as UserDataContextType
} from '@/contexts/app-context'

// UserProfile is an alias for User type
export type { User as UserProfile } from '@/contexts/app-context'

export function useUserData() {
  const context = useApp()
  
  // Add helper methods for image management
  const refreshImages = async () => {
    await context.fetchImages()
  }
  
  const removeImage = (imageId: number) => {
    context.updateImages(context.images.filter(img => img.id !== imageId))
  }
  
  const updateImage = (imageId: number, updates: Partial<any>) => {
    context.updateImages(
      context.images.map(img => img.id === imageId ? { ...img, ...updates } : img)
    )
  }

  // Add helper method for matches
  const refreshMatches = async () => {
    await context.fetchMatches()
  }

  // Add helper method for match requests
  const refreshMatchRequests = async () => {
    await context.fetchMatchRequests()
  }
  
  return {
    ...context,
    // Alias user as profile for compatibility
    profile: context.user,
    // Alias request_stats as requestStats for compatibility
    requestStats: context.stats?.request_stats,
    activityStats: context.stats?.activity_stats,
    // Add helper methods
    refreshImages,
    removeImage,
    updateImage,
    refreshMatches,
    refreshMatchRequests,
  }
}
