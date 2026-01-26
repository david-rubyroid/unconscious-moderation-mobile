import {
  ImageBackground,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  View,
} from 'react-native'

import modalBgImage from '@/assets/images/modal-bg.png'

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
    paddingVertical: verticalScale(59),
  },
  defaultBackground: {
    backgroundColor: Colors.light.tertiaryBackground,
  },
  fullWidth: {
    minWidth: '95%',
  },
  gradientContainer: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(59),
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
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Pressable onPress={e => e.stopPropagation()}>
          <View
            style={[
              styles.modal,
              !isGradient && styles.defaultBackground,
              !isGradient && styles.modalWithPadding,
              fullWidth && styles.fullWidth,
            ]}
          >
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
        </Pressable>
      </View>
    </RNModal>
  )
}

export default Modal
