/**
 * Centralized logging utility
 * Provides consistent logging across the application with support for different log levels
 * and environment-aware behavior (dev vs production)
 */

interface LogContext {
  [key: string]: unknown
}

/**
 * Checks if logging should be enabled
 * Logs are always enabled in development mode
 * In production, logs are enabled unless explicitly disabled
 */
function shouldLog(): boolean {
  // Always log in development
  if (__DEV__) {
    return true
  }

  // In production, you can add environment variable check if needed
  // For now, we'll log in production too, but you can filter by level
  return true
}

/**
 * Logs debug messages (only in development)
 */
export function logDebug(message: string, context?: LogContext): void {
  if (!shouldLog()) {
    return
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[DEBUG] ${message}`, context || '')
  }
}

/**
 * Logs informational messages
 */
export function logInfo(message: string, context?: LogContext): void {
  if (!shouldLog()) {
    return
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, context || '')
  }
  // In production, you could send to analytics service here
}

/**
 * Logs warning messages
 */
export function logWarn(message: string, context?: LogContext): void {
  if (!shouldLog()) {
    return
  }

  if (__DEV__) {
    console.warn(`[WARN] ${message}`, context || '')
  }
  // In production, you could send to error tracking service here
}

/**
 * Logs error messages
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext): void {
  if (!shouldLog()) {
    return
  }

  const errorContext: LogContext = {
    ...context,
    ...(error instanceof Error
      ? {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
        }
      : { error }),
  }

  if (__DEV__) {
    console.error(`[ERROR] ${message}`, errorContext)
  }
  // In production, you could send to error tracking service (e.g., Sentry, Bugsnag) here
}
