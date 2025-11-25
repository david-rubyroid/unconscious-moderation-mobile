export type UserGender = 'male' | 'female' | 'non-specified'
export type UserAge = '18-29' | '30-39' | '40-49' | '50-59' | 'more-than-60'
export type UserReferralSource = 'referral' | 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'mind-over-glass-podcast' | 'other-podcast' | 'online-article' | 'online-search' | 'advertisement' | 'other'
export interface Gift {
  gift: string
}

export interface Fear {
  fear: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  gender: UserGender
  age: UserAge
  referralSource: UserReferralSource
  gifts?: Gift[]
  fears?: Fear[]
  medicalQuestionsCompletedAt: Date | null
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'billing_issue' | 'grace_period'
export type SubscriptionPeriodType = 'trial' | 'intro' | 'normal' | 'promotional' | 'prepaid'
export type SubscriptionStore = 'app_store' | 'play_store'
export type SubscriptionEnvironment = 'sandbox' | 'production'
export type SubscriptionCancelReason = 'unsubscribe' | 'billing_error' | 'developer_initiated' | 'price_increase' | 'customer_support' | 'unknown'

export interface Subscription {
  id: number
  userId: number
  productId: string
  status: SubscriptionStatus
  periodType: SubscriptionPeriodType
  store: SubscriptionStore
  environment: SubscriptionEnvironment
  expiresAt: Date | null
  trialEndsAt: Date | null
  gracePeriodExpiresAt: Date | null
  willRenew: boolean
  cancelReason: SubscriptionCancelReason | null
  expirationReason: SubscriptionCancelReason | null
  createdAt: Date
  updatedAt: Date
}
