export type Currency = 'USD' | 'MXN' | 'COP' | 'EUR'

// DrinkType still used for drink-log (individual drinks during session)
export type DrinkType = 'wine' | 'beer' | 'spirits' | 'cocktails' | 'hard-seltzer-ready-to-drink' | 'other'

export type WhereLocation
  = | 'home'
    | 'bar_restaurant'
    | 'event_party'
    | 'someone_elses_place'
    | 'outdoors'
    | 'hotel_travel'

export type WhoWith
  = | 'alone'
    | 'partner_date'
    | 'friends_family'
    | 'coworkers_work_event'
    | 'mixed_group'

export type WhyReason
  = | 'celebrating'
    | 'strong_emotion'
    | 'bored'
    | 'social_pressure'
    | 'habit_routine'

interface CreateDrinkSessionRequest {
  plannedStartTime: string // ISO date string
  maxDrinkCount: number
  currency: Currency
  budget?: number
  whereLocation?: WhereLocation
  whoWith?: WhoWith
  whyReason?: WhyReason
}

interface CreateDrinkSessionResponse {
  id: number
  userId: number
  plannedStartTime: string
  maxDrinkCount: number
  currency: Currency
  budget?: number
  whereLocation?: WhereLocation
  whoWith?: WhoWith
  whyReason?: WhyReason
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
  currency: Currency
  budget?: number
  whereLocation?: WhereLocation
  whoWith?: WhoWith
  whyReason?: WhyReason
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
  currency?: Currency
  budget?: number
  whereLocation?: WhereLocation
  whoWith?: WhoWith
  whyReason?: WhyReason
  actualStartTime?: string
  endTime?: string
  actualDrinkCount?: number
  actualSpending?: number
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
  whereLocation?: WhereLocation
  whoWith?: WhoWith
  whyReason?: WhyReason
  actualStartTime?: string
  actualEndTime?: string
  actualDrinkCount?: number
  actualSpending?: number
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
