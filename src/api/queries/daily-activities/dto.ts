export type ActivityType = 'hypnosis' | 'journaling' | 'reading'

export interface ActivityCompletion {
  type: ActivityType
  isCompleted: boolean
  completedAt: string | null
}

export interface DayResponse {
  dayNumber: number
  isUnlocked: boolean
  allActivitiesCompleted: boolean
  activities: ActivityCompletion[]
}

export interface DailyActivitiesResponse {
  unlockedDaysCount: number
  days: DayResponse[]
}

export interface DailyActivityProgress {
  id: number
  user_id: number
  day_number: number
  activity_type: ActivityType
  completed_at: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SaveJournalingAnswerRequest {
  day: number
  stepNumber: number
  answerText: string
}

export interface DailyJournalingActivityAnswer {
  id: number
  user_id: number
  day_number: number
  step_number: number
  answer_text: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
