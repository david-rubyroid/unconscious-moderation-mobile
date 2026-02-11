import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'

import {
  useGetActivityFeedback,
  useSubmitActivityFeedback,
} from '@/api/queries/daily-activities'

export type ActivityFeedbackType = 'hypnosis' | 'reading' | 'movement' | 'journaling'

export interface UseActivityFeedbackProps {
  day: number
  activityType: ActivityFeedbackType
}

export interface UseActivityFeedbackReturn {
  isFeedbackModalVisible: boolean
  showFeedbackModal: () => void
  hideFeedbackModal: () => void
  handleLike: () => void
  handleDislike: () => void
  handleSkip: () => void
  hasFeedback: boolean
  handleBackPress: () => void
}

export function useActivityFeedback({
  day,
  activityType,
}: UseActivityFeedbackProps): UseActivityFeedbackReturn {
  const router = useRouter()
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)

  const { mutate: submitFeedback } = useSubmitActivityFeedback()
  const { data: activityFeedbackList } = useGetActivityFeedback(day)

  const hasFeedback = Boolean(
    activityFeedbackList?.some(f => f.activity_type === activityType),
  )

  const closeAndBack = useCallback(() => {
    setIsFeedbackModalVisible(false)
    router.back()
  }, [router])

  const showFeedbackModal = useCallback(() => {
    setIsFeedbackModalVisible(true)
  }, [])

  const hideFeedbackModal = useCallback(() => {
    setIsFeedbackModalVisible(false)
  }, [])

  const handleLike = useCallback(() => {
    submitFeedback({
      day,
      activityType,
      isHelpful: true,
    })
    closeAndBack()
  }, [day, activityType, submitFeedback, closeAndBack])

  const handleDislike = useCallback(() => {
    submitFeedback({
      day,
      activityType,
      isHelpful: false,
    })
    closeAndBack()
  }, [day, activityType, submitFeedback, closeAndBack])

  const handleSkip = useCallback(() => {
    closeAndBack()
  }, [closeAndBack])

  const handleBackPress = useCallback(() => {
    if (hasFeedback) {
      router.back()
    }
    else {
      showFeedbackModal()
    }
  }, [hasFeedback, router, showFeedbackModal])

  return {
    isFeedbackModalVisible,
    showFeedbackModal,
    hideFeedbackModal,
    handleLike,
    handleDislike,
    handleSkip,
    hasFeedback,
    handleBackPress,
  }
}
