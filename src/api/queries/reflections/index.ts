import type {
  CreateReflectionRequest,
  ReflectionResponse,
  UpdateReflectionRequest,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetSessionReflections(
  sessionId: number | undefined,
  options?: QueryOptions<ReflectionResponse[]>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'reflections'],
    queryFn: createQueryFn<ReflectionResponse[]>(`drink-tracker/sessions/${sessionId}/reflections`),
    enabled: !!sessionId,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useGetSessionReflection(
  sessionId: number | undefined,
  options?: QueryOptions<ReflectionResponse | null>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'reflection'],
    queryFn: async () => {
      const reflection = await createQueryFn<ReflectionResponse>(
        `drink-tracker/sessions/${sessionId}/reflection`,
      )()
      return reflection
    },
    enabled: !!sessionId,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useCreateReflection(
  options?: MutationOptions<ReflectionResponse, Error, CreateReflectionRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<ReflectionResponse, CreateReflectionRequest>(
      'post',
      'drink-tracker/reflections',
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', data.sessionId, 'reflections'] })
    },
    ...options,
  })
}

export function useUpdateReflection(
  reflectionId?: number,
  options?: MutationOptions<ReflectionResponse, Error, UpdateReflectionRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<ReflectionResponse, UpdateReflectionRequest>(
      'patch',
      `drink-tracker/reflections/${reflectionId}`,
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', data.sessionId, 'reflections'] })
    },
    ...options,
  })
}
