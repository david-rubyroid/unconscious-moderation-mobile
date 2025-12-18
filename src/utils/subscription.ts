import type { SubscriptionResponse } from '@/api/queries/subscriptions/dto'

/**
 * Checks if a subscription is active
 * Active statuses: trial, active, grace_period
 */
export function isSubscriptionActive(subscription: SubscriptionResponse | null | undefined): boolean {
  if (!subscription) {
    return true
  }

  const activeStatuses: Array<SubscriptionResponse['status']> = [
    'trial',
    'active',
    'grace_period',
  ]

  if (!activeStatuses.includes(subscription.status)) {
    return false
  }

  const now = new Date()

  // Check expiration date for active/grace_period status
  if (subscription.status === 'active' || subscription.status === 'grace_period') {
    if (subscription.expiresAt && new Date(subscription.expiresAt) < now) {
      return false
    }
  }

  // Check trial expiration
  if (subscription.status === 'trial') {
    if (subscription.trialEndsAt && new Date(subscription.trialEndsAt) < now) {
      return false
    }
  }

  // Check grace period expiration
  if (subscription.status === 'grace_period') {
    if (subscription.gracePeriodExpiresAt && new Date(subscription.gracePeriodExpiresAt) < now) {
      return false
    }
  }

  return true
}
