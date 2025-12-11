export type DrinkType = 'wine' | 'beer' | 'spirits' | 'cocktails' | 'hard-seltzer-ready-to-drink'

interface CreateDrinkSessionRequest {
  plannedStartTime: string // ISO date string
  maxDrinkCount: number
  drinkType: DrinkType
  budget?: number
}

interface CreateDrinkSessionResponse {
  id: number
  userId: number
  plannedStartTime: string
  maxDrinkCount: number
  drinkType: DrinkType
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
  budget?: number
  actualStartTime?: string
  actualEndTime?: string
  actualDrinkCount?: number
  actualSpending?: number
  drinkType: DrinkType
  status?: 'planned' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  hydrated: boolean
  selfHypnosis: boolean
  mantra?: string
}

export type {
  CreateDrinkSessionRequest,
  CreateDrinkSessionResponse,
  DrinkSessionResponse,
  UpdateDrinkSessionRequest,
  UpdateDrinkSessionResponse,
}
