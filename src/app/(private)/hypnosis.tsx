import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import hypnosisBackgroundImage from '@/assets/images/box-breathing-bg.webp'

import {
  ActivityFeedbackModal,
  AudioPlayer,
  Button,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { Colors } from '@/constants/theme'
import { useActivityFeedback } from '@/hooks/use-activity-feedback'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(30),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  modalDescription: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
})

function HypnosisScreen() {
  const { t } = useTranslation('hypnosis-adventure')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const hasCompletedRef = useRef(false)
  const { day } = useLocalSearchParams()
  const dayNumber = Number(day)

  const { mutateAsync: completeActivity } = useCompleteActivity()
  const {
    isFeedbackModalVisible,
    handleLike,
    handleDislike,
    handleSkip,
    handleBackPress,
  } = useActivityFeedback({
    day: dayNumber,
    activityType: 'hypnosis',
  })

  const handlePlayStart = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      completeActivity({
        day: dayNumber,
        activityType: 'hypnosis',
      }).catch(() => {
        hasCompletedRef.current = false
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  // TODO: Remove this after testing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ScreenContainer backgroundImage={hypnosisBackgroundImage}>
      <Header
        title={t(`day-${day}.title`)}
        onBackPress={handleBackPress}
        whiteTitle
      />

      <AudioPlayer
        textColor={Colors.light.white}
        audioUri={HYPNOSIS_LINKS.hypnosisForAdventure[
          `day${day}` as keyof typeof HYPNOSIS_LINKS.hypnosisForAdventure
        ]}
        onPlayStart={handlePlayStart}
        lockScreenTitle={t(`day-${day}.title`)}
      />

      <ActivityFeedbackModal
        visible={isFeedbackModalVisible}
        activityType="hypnosis"
        onLike={handleLike}
        onDislike={handleDislike}
        onSkip={handleSkip}
      />

      <Modal
        visible={isModalVisible}
        onClose={handleCloseModal}
        variant="gradient"
      >
        <View style={styles.modalContent}>
          <ThemedText
            type="title"
            style={styles.modalTitle}
          >
            {t(`day-${day}.title`)}
          </ThemedText>

          <ThemedText
            type="defaultSemiBold"
            style={styles.modalDescription}
          >
            {t(`day-${day}.description`)}
          </ThemedText>

          <Button
            variant="secondary"
            title={t('got-it')}
            onPress={handleCloseModal}
          />
        </View>
      </Modal>
    </ScreenContainer>
  )
}

export default HypnosisScreen
