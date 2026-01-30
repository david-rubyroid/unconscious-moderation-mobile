import LottieView from 'lottie-react-native'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ConfettiAnimation from '@/assets/animations/confetti.json'
import DropIcon from '@/assets/icons/drop'

import { Button, Modal, ThemedText } from '@/components'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'

import { styles } from '../drink-with-awareness.styles'

const s = styles.screen

interface WaterLogSuccessModalProps {
  visible: boolean
  onClose: () => void
}

export function WaterLogSuccessModal({
  visible,
  onClose,
}: WaterLogSuccessModalProps) {
  const { t } = useTranslation('drink-with-awareness')
  const animationRef = useRef<LottieView>(null)

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="gradient"
    >
      <View style={s.waterLogSuccessContent}>
        <View style={s.medalContainer}>
          <LottieView
            ref={animationRef}
            source={ConfettiAnimation}
            style={s.confettiContainer}
            loop={false}
            autoPlay
          />

          <View style={s.waterLogSuccessIconCircle}>
            <DropIcon
              width={scale(36)}
              height={scale(48)}
              color={Colors.light.primary4}
            />
          </View>
        </View>

        <ThemedText type="subtitle" style={s.waterLogSuccessTitle}>
          {t('water-log-success-title')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={s.waterLogSuccessDescription}>
          {t('water-log-success-description')}
        </ThemedText>

        <Button
          title={t('ok')}
          onPress={onClose}
        />
      </View>
    </Modal>
  )
}
