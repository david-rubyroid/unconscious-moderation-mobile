import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, View } from 'react-native'

import { useGetDrinkSession } from '@/api/queries/drink-session'
import { useGetSessionReflection } from '@/api/queries/reflections'

import reflectReinforceImage from '@/assets/images/reflect-reinforce.webp'

import {
  Button,
  Header,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

function formatCardDate(isoString?: string): string {
  if (!isoString) {
    return ''
  }
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    borderRadius: scale(20),
    paddingVertical: verticalScale(30),
    overflow: 'hidden',
  },
  imageBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  description: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  container: {
    gap: verticalScale(18),
  },
  myReflectionsText: {
    color: Colors.light.primary4,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(6),
    padding: scale(12),
    gap: verticalScale(4),
  },
  cardTitle: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  cardDate: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  button: {
    alignSelf: 'center',
  },
})

function DrinkTrackerJournalScreen() {
  const { back } = useRouter()
  const { t } = useTranslation('drink-tracker-journal')

  const { sessionId } = useLocalSearchParams()

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { data: sessionReflection } = useGetSessionReflection(Number(sessionId))

  const sessionDate = formatCardDate(drinkSession?.createdAt)

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Header marginBottom={verticalScale(18)} title={t('title')} />

        <ImageBackground
          source={reflectReinforceImage}
          style={styles.imageBackground}
        >
          <View style={styles.imageBackgroundOverlay} />
          <ThemedText type="defaultSemiBold" style={styles.description}>
            {t('description')}
          </ThemedText>
        </ImageBackground>

        <ThemedText style={styles.myReflectionsText}>
          {t('my-reflections')}
        </ThemedText>

        {(sessionReflection?.learnings ?? '').trim() !== '' && (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              {t('post-drinking-summary')}
            </ThemedText>

            {sessionDate !== '' && (
              <ThemedText type="default" style={styles.cardDate}>
                {sessionDate}
              </ThemedText>
            )}

            <ThemedText>
              {sessionReflection?.learnings}
            </ThemedText>
          </View>
        )}

        {(drinkSession?.quickWriting ?? '').trim() !== '' && (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              {t('during-an-urge')}
            </ThemedText>

            {sessionDate !== '' && (
              <ThemedText type="default" style={styles.cardDate}>
                {sessionDate}
              </ThemedText>
            )}

            <ThemedText>
              {drinkSession?.quickWriting}
            </ThemedText>
          </View>
        )}

        <Button
          style={styles.button}
          title={t('done')}
          variant="secondary"
          onPress={back}
        />
      </View>
    </ScreenContainer>
  )
}

export default DrinkTrackerJournalScreen
