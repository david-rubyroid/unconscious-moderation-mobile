import type { DrinkType } from '@/api/queries/drink-session/dto'

export interface LogDrinkRequest {
  drinkType: DrinkType
  cost: number
}

export interface DrinkLogResponse {
  id: number
  sessionId: number
  userId: number
  drinkType: DrinkType
  cost: string // decimal as string from backend
  createdAt: string
  updatedAt: string
}
