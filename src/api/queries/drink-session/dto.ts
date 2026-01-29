export type DrinkType = 'wine' | 'beer' | 'spirits' | 'cocktails' | 'hard-seltzer-ready-to-drink' | 'other'
export type Currency = 'USD' | 'MXN' | 'COP' | 'EUR'
interface CreateDrinkSessionRequest {
  plannedStartTime: string // ISO date string
  maxDrinkCount: number
  drinkType: DrinkType
  drinkTypeOther?: string
  currency: Currency
  budget?: number
}

interface CreateDrinkSessionResponse {
  id: number
  userId: number
  plannedStartTime: string
  maxDrinkCount: number
  drinkType: DrinkType
  drinkTypeOther?: string
  currency: Currency
  budget?: number
  actualStartTime?: string
  actualEndTime?: string
  actualDrinkCount?: number
  actualSpending?: number
  hydrated?: boolean
  selfHypnosis?: boolean
  mantra?: string
  status?: 'planned' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface DrinkSessionResponse {
  quickWriting?: string
  id: number
  userId: number
  plannedStartTime: string
  maxDrinkCount: number
  drinkType: DrinkType
  drinkTypeOther?: string
  currency: Currency
  budget?: number
  actualStartTime?: string
  actualEndTime?: string
  actualDrinkCount?: number
  actualSpent?: number
  hydrated: boolean
  selfHypnosis?: boolean
  mantra?: string
  status?: 'planned' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface UpdateDrinkSessionRequest {
  quickWriting?: string
  plannedStartTime?: string
  maxDrinkCount?: number
  drinkTypeOther?: string
  currency?: Currency
  budget?: number
  actualStartTime?: string
  endTime?: string
  actualDrinkCount?: number
  actualSpending?: number
  drinkType?: DrinkType
  status?: 'planned' | 'active' | 'completed' | 'cancelled'
  hydrated?: boolean
  selfHypnosis?: boolean
  mantra?: string
}

interface UpdateDrinkSessionResponse {
  id: number
  userId: number
  plannedStartTime: string
  maxDrinkCount: number
  drinkTypeOther?: string
  budget?: number
  actualStartTime?: string
  actualEndTime?: string
  actualDrinkCount?: number
  actualSpending?: number
  drinkType: DrinkType
  currency: Currency
  status?: 'planned' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  hydrated: boolean
  selfHypnosis: boolean
  mantra?: string
}

interface DrinkSessionWithStatsResponse extends DrinkSessionResponse {
  totalDrinks: number
  totalWaterCups: number
}

export type {
  CreateDrinkSessionRequest,
  CreateDrinkSessionResponse,
  DrinkSessionResponse,
  DrinkSessionWithStatsResponse,
  UpdateDrinkSessionRequest,
  UpdateDrinkSessionResponse,
}
