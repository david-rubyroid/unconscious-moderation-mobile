import { useEffect, useMemo, useState } from 'react'

import { useGetCurrentUser } from '@/api/queries/auth'
import { useRequestDayOneReminder } from '@/api/queries/user'

import { identifyUser, resetMixpanel } from '@/services/mixpanel'
import {
  isOneSignalInitialized,
  loginOneSignal,
  logoutOneSignal,
  requestOneSignalPermission,
} from '@/services/onesignal'
import { logoutRevenueCat, setRevenueCatUserId } from '@/services/revenuecat'

import { AsyncStorageKey, getItem, removeItem, setItem } from '@/utils/async-storage'
import { checkAuthToken, checkFirstLaunch, removeAuthTokens } from '@/utils/auth'

import { logError } from '@/utils/logger'

import { AuthContext } from './context'

const HOUR_7_AM = 7

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)

  const { data: user, isLoading, isError } = useGetCurrentUser({
    enabled: hasToken === true,
  })

  const { mutate: requestDayOneReminder } = useRequestDayOneReminder({
    onSuccess: () => setItem(AsyncStorageKey.DAY_ONE_REMINDER_REQUESTED, 'true'),
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 400) {
        setItem(AsyncStorageKey.DAY_ONE_REMINDER_REQUESTED, 'true')
      }
    },
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
      Promise.all([
        removeAuthTokens(),
        removeItem(AsyncStorageKey.DAY_ONE_REMINDER_REQUESTED),
      ]).then(() => {
        setHasToken(false)
        logoutOneSignal()
        logoutRevenueCat().catch((error) => {
          logError('Failed to logout RevenueCat', error)
        })
        resetMixpanel()
      })
    }
  }, [isError, hasToken])

  // Set RevenueCat user ID, Mixpanel, and OneSignal when user is authenticated
  useEffect(() => {
    if (user?.id) {
      setRevenueCatUserId(user.id).catch((error) => {
        logError('Failed to set RevenueCat user ID', error, { userId: user.id })
      })
      identifyUser(user.id)
      loginOneSignal(user.id, user.email)

      // Request notification permission shortly after login
      // (consider moving to a post-value moment for better opt-in)
      const t = setTimeout(() => {
        if (isOneSignalInitialized()) {
          requestOneSignalPermission(false)
            .then(async (granted) => {
              if (!granted)
                return
              const now = new Date()
              if (now.getHours() < HOUR_7_AM)
                return
              const requested = await getItem(AsyncStorageKey.DAY_ONE_REMINDER_REQUESTED)
              if (requested)
                return
              requestDayOneReminder()
            })
            .catch(err => logError('OneSignal permission request failed', err))
        }
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [user?.id, user?.email, requestDayOneReminder])

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  )
}
