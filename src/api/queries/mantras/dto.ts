interface CreateMantraRequest {
  mantra: string
}

interface MantraResponse {
  id: number
  userId: number
  mantra: string
  createdAt: string
  updatedAt: string
}

interface DeleteMantraRequest {
  id: number
}
export type { CreateMantraRequest, DeleteMantraRequest, MantraResponse }
