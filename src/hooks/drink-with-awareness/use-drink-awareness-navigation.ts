import type { UseMutateFunction } from '@tanstack/react-query'

import type { UpdateDrinkSessionRequest, UpdateDrinkSessionResponse } from '@/api/queries/drink-session/dto'
import type { HypnosisCheckInType } from '@/utils/hypnosis-checkin-storage'

import { useRouter } from 'expo-router'

interface UseDrinkAwarenessNavigationParams {
  sessionId: string | string[]
  updateDrinkSession: UseMutateFunction<
    UpdateDrinkSessionResponse,
    Error,
    UpdateDrinkSessionRequest,
    unknown
  >
}

interface UseDrinkAwarenessNavigationReturn {
  navigateToLogDrink: () => void
  navigateToSelfHypnosis: (
    _hypnosisLink?: string | null,
    _title?: string | null,
    _checkInType?: HypnosisCheckInType | null,
    _hoursSinceFirstDrink?: number | null,
  ) => void
  navigateToManageUrges: (_sessionId?: string | null) => void
  handleFinishDrinking: (_sessionId?: string | null) => void
}

export function useDrinkAwarenessNavigation({
  sessionId,
  updateDrinkSession,
}: UseDrinkAwarenessNavigationParams): UseDrinkAwarenessNavigationReturn {
  const { push, replace } = useRouter()

  const navigateToLogDrink = () => {
    push({
      pathname: '/drink-tracker/log-drink',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = (
    hypnosisLink?: string | null,
    title?: string | null,
    checkInType?: HypnosisCheckInType | null,
    hoursSinceFirstDrink?: number | null,
  ) => {
    push({
      pathname: '/drink-tracker/hypnosis-check-in',
      params: {
        sessionId,
        ...(hypnosisLink && { hypnosisLink }),
        ...(title && { title }),
        ...(checkInType && { checkInType }),
        ...(hoursSinceFirstDrink != null && { hoursSinceFirstDrink: String(hoursSinceFirstDrink) }),
      },
    })
  }
  const navigateToManageUrges = () => {
    push({
      pathname: '/drink-tracker/manage-urges',
      params: { sessionId },
    })
  }
  const handleFinishDrinking = () => {
    updateDrinkSession({
      status: 'completed',
    }, {
      onSuccess: () => {
        replace({
          pathname: '/drink-tracker/reflect-reinforce',
          params: { sessionId },
        })
      },
    })
  }

  return {
    navigateToLogDrink,
    navigateToSelfHypnosis,
    navigateToManageUrges,
    handleFinishDrinking,
  }
}
