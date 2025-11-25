import type {
  UserFearResponse,
  UserFearsRequest,
  UserGiftResponse,
  UserGiftsRequest,
  UserUpdateRequest,
  UserUpdateResponse,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useGetUserGifts(options?: QueryOptions<UserGiftResponse[]>) {
  return useQuery({
    queryKey: ['users', 'gifts'],
    queryFn: createQueryFn<UserGiftResponse[]>('users/me/gifts'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}
