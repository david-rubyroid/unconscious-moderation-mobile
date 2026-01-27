import { MaterialIcons } from '@expo/vector-icons'

import { router, useLocalSearchParams } from 'expo-router'
import { VideoView } from 'expo-video'

import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { getMovementVideoUrl } from '@/constants/movement'
import { Colors } from '@/constants/theme'

import { useVideoActivity } from '@/hooks/use-video-activity'

import { videoPlayerScreenStyles } from '@/styles/video-player-screen'

import { scale } from '@/utils/responsive'

function MovementScreen() {
  const { day } = useLocalSearchParams()
  const dayNumber = Number(day)
  const insets = useSafeAreaInsets()

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

  // If day is invalid or video is not found
  if (!dayNumber || dayNumber < 1 || dayNumber > 30 || !videoUrl) {
    return (
      <SafeAreaView style={videoPlayerScreenStyles.container} edges={['top', 'bottom']}>
        <View style={videoPlayerScreenStyles.container} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={videoPlayerScreenStyles.container} edges={['top', 'bottom']}>
      <View style={[videoPlayerScreenStyles.headerBar, { paddingTop: insets.top }]}>
        <Pressable
          style={videoPlayerScreenStyles.closeButton}
          onPress={router.back}
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
  )
}

export default MovementScreen
