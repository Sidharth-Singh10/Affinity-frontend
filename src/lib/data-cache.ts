/**
 * Simple in-memory cache for API data to avoid unnecessary refetches
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresIn: number // milliseconds
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  
  /**
   * Store data in cache with expiration time
   */
  set<T>(key: string, data: T, expiresIn: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    })
  }
  
  /**
   * Get data from cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    const isExpired = Date.now() - entry.timestamp > entry.expiresIn
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }
  
  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }
  
  /**
   * Clear specific key or all cache
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }
  
  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

export const dataCache = new DataCache()

// Cache keys
export const CACHE_KEYS = {
  PROFILE: (userId: string) => `profile:${userId}`,
  IMAGES: (userId: string) => `images:${userId}`,
  MATCH_REQUESTS: (userId: string) => `match_requests:${userId}`,
  MATCHES: (userId: string) => `matches:${userId}`,
  STATS: (userId: string) => `stats:${userId}`,
  RECOMMENDATIONS: (userId: string, filters: string) => `recommendations:${userId}:${filters}`,
}

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  PROFILE: 5 * 60 * 1000, // 5 minutes
  IMAGES: 3 * 60 * 1000, // 3 minutes
  MATCH_REQUESTS: 30 * 1000, // 30 seconds
  MATCHES: 2 * 60 * 1000, // 2 minutes
  STATS: 60 * 1000, // 1 minute
  RECOMMENDATIONS: 5 * 60 * 1000, // 5 minutes
}
