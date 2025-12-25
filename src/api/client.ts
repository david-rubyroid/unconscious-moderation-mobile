import type { ApiErrorResponse, AuthTokens } from '@/api/types'

import ky from 'ky'

import { HTTP_CONFIG } from '@/api/constants'

import { removeAuthTokens, saveAuthTokens } from '@/utils/auth'

import { secureStore, SecureStoreKey } from '@/utils/secureStore'

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: HTTP_CONFIG.TIMEOUT, // 10 seconds
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await secureStore.get(SecureStoreKey.ACCESS_TOKEN)
        if (token)
          request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshToken = await secureStore.get(SecureStoreKey.REFRESH_TOKEN)

          if (!refreshToken) {
            await removeAuthTokens()
            throw new Error('No refresh token available')
          }

          try {
            const newTokens = await ky
              .post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
                json: { refreshToken },
              })
              .json<AuthTokens>()

            await saveAuthTokens(newTokens.accessToken, newTokens.refreshToken)

            // Retry the original request with the new token
            const retryResponse = await ky(request, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newTokens.accessToken}`,
              },
            })

            return retryResponse
          }
          catch (error) {
            await removeAuthTokens()
            throw error
          }
        }
        return response
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error

        if (response?.json) {
          try {
            const errorData = await response.json<ApiErrorResponse>()
            if (errorData?.message) {
              error.message = errorData.message
            }
          }
          catch {
            // If response is not valid JSON, keep original error message
            // This can happen with non-JSON error responses (e.g., 500 HTML errors)
          }
        }

        return error
      },
    ],
  },
})
