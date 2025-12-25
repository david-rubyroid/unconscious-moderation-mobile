import type { DrinkLogResponse, LogDrinkRequest } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery } from '@tanstack/react-query'

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
