import type { SubscriptionResponse } from './dto'

import type { QueryOptions } from '@/api/helpers'

import { useQuery } from '@tanstack/react-query'

import { createQueryFn } from '@/api/helpers'

export function useGetSubscription(options?: QueryOptions<SubscriptionResponse>) {
  return useQuery({
    queryKey: ['subscriptions', 'me'],
    queryFn: createQueryFn<SubscriptionResponse>('subscriptions/me'),
    staleTime: 30000, // 30 seconds
    retry: false,
    ...options,
  })
}
