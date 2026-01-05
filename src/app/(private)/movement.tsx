import { useLocalSearchParams } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'

import { useEffect, useRef } from 'react'

import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { getMovementVideoUrl } from '@/constants/movement'
import { Colors, withOpacity } from '@/constants/theme'

import { useCanStartPlayback } from '@/hooks/use-video-buffering'
import { useVideoLoading } from '@/hooks/use-video-loading'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.black,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.black, 0.5),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
})

function MovementScreen() {
  const { day } = useLocalSearchParams()
  const dayNumber = Number(day)
  const hasCompletedRef = useRef(false)
  const wasPlayingRef = useRef(false)

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const videoUrl = getMovementVideoUrl(dayNumber)

  const player = useVideoPlayer(
    videoUrl || null,
    (player) => {
      player.pause()
    },
  )

  const loadingState = useVideoLoading(player)
  const canStartPlayback = useCanStartPlayback(player, 5)

  // Mark activity as completed when playback start
  useEffect(() => {
    if (!player || hasCompletedRef.current || dayNumber < 1 || dayNumber > 30) {
      return
    }

    const checkPlaying = () => {
      const isPlaying = player.playing
      if (isPlaying && !wasPlayingRef.current && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        completeActivity({
          day: dayNumber,
          activityType: 'movement',
        })
      }
      wasPlayingRef.current = isPlaying
    }

    // Initialize initial state
    wasPlayingRef.current = player.playing

    // Check playback status changes
    const subscription = player.addListener('statusChange', () => {
      checkPlaying()
    })

    // Also check periodically in case the event didn't fire
    const interval = setInterval(checkPlaying, 500)

    // Initial check
    checkPlaying()

    return () => {
      subscription.remove()
      clearInterval(interval)
    }
  }, [player, dayNumber, completeActivity])

  // If day is invalid or video is not found
  if (!dayNumber || dayNumber < 1 || dayNumber > 30 || !videoUrl) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.container} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

      {loadingState.isLoading && !canStartPlayback && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.white} />
        </View>
      )}
    </SafeAreaView>
  )
}

export default MovementScreen
