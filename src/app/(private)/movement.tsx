import { MaterialIcons } from '@expo/vector-icons'

import { useLocalSearchParams } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import { VideoView } from 'expo-video'
import { useEffect, useRef } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { ActivityFeedbackModal } from '@/components'

import { getMovementVideoUrl } from '@/constants/movement'
import { Colors, withOpacity } from '@/constants/theme'

import { useActivityFeedback } from '@/hooks/use-activity-feedback'
import { useOrientation } from '@/hooks/use-orientation'
import { useVideoActivity } from '@/hooks/use-video-activity'

import { videoPlayerScreenStyles } from '@/styles/video-player-screen'

import { scale } from '@/utils/responsive'

const styles = StyleSheet.create({
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: scale(80),
    backgroundColor: Colors.light.black,
    zIndex: 20,
    elevation: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: scale(16),
    paddingBottom: scale(12),
  },
  headerBarLandscape: {
    minHeight: 0,
    paddingTop: scale(12),
    paddingRight: scale(16),
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: withOpacity(Colors.light.black, 0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
})

function MovementScreen() {
  const { day } = useLocalSearchParams()
  const dayNumber = Number(day)
  const insets = useSafeAreaInsets()
  const orientation = useOrientation()
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
    ScreenOrientation.unlockAsync().catch((err) => {
      console.error('Failed to unlock screen orientation', err)
    })

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT).catch((err) => {
        console.error('Failed to lock screen orientation to portrait', err)
      })
    }
  }, [])

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
      <SafeAreaView style={videoPlayerScreenStyles.container} edges={orientation === 'landscape' ? [] : ['top', 'bottom']}>
        <View style={videoPlayerScreenStyles.container} />
      </SafeAreaView>
    )
  }

  const isLandscape = orientation === 'landscape'

  return (
    <>
      <SafeAreaView style={videoPlayerScreenStyles.container} edges={isLandscape ? [] : ['top', 'bottom']}>
        <View
          style={[
            styles.headerBar,
            isLandscape && styles.headerBarLandscape,
            { paddingTop: isLandscape ? scale(8) : insets.top },
          ]}
        >
          <Pressable
            style={styles.closeButton}
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
              contentFit={isLandscape ? 'cover' : 'contain'}
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
