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

export function createQueryFn<TData = unknown>(url: string, queryParams?: Record<string, string | boolean | number>) {
  return async (): Promise<TData> => {
    const searchParams = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const queryString = searchParams.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    const response = await api.get(fullUrl).json<TData>()
    return response
  }
}

export function createMutationFn<TData = unknown, TVariables = unknown>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string | ((_variables: TVariables) => string),
  options?: {
    skipBody?: boolean // If true, don't send variables as JSON body
  },
) {
  return async (variables: TVariables): Promise<TData> => {
    const finalUrl = typeof url === 'function' ? url(variables) : url

    if (options?.skipBody) {
      return await api[method](finalUrl).json<TData>()
    }

    return await api[method](finalUrl, { json: variables }).json<TData>()
  }
}
