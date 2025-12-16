import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { AudioPlayer, Header, ThemedGradient } from '@/components'
import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
})

function HypnosisScreen() {
  const { t } = useTranslation('hypnosis-adventure')

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const { day } = useLocalSearchParams()
  const { top, bottom } = useSafeAreaInsets()

  useEffect(() => {
    completeActivity({
      day: Number(day),
      activityType: 'hypnosis',
    })
  }, [day, completeActivity])

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t(`day-${day}`)} />

      <View style={styles.container}>
        <AudioPlayer audioUri={HYPNOSIS_LINKS.hypnosisForAdventure[`day${day}` as keyof typeof HYPNOSIS_LINKS.hypnosisForAdventure]} />
      </View>

    </ThemedGradient>
  )
}

export default HypnosisScreen
