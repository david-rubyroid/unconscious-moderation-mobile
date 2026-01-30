import type { DrinkType } from '@/api/queries/drink-session/dto'

export interface LogDrinkRequest {
  drinkType: DrinkType
  cost: number
  photoS3Key?: string
}

export interface UpdateDrinkLogRequest {
  drinkType?: DrinkType
  cost?: number
  photoS3Key?: string
}

export interface DrinkLogPhoto {
  id: number
  drinkLogId: number
  photoS3Key: string
  photoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface DrinkLogResponse {
  id: number
  sessionId: number
  userId: number
  drinkType: DrinkType
  cost: string // decimal as string from backend
  createdAt: string
  updatedAt: string
  photos: DrinkLogPhoto[]
}

export interface DrinkPhotoResponse {
  id: number
  drinkLogId: number
  photoS3Key: string
  photoUrl: string
  createdAt: string
  updatedAt: string
}

export interface GetUploadUrlResponse {
  uploadUrl: string
  s3Key: string
}

export interface GetUploadUrlParams {
  drinkLogId: number
  contentType?: string
  filename?: string
}

export interface AddDrinkPhotoRequest {
  drinkLogId: number
  s3Key: string
}
