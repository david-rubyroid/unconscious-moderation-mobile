import type { BloodPressureFormValues } from './blood-pressure-form.schema'

import type { BloodPressureResultType } from './components'

import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'

import { useCompleteActivity, useGetActionDayHealthMetrics } from '@/api/queries/daily-activities'
import { getBloodPressureResultType } from '@/utils/blood-pressure'

export function useActionDayCompletion(dayNumber: number) {
  const { back } = useRouter()
  const [bloodPressureResultModal, setBloodPressureResultModal]
    = useState<BloodPressureResultType | null>(null)

  const { mutateAsync: completeActivity, isPending } = useCompleteActivity()
  const { data: day2BloodPressureMetrics } = useGetActionDayHealthMetrics(2)

  const handleCompleteActivityWithoutBloodPressure = useCallback(async () => {
    await completeActivity(
      {
        day: dayNumber,
        activityType: 'action-day',
      },
      {
        onSuccess: () => {
          back()
        },
      },
    )
  }, [completeActivity, dayNumber, back])

  const handleCloseBloodPressureResultModal = useCallback(() => {
    setBloodPressureResultModal(null)
    back()
  }, [back])

  const handleCompleteActivityWithBloodPressure = useCallback(
    async (data: BloodPressureFormValues) => {
      await completeActivity(
        {
          day: dayNumber,
          activityType: 'action-day',
          systolicPressure: data.systolicPressure,
          diastolicPressure: data.diastolicPressure,
        },
        {
          onSuccess: (_, variables) => {
            const day2 = day2BloodPressureMetrics
            const hasDay2 = day2?.systolic != null && day2?.diastolic != null
            const hasDay30
              = variables.systolicPressure != null
                && variables.diastolicPressure != null
            const showResultModal = dayNumber === 30 && hasDay2 && hasDay30

            if (showResultModal && day2) {
              const resultType = getBloodPressureResultType(
                day2.systolic,
                day2.diastolic,
                variables.systolicPressure as number,
                variables.diastolicPressure as number,
              )
              setBloodPressureResultModal(resultType)
            }
            else {
              back()
            }
          },
        },
      )
    },
    [completeActivity, dayNumber, day2BloodPressureMetrics, back],
  )

  return {
    bloodPressureResultModal,
    handleCloseBloodPressureResultModal,
    handleCompleteActivityWithBloodPressure,
    handleCompleteActivityWithoutBloodPressure,
    isPending,
  }
}
