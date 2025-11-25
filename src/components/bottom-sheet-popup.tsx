import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors } from '@/constants/theme'
import { moderateScale, scale } from '@/utils/responsive'
import ThemedGradient from './themed-gradient'

interface BottomSheetPopupProps {
  children: React.ReactNode
  visible: boolean
  radius?: number
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: scale(32),
  },
})

function BottomSheetPopup({
  children,
  visible,
  radius = 20,
}: BottomSheetPopupProps) {
  const { bottom } = useSafeAreaInsets()
  const translateY = useSharedValue(1000)

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    }
    else {
      translateY.value = withTiming(1000, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      })
    }
  }, [visible, translateY])

  const animatedPopupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  if (!visible) {
    return null
  }

  return (
    <Animated.View
      style={[
        animatedPopupStyle,
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
      ]}
    >
      <ThemedGradient
        style={[
          styles.popup,
          {
            paddingBottom: bottom,
            borderTopLeftRadius: moderateScale(radius),
            borderTopRightRadius: moderateScale(radius),
          },
        ]}
        colors={[Colors.light.gradientEnd, Colors.light.gradientStart]}
      >
        {children}
      </ThemedGradient>
    </Animated.View>
  )
}

export default BottomSheetPopup
