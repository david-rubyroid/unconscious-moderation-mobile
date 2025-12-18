import type {
  CurrentStreakResponse,
  MarkTrophiesAsShownRequest,
  ResetStreakRequest,
  ResetStreakResponse,
  SobrietyResetResponse,
  SobrietyStreakResponse,
  SobrietyTrophyResponse,
  StartStreakRequest,
  StatsResponse,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useStartSobrietyStreak(
  options?: MutationOptions<SobrietyStreakResponse, Error, StartStreakRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<SobrietyStreakResponse, StartStreakRequest>(
      'post',
      'sobriety-tracker/start',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-activities'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'trophies'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'trophies', 'pending'] })
    },
    ...options,
  })
}

export function useGetCurrentStreak(options?: QueryOptions<CurrentStreakResponse>) {
  return useQuery({
    queryKey: ['sobriety-tracker', 'current'],
    queryFn: createQueryFn<CurrentStreakResponse>('sobriety-tracker/current'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useResetSobrietyStreak(
  options?: MutationOptions<ResetStreakResponse, Error, ResetStreakRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<ResetStreakResponse, ResetStreakRequest>(
      'post',
      'sobriety-tracker/reset',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'resets'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'trophies'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'trophies', 'pending'] })
    },
    ...options,
  })
}

export function useGetTrophies(options?: QueryOptions<SobrietyTrophyResponse[]>) {
  return useQuery({
    queryKey: ['sobriety-tracker', 'trophies'],
    queryFn: createQueryFn<SobrietyTrophyResponse[]>('sobriety-tracker/trophies'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useGetPendingTrophies(options?: QueryOptions<SobrietyTrophyResponse[]>) {
  return useQuery({
    queryKey: ['sobriety-tracker', 'trophies', 'pending'],
    queryFn: createQueryFn<SobrietyTrophyResponse[]>('sobriety-tracker/trophies/pending'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useMarkTrophiesAsShown(
  options?: MutationOptions<SobrietyTrophyResponse[], Error, MarkTrophiesAsShownRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<SobrietyTrophyResponse[], MarkTrophiesAsShownRequest>(
      'patch',
      'sobriety-tracker/trophies/shown',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'trophies'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'trophies', 'pending'] })
      queryClient.invalidateQueries({ queryKey: ['sobriety-tracker', 'current'] })
    },
    ...options,
  })
}

export function useGetResetHistory(
  limit?: number,
  offset?: number,
  options?: QueryOptions<SobrietyResetResponse[]>,
) {
  const queryParams: Record<string, number> = {}
  if (limit !== undefined)
    queryParams.limit = limit
  if (offset !== undefined)
    queryParams.offset = offset

  return useQuery({
    queryKey: ['sobriety-tracker', 'resets', { limit, offset }],
    queryFn: createQueryFn<SobrietyResetResponse[]>('sobriety-tracker/resets', queryParams),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useGetSobrietyStats(options?: QueryOptions<StatsResponse>) {
  return useQuery({
    queryKey: ['sobriety-tracker', 'stats'],
    queryFn: createQueryFn<StatsResponse>('sobriety-tracker/stats'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}
