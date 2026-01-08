import { VideoView } from 'expo-video'

import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, withOpacity } from '@/constants/theme'
import { VIDEOS_LINKS } from '@/constants/video-links'

import { useVideoActivity } from '@/hooks/use-video-activity'

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

function UrgeSurfingMeditationScreen() {
  const videoUrl = VIDEOS_LINKS.urgeSurfingMeditationVideo

  const { player, loadingState, canStartPlayback } = useVideoActivity({ videoUrl })

  if (!videoUrl) {
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

export default UrgeSurfingMeditationScreen
