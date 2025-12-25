import type { LogWaterRequest, WaterLogResponse } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetSessionWater(
  sessionId: number | undefined,
  options?: QueryOptions<WaterLogResponse[]>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'water'],
    queryFn: createQueryFn<WaterLogResponse[]>(`drink-tracker/sessions/${sessionId}/water`),
    enabled: !!sessionId,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useLogWater(
  sessionId?: number,
  options?: MutationOptions<WaterLogResponse, Error, LogWaterRequest>,
) {
  return useMutation({
    ...options,
    mutationFn: createMutationFn<WaterLogResponse, LogWaterRequest>(
      'post',
      `drink-tracker/sessions/${sessionId}/water`,
    ),
  })
}
