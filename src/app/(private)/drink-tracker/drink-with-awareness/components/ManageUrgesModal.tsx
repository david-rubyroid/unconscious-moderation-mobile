import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Button, Modal, ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

const s = styles.screen

interface ManageUrgesModalProps {
  visible: boolean
  onClose: () => void
  onContinue: () => void
}

export function ManageUrgesModal({
  visible,
  onClose,
  onContinue,
}: ManageUrgesModalProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <Modal
      variant="gradient"
      visible={visible}
      onClose={onClose}
    >
      <View style={s.modalContent}>
        <ThemedText type="subtitle" style={s.modalTitle}>
          {t('we-get-it')}
        </ThemedText>

        <ThemedText type="default" style={s.modalText}>
          <Trans
            i18nKey="drink-with-awareness:struggling-with-an-urge"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={s.modalTextBold} />,
              <ThemedText key="1" type="defaultSemiBold" style={s.modalText} />,
              <ThemedText key="2" type="defaultSemiBold" style={s.modalText} />,
            ]}
          />
        </ThemedText>

        <ThemedText type="default" style={s.modalText}>
          <Trans
            i18nKey="drink-with-awareness:first-things-first"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={s.modalTextBold} />,
            ]}
          />
        </ThemedText>

        <ThemedText type="default" style={s.modalText}>
          <Trans
            i18nKey="drink-with-awareness:if-the-urge-feels-overwhelming"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={s.modalTextBold} />,
            ]}
          />
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={s.modalTextBold}>
          {t('you-ve-got-this')}
        </ThemedText>

        <Button
          style={s.modalButton}
          title={t('continue')}
          onPress={onContinue}
        />
      </View>
    </Modal>
  )
}
