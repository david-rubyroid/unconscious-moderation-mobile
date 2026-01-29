import type { CalendarDayData } from '@/components/calendar/types'

import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { useDeleteDrinkSession } from '@/api/queries/drink-session'

import { getErrorMessage } from '@/utils/error-handler'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

interface UseDaySummaryLogicProps {
  day: Date | null
  dayData?: CalendarDayData
  onClose: () => void
}

/**
 * Get day of week name (e.g., "Friday", "Wednesday")
 */
function getDayOfWeekName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function useDaySummaryLogic({
  day,
  dayData,
  onClose,
}: UseDaySummaryLogicProps) {
  const { push } = useRouter()
  const { t } = useTranslation('drink-tracker')
  const { mutateAsync: deleteSession } = useDeleteDrinkSession()

  if (!day) {
    return {
      dayName: '',
      isExceeded: false,
      isAbstained: false,
      isFollowed: false,
      isPlanned: false,
      handleEditSession: () => {},
      handleDeleteSession: () => {},
    }
  }

  const dayName = getDayOfWeekName(day)

  // Determine if exceeded limit (only for completed sessions)
  const isExceeded = Boolean(
    dayData?.status === 'completed'
    && dayData.totalDrinks
    && dayData.maxDrinkCount
    && dayData.totalDrinks > dayData.maxDrinkCount,
  )

  const isAbstained = !dayData
  const isFollowed = dayData?.status === 'completed' && !isExceeded
  const isPlanned = dayData?.status === 'planned'

  const handleEditSession = () => {
    push({
      pathname: '/drink-tracker/plan-session',
      params: {
        sessionId: dayData?.id,
      },
    })
    onClose()
  }
  const handleDeleteSession = () => {
    if (!dayData?.id) {
      return
    }

    Alert.alert(
      t('day-summary.delete-session-title', { defaultValue: 'Delete Session' }),
      t('day-summary.delete-session-message', { defaultValue: 'Are you sure you want to delete this session? This action cannot be undone.' }),
      [
        {
          text: t('day-summary.cancel', { defaultValue: 'Cancel' }),
          style: 'cancel',
        },
        {
          text: t('day-summary.delete', { defaultValue: 'Delete' }),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession(dayData.id)
              showSuccessToast(
                t('day-summary.delete-session-success', { defaultValue: 'Session deleted' }),
                t('day-summary.delete-session-success-message', { defaultValue: 'The session has been successfully deleted.' }),
              )
              onClose()
            }
            catch (error) {
              const errorMessage = getErrorMessage(error)
              showErrorToast(
                t('day-summary.delete-session-error', { defaultValue: 'Error' }),
                errorMessage,
              )
            }
          },
        },
      ],
    )
  }

  return {
    dayName,
    isExceeded,
    isAbstained,
    isFollowed,
    isPlanned,
    handleEditSession,
    handleDeleteSession,
  }
}
