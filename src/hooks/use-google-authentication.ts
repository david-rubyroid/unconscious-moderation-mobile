import { exchangeCodeAsync, makeRedirectUri } from 'expo-auth-session'
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

import { useCallback, useState } from 'react'

import { Platform } from 'react-native'

import { useGoogleLogin } from '@/api/queries/auth'

import { useAuthSuccess } from '@/hooks/use-auth-success'

import { logError, logWarn } from '@/utils/logger'

WebBrowser.maybeCompleteAuthSession()

function useGoogleAuthentication() {
  const { handleAuthSuccess } = useAuthSuccess()
  const { mutateAsync: googleLogin, isPending: googleLoginPending } = useGoogleLogin()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [request, _, promptAsync] = useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID ?? '',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID ?? '',
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
  })

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsAuthenticating(true)
      const resp = await promptAsync()

      if (resp?.type !== 'success' || !resp.params?.code) {
        logWarn('Google sign-in was not successful', { responseType: resp?.type })
        setIsAuthenticating(false)
        return null
      }

      if (!request?.codeVerifier) {
        logError('Missing codeVerifier on request')
        setIsAuthenticating(false)
        return null
      }

      const tokenResult = await exchangeCodeAsync(
        {
          clientId: Platform.OS === 'ios'
            ? process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID ?? ''
            : process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID ?? '',
          code: resp.params.code,
          redirectUri: makeRedirectUri({
            native: request.redirectUri,
          }),
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        },
      )

      const idToken = tokenResult.idToken ?? null

      if (!idToken) {
        logError('No id_token in token response', undefined, { tokenResult })
        setIsAuthenticating(false)
        return null
      }

      const { accessToken, refreshToken } = await googleLogin({ idToken })

      await handleAuthSuccess(accessToken, refreshToken)
      setIsAuthenticating(false)
    }
    catch (error) {
      logError('Error during Google sign-in', error)
      setIsAuthenticating(false)
      return null
    }
  }, [promptAsync, request, googleLogin, handleAuthSuccess])

  return {
    signInWithGoogle,
    googleLoginPending: googleLoginPending || isAuthenticating,
    isAuthenticating,
  }
}

export default useGoogleAuthentication
