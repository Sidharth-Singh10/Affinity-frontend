'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { api, setAuth, clearAuth as clearAuthData } from '@/lib/api'
import { logger } from '@/lib/logger'
import { toast } from '@/lib/toast'

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  name: string
  age?: number
  city?: string
  gender?: string
  lat?: number
  lon?: number
  communication?: number
  confidence?: number
  emotional?: number
  personality?: number
  totalScore?: number
}

export interface UserImage {
  id: number
  user_id: number
  image_url: string
  is_primary: boolean
  uploaded_at: string
}

export interface MatchRequest {
  id: number
  sender_id: number
  name: string
  age: number
  location: string
  image: string
  bio: string
  timestamp: string
  compatibility: number
  mutualFriends: number
  interests: string[]
}

export interface Match {
  match_id: number
  user_id: number
  name: string
  age: number
  location: string
  image: string
  bio: string
  matched_at: string
  compatibility: number
  last_message?: string
  last_message_at?: string
  unread_count: number
}

export interface DashboardStats {
  activity_stats?: {
    likes: number
    matches: number
    profile_views: number
    messages_sent: number
    messages_received: number
  }
  request_stats?: {
    total_requests: number
    pending: number
    accepted: number
    rejected: number
    this_week: number
    acceptance_rate: number
  }
}

export interface RecommendedUser {
  id: number
  name: string
  age: number
  city: string
  gender: 'M' | 'F'
  lat?: number
  lon?: number
  total_score?: number
  personality?: number
  communication?: number
  emotional?: number
  confidence?: number
  images?: string[]
}

export interface Candidate {
  user: RecommendedUser
  score: number
  reasons: string[]
  match_score: number
}

export interface RecommendationFilters {
  gender?: 'M' | 'F'
  age_min?: number
  age_max?: number
  limit?: number
  min_score?: number
}

// ============================================================================
// CONTEXT TYPE
// ============================================================================

export interface AppContextType {
  // Auth State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Data State
  images: UserImage[]
  matchRequests: MatchRequest[]
  matches: Match[]
  stats: DashboardStats | null
  recommendations: Candidate[]
  currentFilters: RecommendationFilters
  
  // Aliases for compatibility
  dashboardStats?: DashboardStats | null
  isInitialized?: boolean
  error?: string | null

  // Auth Methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void

  // Data Methods
  fetchProfile: () => Promise<void>
  fetchImages: () => Promise<void>
  fetchMatchRequests: () => Promise<void>
  fetchMatches: () => Promise<void>
  fetchStats: () => Promise<void>
  fetchRecommendations: (filters?: any, append?: boolean) => Promise<void>
  updateFilters: (filters: RecommendationFilters) => void
  refreshAll: () => Promise<void>
  refreshRecommendations?: () => Promise<void>
  rejectUser?: (userId: number) => Promise<void>

  // Update Methods
  updateImages: (images: UserImage[]) => void
  removeMatchRequest: (senderId: number) => void
  addMatch: (match: Match) => void
  removeRecommendation: (userId: number) => void
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Data State
  const [images, setImages] = useState<UserImage[]>([])
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recommendations, setRecommendations] = useState<Candidate[]>([])
  const [currentFilters, setCurrentFilters] = useState<RecommendationFilters>({ limit: 10 })
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      logger.debug('Fetching profile for user:', userId)
      const response = await api.getProfile(parseInt(userId))
      
      if (response.error) {
        logger.error('Profile fetch error:', response.error)
        return null
      }
      
      if (!response.data) {
        logger.error('Profile data is missing')
        return null
      }

      const profile = response.data
      logger.debug('Profile data received:', profile)
      
      const email = localStorage.getItem('user_email') || ''
      
      // Backend returns lowercase field names (id, name, age, etc.)
      return {
        id: userId,
        email,
        name: profile.name || '',
        age: profile.age || 0,
        city: profile.city || '',
        gender: profile.gender || '',
        lat: profile.lat || 0,
        lon: profile.lon || 0,
        communication: profile.communication || 0,
        confidence: profile.confidence || 0,
        emotional: profile.emotional || 0,
        personality: profile.personality || 0,
        totalScore: profile.total_score || 0,
      }
    } catch (error) {
      logger.error('Error fetching user profile:', error)
      return null
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      logger.log('Attempting login for:', email)
      const response = await api.login(email, password)

      if (response.error || !response.data) {
        logger.error('Login failed:', response.error)
        toast.error('Login failed', response.error || 'Invalid credentials')
        return { success: false, error: response.error || 'Login failed' }
      }

      const token = response.data.token
      const user_id = response.data.user.id
      logger.log('Login successful, user_id:', user_id)
      
      // Store authentication data using the helper function
      setAuth(token, user_id, email)
      
      // Fetch full profile
      logger.log('Fetching user profile...')
      const profile = await fetchUserProfile(user_id.toString())
      
      if (profile) {
        logger.log('Profile fetched successfully:', profile)
        localStorage.setItem('user_name', profile.name)
        setUser(profile)
        toast.success('Welcome back!', `Hello ${profile.name}`)
      } else {
        logger.warn('Profile fetch failed, using minimal user data')
        const name = email.split('@')[0]
        localStorage.setItem('user_name', name)
        setUser({ id: user_id.toString(), email, name })
        toast.warning('Profile Incomplete', 'Please complete your profile')
      }

      return { success: true }
    } catch (error) {
      logger.error('Login error:', error)
      toast.error('Login failed', 'Please check your connection and try again')
      return { success: false, error: 'Network error' }
    } finally {
      setIsLoading(false)
    }
  }, [fetchUserProfile])

  const signup = useCallback(async (userData: any) => {
    setIsLoading(true)
    try {
      logger.log('Attempting signup for:', userData.email)
      const response = await api.signup(userData)

      if (response.error || !response.data) {
        logger.error('Signup failed:', response.error)
        toast.error('Signup failed', response.error || 'Unable to create account')
        return { success: false, error: response.error || 'Signup failed' }
      }

      // const token  = response.data.token
      // const user_id  = response.data.user.id 
      // logger.log('Signup successful, user_id:', user_id)
      
      // // Store authentication data using the helper function
      // setAuth(token, user_id, userData.email, userData.name)
      
      // // Fetch full profile (should include the data they just provided)
      // logger.log('Fetching new user profile...')
      // const profile = await fetchUserProfile(user_id.toString())
      
      // if (profile) {
      //   logger.log('New user profile fetched:', profile)
      //   setUser(profile)
      //   toast.success('Welcome!', `Account created successfully`)
      // } else {
      //   logger.warn('Profile fetch failed after signup, using provided data')
      //   // Use the data they provided during signup
      //   setUser({ 
      //     id: user_id.toString(), 
      //     email: userData.email, 
      //     name: userData.name,
      //     age: userData.age,
      //     city: userData.city,
      //     gender: userData.gender
      //   })
      //   toast.success('Welcome!', 'Account created successfully')
      // }

      return { success: true }
    } catch (error) {
      logger.error('Signup error:', error)
      toast.error('Signup failed', 'Please check your connection and try again')
      return { success: false, error: 'Network error' }
    } finally {
      setIsLoading(false)
    }
  }, [fetchUserProfile])

  const logout = useCallback(() => {
    logger.log('Logging out user')
    clearAuthData()
    sessionStorage.clear()
    setUser(null)
    setImages([])
    setMatchRequests([])
    setMatches([])
    setStats(null)
    setRecommendations([])
    toast.success('Logged out', 'You have been successfully logged out')
  }, [])

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...userData }
      
      if (userData.name) localStorage.setItem('user_name', userData.name)
      if (userData.email) localStorage.setItem('user_email', userData.email)
      
      return updated
    })
  }, [])

  // ============================================================================
  // DATA FETCH METHODS
  // ============================================================================

  const fetchProfile = useCallback(async () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
    if (!userId) {
      logger.warn('Cannot fetch profile: no user ID')
      return
    }
    
    try {
      logger.debug('Fetching user profile...')
      const profile = await fetchUserProfile(userId)
      if (profile) {
        setUser(profile)
        logger.debug('Profile fetched successfully')
      }
    } catch (error) {
      logger.error('Error fetching profile:', error)
    }
  }, [fetchUserProfile])

  const fetchImages = useCallback(async () => {
    if (!isAuthenticated) {
      logger.warn('Cannot fetch images: not authenticated')
      return
    }
    
    try {
      logger.debug('Fetching user images...')
      const response = await api.listUserImages()
      if (response.data?.images) {
        setImages(response.data.images)
        logger.debug('Images fetched successfully:', response.data.images.length)
      } else if (response.error) {
        logger.warn('Failed to fetch images:', response.error)
        setImages([])
      } else {
        setImages([])
      }
    } catch (error) {
      logger.error('Error fetching images:', error)
      setImages([])
    }
  }, [isAuthenticated])

  const fetchMatchRequests = useCallback(async () => {
    if (!isAuthenticated) {
      logger.warn('Cannot fetch match requests: not authenticated')
      return
    }
    
    try {
      logger.debug('Fetching match requests...')
      const response = await api.getIncomingRequests()
      if (response.data?.requests) {
        setMatchRequests(response.data.requests)
        logger.debug('Match requests fetched successfully:', response.data.requests.length)
      } else if (response.error) {
        logger.warn('Failed to fetch match requests:', response.error)
        setMatchRequests([])
      } else {
        setMatchRequests([])
      }
    } catch (error) {
      logger.error('Error fetching match requests:', error)
      setMatchRequests([])
    }
  }, [isAuthenticated])

  const fetchMatches = useCallback(async () => {
    if (!isAuthenticated) {
      logger.warn('Cannot fetch matches: not authenticated')
      return
    }
    
    try {
      logger.debug('Fetching matches...')
      const response = await api.getRecentMatches()
      if (response.data?.matches) {
        setMatches(response.data.matches)
        logger.debug('Matches fetched successfully:', response.data.matches.length)
      } else if (response.error) {
        logger.warn('Failed to fetch matches:', response.error)
        setMatches([])
      } else {
        setMatches([])
      }
    } catch (error) {
      logger.error('Error fetching matches:', error)
      setMatches([])
    }
  }, [isAuthenticated])

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) {
      logger.warn('Cannot fetch stats: not authenticated')
      return
    }
    
    try {
      logger.debug('Fetching stats...')
      const response = await api.getDashboardStats()
      if (response.data) {
        setStats(response.data)
        logger.debug('Stats fetched successfully')
      } else if (response.error) {
        logger.warn('Failed to fetch stats:', response.error)
        setStats(null)
      } else {
        setStats(null)
      }
    } catch (error) {
      logger.error('Error fetching stats:', error)
      setStats(null)
    }
  }, [isAuthenticated])

  const fetchRecommendations = useCallback(async (filters?: any, append: boolean = false) => {
    if (!isAuthenticated) {
      logger.warn('Cannot fetch recommendations: not authenticated')
      return
    }
    
    try {
      setError(null)
      logger.log('Fetching recommendations with filters:', filters)
      
      const response = await api.getRecommendations(filters || { limit: 20, min_score: 50 })
      
      if (response.error) {
        logger.error('Recommendations fetch error:', response.error)
        setError(response.error)
        if (!append) {
          setRecommendations([])
        }
        return
      }
      
      if (response.data?.candidates && Array.isArray(response.data.candidates)) {
        logger.log('Recommendations received:', response.data.candidates.length)
        if (append) {
          setRecommendations(prev => {
            // Avoid duplicates
            const existingIds = new Set(prev.map(c => c.user.id))
            const newCandidates = response.data.candidates.filter((c: Candidate) => !existingIds.has(c.user.id))
            return [...prev, ...newCandidates]
          })
        } else {
          setRecommendations(response.data.candidates)
        }
      } else {
        logger.warn('No candidates in response')
        if (!append) {
          setRecommendations([])
        }
      }
    } catch (error) {
      logger.error('Error fetching recommendations:', error)
      setError('Failed to fetch recommendations')
      if (!append) {
        setRecommendations([])
      }
    }
  }, [isAuthenticated])

  const refreshRecommendations = useCallback(async () => {
    return fetchRecommendations()
  }, [isAuthenticated])

  const rejectUser = useCallback(async (userId: number) => {
    if (!isAuthenticated) return
    
    try {
      const response = await api.rejectUser(userId)
      if (response.error) {
        logger.error('Failed to reject user:', response.error)
        toast.error('Failed to reject user')
      }
    } catch (error) {
      logger.error('Error rejecting user:', error)
    }
  }, [isAuthenticated])

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return
    
    setIsLoading(true)
    try {
      await Promise.all([
        fetchProfile(),
        fetchImages(),
        fetchMatchRequests(),
        fetchMatches(),
        fetchStats(),
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, fetchProfile, fetchImages, fetchMatchRequests, fetchMatches, fetchStats])

  // ============================================================================
  // UPDATE METHODS
  // ============================================================================

  const updateImages = useCallback((newImages: UserImage[]) => {
    setImages(newImages)
  }, [])

  const removeMatchRequest = useCallback((senderId: number) => {
    setMatchRequests(prev => prev.filter(req => req.sender_id !== senderId))
  }, [])

  const addMatch = useCallback((match: Match) => {
    setMatches(prev => [match, ...prev])
  }, [])

  const removeRecommendation = useCallback((userId: number) => {
    setRecommendations(prev => prev.filter(c => c.user.id !== userId))
  }, [])

  const updateFilters = useCallback(async (filters: RecommendationFilters) => {
    logger.log('Updating recommendation filters:', filters)
    setCurrentFilters(filters)
    
    // Immediately fetch recommendations with new filters
    if (isAuthenticated) {
      try {
        setError(null)
        logger.log('Fetching recommendations with new filters:', filters)
        
        const response = await api.getRecommendations(filters || { limit: 20 })
        
        if (response.error) {
          logger.error('Recommendations fetch error:', response.error)
          setError(response.error)
          setRecommendations([])
          return
        }
        
        if (response.data?.candidates && Array.isArray(response.data.candidates)) {
          logger.log('Recommendations received:', response.data.candidates.length)
          setRecommendations(response.data.candidates)
        } else {
          logger.warn('No candidates in response')
          setRecommendations([])
        }
      } catch (error) {
        logger.error('Error fetching recommendations:', error)
        setError('Failed to fetch recommendations')
        setRecommendations([])
      }
    }
  }, [isAuthenticated])

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const initAuth = async () => {
      logger.log('Initializing authentication...')
      const token = localStorage.getItem('auth_token')
      const userId = localStorage.getItem('user_id')
      const userEmail = localStorage.getItem('user_email')
      const userName = localStorage.getItem('user_name')

      if (token && userId && userEmail) {
        logger.log('Found stored auth, fetching profile for user:', userId)
        const profile = await fetchUserProfile(userId)
        
        if (profile) {
          logger.log('Profile restored from backend:', profile)
          setUser(profile)
        } else {
          logger.warn('Profile fetch failed, using cached data')
          setUser({
            id: userId,
            email: userEmail,
            name: userName || userEmail.split('@')[0],
          })
        }
      } else {
        logger.log('No stored authentication found')
      }
      
      setIsLoading(false)
      setIsInitialized(true)
    }

    initAuth()
  }, [fetchUserProfile])

  // Fetch data when authenticated (only once on mount after auth is confirmed)
  useEffect(() => {
    let isMounted = true
    
    if (isAuthenticated && user?.id && isInitialized) {
      // Only fetch if we don't have data already
      const hasData = images.length > 0 || matches.length > 0 || matchRequests.length > 0
      if (!hasData) {
        logger.log('Fetching initial user data...')
        const fetchData = async () => {
          try {
            if (!isMounted) return
            
            await Promise.all([
              fetchImages(),
              fetchMatchRequests(),
              fetchMatches(),
              fetchStats(),
            ])
            
            if (isMounted) {
              logger.log('Initial data fetch complete')
            }
          } catch (error) {
            if (isMounted) {
              logger.error('Error fetching initial data:', error)
              setError('Failed to load initial data')
            }
          }
        }
        fetchData()
      } else {
        logger.log('Data already loaded, skipping fetch')
      }
    }
    
    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isInitialized])
  // Removed dependencies on user?.id, images.length, matches.length, matchRequests.length to avoid loops

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AppContextType = {
    // Auth State
    user,
    isAuthenticated,
    isLoading,

    // Data State
    images,
    matchRequests,
    matches,
    stats,
    recommendations,
    currentFilters,
    
    // Aliases for compatibility
    dashboardStats: stats,
    isInitialized,
    error,

    // Auth Methods
    login,
    signup,
    logout,
    updateUser,

    // Data Methods
    fetchProfile,
    fetchImages,
    fetchMatchRequests,
    fetchMatches,
    fetchStats,
    fetchRecommendations,
    updateFilters,
    refreshAll,
    refreshRecommendations,
    rejectUser,

    // Update Methods
    updateImages,
    removeMatchRequest,
    addMatch,
    removeRecommendation,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}