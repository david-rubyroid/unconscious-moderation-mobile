import { MaterialIcons } from '@expo/vector-icons'

import { router } from 'expo-router'
import { VideoView } from 'expo-video'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors } from '@/constants/theme'
import { VIDEOS_LINKS } from '@/constants/video-links'

import { useVideoActivity } from '@/hooks/use-video-activity'

import { videoPlayerScreenStyles } from '@/styles/video-player-screen'

import { scale } from '@/utils/responsive'

function UrgeSurfingMeditationScreen() {
  const videoUrl = VIDEOS_LINKS.urgeSurfingMeditationVideo
  const insets = useSafeAreaInsets()

  const { player, loadingState, canStartPlayback } = useVideoActivity({ videoUrl })

  if (!videoUrl) {
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

export default UrgeSurfingMeditationScreen
