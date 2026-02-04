import type { User } from '@/api/types'

interface UserUpdateResponse extends User {
}

interface UserUpdateRequest extends Partial<User> {
}

interface UserFearsRequest {
  fears: string[]
}

interface UserGiftsRequest {
  gifts: string[]
}

interface UserFearResponse {
  id: number
  userId: number
  fear: string
  createdAt: string
  updatedAt: string
}

interface UserGiftResponse {
  id: number
  userId: number
  gift: string
  createdAt: string
  updatedAt: string
}

interface PushSubscriptionRequest {
  pushToken: string
  platform: 'ios' | 'android'
}

export type {
  PushSubscriptionRequest,
  UserFearResponse,
  UserFearsRequest,
  UserGiftResponse,
  UserGiftsRequest,
  UserUpdateRequest,
  UserUpdateResponse,
}
