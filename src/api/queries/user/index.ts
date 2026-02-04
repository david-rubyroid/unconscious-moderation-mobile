import type {
  PushSubscriptionRequest,
  UserFearResponse,
  UserFearsRequest,
  UserGiftResponse,
  UserGiftsRequest,
  UserUpdateRequest,
  UserUpdateResponse,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useUpdateUser(options?: MutationOptions<UserUpdateResponse, UserUpdateRequest>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<UserUpdateResponse, UserUpdateRequest>('patch', 'users/me'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
    },
    ...options,
  })
}

export function useUserGiftsAdd(options?: MutationOptions<void, UserGiftsRequest>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<void, UserGiftsRequest>('post', 'users/me/gifts'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'gifts'] })
    },
    ...options,
  })
}

export function useUserFearsAdd(options?: MutationOptions<void, UserFearsRequest>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<void, UserFearsRequest>('post', 'users/me/fears'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'fears'] })
    },
    ...options,
  })
}

export function useGetUserFears(options?: QueryOptions<UserFearResponse[]>) {
  return useQuery({
    queryKey: ['users', 'fears'],
    queryFn: createQueryFn<UserFearResponse[]>('users/me/fears'),
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useGetUserGifts(options?: QueryOptions<UserGiftResponse[]>) {
  return useQuery({
    queryKey: ['users', 'gifts'],
    queryFn: createQueryFn<UserGiftResponse[]>('users/me/gifts'),
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function usePushSubscriptionRegister(options?:
MutationOptions<void, PushSubscriptionRequest>) {
  return useMutation({
    mutationFn:
    createMutationFn<void, PushSubscriptionRequest>('post', 'users/me/push-subscription'),
    ...options,
  })
}

/**
 * Request immediate day-1 reminder push.
 * For users who registered after 7 AM — backend sends push on demand.
 * Backend returns 400 if user is not on day 1.
 */
export function useRequestDayOneReminder(
  options?: MutationOptions<{ sent: boolean }, Error, void>,
) {
  return useMutation({
    mutationFn: createMutationFn<{ sent: boolean }, void>(
      'post',
      'users/me/request-day-one-reminder',
      { skipBody: true },
    ),
    ...options,
  })
}
