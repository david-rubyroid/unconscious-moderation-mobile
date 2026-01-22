import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'

import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { Colors, withOpacity } from '@/constants/theme'

interface SkeletonProps {
  width?: DimensionValue
  height?: DimensionValue
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: withOpacity(Colors.light.primary4, 0.1),
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: withOpacity(Colors.light.white, 0.4),
  },
})

function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 20,
  style,
}: SkeletonProps) {
  const shimmerTranslateX = useSharedValue(-200)

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(400, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    )
  }, [shimmerTranslateX])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerTranslateX.value }],
    }
  })

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, { borderRadius }, animatedStyle]} />
    </View>
  )
}

export default Skeleton
