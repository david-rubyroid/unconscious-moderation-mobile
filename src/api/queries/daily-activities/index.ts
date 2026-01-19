import type { ActivityType, DailyActivitiesResponse, DailyActivityProgress, DailyJournalingActivityAnswer, DayResponse, SaveJournalingAnswerRequest } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetDaysWithActivities(
  options?: QueryOptions<DailyActivitiesResponse>,
) {
  return useQuery({
    queryKey: ['daily-activities'],
    queryFn: createQueryFn<DailyActivitiesResponse>('daily-activities'),
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useGetDayDetails(
  day: number | undefined,
  options?: QueryOptions<DayResponse>,
) {
  return useQuery({
    queryKey: ['daily-activities', 'day', day],
    queryFn: createQueryFn<DayResponse>(`daily-activities/${day}`),
    enabled: day !== undefined && day >= 1 && day <= 30,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useCompleteActivity(
  options?: MutationOptions<DailyActivityProgress, Error, { day: number, activityType: ActivityType }>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<DailyActivityProgress, { day: number, activityType: ActivityType }>(
      'post',
      ({ day, activityType }) => `daily-activities/${day}/${activityType}/complete`,
      { skipBody: true },
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-activities'] })
      queryClient.invalidateQueries({ queryKey: ['daily-activities', 'day', data.day_number] })
    },
    ...options,
  })
}

export function useSaveJournalingAnswer(
  options?: MutationOptions<DailyJournalingActivityAnswer, Error, SaveJournalingAnswerRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<DailyJournalingActivityAnswer, SaveJournalingAnswerRequest>(
      'post',
      variables => `daily-activities/journaling/${variables.day}/answers`,
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-activities'] })
      queryClient.invalidateQueries({ queryKey: ['daily-activities', 'day', data.day_number] })
      queryClient.invalidateQueries({ queryKey: ['daily-activities', 'journaling', data.day_number, 'answers'] })
    },
    ...options,
  })
}

export function useGetJournalingAnswers(
  day: number | undefined,
  options?: QueryOptions<DailyJournalingActivityAnswer[]>,
) {
  return useQuery({
    queryKey: ['daily-activities', 'journaling', day, 'answers'],
    queryFn: createQueryFn<DailyJournalingActivityAnswer[]>(`daily-activities/journaling/${day}/answers`),
    enabled: day !== undefined && day >= 1 && day <= 30,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useMarkDayCompletionModalShown(
  options?: MutationOptions<void, Error, { day: number }>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<void, { day: number }>(
      'post',
      ({ day }) => `daily-activities/${day}/completion-modal/mark-shown`,
      { skipBody: true },
    ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['daily-activities'] })
      queryClient.invalidateQueries({ queryKey: ['daily-activities', 'day', variables.day] })
    },
    ...options,
  })
}
