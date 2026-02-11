import type { Step } from '../progress-steps'

import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useGetDayDetails, useMarkDayCompletionModalShown } from '@/api/queries/daily-activities'
import { useGetSubscription } from '@/api/queries/subscriptions'

import actionDayImage from '@/assets/images/today-adventure/action-day.webp'
import connectionDayImage from '@/assets/images/today-adventure/connection-day.webp'
import hypnotherapyImage from '@/assets/images/today-adventure/hypnotherapy.webp'
import journalingImage from '@/assets/images/today-adventure/journaling.webp'
import movementImage from '@/assets/images/today-adventure/movement.webp'
import readingImage from '@/assets/images/today-adventure/reading.webp'

import { Colors } from '@/constants/theme'

import { getAvailableActivitiesForDay } from '@/utils/daily-activities'
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
  const actionDayActivity = dayDetails?.activities.find(a => a.type === 'action-day')
  const connectionDayActivity = dayDetails?.activities.find(a => a.type === 'connection-day')

  const isHypnosisCompleted = hypnosisActivity?.isCompleted ?? false
  const isJournalingCompleted = journalingActivity?.isCompleted ?? false
  const isReadingCompleted = readingActivity?.isCompleted ?? false
  const isMovementCompleted = movementActivity?.isCompleted ?? false
  const isActionDayCompleted = actionDayActivity?.isCompleted ?? false
  const isConnectionDayCompleted = connectionDayActivity?.isCompleted ?? false

  const availableActivitiesForDay = useMemo(
    () => getAvailableActivitiesForDay(dailyActivitiesDay),
    [dailyActivitiesDay],
  )
  const isDayCompleted = availableActivitiesForDay.every((type) => {
    switch (type) {
      case 'hypnosis': return isHypnosisCompleted
      case 'journaling': return isJournalingCompleted
      case 'reading': return isReadingCompleted
      case 'movement': return isMovementCompleted
      case 'action-day': return isActionDayCompleted
      case 'connection-day': return isConnectionDayCompleted
      default: return true
    }
  })

  // Create steps for ProgressSteps (base + optional action-day and connection-day)
  const steps: Step[] = useMemo(() => {
    const base: Step[] = [
      { id: 'hypnosis', status: isHypnosisCompleted ? 'completed' : 'pending' },
      { id: 'reading', status: isReadingCompleted ? 'completed' : 'pending' },
      { id: 'journaling', status: isJournalingCompleted ? 'completed' : 'pending' },
      { id: 'movement', status: isMovementCompleted ? 'completed' : 'pending' },
    ]
    if (availableActivitiesForDay.includes('action-day')) {
      base.push({
        id: 'action-day',
        status: isActionDayCompleted ? 'completed' : 'pending',
        startIcon: true,
      })
    }
    if (availableActivitiesForDay.includes('connection-day')) {
      base.push({
        id: 'connection-day',
        status: isConnectionDayCompleted ? 'completed' : 'pending',
        startIcon: true,
      })
    }
    return base
  }, [
    isHypnosisCompleted,
    isReadingCompleted,
    isJournalingCompleted,
    isMovementCompleted,
    isActionDayCompleted,
    isConnectionDayCompleted,
    availableActivitiesForDay,
  ])

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

  const handleStartActionDay = useCallback(() => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }
    push({
      pathname: '/action-day',
      params: { day: String(dailyActivitiesDay) },
    })
  }, [isPremium, push, dailyActivitiesDay])

  const handleStartConnectionDay = useCallback(() => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }
    push({
      pathname: '/connection-day',
      params: { day: String(dailyActivitiesDay) },
    })
  }, [isPremium, push, dailyActivitiesDay])

  // Activity cards configuration (base + optional action-day and connection-day)
  const activities = useMemo(() => {
    const base = [
      {
        id: 'hypnosis',
        image: hypnotherapyImage,
        label: t('hypnosis'),
        onPress: handleOpenHypnosisBottomSheet,
        overlayColor: Colors.light.primary4,
      },
      {
        id: 'reading',
        image: readingImage,
        label: t('reading'),
        onPress: handleStartReading,
        overlayColor: Colors.light.primary4,
      },
      {
        id: 'journaling',
        image: journalingImage,
        label: t('journaling'),
        onPress: handleOpenJournalingBottomSheet,
        overlayColor: Colors.light.primary4,
      },
      {
        id: 'movement',
        image: movementImage,
        label: t('movement'),
        onPress: handleOpenMovementBottomSheet,
        overlayColor: Colors.light.primary4,
      },
    ]
    if (availableActivitiesForDay.includes('action-day')) {
      base.push({
        id: 'action-day',
        image: actionDayImage,
        label: t('action-day'),
        onPress: handleStartActionDay,
        overlayColor: Colors.light.primary,
      })
    }
    if (availableActivitiesForDay.includes('connection-day')) {
      base.push({
        id: 'connection-day',
        image: connectionDayImage,
        label: t('connection-day'),
        onPress: handleStartConnectionDay,
        overlayColor: Colors.light.primary,
      })
    }
    return base
  }, [
    t,
    availableActivitiesForDay,
    handleOpenHypnosisBottomSheet,
    handleStartReading,
    handleOpenJournalingBottomSheet,
    handleOpenMovementBottomSheet,
    handleStartActionDay,
    handleStartConnectionDay,
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
