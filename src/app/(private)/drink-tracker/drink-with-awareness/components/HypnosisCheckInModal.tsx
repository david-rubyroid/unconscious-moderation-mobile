import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Button, Modal, ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

const s = styles.screen

interface HypnosisCheckInModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function HypnosisCheckInModal({
  visible,
  onClose,
  onConfirm,
}: HypnosisCheckInModalProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <Modal
      variant="gradient"
      visible={visible}
      onClose={onClose}
    >
      <View style={s.modalContent}>
        <ThemedText type="subtitle" style={s.modalTitle}>
          {t('time-for-your-hypnosis')}
        </ThemedText>

        <ThemedText type="default" style={s.modalText}>
          {t('time-for-your-hypnosis-description')}
        </ThemedText>

        <Button
          style={s.modalButton}
          title={t('ok')}
          onPress={onConfirm}
        />
      </View>
    </Modal>
  )
}
