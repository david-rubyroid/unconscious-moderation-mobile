import type { HypnosisCheckInType } from '@/utils/hypnosis-checkin-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { HypnosisPlayer } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

import { saveHypnosisCheckIn } from '@/utils/hypnosis-checkin-storage'

function HypnosisCheckInScreen() {
  const { back } = useRouter()
  const {
    sessionId,
    hypnosisLink,
    title,
    checkInType,
    hoursSinceFirstDrink,
  } = useLocalSearchParams<{
    sessionId: string
    hypnosisLink: string
    title?: string
    checkInType: string
    hoursSinceFirstDrink: string
  }>()

  const handleDone = async () => {
    if (sessionId && checkInType && hypnosisLink && hoursSinceFirstDrink) {
      try {
        await saveHypnosisCheckIn({
          sessionId: Number(sessionId),
          type: checkInType as HypnosisCheckInType,
          link: hypnosisLink,
          completedAt: new Date().toISOString(),
          hoursSinceFirstDrink: Number(hoursSinceFirstDrink),
        })
      }
      catch (error) {
        console.error('Failed to save hypnosis check-in:', error)
      }
    }
    back()
  }

  return (
    <HypnosisPlayer
      title={title ?? ''}
      audioUri={hypnosisLink ?? HYPNOSIS_LINKS.awarenessCheckIn}
      onDone={handleDone}
    />
  )
}

export default HypnosisCheckInScreen
