import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import { useUpdateReflection } from '@/api/queries/reflections'

import { AudioPlayer, Button, Header, ScreenContainer } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

import { scale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
})

function PreDrinkHypnosisScreen() {
  const { back } = useRouter()
  const { t } = useTranslation('hypnosis')

  const { sessionId, reflectionId, title, postSessionHypnosis } = useLocalSearchParams()
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))
  const { mutate: updateReflection } = useUpdateReflection(Number(reflectionId))

  const handleUpdate = () => {
    if (postSessionHypnosis) {
      updateReflection({
        postSessionHypnosis: true,
      }, {
        onSuccess: () => {
          back()
        },
      })
      return
    }

    updateDrinkSession({
      selfHypnosis: true,
    }, {
      onSuccess: () => {
        back()
      },
    })
  }

  return (
    <ScreenContainer>
      <Header title={title as string || t('title')} />

      <View style={styles.container}>
        <AudioPlayer audioUri={HYPNOSIS_LINKS.preDrinkHypnosis} />

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            title={t('done')}
            onPress={handleUpdate}
          />
        </View>
      </View>

    </ScreenContainer>
  )
}

export default PreDrinkHypnosisScreen
