import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import { AudioPlayer, Button, Header, ThemedGradient } from '@/components'
import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { scale, verticalScale } from '@/utils/responsive'

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

  const { top, bottom } = useSafeAreaInsets()
  const { sessionId } = useLocalSearchParams()
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))

  const handleUpdateDrinkSession = () => {
    updateDrinkSession({
      selfHypnosis: true,
    }, {
      onSuccess: () => {
        back()
      },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <View style={styles.container}>
        <AudioPlayer audioUri={HYPNOSIS_LINKS.preDrinkHypnosis} />

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            title={t('done')}
            onPress={handleUpdateDrinkSession}
          />
        </View>
      </View>

    </ThemedGradient>
  )
}

export default PreDrinkHypnosisScreen
