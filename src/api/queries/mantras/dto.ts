interface CreateMantraRequest {
  mantras: string[]
}

interface MantraResponse {
  id: number
  userId: number
  mantra: string
  createdAt: string
  updatedAt: string
}

export type { CreateMantraRequest, MantraResponse }
