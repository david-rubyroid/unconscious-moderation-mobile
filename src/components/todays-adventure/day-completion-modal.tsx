import LottieView from 'lottie-react-native'
import { useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'

import confettiAnimation from '@/assets/animations/confetti.json'
import MedalIcon from '@/assets/images/daily-activity-medal.png'

import { Colors } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import Modal from '../modal'
import ThemedText from '../themed-text'

interface DayCompletionModalProps {
  visible: boolean
  day: number
  onClose: () => void
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(8),
  },
  medalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
  },
  message: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  messageBold: {
    fontWeight: '700',
    color: Colors.light.primary4,
  },
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.5 }],
  },
})

function DayCompletionModal({ visible, day, onClose }: DayCompletionModalProps) {
  const { t } = useTranslation('daily-complete-messages')
  const animationRef = useRef<LottieView>(null)

  // Determine which message key to use based on day
  const specialDays = [1, 5, 10, 15, 20, 25, 30]
  const messageKey = specialDays.includes(day) ? `modal.day-${day}` : 'modal.another-day'

  const title = t(`${messageKey}.title`)

  // Trigger confetti animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        animationRef.current?.play()
      }, 100)

      return () => clearTimeout(timer)
    }
    else {
      // Reset animation when modal closes
      animationRef.current?.reset()
    }
  }, [visible])

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <LottieView
          ref={animationRef}
          source={confettiAnimation}
          style={styles.confettiContainer}
          loop={false}
          autoPlay={false}
        />

        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>

        <View style={styles.medalContainer}>
          <Image source={MedalIcon} style={{ width: scale(147), height: scale(135) }} />
        </View>

        <ThemedText type="default" style={styles.message}>
          <Trans
            i18nKey={`daily-complete-messages:${messageKey}.message`}
            components={[
              <ThemedText key="0" type="default" style={styles.messageBold} />,
            ]}
          />
        </ThemedText>
      </View>
    </Modal>
  )
}

export default DayCompletionModal
