import { Stack } from 'expo-router'

import { ThemedGradient } from '@/components'

import { useAuth } from '@/context/auth/use'

function ProtectedLayout() {
  const { user } = useAuth()

  const isBasicInfoCompleted = Boolean(user?.gender && user?.age && user?.referralSource)
  const isGiftsCompleted = Boolean(user?.gifts && user?.gifts.length > 0)
  const isFearsCompleted = Boolean(user?.fears && user?.fears.length > 0)
  const isMedicalQuestionsCompleted = Boolean(user?.medicalQuestionsCompletedAt)

  const isHomeScreenAvailable
    = isBasicInfoCompleted && isGiftsCompleted && isFearsCompleted && isMedicalQuestionsCompleted

  return (
    <ThemedGradient>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isHomeScreenAvailable}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        <Stack.Protected guard={!isBasicInfoCompleted}>
          <Stack.Screen name="personalize-questions" />
        </Stack.Protected>

        <Stack.Protected guard={!isGiftsCompleted}>
          <Stack.Screen
            name="gifts"
          />
        </Stack.Protected>

        <Stack.Protected guard={!isFearsCompleted}>
          <Stack.Screen name="fears" />
        </Stack.Protected>

        <Stack.Protected guard={!isMedicalQuestionsCompleted}>
          <Stack.Screen name="shared-awareness" />
        </Stack.Protected>

        {/* Purchase screen is always accessible */}
        <Stack.Screen name="medical-report" />
        <Stack.Screen name="welcome-to-your-journey" />
        <Stack.Screen name="purchase" />

        {/* Drink tracker screens are always accessible */}
        <Stack.Screen name="drink-tracker/index" />
        <Stack.Screen name="drink-tracker/drink-tracker-steps" />
        <Stack.Screen name="drink-tracker/plan-and-prepare" />
        <Stack.Screen name="drink-tracker/hypnosis" />
        <Stack.Screen name="drink-tracker/hydration" />
        <Stack.Screen name="drink-tracker/mantra" />
        <Stack.Screen name="drink-tracker/pre-drink-checklist" />
      </Stack>
    </ThemedGradient>
  )
}

export default ProtectedLayout
