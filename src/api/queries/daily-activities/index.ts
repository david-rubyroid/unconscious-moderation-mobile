import type {
  ActionDayBloodPressure,
  ActivityFeedbackResponse,
  CompleteActivityRequest,
  DailyActivitiesResponse,
  DailyActivityProgress,
  DailyJournalingActivityAnswer,
  DayResponse,
  SaveJournalingAnswerRequest,
  SubmitActivityFeedbackRequest,
} from './dto'

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

export function useGetActionDayHealthMetrics(
  day: number | undefined,
  options?: QueryOptions<ActionDayBloodPressure | null>,
) {
  return useQuery({
    queryKey: ['daily-activities', 'health-metrics', 'action-days', day],
    queryFn: createQueryFn<ActionDayBloodPressure | null>(`daily-activities/health-metrics/action-days/${day}`),
    enabled: day !== undefined && day >= 1 && day <= 30,
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
  options?: MutationOptions<DailyActivityProgress, Error, CompleteActivityRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<DailyActivityProgress, CompleteActivityRequest>(
      'post',
      ({ day, activityType }) => `daily-activities/${day}/${activityType}/complete`,
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

export function useGetActivityFeedback(
  day: number | undefined,
  options?: QueryOptions<ActivityFeedbackResponse[]>,
) {
  return useQuery({
    queryKey: ['daily-activities', 'day', day, 'feedback'],
    queryFn: createQueryFn<ActivityFeedbackResponse[]>(`daily-activities/${day}/feedback`),
    enabled: day !== undefined && day >= 1 && day <= 30,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useSubmitActivityFeedback(
  options?: MutationOptions<ActivityFeedbackResponse, Error, SubmitActivityFeedbackRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<ActivityFeedbackResponse, SubmitActivityFeedbackRequest>(
      'post',
      ({ day }) => `daily-activities/${day}/feedback`,
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-activities'] })
      queryClient.invalidateQueries({ queryKey: ['daily-activities', 'day', data.day_number] })
      queryClient.invalidateQueries({ queryKey: ['daily-activities', 'day', data.day_number, 'feedback'] })
    },
    ...options,
  })
}
