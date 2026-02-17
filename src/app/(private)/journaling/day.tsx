import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'

import {
  useCompleteActivity,
  useGetJournalingAnswers,
  useSaveJournalingAnswer,
} from '@/api/queries/daily-activities'

import {
  ActivityFeedbackModal,
  Button,
  Header,
  ScreenContainer,
  StepIndicator,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { useActivityFeedback } from '@/hooks/use-activity-feedback'

import { scale } from '@/utils/responsive'

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
  promptDescriptionBold: {
    fontWeight: '600',
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
})

function JournalingDayScreen() {
  const router = useRouter()
  const [answer, setAnswer] = useState<string>('')
  const [activeStep, setActiveStep] = useState<number>(1)

  const { day } = useLocalSearchParams()
  const { t } = useTranslation('journaling')
  const dayNumber = Number(day)

  const { mutateAsync: saveJournalingAnswer } = useSaveJournalingAnswer()
  const { mutateAsync: completeActivity } = useCompleteActivity()
  const { data: journalingAnswers } = useGetJournalingAnswers(dayNumber)
  const {
    isFeedbackModalVisible,
    hasFeedback,
    showFeedbackModal,
    handleLike,
    handleDislike,
    handleSkip,
  } = useActivityFeedback({
    day: dayNumber,
    activityType: 'journaling',
  })

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

  const handleContinue = async () => {
    await saveJournalingAnswer({
      day: dayNumber,
      stepNumber: activeStep,
      answerText: answer,
    })

    if (activeStep === totalSteps) {
      if (hasFeedback) {
        router.back()
        return
      }

      await completeActivity({
        day: dayNumber,
        activityType: 'journaling',
      })

      showFeedbackModal()
    }
    else {
      setAnswer('')
      setActiveStep(activeStep + 1)
    }
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
              <ThemedText key="2" type="default" style={styles.promptDescriptionBold} />,
              <ThemedText key="3" type="default" style={styles.promptDescriptionBold} />,
              <ThemedText key="4" type="default" style={styles.promptDescriptionBold} />,
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
          onPress={handleContinue}
          disabled={!answer}
          style={styles.button}
        />
      </View>

      <ActivityFeedbackModal
        visible={isFeedbackModalVisible}
        activityType="journaling"
        onLike={handleLike}
        onDislike={handleDislike}
        onSkip={handleSkip}
      />
    </ScreenContainer>
  )
}

export default JournalingDayScreen
