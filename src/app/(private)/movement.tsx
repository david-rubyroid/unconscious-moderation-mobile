import { MaterialIcons } from '@expo/vector-icons'

import { router, useLocalSearchParams } from 'expo-router'
import { VideoView } from 'expo-video'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetActivityFeedback, useSubmitActivityFeedback } from '@/api/queries/daily-activities'

import DislikeIcon from '@/assets/icons/dislike'
import LikeIcon from '@/assets/icons/like'
import movementDoneImage from '@/assets/images/end-of-activity/movment-done.png'

import { Button, Modal, ThemedText } from '@/components'

import { getMovementVideoUrl } from '@/constants/movement'
import { Colors } from '@/constants/theme'

import { useVideoActivity } from '@/hooks/use-video-activity'

import { videoPlayerScreenStyles } from '@/styles/video-player-screen'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
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

function MovementScreen() {
  const { day } = useLocalSearchParams()
  const { t } = useTranslation('movement')
  const dayNumber = Number(day)
  const insets = useSafeAreaInsets()

  const [isDoneModalVisible, setIsDoneModalVisible] = useState(false)

  const { mutate: submitFeedback } = useSubmitActivityFeedback()
  const { data: activityFeedbackList } = useGetActivityFeedback(dayNumber)

  const hasFeedbackForMovement = activityFeedbackList?.some(
    f => f.activity_type === 'movement',
  ) ?? false

  const videoUrl = getMovementVideoUrl(dayNumber) ?? null

  const { player, loadingState, canStartPlayback } = useVideoActivity({
    videoUrl,
    activityCompletion: dayNumber >= 1 && dayNumber <= 30
      ? {
          day: dayNumber,
          activityType: 'movement',
        }
      : undefined,
  })

  const closeDoneModalAndBack = () => {
    setIsDoneModalVisible(false)
    router.back()
  }

  const handleClosePress = () => {
    if (hasFeedbackForMovement) {
      router.back()
    }
    else {
      setIsDoneModalVisible(true)
    }
  }

  const handleDoneModalLike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'movement',
      isHelpful: true,
    })
    closeDoneModalAndBack()
  }

  const handleDoneModalDislike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'movement',
      isHelpful: false,
    })
    closeDoneModalAndBack()
  }

  // If day is invalid or video is not found
  if (!dayNumber || dayNumber < 1 || dayNumber > 30 || !videoUrl) {
    return (
      <SafeAreaView style={videoPlayerScreenStyles.container} edges={['top', 'bottom']}>
        <View style={videoPlayerScreenStyles.container} />
      </SafeAreaView>
    )
  }

  return (
    <>
      <SafeAreaView style={videoPlayerScreenStyles.container} edges={['top', 'bottom']}>
        <View style={[videoPlayerScreenStyles.headerBar, { paddingTop: insets.top }]}>
          <Pressable
            style={videoPlayerScreenStyles.closeButton}
            onPress={handleClosePress}
          >
            <MaterialIcons
              name="close"
              size={scale(24)}
              color={Colors.light.white}
            />
          </Pressable>
        </View>

        <View style={videoPlayerScreenStyles.videoContainer}>
          {player && (
            <VideoView
              nativeControls
              player={player}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
              allowsFullscreen
              allowsPictureInPicture={false}
            />
          )}
        </View>

        {loadingState.isLoading && !canStartPlayback && (
          <View style={videoPlayerScreenStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.white} />
          </View>
        )}
      </SafeAreaView>

      <Modal
        visible={isDoneModalVisible}
        onClose={closeDoneModalAndBack}
        variant="gradient"
      >
        <View style={styles.doneModalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('you-did-it')}
          </ThemedText>

          <View style={styles.doneImageContainer}>
            <Image style={styles.doneImage} source={movementDoneImage} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>
            {t('you-re-literally-rewiring-your-brain-with-every-session')}
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
    </>
  )
}

export default MovementScreen
