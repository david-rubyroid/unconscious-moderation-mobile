import { QueryClient } from '@tanstack/react-query'

import { QUERY_CONFIG } from './constants'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME, // 5 minutes
      gcTime: QUERY_CONFIG.DEFAULT_GC_TIME, // 10 minutes
      retry: QUERY_CONFIG.DEFAULT_RETRY, // 2 times
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
})
