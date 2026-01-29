import type { CreateMantraRequest, DeleteMantraRequest, MantraResponse } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetMantras(options?: QueryOptions<MantraResponse[]>) {
  return useQuery({
    queryKey: ['users', 'mantras'],
    queryFn: createQueryFn<MantraResponse[]>('users/me/mantras'),
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useCreateMantra(
  options?: MutationOptions<MantraResponse, Error, CreateMantraRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<MantraResponse, CreateMantraRequest>(
      'post',
      'users/me/mantras',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mantras'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
    },
    ...options,
  })
}

export function useDeleteMantra(
  options?: MutationOptions<void, Error, DeleteMantraRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<void, DeleteMantraRequest>(
      'delete',
      'users/me/mantras',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mantras'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
    },
    ...options,
  })
}
