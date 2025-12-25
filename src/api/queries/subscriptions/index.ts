import type { SubscriptionResponse } from './dto'

import type { QueryOptions } from '@/api/helpers'

import { useQuery } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createQueryFn } from '@/api/helpers'

export function useGetSubscription(options?: QueryOptions<SubscriptionResponse>) {
  return useQuery({
    queryKey: ['subscriptions', 'me'],
    queryFn: createQueryFn<SubscriptionResponse>('subscriptions/me'),
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}
