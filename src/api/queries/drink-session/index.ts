import type { CreateDrinkSessionRequest, CreateDrinkSessionResponse } from './dto'

import type { MutationOptions } from '@/api/helpers'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createMutationFn } from '@/api/helpers'

export function useCreateDrinkSession(
  options?: MutationOptions<CreateDrinkSessionResponse, Error, CreateDrinkSessionRequest>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMutationFn<CreateDrinkSessionResponse, CreateDrinkSessionRequest>(
      'post',
      'drink-tracker/sessions',
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions'] })
    },
    ...options,
  })
}
