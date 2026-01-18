export const FEELINGS = [
  'Proud',
  'Calm',
  'Grateful',
  'Anxious',
  'Stressed',
  'Sad',
  'Irritable',
  'Lonely',
  'Overwhelmed',
]

export interface CreateReflectionRequest {
  sessionId: number
  feeling?: typeof FEELINGS[number]
  learnings?: string
}

export interface ReflectionResponse {
  id: number
  sessionId: number
  userId: number
  feeling?: typeof FEELINGS[number]
  learnings?: string
  hydrated?: boolean
  postSessionHypnosis?: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateReflectionRequest {
  feeling?: typeof FEELINGS[number]
  learnings?: string
  hydrated?: boolean
  postSessionHypnosis?: boolean
}
