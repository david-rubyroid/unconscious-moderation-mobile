import { useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'

import { useTranslation } from 'react-i18next'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { AudioPlayer, Header, ScreenContainer } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

function HypnosisScreen() {
  const { t } = useTranslation('hypnosis-adventure')

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const { day } = useLocalSearchParams()
  const hasCompletedRef = useRef(false)

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

  return (
    <ScreenContainer>
      <Header title={t(`day-${day}`)} />

      <AudioPlayer
        audioUri={HYPNOSIS_LINKS.hypnosisForAdventure[`day${day}` as keyof typeof HYPNOSIS_LINKS.hypnosisForAdventure]}
        onPlayStart={handlePlayStart}
      />
    </ScreenContainer>
  )
}

export default HypnosisScreen
