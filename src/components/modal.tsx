import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import modalBgImage from '@/assets/images/modal-bg.webp'

import { Colors, withOpacity } from '@/constants/theme'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'

interface ModalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  fullWidth?: boolean
  onUserDismiss?: () => void
  variant?: 'default' | 'gradient'
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: withOpacity(Colors.light.black, 0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: moderateScale(20),
    width: '95%',
    overflow: 'hidden',
  },
  modalWithPadding: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(36),
  },
  defaultBackground: {
    backgroundColor: Colors.light.tertiaryBackground,
  },
  fullWidth: {
    minWidth: '95%',
  },
  gradientContainer: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(36),
  },
})

function Modal({
  visible,
  onClose,
  children,
  fullWidth = false,
  onUserDismiss,
  variant = 'default',
}: ModalProps) {
  const handleClose = () => {
    if (onUserDismiss) {
      onUserDismiss()
    }
    onClose()
  }

  const isGradient = variant === 'gradient'

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View
          style={[
            styles.modal,
            !isGradient && styles.defaultBackground,
            !isGradient && styles.modalWithPadding,
            fullWidth && styles.fullWidth,
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {isGradient
                ? (
                    <ImageBackground
                      source={modalBgImage}
                      style={styles.gradientContainer}
                      resizeMode="cover"
                    >
                      {children}
                    </ImageBackground>
                  )
                : (
                    children
                  )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  )
}

export default Modal
