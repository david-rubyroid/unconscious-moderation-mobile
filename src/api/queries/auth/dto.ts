import type { User } from '@/api/types'

interface GoogleAuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface GoogleAuthRequest {
  idToken: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface LoginRequest {
  email: string
  password: string
}

interface RegistrationResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface RegistrationRequest {
  email: string
  password: string
  lastName: string
  firstName: string
}

interface AppleAuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface AppleAuthRequest {
  idToken: string
  email: string | null
  firstName: string | null
  lastName: string | null
  rawNonce: string
}

interface FacebookAuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface FacebookAuthRequest {
  accessToken: string
}

interface ForgotPasswordRequest {
  email: string
}

interface ForgotPasswordResponse {
  message?: string
}

interface VerifyCodeRequest {
  email: string
  code: string
}

interface VerifyCodeResponse {
  message?: string
}

interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

interface ResetPasswordResponse {
  message?: string
}

export type {
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
  VerifyCodeResponse
}

