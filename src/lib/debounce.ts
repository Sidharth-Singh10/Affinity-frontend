/**
 * Debounce utility to prevent rapid-fire function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, wait)
  }
}

/**
 * Throttle utility to limit function call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Async debounce for promises
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null
  let pendingPromise: Promise<ReturnType<T>> | null = null

  return function(...args: Parameters<T>): Promise<ReturnType<T>> {
    if (timeout) clearTimeout(timeout)
    
    if (pendingPromise) return pendingPromise
    
    pendingPromise = new Promise((resolve, reject) => {
      timeout = setTimeout(async () => {
        try {
          const result = await func(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          pendingPromise = null
          timeout = null
        }
      }, wait)
    })
    
    return pendingPromise
  }
}
