import type {
  CreateDrinkSessionRequest,
  CreateDrinkSessionResponse,
  DrinkSessionResponse,
  UpdateDrinkSessionRequest,
  UpdateDrinkSessionResponse,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useCreateDrinkSession(
  options?: MutationOptions<CreateDrinkSessionResponse, Error, CreateDrinkSessionRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<CreateDrinkSessionResponse, CreateDrinkSessionRequest>(
      'post',
      'drink-tracker/sessions',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions'] })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'current-session'] })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', 'current-week'] })
    },
    ...options,
  })
}

export function useGetDrinkSession(
  sessionId: number | undefined,
  options?: QueryOptions<DrinkSessionResponse>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId],
    queryFn: createQueryFn<DrinkSessionResponse>(`drink-tracker/sessions/${sessionId}`),
    enabled: !!sessionId,
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useGetDrinkSessions(options?: QueryOptions<DrinkSessionResponse[]>) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions'],
    queryFn: createQueryFn<DrinkSessionResponse[]>('drink-tracker/sessions'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useGetCurrentWeekDrinkSessions(options?: QueryOptions<DrinkSessionResponse[]>) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', 'current-week'],
    queryFn: createQueryFn<DrinkSessionResponse[]>('drink-tracker/sessions', { currentWeek: true }),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useGetCurrentDrinkSession(options?: QueryOptions<DrinkSessionResponse | null>) {
  return useQuery({
    queryKey: ['drink-tracker', 'current-session'],
    queryFn: createQueryFn<DrinkSessionResponse | null>('drink-tracker/sessions/current'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useUpdateDrinkSession(
  sessionId: number,
  options?: MutationOptions<UpdateDrinkSessionResponse, Error, UpdateDrinkSessionRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<UpdateDrinkSessionResponse, UpdateDrinkSessionRequest>(
      'patch',
      `drink-tracker/sessions/${sessionId}`,
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions'] })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'current-session'] })
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', 'current-week'] })
    },
    ...options,
  })
}
