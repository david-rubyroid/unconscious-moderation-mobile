export interface LogWaterRequest {
  cups: number
}

export interface WaterLogResponse {
  id: number
  sessionId: number
  userId: number
  cups: number
  createdAt: string
  updatedAt: string
}
