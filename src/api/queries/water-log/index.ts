import type { LogWaterRequest, WaterLogResponse } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery } from '@tanstack/react-query'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetSessionWater(
  sessionId: number | undefined,
  options?: QueryOptions<WaterLogResponse[]>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'water'],
    queryFn: createQueryFn<WaterLogResponse[]>(`drink-tracker/sessions/${sessionId}/water`),
    enabled: !!sessionId,
    staleTime: 30000, // 30 seconds
    retry: false,
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
