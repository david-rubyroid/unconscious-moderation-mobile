import { Redirect } from 'expo-router'

// Need for android oauth redirect to work after login
function OAuthRedirect() {
  return <Redirect href="/(auth)/sign-in" />
}

export default OAuthRedirect
