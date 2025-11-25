import { Stack } from 'expo-router'

import { useGetCurrentUser } from '@/api/queries/auth'
import { useGetUserFears, useGetUserGifts } from '@/api/queries/user'

function ProtectedLayout() {
  const { data: user } = useGetCurrentUser()
  const { data: fears } = useGetUserFears()
  const { data: gifts } = useGetUserGifts()

  const isBasicInfoCompleted = Boolean(user?.gender && user?.age && user?.referralSource)
  const isGiftsCompleted = Boolean(gifts && gifts.length > 0)
  const isFearsCompleted = Boolean(fears && fears.length > 0)
  const isMedicalQuestionsCompleted = Boolean(user?.medicalQuestionsCompletedAt)

  const isHomeScreenAvailable
    = isBasicInfoCompleted && isGiftsCompleted && isFearsCompleted && isMedicalQuestionsCompleted

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Protected guard={isHomeScreenAvailable}>
        <Stack.Screen name="index" />
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
      <Stack.Screen name="purchase" />
    </Stack>
  )
}

export default ProtectedLayout
