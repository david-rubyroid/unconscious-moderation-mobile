import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import WarningIcon from '@/assets/icons/warning'
import { Button, Modal, ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

const s = styles.screen

interface PlannedLimitWarningModalProps {
  visible: boolean
  onClose: () => void
}

export function PlannedLimitWarningModal({
  visible,
  onClose,
}: PlannedLimitWarningModalProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <Modal
      variant="gradient"
      visible={visible}
      onClose={onClose}
    >
      <View style={s.modalContent}>
        <View style={s.modalWarningIconContainer}>
          <WarningIcon />

          <ThemedText
            type="subtitle"
            style={s.modalWarningTitle}
          >
            {t('warning-icon-title')}
          </ThemedText>
        </View>

        <ThemedText type="subtitle" style={s.modalTitle}>
          {t('warning-exceeding-your-planned-limit')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={s.modalText}>
          <Trans
            i18nKey="drink-with-awareness:warning-exceeding-your-planned-limit-description"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={s.modalTextBold} />,
            ]}
          />
        </ThemedText>

        <Button
          style={s.modalButton}
          title={t('ok')}
          onPress={onClose}
        />
      </View>
    </Modal>
  )
}
