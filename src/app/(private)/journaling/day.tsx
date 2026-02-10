import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'

import { Image, StyleSheet, TextInput, View } from 'react-native'

import {
  useCompleteActivity,
  useGetActivityFeedback,
  useGetJournalingAnswers,
  useSaveJournalingAnswer,
  useSubmitActivityFeedback,
} from '@/api/queries/daily-activities'

import DislikeIcon from '@/assets/icons/dislike'
import LikeIcon from '@/assets/icons/like'
import journalingDoneImage from '@/assets/images/end-of-activity/journaling-done.webp'

import { Button, Header, Modal, ScreenContainer, StepIndicator, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.light.primary,
    marginBottom: scale(17),
  },
  promptsContainer: {
    padding: 12,
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    marginBottom: 17,
  },
  promptDescription: {
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 10,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: withOpacity(Colors.light.black, 0.2),
    borderRadius: 8,
    padding: 12,
    height: 300,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: scale(10),
  },
  button: {
    flex: 1,
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
    borderRadius: 9999,
  },
  doneImage: {
    width: scale(90),
    height: scale(90),
  },
  feedbackButtonsContainer: {
    flexDirection: 'row',
    gap: scale(16),
  },
  feedbackButton: {
    width: 96,
  },
})

function JournalingDayScreen() {
  const { back } = useRouter()
  const [answer, setAnswer] = useState<string>('')
  const [activeStep, setActiveStep] = useState<number>(1)
  const [isDoneModalVisible, setIsDoneModalVisible] = useState(false)

  const { day } = useLocalSearchParams()
  const { t } = useTranslation('journaling')
  const dayNumber = Number(day)

  const { mutateAsync: saveJournalingAnswer } = useSaveJournalingAnswer()
  const { mutateAsync: completeActivity } = useCompleteActivity()
  const { mutate: submitFeedback } = useSubmitActivityFeedback()
  const { data: journalingAnswers } = useGetJournalingAnswers(dayNumber)
  const { data: activityFeedbackList } = useGetActivityFeedback(dayNumber)

  const hasFeedbackForJournaling = activityFeedbackList?.some(
    f => f.activity_type === 'journaling',
  ) ?? false

  const prompts = t(
    `day-${day}.prompts`,
    { returnObjects: true },
  ) as Record<string, { title: string, description: string }>

  const allPrompts = Object.keys(prompts)
  const totalSteps = allPrompts.length

  const handlePrevious = () => {
    setAnswer('')
    setActiveStep(activeStep - 1)
  }
  const handleNext = async () => {
    await saveJournalingAnswer({
      day: dayNumber,
      stepNumber: activeStep,
      answerText: answer,
    })

    setAnswer('')
    setActiveStep(activeStep + 1)
  }
  const closeDoneModalAndBack = () => {
    setIsDoneModalVisible(false)
    back()
  }

  const handleDone = async () => {
    if (hasFeedbackForJournaling) {
      back()
      return
    }
    await completeActivity({
      day: dayNumber,
      activityType: 'journaling',
    })
    setIsDoneModalVisible(true)
  }
  const handleDoneModalLike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'journaling',
      isHelpful: true,
    })
    closeDoneModalAndBack()
  }
  const handleDoneModalDislike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'journaling',
      isHelpful: false,
    })
    closeDoneModalAndBack()
  }

  useEffect(() => {
    const currentStepAnswer
      = journalingAnswers?.find(a => a.step_number === activeStep)?.answer_text

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAnswer(currentStepAnswer || '')
  }, [activeStep, journalingAnswers])

  return (
    <ScreenContainer>
      <Header title={t('journaling')} backButton={false} />

      {totalSteps > 1 && (
        <StepIndicator
          currentStep={activeStep}
          totalSteps={totalSteps}
        />
      )}

      <ThemedText
        type="preSubtitle"
        style={[styles.title, { marginTop: totalSteps > 1 ? scale(17) : 0 }]}
      >
        {t(`day-${day}.title`)}
      </ThemedText>

      <View style={styles.promptsContainer}>
        <ThemedText type="default" style={styles.promptDescription}>
          <Trans
            i18nKey={`journaling:day-${day}.prompts.${activeStep}.description`}
            components={[
              <ThemedText key="0" type="default" style={{ color: Colors.light.primary }} />,
              <ThemedText key="1" type="default" style={{ color: Colors.light.primary }} />,
            ]}
          />
        </ThemedText>

        <TextInput
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
          style={styles.promptInput}
          placeholder={t('your-answer')}
          value={answer}
          onChangeText={setAnswer}
        />
      </View>

      <View style={styles.buttonsContainer}>
        {activeStep > 1 && (
          <Button
            title={t('previous')}
            onPress={handlePrevious}
            disabled={activeStep === 1}
            style={styles.button}
          />
        )}

        <Button
          title={activeStep === totalSteps ? t('done') : t('next')}
          onPress={activeStep === totalSteps ? handleDone : handleNext}
          disabled={!answer}
          style={styles.button}
        />
      </View>

      <Modal
        visible={isDoneModalVisible}
        onClose={closeDoneModalAndBack}
        variant="gradient"
      >
        <View style={styles.doneModalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('great-work')}
          </ThemedText>

          <View style={styles.doneImageContainer}>
            <Image style={styles.doneImage} source={journalingDoneImage} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>
            {t('you-re-creating-the-awareness-needed-to-make-conscious-choices')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>
            {t('was-this-helpful')}
          </ThemedText>

          <View style={styles.feedbackButtonsContainer}>
            <Button
              style={styles.feedbackButton}
              onPress={handleDoneModalLike}
              icon={<LikeIcon />}
            />
            <Button
              style={styles.feedbackButton}
              onPress={handleDoneModalDislike}
              icon={<DislikeIcon />}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  )
}

export default JournalingDayScreen
