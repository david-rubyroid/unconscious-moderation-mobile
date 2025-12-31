import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import boxBreathingImage from '@/assets/images/box-breathing-bg.jpg'

import { BoxBreathingGuide, Button, Header, ScreenContainer, ThemedText } from '@/components'

import { BOX_BREATHING_AUDIO_URL, BOX_BREATHING_DURATION, getBoxBreathingInstructions } from '@/constants/box-breathing'
import { Colors } from '@/constants/theme'

import { useAudioPlayer } from '@/hooks/use-audio-player'
import useBoxBreathing from '@/hooks/use-box-breathing'

import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  description: {
    textAlign: 'center',
    color: Colors.light.white,
    fontWeight: '400',
    marginBottom: verticalScale(20),
  },
  guideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  timerText: {
    color: Colors.light.white,
  },
  button: {
    alignSelf: 'center',
    width: 130,
  },
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function BoxBreathingScreen() {
  const { t } = useTranslation('box-breathing')
  const instructions = getBoxBreathingInstructions(t)

  // Audio player for guided breathing
  const audioPlayer = useAudioPlayer(BOX_BREATHING_AUDIO_URL)
  const { play, pause: pauseAudio, seekTo, currentTime: audioCurrentTime, duration: audioDuration, isPlaying: isAudioPlaying } = audioPlayer

  const { currentPhase } = useBoxBreathing({
    phaseDuration: BOX_BREATHING_DURATION,
    audioCurrentTime: isAudioPlaying ? audioCurrentTime : 0,
  })

  const currentInstruction = useMemo(() => {
    return instructions.find(inst => inst.value === currentPhase)?.label || ''
  }, [currentPhase, instructions])

  const handleButtonPress = () => {
    if (isAudioPlaying) {
      pauseAudio()
    }
    else {
      seekTo(0)
      play()
    }
  }

  return (
    <ScreenContainer backgroundImage={boxBreathingImage} scrollable={false}>
      <Header title={t('title')} whiteTitle />

      <ThemedText type="defaultSemiBold" style={styles.description}>
        {t('description')}
      </ThemedText>

      <View style={styles.guideContainer}>
        <BoxBreathingGuide
          instructionLabel={currentInstruction}
          audioCurrentTime={isAudioPlaying ? audioCurrentTime : 0}
          audioDuration={audioDuration}
          phaseDuration={BOX_BREATHING_DURATION}
        />

        <ThemedText type="title" style={styles.timerText}>
          {formatTime(Math.ceil(isAudioPlaying ? audioCurrentTime : 0))}
        </ThemedText>
      </View>

      <Button
        variant="white"
        style={styles.button}
        title={isAudioPlaying ? t('reset') : t('start')}
        fullWidth
        onPress={handleButtonPress}
      />

    </ScreenContainer>
  )
}

export default BoxBreathingScreen
