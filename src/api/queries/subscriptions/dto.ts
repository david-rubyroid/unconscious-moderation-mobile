import type {
  SubscriptionCancelReason,
  SubscriptionEnvironment,
  SubscriptionPeriodType,
  SubscriptionStatus,
  SubscriptionStore,
} from '@/api/types'

export interface SubscriptionResponse {
  id: number
  userId: number
  productId: string
  status: SubscriptionStatus
  periodType: SubscriptionPeriodType
  store: SubscriptionStore
  environment: SubscriptionEnvironment
  expiresAt: string | null
  trialEndsAt: string | null
  gracePeriodExpiresAt: string | null
  willRenew: boolean
  cancelReason: SubscriptionCancelReason | null
  expirationReason: SubscriptionCancelReason | null
  createdAt: string
  updatedAt: string
}
