import type { ApiErrorResponse } from '@/api/types'

/**
 * Base error class for API errors
 */
export class ApiError extends Error {
  statusCode?: number
  response?: ApiErrorResponse
  originalError?: unknown

  constructor(
    message: string,
    statusCode?: number,
    response?: ApiErrorResponse,
    originalError?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.response = response
    this.originalError = originalError
  }
}

/**
 * Network error class for connection issues
 */
export class NetworkError extends Error {
  originalError?: unknown

  constructor(message: string, originalError?: unknown) {
    super(message)
    this.name = 'NetworkError'
    this.originalError = originalError
  }
}

/**
 * Validation error class for form validation errors
 */
export class ValidationError extends Error {
  errors?: Record<string, string[]>

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

/**
 * Checks if error is an instance of ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Checks if error is an instance of NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

/**
 * Checks if error is an instance of ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

/**
 * Extracts user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'Something went wrong. Please try again.'): string {
  // Handle ApiError
  if (isApiError(error)) {
    if (error.response?.message) {
      return error.response.message
    }
    if (error.message) {
      return error.message
    }
  }

  // Handle NetworkError
  if (isNetworkError(error)) {
    if (error.message) {
      return error.message
    }
    return 'Network error. Please check your connection and try again.'
  }

  // Handle ValidationError
  if (isValidationError(error)) {
    if (error.message) {
      return error.message
    }
    return 'Validation error. Please check your input.'
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message || fallbackMessage
  }

  // Handle ky HTTPError (from ky library)
  if (error && typeof error === 'object' && 'response' in error) {
    const httpError = error as { response?: { status?: number, statusText?: string }, message?: string }
    if (httpError.message) {
      return httpError.message
    }
    if (httpError.response?.statusText) {
      return httpError.response.statusText
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  // Fallback
  return fallbackMessage
}

/**
 * Gets validation errors from ApiError response
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isApiError(error) && error.response?.errors) {
    return error.response.errors
  }

  if (isValidationError(error) && error.errors) {
    return error.errors
  }

  return null
}
