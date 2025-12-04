import { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Colors, withOpacity } from '@/constants/theme'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'

interface ModalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.black, 0.5),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(59),
    width: '95%',
  },
})

function Modal({
  visible,
  onClose,
  children,
}: ModalProps) {
  const opacity = useSharedValue(0)
  const scaleValue = useSharedValue(0.8)
  const [shouldRender, setShouldRender] = useState(visible)

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      })
      scaleValue.value = withTiming(
        1,
        {
          duration: 200,
          easing: Easing.out(Easing.ease),
        },
        () => {
          runOnJS(setShouldRender)(true)
        },
      )
    }
    else {
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.ease),
      })
      scaleValue.value = withTiming(
        0.8,
        {
          duration: 200,
          easing: Easing.in(Easing.ease),
        },
        (finished) => {
          if (finished) {
            runOnJS(setShouldRender)(false)
          }
        },
      )
    }
  }, [visible, opacity, scaleValue])

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: opacity.value > 0 ? ('auto' as const) : ('none' as const),
  }))

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleValue.value }],
  }))

  const handleClose = () => {
    onClose()
  }

  const animatedOverlayProps = useAnimatedProps(() => ({
    pointerEvents: opacity.value > 0 ? ('auto' as const) : ('none' as const),
  }))

  // Don't render if not visible and animation is complete
  if (!visible && !shouldRender) {
    return null
  }

  return (
    <>
      <Animated.View
        style={[styles.overlay, overlayStyle]}
        animatedProps={animatedOverlayProps}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View style={[styles.modal, modalStyle]}>
            {children}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </>
  )
}

export default Modal
