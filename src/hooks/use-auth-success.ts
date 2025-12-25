import { useCallback } from 'react'

import { useAuth } from '@/context/auth/use'

import { saveAuthTokens } from '@/utils/auth'

/**
 * Hook for handling successful authentication
 * Provides a centralized function to save tokens and update auth state
 */
export function useAuthSuccess() {
  const { setHasToken } = useAuth()

  const handleAuthSuccess = useCallback(
    async (accessToken: string, refreshToken: string) => {
      await saveAuthTokens(accessToken, refreshToken)

      if (accessToken && refreshToken) {
        setHasToken(true)
      }
    },
    [setHasToken],
  )

  return { handleAuthSuccess }
}
