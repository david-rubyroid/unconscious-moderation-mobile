import type { ApiErrorResponse, AuthTokens } from '@/api/types'

import ky from 'ky'

import { removeAuthTokens, saveAuthTokens } from '@/utils/auth'

import { secureStore } from '@/utils/secureStore'

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await secureStore.get('accessToken')
        if (token)
          request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshToken = await secureStore.get('refreshToken')

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

            return ky(request, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newTokens.accessToken}`,
              },
            })
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

        if (response.json) {
          const errorData = await response.json<ApiErrorResponse>()
          error.message = errorData.message
        }

        return error
      },
    ],
  },
})
