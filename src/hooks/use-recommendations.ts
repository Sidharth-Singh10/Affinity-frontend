// Re-export from unified app context
export { useApp as useRecommendations } from '@/contexts/app-context'
export type { 
  RecommendedUser, 
  Candidate,
  AppContextType as RecommendationsContextType 
} from '@/contexts/app-context'

// Filters can be defined here if needed
export interface RecommendationFilters {
  gender?: 'M' | 'F'
  age_min?: number
  age_max?: number
  limit?: number
  min_score?: number
}
