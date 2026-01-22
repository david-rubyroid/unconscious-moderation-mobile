import { Pressable, Modal as RNModal, StyleSheet, View } from 'react-native'

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
  const handleClose = () => {
    if (onUserDismiss) {
      onUserDismiss()
    }
    onClose()
  }

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
          <View style={[styles.modal, fullWidth ? styles.fullWidth : {}]}>
            {children}
          </View>
        </Pressable>
      </View>
    </RNModal>
  )
}

export default Modal
