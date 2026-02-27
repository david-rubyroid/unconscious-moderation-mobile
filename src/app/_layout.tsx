import { QueryClientProvider } from '@tanstack/react-query'
import { SplashScreen, Stack, usePathname } from 'expo-router'

import { StatusBar } from 'expo-status-bar'

import { useEffect } from 'react'

import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import Toast from 'react-native-toast-message'

import { queryClient } from '@/api/query-client'

import { ThemedGradient, toastConfig } from '@/components'

import { Colors } from '@/constants/theme'

import { AuthProvider } from '@/context/auth/provider'

import { useAuth } from '@/context/auth/use'

import {
  initializeMixpanel,
  isMixpanelInitialized,
  trackScreenView,
} from '@/services/mixpanel'
import { initializeOneSignal } from '@/services/onesignal'
import { initializeRevenueCat } from '@/services/revenuecat'
import { initializeTikTok } from '@/services/tiktok'

import { logDebug, logError } from '@/utils/logger'
import { preloadImages } from '@/utils/preload-assets'

import '@/i18n/config'

import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

// Initialize RevenueCat on app startup
initializeRevenueCat().catch((error) => {
  logError('Failed to initialize RevenueCat on app startup', error)
})

// Initialize OneSignal on app startup
initializeOneSignal()

// Initialize Mixpanel on app startup
initializeMixpanel()
  .then(() => {
    logDebug('[Mixpanel] Initialization check', { status: isMixpanelInitialized() ? 'OK' : 'FAILED' })
  })
  .catch((error) => {
    logError('[Mixpanel] Failed to initialize on app startup', error)
  })

initializeTikTok({ debugMode: __DEV__, autoTrackAppLifecycle: true })
  .catch((error) => {
    logError('[TikTok] Failed to initialize on app startup', error)
  })

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureRoot: {
    flex: 1,
  },
})

function AppContent() {
  const {
    isInitialized,
    isAuthenticated,
    isFirstLaunch,
  } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    preloadImages().catch((err) => {
      logError('Failed to preload images', err)
    })
  }, [])

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync()
    }
  }, [isInitialized])

  // Track screen views when pathname changes
  useEffect(() => {
    if (pathname && isInitialized) {
      trackScreenView(pathname)
    }
  }, [pathname, isInitialized])

  if (!isInitialized) {
    return (
      <ThemedGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </ThemedGradient>
    )
  }

  return (
    <ThemedGradient>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(private)" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Protected guard={!isFirstLaunch}>
            <Stack.Screen name="(public)" />
          </Stack.Protected>

          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemedGradient>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <StatusBar style="dark" animated />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>

      <Toast config={toastConfig} topOffset={60} visibilityTime={4000} />
    </GestureHandlerRootView>
  )
}
