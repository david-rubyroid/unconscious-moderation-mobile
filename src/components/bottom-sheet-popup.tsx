import type { StyleProp, ViewStyle } from 'react-native'

import { useEffect, useRef, useState } from 'react'
import { Modal, Pressable, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors } from '@/constants/theme'

import { moderateScale, scale } from '@/utils/responsive'

import ThemedGradient from './themed-gradient'

interface BottomSheetPopupProps {
  children: React.ReactNode
  visible: boolean
  onClose?: () => void
  dismissible?: boolean
  radius?: number
  style?: StyleProp<ViewStyle>
  gradientColors?: readonly [string, string, ...string[]]
  useSafeAreaPadding?: boolean
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
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
  onClose,
  dismissible = true,
  radius = 20,
  style,
  gradientColors,
  useSafeAreaPadding = false,
}: BottomSheetPopupProps) {
  const { bottom } = useSafeAreaInsets()
  const translateY = useSharedValue(1000)
  const overlayOpacity = useSharedValue(0)
  const startY = useSharedValue(0)
  const [shouldRender, setShouldRender] = useState(visible)
  const [modalVisible, setModalVisible] = useState(visible)
  const prevVisibleRef = useRef(visible)

  const handleClose = () => {
    if (dismissible) {
      onClose?.()
    }
  }

  const panGesture = Gesture.Pan()
    .enabled(dismissible)
    .onStart(() => {
      if (!dismissible)
        return
      startY.value = translateY.value
    })
    .onUpdate((event) => {
      if (!dismissible)
        return
      const newTranslateY = startY.value + event.translationY
      // Only allow dragging down
      if (newTranslateY > 0) {
        translateY.value = newTranslateY
        // Update overlay opacity based on drag progress
        const progress = Math.min(newTranslateY / 500, 1)
        overlayOpacity.value = 1 - progress
      }
    })
    .onEnd((event) => {
      if (!dismissible)
        return
      const threshold = 100
      if (event.translationY > threshold || event.velocityY > 500) {
        translateY.value = withTiming(1000, {
          duration: 250,
          easing: Easing.in(Easing.ease),
        })
        overlayOpacity.value = withTiming(
          0,
          {
            duration: 250,
            easing: Easing.in(Easing.ease),
          },
          (finished) => {
            if (finished) {
              runOnJS(setModalVisible)(false)
              runOnJS(setShouldRender)(false)
            }
          },
        )
        runOnJS(handleClose)()
      }
      else {
        // Snap back to original position
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        })
        overlayOpacity.value = withTiming(1, {
          duration: 250,
        })
      }
    })

  const defaultGradientColors = [Colors.light.gradientEnd, Colors.light.gradientStart] as const

  const animatedPopupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  const animatedOverlayProps = useAnimatedProps(() => ({
    pointerEvents: overlayOpacity.value > 0 ? ('auto' as const) : ('none' as const),
  }))

  useEffect(() => {
    if (visible !== prevVisibleRef.current) {
      prevVisibleRef.current = visible

      if (visible) {
        setModalVisible(true)
        setShouldRender(true)
        translateY.value = withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        })
        overlayOpacity.value = withTiming(
          1,
          {
            duration: 200,
          },
        )
      }
      else {
        translateY.value = withTiming(1000, {
          duration: 250,
          easing: Easing.in(Easing.ease),
        })
        overlayOpacity.value = withTiming(
          0,
          {
            duration: 250,
            easing: Easing.in(Easing.ease),
          },
          (finished) => {
            if (finished) {
              runOnJS(setModalVisible)(false)
              runOnJS(setShouldRender)(false)
            }
          },
        )
      }
    }
  }, [visible, translateY, overlayOpacity])

  // Don't render if not visible and animation is complete
  if (!modalVisible && !shouldRender) {
    return null
  }

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? handleClose : undefined}
    >
      <Animated.View style={[styles.overlay, animatedOverlayStyle]} animatedProps={animatedOverlayProps}>
        {dismissible && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        )}
      </Animated.View>

      <GestureDetector gesture={panGesture}>
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
                borderTopLeftRadius: moderateScale(radius),
                borderTopRightRadius: moderateScale(radius),
                ...(useSafeAreaPadding && { paddingBottom: bottom }),
              },
              style,
            ]}
            colors={gradientColors || defaultGradientColors}
          >
            {children}
          </ThemedGradient>
        </Animated.View>
      </GestureDetector>
    </Modal>
  )
}

export default BottomSheetPopup
