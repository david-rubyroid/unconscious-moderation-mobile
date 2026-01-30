import type {
  DrinkLogResponse,
  LogDrinkRequest,
  UpdateDrinkLogRequest,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetSessionDrinks(
  sessionId: number | undefined,
  options?: QueryOptions<DrinkLogResponse[]>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'drinks'],
    queryFn: createQueryFn<DrinkLogResponse[]>(`drink-tracker/sessions/${sessionId}/drinks`),
    enabled: !!sessionId,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useGetDrinkLog(
  sessionId: number | undefined,
  drinkId: number | undefined,
  options?: QueryOptions<DrinkLogResponse>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'drinks', drinkId],
    queryFn: createQueryFn<DrinkLogResponse>(
      `drink-tracker/sessions/${sessionId}/drinks/${drinkId}`,
    ),
    enabled: !!sessionId && !!drinkId,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useLogDrink(
  sessionId?: number,
  options?: MutationOptions<DrinkLogResponse, Error, LogDrinkRequest>,
) {
  return useMutation({
    ...options,
    mutationFn: createMutationFn<DrinkLogResponse, LogDrinkRequest>(
      'post',
      `drink-tracker/sessions/${sessionId}/drinks`,
    ),
  })
}

export function useUpdateDrinkLog(
  sessionId: number,
  drinkId: number,
  options?: MutationOptions<DrinkLogResponse, Error, UpdateDrinkLogRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: createMutationFn<DrinkLogResponse, UpdateDrinkLogRequest>(
      'patch',
      `drink-tracker/sessions/${sessionId}/drinks/${drinkId}`,
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['drink-tracker', 'sessions', sessionId, 'drinks'],
      })
      queryClient.invalidateQueries({
        queryKey: ['drink-tracker', 'sessions', sessionId, 'drinks', drinkId],
      })
      queryClient.invalidateQueries({
        queryKey: ['drink-tracker', 'sessions', sessionId],
      })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions'] })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'current-session'] })
    },
  })
}
