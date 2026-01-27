import type { Step } from '../progress-steps'

import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useGetDayDetails, useMarkDayCompletionModalShown } from '@/api/queries/daily-activities'
import { useGetSubscription } from '@/api/queries/subscriptions'

import hypnotherapyImage from '@/assets/images/today-adventure/hypnotherapy.png'
import journalingImage from '@/assets/images/today-adventure/journaling.jpg'
import movementImage from '@/assets/images/today-adventure/movement.jpg'
import readingImage from '@/assets/images/today-adventure/reading.jpg'

import { Colors } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'
import { isSubscriptionActive } from '@/utils/subscription'

import ThemedText from '../themed-text'
import ActivityBottomSheet from './activity-bottom-sheet'
import ActivityCardsList from './activity-cards-list'
import DayCompletionMedal from './day-completion-medal'
import DayCompletionModal from './day-completion-modal'

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(20),
  },
  title: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
})

interface TodaysAdventureProps {
  dailyActivitiesDay: number
}

function TodaysAdventure({ dailyActivitiesDay }: TodaysAdventureProps) {
  const { push } = useRouter()
  const { t } = useTranslation('home')

  const { data: subscription } = useGetSubscription()
  const { data: dayDetails } = useGetDayDetails(dailyActivitiesDay)
  const { mutate: markModalShown } = useMarkDayCompletionModalShown()

  const [showHypnosisBottomSheet, setShowHypnosisBottomSheet] = useState(false)
  const [showJournalingBottomSheet, setShowJournalingBottomSheet] = useState(false)
  const [showMovementBottomSheet, setShowMovementBottomSheet] = useState(false)
  const [showDayCompletionModal, setShowDayCompletionModal] = useState(false)

  const isPremium = isSubscriptionActive(subscription)

  // Get activity completion status
  const hypnosisActivity = dayDetails?.activities.find(a => a.type === 'hypnosis')
  const journalingActivity = dayDetails?.activities.find(a => a.type === 'journaling')
  const readingActivity = dayDetails?.activities.find(a => a.type === 'reading')
  const movementActivity = dayDetails?.activities.find(a => a.type === 'movement')

  const isHypnosisCompleted = hypnosisActivity?.isCompleted ?? false
  const isJournalingCompleted = journalingActivity?.isCompleted ?? false
  const isReadingCompleted = readingActivity?.isCompleted ?? false
  const isMovementCompleted = movementActivity?.isCompleted ?? false
  const isDayCompleted = isHypnosisCompleted
    && isReadingCompleted && isJournalingCompleted && isMovementCompleted

  // Create steps for ProgressSteps
  const steps: Step[] = [
    {
      id: 'hypnosis',
      status: isHypnosisCompleted ? 'completed' : 'pending',
    },
    {
      id: 'reading',
      status: isReadingCompleted ? 'completed' : 'pending',
    },
    {
      id: 'journaling',
      status: isJournalingCompleted ? 'completed' : 'pending',
    },
    {
      id: 'movement',
      status: isMovementCompleted ? 'completed' : 'pending',
    },
  ]

  // Handlers
  const handleCloseDayCompletionModal = useCallback(() => {
    setShowDayCompletionModal(false)
    markModalShown({ day: dailyActivitiesDay })
  }, [dailyActivitiesDay, markModalShown])
  const handleOpenMovementBottomSheet = useCallback(() => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    setShowMovementBottomSheet(true)
  }, [isPremium, push])
  const handleCloseMovementBottomSheet = useCallback(() => {
    setShowMovementBottomSheet(false)
  }, [])
  const handleStartMovement = useCallback(() => {
    handleCloseMovementBottomSheet()
    push({
      pathname: '/movement',
      params: { day: dailyActivitiesDay },
    })
  }, [dailyActivitiesDay, push, handleCloseMovementBottomSheet])
  const handleOpenJournalingBottomSheet = useCallback(() => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    setShowJournalingBottomSheet(true)
  }, [isPremium, push])
  const handleCloseJournalingBottomSheet = useCallback(() => {
    setShowJournalingBottomSheet(false)
  }, [])
  const handleStartJournaling = useCallback(() => {
    handleCloseJournalingBottomSheet()

    push({
      pathname: '/journaling/day',
      params: { day: dailyActivitiesDay },
    })
  }, [dailyActivitiesDay, push, handleCloseJournalingBottomSheet])
  const handleOpenHypnosisBottomSheet = useCallback(() => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    setShowHypnosisBottomSheet(true)
  }, [isPremium, push])
  const handleCloseHypnosisBottomSheet = useCallback(() => {
    setShowHypnosisBottomSheet(false)
  }, [])
  const handleStartHypnosis = useCallback(() => {
    handleCloseHypnosisBottomSheet()
    push({
      pathname: '/hypnosis',
      params: { day: dailyActivitiesDay },
    })
  }, [dailyActivitiesDay, push, handleCloseHypnosisBottomSheet])
  const handleStartReading = useCallback(() => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    push({
      pathname: '/reading',
      params: { day: dailyActivitiesDay },
    })
  }, [isPremium, push, dailyActivitiesDay])

  // Activity cards configuration
  const activities = useMemo(() => [
    {
      id: 'hypnosis',
      image: hypnotherapyImage,
      label: t('hypnosis'),
      onPress: handleOpenHypnosisBottomSheet,
    },
    {
      id: 'reading',
      image: readingImage,
      label: t('reading'),
      onPress: handleStartReading,
    },
    {
      id: 'journaling',
      image: journalingImage,
      label: t('journaling'),
      onPress: handleOpenJournalingBottomSheet,
    },
    {
      id: 'movement',
      image: movementImage,
      label: t('movement'),
      onPress: handleOpenMovementBottomSheet,
    },
  ], [
    t,
    handleOpenHypnosisBottomSheet,
    handleStartReading,
    handleOpenJournalingBottomSheet,
    handleOpenMovementBottomSheet,
  ])

  // Check if modal should be shown when day is completed
  useEffect(() => {
    if (dayDetails?.completion && !dayDetails.completion.modalShown) {
      setShowDayCompletionModal(true)
    }
  }, [dayDetails])

  return (
    <>
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          {t('todays-adventure')}
        </ThemedText>

        {isDayCompleted
          ? (
              <DayCompletionMedal
                dailyActivitiesDay={dailyActivitiesDay}
                steps={steps}
                locked={!isPremium}
                activities={activities}
              />
            )
          : (
              <ActivityCardsList
                steps={steps}
                locked={!isPremium}
                activities={activities}
              />
            )}
      </View>

      <ActivityBottomSheet
        visible={showHypnosisBottomSheet}
        onClose={handleCloseHypnosisBottomSheet}
        imageSource={hypnotherapyImage}
        title={t('hypnosis-session')}
        content={[
          { type: 'subtitle', text: t('get-ready-for-your-session') },
          { type: 'description', text: t('this-is-your-time-to-pause-breathe-and-reconnect-with-yourself') },
          { type: 'description', text: t('find-a-quiet-comfortable-place-where-you-won-t-be-interrupted') },
          { type: 'description', text: t('for-the-best-experience-we-recommend-using-headphones') },
          { type: 'description', text: t('when-you-re-ready-press-play-to-begin-your-session-with-dr-john-obrien') },
          { type: 'description', text: t('let-the-shift-begin-from-the-inside-out') },
        ]}
        buttonTitle={t('start-session')}
        onStart={handleStartHypnosis}
        gap={12}
      />

      <ActivityBottomSheet
        visible={showJournalingBottomSheet}
        onClose={handleCloseJournalingBottomSheet}
        imageSource={hypnotherapyImage}
        title={t('journaling-title')}
        buttonWithIcon={false}
        content={[
          { type: 'subtitle', text: t('your-unconscious-mind-has-been-running-the-show') },
          { type: 'description', text: t('these-prompts-help-you-hear-what-its-been-trying-to-say') },
          { type: 'subtitle', text: t('three-things-to-remember') },
          {
            type: 'bulletList',
            items: [
              'first-thought-best-thought',
              'no-wrong-answers',
              'patterns-emerge-slowly',
            ],
            i18nNamespace: 'home',
          },
          { type: 'descriptionBold', text: t('this-space-is-yours-alone') },
        ]}
        buttonTitle={t('start')}
        onStart={handleStartJournaling}
      />

      <ActivityBottomSheet
        visible={showMovementBottomSheet}
        onClose={handleCloseMovementBottomSheet}
        imageSource={movementImage}
        title={t('movement-matters')}
        content={[
          { type: 'subtitle', text: t('movement-matters-description') },
          { type: 'description', text: t('movement-matters-description-2') },
          { type: 'descriptionBold', text: t('movement-matters-description-3') },
        ]}
        buttonTitle={t('start')}
        onStart={handleStartMovement}
      />

      <DayCompletionModal
        visible={showDayCompletionModal}
        day={dailyActivitiesDay}
        onClose={handleCloseDayCompletionModal}
      />
    </>
  )
}

export default TodaysAdventure
