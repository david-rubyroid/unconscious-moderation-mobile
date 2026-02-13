import type {
  AppleAuthRequest,
  AppleAuthResponse,
  FacebookAuthRequest,
  FacebookAuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleAuthRequest,
  GoogleAuthResponse,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from './dto'

import type { MutationOptions, QueryOptions } from '@/api/helpers'

import type { User } from '@/api/types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_SHORT_CACHE } from '@/api/constants'

import { createMutationFn, createQueryFn } from '@/api/helpers'

import { useAuth } from '@/context/auth/use'

import { logoutOneSignal } from '@/services/onesignal'

import { AsyncStorageKey, removeItem } from '@/utils/async-storage'
import { removeAuthTokens } from '@/utils/auth'

export function useGetCurrentUser(options?: QueryOptions<User>) {
  return useQuery({
    queryKey: ['auth', 'current'],
    queryFn: createQueryFn<User>('auth/current'),
    retry: QUERY_SHORT_CACHE.RETRY,
    ...options,
  })
}

export function useLogin(options?: MutationOptions) {
  return useMutation({
    mutationFn: createMutationFn<LoginResponse, LoginRequest>('post', 'auth/login'),
    ...options,
  })
}

export function useGoogleLogin(options?: MutationOptions) {
  return useMutation({
    mutationFn: createMutationFn<GoogleAuthResponse, GoogleAuthRequest>('post', 'auth/google'),
    ...options,
  })
}

export function useFacebookLogin(options?: MutationOptions<FacebookAuthResponse, Error, FacebookAuthRequest>) {
  return useMutation({
    mutationFn: createMutationFn<FacebookAuthResponse, FacebookAuthRequest>('post', 'auth/facebook'),
    ...options,
  })
}

export function useAppleNativeLogin(options?: MutationOptions<AppleAuthResponse, Error, AppleAuthRequest>) {
  return useMutation({
    mutationFn: createMutationFn<AppleAuthResponse, AppleAuthRequest>('post', 'auth/native-apple'),
    ...options,
  })
}

export function useAppleLogin(options?: MutationOptions<AppleAuthResponse, Error, AppleAuthRequest>) {
  return useAppleNativeLogin(options)
}

export function useRegistration(options?: MutationOptions) {
  return useMutation({
    mutationFn: createMutationFn<RegistrationResponse, RegistrationRequest>('post', 'auth/register'),
    ...options,
  })
}

export function useLogout(options?: MutationOptions) {
  const queryClient = useQueryClient()
  const { setHasToken } = useAuth()

  return useMutation({
    mutationFn: createMutationFn<void, void>('post', 'auth/logout'),
    onSuccess: async () => {
      logoutOneSignal()
      await removeAuthTokens()
      setHasToken(false)

      queryClient.clear()
    },
    ...options,
  })
}

export function useForgotPassword(options?: MutationOptions<ForgotPasswordResponse, Error, ForgotPasswordRequest>) {
  return useMutation({
    mutationFn: createMutationFn<ForgotPasswordResponse, ForgotPasswordRequest>('post', 'auth/forgot-password'),
    ...options,
  })
}

export function useVerifyCode(options?: MutationOptions<VerifyCodeResponse, Error, VerifyCodeRequest>) {
  return useMutation({
    mutationFn: createMutationFn<VerifyCodeResponse, VerifyCodeRequest>('post', 'auth/verify-code'),
    ...options,
  })
}

export function useResetPassword(options?: MutationOptions<ResetPasswordResponse, Error, ResetPasswordRequest>) {
  return useMutation({
    mutationFn: createMutationFn<ResetPasswordResponse, ResetPasswordRequest>('post', 'auth/reset-password'),
    ...options,
  })
}

export function useDeleteAccount(options?: MutationOptions) {
  const queryClient = useQueryClient()
  const { setHasToken } = useAuth()

  return useMutation({
    mutationFn: createMutationFn<void, void>('delete', 'users/me'),
    onSuccess: async () => {
      logoutOneSignal()
      await removeAuthTokens()
      await Promise.all([
        removeItem(AsyncStorageKey.DAY_ONE_REMINDER_REQUESTED),
        removeItem(AsyncStorageKey.FIRST_TIME_DRINK_TRACKER_POPUPS),
        removeItem(AsyncStorageKey.FIRST_TIME_ACTION_DAY_POPUP),
        removeItem(AsyncStorageKey.FIRST_TIME_CONNECTION_DAY_POPUP),
      ])
      setHasToken(false)
      queryClient.clear()
    },
    ...options,
  })
}
