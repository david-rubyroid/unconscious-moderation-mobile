import { Stack } from 'expo-router'

import { ThemedGradient, TrophyManager } from '@/components'

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
      <TrophyManager />

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

        {/* screen is always accessible */}
        <Stack.Screen name="medical-report" />
        <Stack.Screen name="welcome-to-your-journey" />
        <Stack.Screen name="purchase" />

        <Stack.Screen name="drink-tracker/index" />
        <Stack.Screen name="drink-tracker/drink-tracker-steps" />
        <Stack.Screen name="drink-tracker/plan-and-prepare" />
        <Stack.Screen name="drink-tracker/hypnosis" />
        <Stack.Screen name="drink-tracker/hydration" />
        <Stack.Screen name="drink-tracker/mantra" />
        <Stack.Screen name="drink-tracker/pre-drink-checklist" />
        <Stack.Screen name="drink-tracker/drink-with-awareness" />
        <Stack.Screen name="drink-tracker/log-drink" />
        <Stack.Screen name="drink-tracker/manage-urges" />

        <Stack.Screen name="free-drink-tracker/start-tracking" />
        <Stack.Screen name="free-drink-tracker/reset-tracking" />

        <Stack.Screen name="my-progress" />

        <Stack.Screen name="journaling/day" />
        <Stack.Screen name="journaling/intro" />

        <Stack.Screen name="box-breathing" />

        <Stack.Screen name="blinkist" />
      </Stack>
    </ThemedGradient>
  )
}

export default ProtectedLayout
