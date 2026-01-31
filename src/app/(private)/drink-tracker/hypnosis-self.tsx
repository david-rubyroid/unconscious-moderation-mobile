import { useLocalSearchParams, useRouter } from 'expo-router'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import { HypnosisPlayer } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

function HypnosisSelfScreen() {
  const { back } = useRouter()
  const { sessionId } = useLocalSearchParams<{
    sessionId: string
  }>()

  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))

  const handleDone = () => {
    updateDrinkSession(
      { selfHypnosis: true },
      {
        onSuccess: () => {
          back()
        },
      },
    )
  }

  return (
    <HypnosisPlayer
      title=""
      audioUri={HYPNOSIS_LINKS.selfHypnosis}
      onDone={handleDone}
    />
  )
}

export default HypnosisSelfScreen
