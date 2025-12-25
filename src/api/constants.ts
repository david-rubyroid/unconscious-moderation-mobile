/**
 * API configuration constants
 * Centralized values for timeouts, cache times, and retry settings
 */

// Time constants in milliseconds
export const TIME = {
  SECOND: 1000, // 1 second
  MINUTE: 1000 * 60, // 1 minute
  HOUR: 1000 * 60 * 60, // 1 hour
} as const

// HTTP client configuration
export const HTTP_CONFIG = {
  TIMEOUT: 10 * TIME.SECOND, // 10 seconds
} as const

// React Query default configuration
export const QUERY_CONFIG = {
  DEFAULT_STALE_TIME: 5 * TIME.MINUTE, // 5 minutes
  DEFAULT_GC_TIME: 10 * TIME.MINUTE, // 10 minutes (garbage collection time)
  DEFAULT_RETRY: 2,
} as const

// React Query short cache configuration (for frequently changing data)
export const QUERY_SHORT_CACHE = {
  STALE_TIME: 30 * TIME.SECOND, // 30 seconds
  RETRY: false,
} as const
