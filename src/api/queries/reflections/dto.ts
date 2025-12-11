export interface CreateReflectionRequest {
  sessionId: number
  feeling?: string
  learnings?: string
}

export interface ReflectionResponse {
  id: number
  sessionId: number
  userId: number
  feeling?: string
  learnings?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateReflectionRequest {
  feeling?: string
  learnings?: string
}
