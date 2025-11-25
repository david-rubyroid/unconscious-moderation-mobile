export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ApiErrorResponse {
  statusCode: number
  timestamp: string
  path: string
  method: string
  message: string
  error: string
  errors: Record<string, string[]>
}
