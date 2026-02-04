import type { PushSubscriptionChangedState } from 'react-native-onesignal'

import { useEffect, useMemo, useRef, useState } from 'react'
import { OneSignal } from 'react-native-onesignal'

import { useGetCurrentUser } from '@/api/queries/auth'
import { usePushSubscriptionRegister } from '@/api/queries/user'

import { identifyUser, resetMixpanel } from '@/services/mixpanel'
import {
  getOneSignalPushToken,
  getPushPlatform,
  isOneSignalInitialized,
  loginOneSignal,
  logoutOneSignal,
  requestOneSignalPermission,
} from '@/services/onesignal'
import { logoutRevenueCat, setRevenueCatUserId } from '@/services/revenuecat'

import { checkAuthToken, checkFirstLaunch, removeAuthTokens } from '@/utils/auth'

import { logError } from '@/utils/logger'

import { AuthContext } from './context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)
  const userRef = useRef<{ id: number } | null>(null)

  const { data: user, isLoading, isError } = useGetCurrentUser({
    enabled: hasToken === true,
  })
  const { mutateAsync: registerPushSubscription } = usePushSubscriptionRegister()

  userRef.current = user ?? null

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

      // Request notification permission after login
      // so user can receive test pushes from OneSignal Dashboard
      const t = setTimeout(() => {
        if (isOneSignalInitialized()) {
          requestOneSignalPermission(false)
            .catch(err => logError('OneSignal permission request failed', err))
        }
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [user?.id, user?.email])

  // Register push token with backend when user is set and we have a token
  useEffect(() => {
    if (!user?.id || !isOneSignalInitialized())
      return

    const platform = getPushPlatform()
    if (!platform)
      return

    getOneSignalPushToken()
      .then((pushToken: string | null) => {
        if (pushToken)
          return registerPushSubscription({ pushToken, platform })
      })
      .catch((error: unknown) => {
        logError('Failed to register push subscription', error, { userId: user.id })
      })
  }, [user?.id, registerPushSubscription])

  // When push subscription changes
  // (e.g. user grants permission), register token with backend
  useEffect(() => {
    if (!isOneSignalInitialized())
      return

    const handler = (event: PushSubscriptionChangedState) => {
      const pushToken = event.current?.token
      const currentUser = userRef.current
      if (!pushToken || !currentUser?.id)
        return

      const platform = getPushPlatform()
      if (!platform)
        return

      registerPushSubscription({ pushToken, platform }).catch((error) => {
        logError(
          'Failed to register push subscription on change',
          error,
          { userId: currentUser.id },
        )
      })
    }

    OneSignal.User.pushSubscription.addEventListener('change', handler)
    return () => {
      OneSignal.User.pushSubscription.removeEventListener('change', handler)
    }
  }, [registerPushSubscription])

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  )
}
