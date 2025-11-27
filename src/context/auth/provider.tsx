import { useEffect, useMemo, useState } from 'react'

import { useGetCurrentUser } from '@/api/queries/auth'

import { logoutRevenueCat, setRevenueCatUserId } from '@/services/revenuecat'

import { checkAuthToken, checkFirstLaunch, removeAuthTokens } from '@/utils/auth'

import { AuthContext } from './context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)

  const { data: user, isLoading, isError } = useGetCurrentUser({
    enabled: hasToken === true,
  })

  const isAuthenticated = Boolean(user)
  // isInitialized is true when the token is not null and the user is not loading
  const isInitialized = hasToken !== null && (!hasToken || !isLoading)

  const value = useMemo(() => ({
    hasToken,
    setHasToken,
    isFirstLaunch: isFirstLaunch ?? true,
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
  }), [
    hasToken,
    setHasToken,
    isFirstLaunch,
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
  ])

  useEffect(() => {
    Promise.all([
      checkAuthToken(),
      checkFirstLaunch(),
    ]).then(([token, firstLaunch]) => {
      setHasToken(token)
      setIsFirstLaunch(firstLaunch)
    })
  }, [])

  useEffect(() => {
    if (isError && hasToken) {
      removeAuthTokens().then(() => {
        setHasToken(false)
        logoutRevenueCat().catch((error) => {
          console.error('Failed to logout RevenueCat:', error)
        })
      })
    }
  }, [isError, hasToken])

  // Set RevenueCat user ID when user is authenticated
  useEffect(() => {
    if (user?.id) {
      setRevenueCatUserId(user.id).catch((error) => {
        console.error('Failed to set RevenueCat user ID:', error)
      })
    }
  }, [user?.id])

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  )
}
