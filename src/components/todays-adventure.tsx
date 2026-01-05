import type { Step } from './progress-steps'

import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import { useGetDayDetails } from '@/api/queries/daily-activities'
import { useGetSubscription } from '@/api/queries/subscriptions'

import PlaySmall from '@/assets/icons/play-small'
import hypnotherapyImage from '@/assets/images/today-adventure/hypnotherapy.png'
import journalingImage from '@/assets/images/today-adventure/journaling.jpg'
import movementImage from '@/assets/images/today-adventure/movement.jpg'
import readingImage from '@/assets/images/today-adventure/reading.jpg'

import { Colors, withOpacity } from '@/constants/theme'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'
import { isSubscriptionActive } from '@/utils/subscription'

import BottomSheetPopup from './bottom-sheet-popup'
import Button from './button'
import ProgressSteps from './progress-steps'
import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(20),
  },
  title: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
  contentWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: scale(50),
  },
  progressStepsContainer: {
    position: 'absolute',
    left: 0,
    top: verticalScale(25),
    marginRight: scale(15),
  },
  content: {
    flex: 1,
    gap: verticalScale(20),
  },
  contentImage: {
    flex: 1,
    paddingVertical: verticalScale(26),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  contentText: {
    color: Colors.light.white,
  },
  // Bottom Sheet
  bottomSheetPopup: {
    padding: 0,
  },
  bottomSheetHeaderImage: {
    alignContent: 'center',
    justifyContent: 'center',
    height: verticalScale(220),
    borderTopEndRadius: moderateScale(40),
    borderTopStartRadius: moderateScale(40),
    overflow: 'hidden',
  },
  bottomSheetHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.7),
  },
  bottomSheetHeaderText: {
    color: Colors.light.white,
    textAlign: 'center',
    paddingVertical: verticalScale(26),
    paddingHorizontal: scale(20),
  },
  bottomSheetContent: {
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
    marginTop: -verticalScale(30),
    borderTopEndRadius: moderateScale(40),
    borderTopStartRadius: moderateScale(40),
    backgroundColor: Colors.light.tertiaryBackground,
  },
  bottomSheetContentTitle: {
    color: Colors.light.primary4,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  bottomSheetContentDescriptionBold: {
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  bottomSheetContentDescription: {
    fontWeight: 400,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },

  bottomSheetButton: {
    width: 156,
    borderRadius: 15,
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

  const [showHypnosisBottomSheet, setShowHypnosisBottomSheet] = useState(false)
  const [showJournalingBottomSheet, setShowJournalingBottomSheet] = useState(false)
  const [showMovementBottomSheet, setShowMovementBottomSheet] = useState(false)

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

  // handle open movement bottom sheet
  const handleOpenMovementBottomSheet = () => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    setShowMovementBottomSheet(true)
  }
  const handleCloseMovementBottomSheet = () => {
    setShowMovementBottomSheet(false)
  }
  const handleStartMovement = () => {
    handleCloseMovementBottomSheet()
    push({
      pathname: '/movement',
      params: { day: dailyActivitiesDay },
    })
  }

  // handle open journaling bottom sheet
  const handleOpenJournalingBottomSheet = () => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    setShowJournalingBottomSheet(true)
  }
  const handleCloseJournalingBottomSheet = () => {
    setShowJournalingBottomSheet(false)
  }
  const handleStartJournaling = () => {
    handleCloseJournalingBottomSheet()
    if (dailyActivitiesDay === 1) {
      push('/journaling/intro')
    }
    else {
      push({
        pathname: '/journaling/day',
        params: { day: dailyActivitiesDay },
      })
    }
  }
  // handle open hypnosis bottom sheet
  const handleOpenHypnosisBottomSheet = () => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    setShowHypnosisBottomSheet(true)
  }
  const handleCloseHypnosisBottomSheet = () => {
    setShowHypnosisBottomSheet(false)
  }
  const handleStartHypnosis = () => {
    handleCloseHypnosisBottomSheet()
    push({
      pathname: '/hypnosis',
      params: { day: dailyActivitiesDay },
    })
  }
  const handleStartReading = () => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    push({
      pathname: '/reading',
      params: { day: dailyActivitiesDay },
    })
  }

  return (
    <>
      <View style={styles.container}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {t('todays-adventure')}
        </ThemedText>

        <View style={styles.contentWrapper}>
          <View style={styles.progressStepsContainer}>
            <ProgressSteps locked={!isPremium} steps={steps} connectorHeight={verticalScale(50)} />
          </View>

          <View style={styles.content}>
            <Pressable onPress={handleOpenHypnosisBottomSheet}>
              <ImageBackground source={hypnotherapyImage} style={styles.contentImage}>
                <View style={styles.contentOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.contentText}>
                  {t('hypnosis')}
                </ThemedText>
              </ImageBackground>
            </Pressable>

            <Pressable onPress={handleStartReading}>
              <ImageBackground source={readingImage} style={styles.contentImage}>
                <View style={styles.contentOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.contentText}>
                  {t('reading')}
                </ThemedText>
              </ImageBackground>
            </Pressable>

            <Pressable onPress={handleOpenJournalingBottomSheet}>
              <ImageBackground source={journalingImage} style={styles.contentImage}>
                <View style={styles.contentOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.contentText}>
                  {t('journaling')}
                </ThemedText>
              </ImageBackground>
            </Pressable>

            <Pressable onPress={handleOpenMovementBottomSheet}>
              <ImageBackground source={movementImage} style={styles.contentImage}>
                <View style={styles.contentOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.contentText}>
                  {t('movement')}
                </ThemedText>
              </ImageBackground>
            </Pressable>
          </View>
        </View>
      </View>

      <BottomSheetPopup
        visible={showHypnosisBottomSheet}
        onClose={handleCloseHypnosisBottomSheet}
        radius={40}
        style={styles.bottomSheetPopup}
      >
        <ImageBackground
          source={hypnotherapyImage}
          style={styles.bottomSheetHeaderImage}
        >
          <View style={styles.bottomSheetHeaderOverlay} />

          <ThemedText type="title" style={styles.bottomSheetHeaderText}>
            {t('hypnosis-session')}
          </ThemedText>
        </ImageBackground>

        <View style={styles.bottomSheetContent}>
          <ThemedText type="preSubtitle" style={styles.bottomSheetContentTitle}>
            {t('get-ready-for-your-session')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('this-is-your-time-to-pause-breathe-and-reconnect-with-yourself')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('find-a-quiet-comfortable-place-where-you-won-t-be-interrupted')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('for-the-best-experience-we-recommend-using-headphones')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('when-you-re-ready-press-play-to-begin-your-session-with-dr-john-obrien')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('let-the-shift-begin-from-the-inside-out')}
          </ThemedText>

          <Button
            icon={<PlaySmall />}
            title={t('start-session')}
            onPress={handleStartHypnosis}
            style={styles.bottomSheetButton}
          />
        </View>
      </BottomSheetPopup>

      <BottomSheetPopup
        visible={showJournalingBottomSheet}
        onClose={handleCloseJournalingBottomSheet}
        radius={40}
        style={styles.bottomSheetPopup}
      >
        <ImageBackground
          source={hypnotherapyImage}
          style={styles.bottomSheetHeaderImage}
        >
          <View style={styles.bottomSheetHeaderOverlay} />

          <ThemedText type="title" style={styles.bottomSheetHeaderText}>
            {t('journaling-with-dr-nada-obrien')}
          </ThemedText>
        </ImageBackground>

        <View style={styles.bottomSheetContent}>
          <ThemedText type="preSubtitle" style={styles.bottomSheetContentTitle}>
            {t('meet-your-inner-voice')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('meet-your-inner-voice-description')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentTitle}>
            {t('three-things-to-remember')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('first-thought-best-thought')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('no-wrong-answers')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('patterns-emerge-slowly')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('this-space-is-yours-alone')}
          </ThemedText>

          <Button
            icon={<PlaySmall />}
            title={t('start')}
            onPress={handleStartJournaling}
            style={styles.bottomSheetButton}
          />
        </View>
      </BottomSheetPopup>

      <BottomSheetPopup
        visible={showMovementBottomSheet}
        onClose={handleCloseMovementBottomSheet}
        radius={40}
        style={styles.bottomSheetPopup}
      >
        <ImageBackground source={movementImage} style={styles.bottomSheetHeaderImage}>
          <View style={styles.bottomSheetHeaderOverlay} />

          <ThemedText type="title" style={styles.bottomSheetHeaderText}>
            {t('movement-matters')}
          </ThemedText>
        </ImageBackground>

        <View style={styles.bottomSheetContent}>
          <ThemedText type="preSubtitle" style={styles.bottomSheetContentTitle}>
            {t('movement-matters-description')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescription}>
            {t('movement-matters-description-2')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.bottomSheetContentDescriptionBold}>
            {t('movement-matters-description-3')}
          </ThemedText>

          <Button
            icon={<PlaySmall />}
            title={t('start')}
            onPress={handleStartMovement}
            style={styles.bottomSheetButton}
          />
        </View>
      </BottomSheetPopup>
    </>
  )
}

export default TodaysAdventure
