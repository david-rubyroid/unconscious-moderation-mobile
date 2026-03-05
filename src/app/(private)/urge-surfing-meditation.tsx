import { MaterialIcons } from '@expo/vector-icons'

import { router } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import { VideoView } from 'expo-video'
import { useEffect } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors, withOpacity } from '@/constants/theme'
import { VIDEOS_LINKS } from '@/constants/video-links'

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

function UrgeSurfingMeditationScreen() {
  const videoUrl = VIDEOS_LINKS.urgeSurfingMeditationVideo
  const insets = useSafeAreaInsets()
  const orientation = useOrientation()

  const { player, loadingState, canStartPlayback } = useVideoActivity({ videoUrl })

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

  if (!videoUrl) {
    return (
      <SafeAreaView style={videoPlayerScreenStyles.container} edges={orientation === 'landscape' ? [] : ['top', 'bottom']}>
        <View style={videoPlayerScreenStyles.container} />
      </SafeAreaView>
    )
  }

  const isLandscape = orientation === 'landscape'

  return (
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
  )
}

export default UrgeSurfingMeditationScreen
