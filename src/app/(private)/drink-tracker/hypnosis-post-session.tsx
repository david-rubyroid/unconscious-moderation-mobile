import { useLocalSearchParams, useRouter } from 'expo-router'

import { useUpdateReflection } from '@/api/queries/reflections'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

import { HypnosisPlayer } from './components/hypnosis-player'

function HypnosisPostSessionScreen() {
  const { back } = useRouter()
  const { reflectionId, title } = useLocalSearchParams<{
    reflectionId: string
    title?: string
  }>()
  const { mutate: updateReflection } = useUpdateReflection(Number(reflectionId))

  const handleDone = () => {
    updateReflection(
      { postSessionHypnosis: true },
      {
        onSuccess: () => {
          back()
        },
      },
    )
  }

  return (
    <HypnosisPlayer
      title={title ?? ''}
      audioUri={HYPNOSIS_LINKS.postDrinkingHypnosis}
      onDone={handleDone}
    />
  )
}

export default HypnosisPostSessionScreen
