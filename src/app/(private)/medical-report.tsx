import { useRouter } from 'expo-router'

import { useVideoPlayer, VideoView } from 'expo-video'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Pressable, StyleSheet, View } from 'react-native'

import Play from '@/assets/icons/play'

import { BottomSheetPopup, Button, ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { VIDEOS_LINKS } from '@/constants/video-links'

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

  const player = useVideoPlayer(VIDEOS_LINKS.medicalReportVideo, (player) => {
    player.loop = true
    player.currentTime = 0.5
    player.pause()
  })

  const handlePlay = () => {
    player.play()
    setIsPlaying(true)
    setShowPopup(true)
  }

  const handleReady = () => {
    replace('/(private)/welcome-to-your-journey')
  }

  return (
    <ThemedGradient style={styles.container}>
      <VideoView
        nativeControls={false}
        player={player}
        style={styles.video}
        pointerEvents="none"
        contentFit="cover"
      />

      <View
        style={[
          styles.overlay,
          isPlaying && styles.overlayHidden,
        ]}
        pointerEvents={isPlaying ? 'none' : 'auto'}
      >
        <Pressable
          style={styles.playButton}
          onPress={handlePlay}
        >
          <Play />

          <ThemedText type="defaultSemiBold" style={styles.playButtonText}>
            {t('play')}
          </ThemedText>
        </Pressable>
      </View>

      <BottomSheetPopup
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
