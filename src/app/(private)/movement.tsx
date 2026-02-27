import { MaterialIcons } from '@expo/vector-icons'

import { useLocalSearchParams } from 'expo-router'
import { VideoView } from 'expo-video'
import { useEffect, useRef } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { ActivityFeedbackModal } from '@/components'

import { getMovementVideoUrl } from '@/constants/movement'
import { Colors } from '@/constants/theme'

import { useActivityFeedback } from '@/hooks/use-activity-feedback'
import { useVideoActivity } from '@/hooks/use-video-activity'

import { videoPlayerScreenStyles } from '@/styles/video-player-screen'

import { scale } from '@/utils/responsive'

function MovementScreen() {
  const { day } = useLocalSearchParams()
  const dayNumber = Number(day)
  const insets = useSafeAreaInsets()
  const hasCompletedRef = useRef(false)
  const wasPlayingRef = useRef(false)

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const {
    isFeedbackModalVisible,
    handleLike,
    handleDislike,
    handleSkip,
    handleBackPress,
  } = useActivityFeedback({
    day: dayNumber,
    activityType: 'movement',
  })

  const videoUrl = getMovementVideoUrl(dayNumber) ?? null

  const { player, loadingState, canStartPlayback } = useVideoActivity({
    videoUrl,
  })

  useEffect(() => {
    if (!player || hasCompletedRef.current) {
      return
    }

    // Validate day range
    if (dayNumber < 1 || dayNumber > 30) {
      return
    }

    const checkPlaying = () => {
      const isPlaying = player.playing
      if (isPlaying && !wasPlayingRef.current && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        completeActivity({
          day: dayNumber,
          activityType: 'movement',
        }).catch(() => {
          hasCompletedRef.current = false
        })
      }
      wasPlayingRef.current = isPlaying
    }

    wasPlayingRef.current = player.playing

    const subscription = player.addListener('statusChange', () => {
      checkPlaying()
    })

    const interval = setInterval(checkPlaying, 500)

    checkPlaying()

    return () => {
      subscription.remove()
      clearInterval(interval)
    }
  }, [player, dayNumber, completeActivity])

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
            onPress={handleBackPress}
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

      <ActivityFeedbackModal
        visible={isFeedbackModalVisible}
        activityType="movement"
        onLike={handleLike}
        onDislike={handleDislike}
        onSkip={handleSkip}
      />
    </>
  )
}

export default MovementScreen
