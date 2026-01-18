import type { AddDrinkPhotoRequest, DrinkPhotoResponse, GetUploadUrlParams, GetUploadUrlResponse } from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import { useMutation, useQuery } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

export function useGetDrinkPhotos(
  sessionId: number | undefined,
  drinkId: number | undefined,
  options?: QueryOptions<DrinkPhotoResponse[]>,
) {
  return useQuery({
    queryKey: ['drink-tracker', 'sessions', sessionId, 'drinks', drinkId, 'photos'],
    queryFn: createQueryFn<DrinkPhotoResponse[]>(
      `drink-tracker/sessions/${sessionId}/drinks/${drinkId}/photos`,
    ),
    enabled: !!sessionId && !!drinkId,
    staleTime: QUERY_SHORT_CACHE.STALE_TIME,
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useGetUploadUrl(
  sessionId: number | undefined,
  options?: MutationOptions<GetUploadUrlResponse, Error, GetUploadUrlParams>,
) {
  return useMutation({
    ...options,
    mutationFn: createMutationFn<GetUploadUrlResponse, GetUploadUrlParams>(
      'post',
      `drink-tracker/sessions/${sessionId}/drinks/photos/upload`,
    ),
  })
}

export function useAddDrinkPhoto(
  sessionId: number | undefined,
  options?: MutationOptions<DrinkPhotoResponse, Error, AddDrinkPhotoRequest>,
) {
  return useMutation({
    ...options,
    mutationFn: createMutationFn<DrinkPhotoResponse, AddDrinkPhotoRequest>(
      'post',
      `drink-tracker/sessions/${sessionId}/drinks/photos`,
    ),
  })
}

export function useDeleteDrinkPhoto(
  sessionId: number | undefined,
  drinkId: number | undefined,
  photoId: number | undefined,
  options?: MutationOptions<void, Error, void>,
) {
  return useMutation({
    ...options,
    mutationFn: createMutationFn<void, void>(
      'delete',
      `drink-tracker/sessions/${sessionId}/drinks/${drinkId}/photos/${photoId}`,
      { skipBody: true },
    ),
  })
}
