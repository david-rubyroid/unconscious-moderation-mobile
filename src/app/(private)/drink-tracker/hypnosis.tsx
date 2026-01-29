import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { StyleSheet } from 'react-native'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import { useUpdateReflection } from '@/api/queries/reflections'

import preDrinkHypnosisBackgroundImage from '@/assets/images/box-breathing-bg.jpg'

import { AudioPlayer, Button, Header, ScreenContainer } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { Colors } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  button: {
    marginTop: verticalScale(35),
    alignSelf: 'center',
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
    <ScreenContainer backgroundImage={preDrinkHypnosisBackgroundImage}>
      <Header title={title as string || t('title')} whiteTitle />

      <AudioPlayer
        audioUri={HYPNOSIS_LINKS.preDrinkHypnosis}
        lockScreenTitle={title as string || t('title')}
        textColor={Colors.light.white}
      />

      <Button
        style={styles.button}
        title={t('done')}
        onPress={handleUpdate}
      />
    </ScreenContainer>
  )
}

export default PreDrinkHypnosisScreen
