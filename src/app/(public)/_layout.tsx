import { Stack } from 'expo-router'

import { useEffect } from 'react'

import { setFirstLaunch } from '@/utils/auth'

function PublicLayout() {
  useEffect(() => {
    setFirstLaunch()
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="intro" />
    </Stack>
  )
}

export default PublicLayout
