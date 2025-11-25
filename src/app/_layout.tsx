import { QueryClientProvider } from '@tanstack/react-query'
import { SplashScreen, Stack } from 'expo-router'

import { StatusBar } from 'expo-status-bar'

import { useEffect } from 'react'

import Toast from 'react-native-toast-message'

import { queryClient } from '@/api/query-client'
import { ThemedGradient, toastConfig } from '@/components'

import { AuthProvider } from '@/context/auth/provider'

import { useAuth } from '@/context/auth/use'

import { initializeRevenueCat } from '@/services/revenuecat'

import '@/i18n/config'

import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

// Initialize RevenueCat on app startup
initializeRevenueCat().catch((error) => {
  console.error('Failed to initialize RevenueCat on app startup:', error)
})

function AppContent() {
  const { isInitialized, isAuthenticated, isFirstLaunch } = useAuth()

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync()
    }
  }, [isInitialized])

  if (!isInitialized) {
    // when we return null, the splash screen is visible
    return null
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
    <>
      <StatusBar style="dark" animated />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>

      <Toast config={toastConfig} topOffset={60} visibilityTime={4000} />
    </>
  )
}
