import { useEffect } from 'react'

import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export function useVideoFade(isLoading: boolean, duration: number = 500) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (!isLoading) {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    }
    else {
      opacity.value = 0
    }
  }, [isLoading, opacity, duration])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return animatedStyle
}
