import { exchangeCodeAsync, makeRedirectUri } from 'expo-auth-session'
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

import { useCallback, useState } from 'react'

import { Platform } from 'react-native'

import { useGoogleLogin } from '@/api/queries/auth'
import { useAuth } from '@/context/auth/use'
import { saveAuthTokens } from '@/utils/auth'

WebBrowser.maybeCompleteAuthSession()

function useGoogleAuthentication() {
  const { setHasToken } = useAuth()
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
        console.warn('Google sign-in was not successful:', resp?.type)
        setIsAuthenticating(false)
        return null
      }

      if (!request?.codeVerifier) {
        console.error('Missing codeVerifier on request')
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
        console.error('No id_token in token response', tokenResult)
        setIsAuthenticating(false)
        return null
      }

      const { accessToken, refreshToken } = await googleLogin({ idToken })

      saveAuthTokens(accessToken, refreshToken)
      setHasToken(true)
      setIsAuthenticating(false)
    }
    catch (error) {
      console.error('Error during Google sign-in:', error)
      setIsAuthenticating(false)
      return null
    }
  }, [promptAsync, request, googleLogin, setHasToken])

  return {
    signInWithGoogle,
    googleLoginPending: googleLoginPending || isAuthenticating,
    isAuthenticating,
  }
}

export default useGoogleAuthentication
