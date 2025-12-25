import * as AppleAuthentication from 'expo-apple-authentication'
import { randomUUID } from 'expo-crypto'

import { useState } from 'react'

import { Platform } from 'react-native'

import { useAppleNativeLogin } from '@/api/queries/auth'

import { useAuthSuccess } from '@/hooks/use-auth-success'

import { logError, logWarn } from '@/utils/logger'

function useAppleAuthentication() {
  const { handleAuthSuccess } = useAuthSuccess()
  const { mutateAsync: appleLogin, isPending: appleLoginPending } = useAppleNativeLogin()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      logWarn('Apple Sign In is only available on iOS', { platform: Platform.OS })
      return null
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync()
    if (!isAvailable) {
      logError('Apple Sign In is not available on this device')
      return null
    }

    const rawNonce = randomUUID()

    try {
      setIsAuthenticating(true)
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        // nonce is a random string that is used to prevent replay attacks
        nonce: rawNonce,
      })

      if (!credential.identityToken) {
        logError('No identity token in credential')
        setIsAuthenticating(false)
        return null
      }

      const { accessToken, refreshToken } = await appleLogin({
        idToken: credential.identityToken,
        firstName: credential.fullName?.givenName ?? null,
        lastName: credential.fullName?.familyName ?? null,
        email: credential.email,
        rawNonce,
      })

      await handleAuthSuccess(accessToken, refreshToken)
      setIsAuthenticating(false)

      return credential
    }
    catch (error: any) {
      setIsAuthenticating(false)
      if (error.code === 'ERR_REQUEST_CANCELED') {
        logError('Apple Sign In was canceled by user', error)
      }
      else if (error.code === 'ERR_INVALID_RESPONSE') {
        logError('Apple Sign In: Invalid response from Apple', error)
      }
      else if (error.code === 'ERR_REQUEST_FAILED') {
        logError('Apple Sign In: Request failed - check Apple Developer Console configuration', error)
      }
      else {
        logError('Apple login failed', error, {
          errorCode: error.code,
          errorMessage: error.message,
        })
      }
      return null
    }
  }

  return {
    signInWithApple,
    appleLoginPending: appleLoginPending || isAuthenticating,
    isAuthenticating,
  }
}

export default useAppleAuthentication
