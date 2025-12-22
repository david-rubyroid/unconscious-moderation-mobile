import { useRouter } from 'expo-router'

import { useVideoPlayer, VideoView } from 'expo-video'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import Animated from 'react-native-reanimated'

import PlaySmall from '@/assets/icons/play-small'

import { BottomSheetPopup, Button, ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { VIDEOS_LINKS } from '@/constants/video-links'

import { useCanStartPlayback } from '@/hooks/use-video-buffering'
import { useVideoFade } from '@/hooks/use-video-fade'
import { useVideoLoading } from '@/hooks/use-video-loading'

import { logStreamingInfo } from '@/utils/video-streaming'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.white, 0.3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayHidden: {
    opacity: 0,
  },
  playButton: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 152,
    height: 42,
    borderRadius: 36,
    backgroundColor: Colors.light.tertiaryBackground,
  },
  playButtonText: {
    color: Colors.light.primary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.black, 0.4),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '500',
  },
  popupContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    flex: 1,
  },
  popupText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  popupButton: {
    width: 233,
  },
})

function MedicalReportScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('medical-report')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true)

  const player = useVideoPlayer(
    shouldLoadVideo ? VIDEOS_LINKS.medicalReportVideo : null,
    (player) => {
      player.currentTime = 0.5
      player.pause()
      logStreamingInfo(VIDEOS_LINKS.medicalReportVideo, player.status)
    },
  )

  const loadingState = useVideoLoading(player)
  const canStartPlayback = useCanStartPlayback(player, 5)
  const animatedVideoStyle = useVideoFade(loadingState.isLoading)

  const handlePlay = () => {
    if (!shouldLoadVideo) {
      setShouldLoadVideo(true)
      return
    }

    if (loadingState.isLoading && !canStartPlayback) {
      return
    }

    if (player && canStartPlayback) {
      player.play()
      setIsPlaying(true)
      setShowPopup(true)
    }
  }

  const handleReady = () => {
    replace('/(private)/welcome-to-your-journey')
  }

  return (
    <ThemedGradient style={styles.container}>
      {shouldLoadVideo && player && (
        <Animated.View style={[styles.video, animatedVideoStyle]}>
          <VideoView
            nativeControls={false}
            player={player}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
            contentFit="cover"
          />
        </Animated.View>
      )}

      <View
        style={[
          styles.overlay,
          isPlaying && styles.overlayHidden,
        ]}
        pointerEvents={(isPlaying || loadingState.isLoading) ? 'none' : 'auto'}
      >
        <Pressable
          style={styles.playButton}
          onPress={handlePlay}
          disabled={loadingState.isLoading && !canStartPlayback}
        >
          {loadingState.isLoading && !canStartPlayback
            ? (
                <ActivityIndicator size="small" color={Colors.light.primary3} />
              )
            : (
                <>
                  <PlaySmall />

                  <ThemedText type="defaultSemiBold" style={styles.playButtonText}>
                    {t('play')}
                  </ThemedText>
                </>
              )}
        </Pressable>
      </View>

      <BottomSheetPopup
        dismissible={false}
        visible={showPopup}
      >
        <View style={styles.popupContent}>
          <ThemedText type="subtitle" style={styles.popupText}>
            {t('you-just-pressed-play-on-your-transformation')}
          </ThemedText>

          <Button
            style={styles.popupButton}
            variant="primary"
            title={t('im-ready')}
            onPress={handleReady}
          />
        </View>
      </BottomSheetPopup>
    </ThemedGradient>
  )
}

export default MedicalReportScreen
