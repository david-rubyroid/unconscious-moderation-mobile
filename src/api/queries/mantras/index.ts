import type { CreateMantraRequest, MantraResponse } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetMantras(options?: QueryOptions<MantraResponse[]>) {
  return useQuery({
    queryKey: ['users', 'mantras'],
    queryFn: createQueryFn<MantraResponse[]>('users/me/mantras'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}

export function useCreateMantra(
  options?: MutationOptions<MantraResponse, Error, string>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (mantraText: string): Promise<MantraResponse> => {
      const response = await api
        .post('users/me/mantras', { json: { mantras: [mantraText] } })
        .json<MantraResponse>()
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mantras'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
    },
    ...options,
  })
}

export function useUpdateMantras(
  options?: MutationOptions<void, Error, CreateMantraRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<void, CreateMantraRequest>(
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
  options?: MutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`users/me/mantras/${id}`).json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mantras'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'current'] })
    },
    ...options,
  })
}
