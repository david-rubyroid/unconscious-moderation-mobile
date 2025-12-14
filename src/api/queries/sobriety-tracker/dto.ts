export type TrophyType = '24h' | '3d' | '7d' | '14d' | '21d' | '30d' | '60d' | '90d'

// Request DTOs
export interface StartStreakRequest {
  startedAt?: string // ISO date string
}

export interface ResetStreakRequest {
  reason: string
  feelings: string
  supportNeeded: string
  resetAt?: string // ISO date string
}

export interface MarkTrophiesAsShownRequest {
  ids: number[]
}

// Response DTOs
export interface SobrietyStreakResponse {
  id: number
  user_id: number
  started_at: string
  ended_at: string | null
  is_active: boolean
  duration_days: number | null
  created_at: string
  updated_at: string
}

export interface SobrietyTrophyResponse {
  id: number
  user_id: number
  trophy_type: TrophyType
  earned_at: string
  shown_at: string | null
  streak_id: number
  created_at: string
  updated_at: string
}

export interface CurrentStreakResponse {
  streak: SobrietyStreakResponse | null
  durationHours: number
  durationDays: number
  nextTrophy: TrophyType | null
  hoursToNextTrophy: number | null
  pendingTrophies: SobrietyTrophyResponse[]
}

export interface SobrietyResetResponse {
  id: number
  user_id: number
  streak_id: number
  reset_at: string
  reason: string
  feelings: string
  support_needed: string
  created_at: string
  updated_at: string
}

export interface StatsResponse {
  currentStreak: {
    startedAt: string | null
    durationDays: number
    durationHours: number
  }
  longestStreak: {
    durationDays: number
    startedAt: string
    endedAt: string | null
  } | null
  totalResets: number
}

export interface ResetStreakResponse {
  endedStreak: SobrietyStreakResponse
  reset: SobrietyResetResponse
}
