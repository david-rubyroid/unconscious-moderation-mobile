import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

import { api } from '@/api/client'

export interface QueryOptions<TData = unknown, TError = Error> extends Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
> {}

export interface MutationOptions<TData = unknown, TError = Error, TVariables = unknown> extends Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
> {}

export function createQueryFn<TData = unknown>(url: string) {
  return async (): Promise<TData> => {
    const response = await api.get(url).json<TData>()
    return response
  }
}

export function createMutationFn<TData = unknown, TVariables = unknown>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
) {
  return async (variables: TVariables): Promise<TData> => {
    const response = await api[method](url, { json: variables }).json<TData>()
    return response
  }
}
