import type { AudioPlayer } from 'expo-audio'
import { useLocalSearchParams } from 'expo-router'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { AudioPlayer as AudioPlayerComponent, Header, ScreenContainer } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

function HypnosisScreen() {
  const { t } = useTranslation('hypnosis-adventure')

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const { day } = useLocalSearchParams()
  const hasCompletedRef = useRef(false)
  const [player, setPlayer] = useState<AudioPlayer | null>(null)

  const handlePlayStart = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      completeActivity({
        day: Number(day),
        activityType: 'hypnosis',
      }).catch(() => {
        // Reset on error to allow retry
        hasCompletedRef.current = false
      })
    }
  }

  const handlePlayerReady = (audioPlayer: AudioPlayer | null) => {
    setPlayer(audioPlayer)
  }

  // Enable lock screen controls
  useEffect(() => {
    if (player) {
      player.setActiveForLockScreen(true, {
        title: t(`day-${day}`),
        artist: 'Unconscious Moderation',
      })
    }

    return () => {
      if (player) {
        player.clearLockScreenControls()
      }
    }
  }, [player, day, t])

  return (
    <ScreenContainer>
      <Header title={t(`day-${day}`)} />

      <AudioPlayerComponent
        audioUri={HYPNOSIS_LINKS.hypnosisForAdventure[`day${day}` as keyof typeof HYPNOSIS_LINKS.hypnosisForAdventure]}
        onPlayStart={handlePlayStart}
        onPlayerReady={handlePlayerReady}
      />
    </ScreenContainer>
  )
}

export default HypnosisScreen
