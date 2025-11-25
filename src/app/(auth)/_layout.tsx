import { Stack } from 'expo-router'

function AuthLayout() {
  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />

      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-reset-password-code" />
      <Stack.Screen name="reset-password" />
    </Stack>
  )
}

export default AuthLayout
