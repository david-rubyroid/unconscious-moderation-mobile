import { useLocalSearchParams, useRouter } from 'expo-router'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

import { HypnosisPlayerScreen } from './components/hypnosis-player-screen'

function HypnosisPreDrinkScreen() {
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
    <HypnosisPlayerScreen
      title=""
      audioUri={HYPNOSIS_LINKS.preDrinkHypnosis}
      onDone={handleDone}
    />
  )
}

export default HypnosisPreDrinkScreen
