import * as AppleAuthentication from 'expo-apple-authentication'
import { randomUUID } from 'expo-crypto'

import { useState } from 'react'

import { Platform } from 'react-native'

import { useAppleNativeLogin } from '@/api/queries/auth'

import { useAuth } from '@/context/auth/use'

import { saveAuthTokens } from '@/utils/auth'

function useAppleAuthentication() {
  const { setHasToken } = useAuth()
  const { mutateAsync: appleLogin, isPending: appleLoginPending } = useAppleNativeLogin()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      console.warn('Apple Sign In is only available on iOS')
      return null
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync()
    if (!isAvailable) {
      console.error('Apple Sign In is not available on this device')
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
        console.error('No identity token in credential')
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

      saveAuthTokens(accessToken, refreshToken)
      setHasToken(true)
      setIsAuthenticating(false)

      return credential
    }
    catch (error: any) {
      setIsAuthenticating(false)
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.error('Apple Sign In was canceled by user')
      }
      else if (error.code === 'ERR_INVALID_RESPONSE') {
        console.error('Apple Sign In: Invalid response from Apple')
      }
      else if (error.code === 'ERR_REQUEST_FAILED') {
        console.error('Apple Sign In: Request failed - check Apple Developer Console configuration')
      }
      else {
        console.error('Apple login failed:', error)
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
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
