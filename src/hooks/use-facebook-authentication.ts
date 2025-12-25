import { useCallback, useState } from 'react'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

import { useFacebookLogin } from '@/api/queries/auth'

import { useAuthSuccess } from '@/hooks/use-auth-success'

import { logError } from '@/utils/logger'

function useFacebookAuthentication() {
  const { handleAuthSuccess } = useAuthSuccess()
  const { mutateAsync: facebookLogin, isPending: facebookLoginPending } = useFacebookLogin()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleFacebookToken = useCallback(async (accessToken: string) => {
    try {
      const { accessToken: jwtAccessToken, refreshToken } = await facebookLogin({ accessToken })
      await handleAuthSuccess(jwtAccessToken, refreshToken)
      setIsAuthenticating(false)
    }
    catch (error) {
      logError('Error during Facebook login', error)
      setIsAuthenticating(false)
    }
  }, [facebookLogin, handleAuthSuccess])

  const signInWithFacebook = useCallback(async () => {
    try {
      setIsAuthenticating(true)

      // Check if LoginManager is available
      if (!LoginManager) {
        logError('[Facebook] LoginManager is not available')
        setIsAuthenticating(false)
        return
      }

      const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])

      if (result.isCancelled) {
        setIsAuthenticating(false)
        return
      }

      // Check if login was successful
      if (!result.grantedPermissions || result.grantedPermissions.length === 0) {
        logError('[Facebook] No permissions granted')
        setIsAuthenticating(false)
        return
      }

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken()

      if (!data) {
        logError('[Facebook] No access token available')
        setIsAuthenticating(false)
        return
      }

      const accessToken = data.accessToken

      if (!accessToken) {
        logError('[Facebook] Access token is empty')
        setIsAuthenticating(false)
        return
      }

      // Send token to backend
      await handleFacebookToken(accessToken)
    }
    catch (error: any) {
      logError('[Facebook] Error during Facebook sign-in', error)
      setIsAuthenticating(false)
    }
  }, [handleFacebookToken])

  return {
    signInWithFacebook,
    facebookLoginPending: facebookLoginPending || isAuthenticating,
  }
}

export default useFacebookAuthentication
