import { useEffect, useRef, useState } from 'react'
import { Pressable, Modal as RNModal, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
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
  fullWidth?: boolean
  onUserDismiss?: () => void
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: withOpacity(Colors.light.black, 0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(59),
    width: '95%',
  },
  fullWidth: {
    minWidth: '95%',
  },
})

function Modal({
  visible,
  onClose,
  children,
  fullWidth = false,
  onUserDismiss,
}: ModalProps) {
  const opacity = useSharedValue(0)
  const scaleValue = useSharedValue(0.8)
  const [shouldRender, setShouldRender] = useState(visible)
  const [isClosing, setIsClosing] = useState(false)
  const prevVisibleRef = useRef(visible)

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleValue.value }],
  }))

  const handleClose = () => {
    // Call onUserDismiss only when user explicitly closes the modal
    // (not when visible changes programmatically)
    if (onUserDismiss) {
      onUserDismiss()
    }
    setIsClosing(true)
  }

  // Reset isClosing when modal becomes visible (transition from false to true)
  // Set isClosing when modal becomes invisible (transition from true to false)
  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      setIsClosing(false)
    }

    if (!visible && prevVisibleRef.current) {
      // When visible changes from true to false, start closing animation
      setIsClosing(true)
    }
    prevVisibleRef.current = visible
  }, [visible])

  useEffect(() => {
    if (visible && !isClosing) {
      // Opening animation
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
    else if (!visible || isClosing) {
      // Closing animation
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
            runOnJS(setIsClosing)(false)
            runOnJS(onClose)()
          }
        },
      )
    }
  }, [visible, isClosing, opacity, scaleValue, onClose])

  // Don't render if not visible, not closing, and animation is complete
  if (!visible && !isClosing && !shouldRender) {
    return null
  }

  return (
    <RNModal
      visible={visible || isClosing}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View style={[styles.modal, modalStyle, fullWidth ? styles.fullWidth : {}]}>
            {children}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </RNModal>
  )
}

export default Modal
