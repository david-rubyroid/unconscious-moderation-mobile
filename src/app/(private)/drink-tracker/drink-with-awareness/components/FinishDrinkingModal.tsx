import LottieView from 'lottie-react-native'
import { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ConfettiAnimation from '@/assets/animations/confetti.json'
import MedalIcon from '@/assets/icons/medal'

import { Button, Modal, ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

const s = styles.screen

interface FinishDrinkingModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function FinishDrinkingModal({
  visible,
  onClose,
  onConfirm,
}: FinishDrinkingModalProps) {
  const { t } = useTranslation('drink-with-awareness')
  const animationRef = useRef<LottieView>(null)

  return (
    <Modal
      variant="gradient"
      visible={visible}
      onClose={onClose}
    >
      <View style={s.modalContent}>
        <ThemedText type="subtitle" style={s.modalTitle}>
          {t('great-job-tracking-your-drinks-tonight')}
        </ThemedText>

        <View style={s.medalContainer}>
          <LottieView
            ref={animationRef}
            source={ConfettiAnimation}
            style={s.confettiContainer}
            loop={false}
            autoPlay
          />

          <MedalIcon />
        </View>

        <ThemedText type="defaultSemiBold" style={s.modalText}>
          <Trans
            i18nKey="drink-with-awareness:great-job-tracking-your-drinks-tonight-description"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={s.modalTextBold} />,
              <ThemedText key="1" type="defaultSemiBold" style={s.modalTextBold} />,
            ]}
          />
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
