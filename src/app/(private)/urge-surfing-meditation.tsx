import { MaterialIcons } from '@expo/vector-icons'

import { router } from 'expo-router'
import { VideoView } from 'expo-video'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors, withOpacity } from '@/constants/theme'
import { VIDEOS_LINKS } from '@/constants/video-links'

import { useVideoActivity } from '@/hooks/use-video-activity'

import { scale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: Colors.light.black,
  },
  backButton: {
    position: 'absolute',
    right: scale(16),
    zIndex: 20,
    backgroundColor: withOpacity(Colors.light.black, 0.6),
    borderRadius: scale(20),
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
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
  const insets = useSafeAreaInsets()

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
      <Pressable
        style={[styles.backButton, { top: insets.top }]}
        onPress={router.back}
      >
        <MaterialIcons
          name="close"
          size={scale(24)}
          color={Colors.light.white}
        />
      </Pressable>

      {player && (
        <VideoView
          nativeControls
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
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
