import { useRouter } from 'expo-router'
import { useCallback } from 'react'

import { useCompleteActivity } from '@/api/queries/daily-activities'

export function useConnectionDayCompletion(dayNumber: number) {
  const { back } = useRouter()
  const { mutateAsync: completeActivity, isPending } = useCompleteActivity()

  const handleComplete = useCallback(async () => {
    await completeActivity(
      {
        day: dayNumber,
        activityType: 'connection-day',
      },
      {
        onSuccess: () => {
          back()
        },
      },
    )
  }, [completeActivity, dayNumber, back])

  return {
    handleComplete,
    isPending,
  }
}
