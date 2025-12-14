import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Pressable, StyleSheet, View } from 'react-native'

import { useGetCurrentUser } from '@/api/queries/auth'

import { useGetCurrentStreak } from '@/api/queries/sobriety-tracker'

import { JourneyStreak, ScreenContainer, SobrietyTimer, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  welcome: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(9),
  },
  reminder: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(11),
    fontStyle: 'italic',
  },
  breneBrownQuote: {
    color: Colors.light.primary4,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  breneBrownQuoteAuthor: {
    color: Colors.light.primary4,
    fontStyle: 'italic',
  },
  quoteContainer: {
    paddingHorizontal: scale(19),
    marginBottom: verticalScale(31),
  },
  lastDrinkContainer: {
    paddingHorizontal: scale(33),
    paddingVertical: verticalScale(20),
    backgroundColor: withOpacity(Colors.light.white, 0.7),
    borderRadius: scale(10),
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,

    marginBottom: verticalScale(20),
  },
  lastDrinkText: {
    fontWeight: 500,
    marginBottom: verticalScale(15),
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(14),
    marginTop: verticalScale(15),
  },
  startTrackingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    borderRadius: scale(36),
    backgroundColor: '#BFE3C0',
  },
  startTrackingButtonText: {
    color: Colors.light.primary,
    fontWeight: 500,
  },
  myProgressButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    borderRadius: scale(36),
    backgroundColor: Colors.light.primary4,
  },
  myProgressButtonText: {
    color: Colors.light.white,
    fontWeight: 500,
  },
})

function HomeScreen() {
  const { push } = useRouter()

  const { t } = useTranslation('home')

  const { data: user } = useGetCurrentUser()
  const { data: currentStreak } = useGetCurrentStreak()

  const hasActiveStreak = currentStreak?.streak?.is_active

  const navigateToStartTracking = () => {
    if (hasActiveStreak) {
      push('/free-drink-tracker/reset-tracking')
      return
    }

    push('/free-drink-tracker/start-tracking')
  }

  const navigateToMyProgress = () => {
    push('/my-progress')
  }

  return (
    <ScreenContainer>
      <ThemedText type="subtitle" style={styles.welcome}>
        {t('welcome', { name: user?.firstName })}
      </ThemedText>

      <View style={styles.quoteContainer}>
        <ThemedText type="defaultSemiBold" style={styles.reminder}>
          {t('reminder')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.breneBrownQuote}>
          {t('brene-brown-quote')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.breneBrownQuoteAuthor}>
          {t('brene-brown-quote-author')}
        </ThemedText>
      </View>

      <View style={styles.lastDrinkContainer}>
        <ThemedText type="defaultSemiBold" style={styles.lastDrinkText}>
          {t('last-drink')}
        </ThemedText>

        <SobrietyTimer showIcon />

        <View style={styles.buttonsContainer}>
          <Pressable onPress={navigateToMyProgress} style={styles.myProgressButton}>
            <ThemedText style={styles.myProgressButtonText}>{t('my-progress')}</ThemedText>
          </Pressable>

          <Pressable onPress={navigateToStartTracking} style={styles.startTrackingButton}>
            <ThemedText
              style={styles.startTrackingButtonText}
            >
              {hasActiveStreak ? t('reset') : t('start')}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <JourneyStreak />
    </ScreenContainer>
  )
}

export default HomeScreen
