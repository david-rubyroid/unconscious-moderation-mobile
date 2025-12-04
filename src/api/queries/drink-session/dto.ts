interface CreateDrinkSessionRequest {
  plannedStartTime: string // ISO date string
  maxDrinkCount: number
  budget?: number
}

interface CreateDrinkSessionResponse {
  id: number
  userId: number
  plannedStartTime: string
  maxDrinkCount: number
  budget?: number
}

export type { CreateDrinkSessionRequest, CreateDrinkSessionResponse }
