import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'

import {
  useCompleteActivity,
  useGetActivityFeedback,
  useSubmitActivityFeedback,
} from '@/api/queries/daily-activities'

import DislikeIcon from '@/assets/icons/dislike'
import LikeIcon from '@/assets/icons/like'
import hypnosisBackgroundImage from '@/assets/images/box-breathing-bg.jpg'
import doneImage from '@/assets/images/end-of-activity/hypnosis-done.png'

import {
  AudioPlayer,
  Button,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(30),
  },
  doneModalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(23),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  modalDescription: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  doneImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.white,
    width: scale(127),
    height: scale(127),
    borderRadius: '50%',
  },
  doneImage: {
    width: scale(90),
    height: scale(90),
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: scale(16),
  },
  button: {
    width: 96,
  },
})

function HypnosisScreen() {
  const { t } = useTranslation('hypnosis-adventure')
  const router = useRouter()

  const [isModalVisible, setIsModalVisible] = useState(true)
  const [isExitFeedbackModalVisible, setIsExitFeedbackModalVisible] = useState(false)

  const { day } = useLocalSearchParams()
  const hasCompletedRef = useRef(false)
  const dayNumber = Number(day)

  const { mutateAsync: completeActivity } = useCompleteActivity()
  const { mutate: submitFeedback } = useSubmitActivityFeedback()
  const { data: activityFeedbackList } = useGetActivityFeedback(dayNumber)

  const hasFeedbackForHypnosis = activityFeedbackList?.some(
    f => f.activity_type === 'hypnosis',
  ) ?? false

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
  const closeExitFeedbackAndBack = () => {
    setIsExitFeedbackModalVisible(false)
    router.back()
  }
  const handleExitFeedbackLike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'hypnosis',
      isHelpful: true,
    })
    closeExitFeedbackAndBack()
  }
  const handleExitFeedbackDislike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'hypnosis',
      isHelpful: false,
    })
    closeExitFeedbackAndBack()
  }
  const handleBackPress = () => {
    if (hasFeedbackForHypnosis) {
      router.back()
    }
    else {
      setIsExitFeedbackModalVisible(true)
    }
  }

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

      <Modal
        visible={isExitFeedbackModalVisible}
        onClose={closeExitFeedbackAndBack}
        variant="gradient"
      >
        <View style={styles.doneModalContent}>
          <ThemedText
            type="subtitle"
            style={styles.modalTitle}
          >
            {t('hypnosis-adventure-done-modal-title')}
          </ThemedText>

          <View style={styles.doneImageContainer}>
            <Image
              style={styles.doneImage}
              source={doneImage}
            />
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={styles.modalDescription}
          >
            {t('hypnosis-adventure-done-modal-description')}
          </ThemedText>

          <ThemedText
            type="defaultSemiBold"
            style={styles.modalDescription}
          >
            {t('was-this-helpful')}
          </ThemedText>

          <View style={styles.buttonsContainer}>
            <Button
              style={styles.button}
              onPress={handleExitFeedbackLike}
              icon={<LikeIcon />}
            />

            <Button
              style={styles.button}
              onPress={handleExitFeedbackDislike}
              icon={<DislikeIcon />}
            />
          </View>
        </View>
      </Modal>

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
