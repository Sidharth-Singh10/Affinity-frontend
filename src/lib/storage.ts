/**
 * Storage utility for caching data with expiration
 */

export interface CachedData<T> {
  data: T
  timestamp: number
  expiresIn: number // in milliseconds
}

/**
 * Save data to session storage with expiration
 */
export function saveToCache<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
  if (typeof window === 'undefined') return

  try {
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    }
    sessionStorage.setItem(key, JSON.stringify(cachedData))
  } catch (error) {
    console.error('Error saving to cache:', error)
  }
}

/**
 * Get data from session storage if not expired
 */
export function getFromCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const item = sessionStorage.getItem(key)
    if (!item) return null

    const cachedData: CachedData<T> = JSON.parse(item)
    const now = Date.now()
    const age = now - cachedData.timestamp

    // Check if data has expired
    if (age > cachedData.expiresIn) {
      sessionStorage.removeItem(key)
      return null
    }

    return cachedData.data
  } catch (error) {
    console.error('Error reading from cache:', error)
    return null
  }
}

/**
 * Clear specific cache key
 */
export function clearCache(key: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.clear()
  } catch (error) {
    console.error('Error clearing all cache:', error)
  }
}
