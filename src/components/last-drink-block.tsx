import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import { useGetCurrentSobrietyStreak } from '@/api/queries/sobriety-tracker'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import SobrietyTimer from './sobriety-timer'
import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(33),
    paddingVertical: verticalScale(20),
    backgroundColor: withOpacity(Colors.light.white, 0.7),
    borderRadius: scale(10),
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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

function LastDrinkBlock() {
  const { push } = useRouter()
  const { t } = useTranslation('home')

  const { data: currentStreak } = useGetCurrentSobrietyStreak()
  const hasActiveStreak = currentStreak?.streak?.is_active

  const navigateToMyProgress = () => {
    push('/my-progress')
  }
  const navigateToStartTracking = () => {
    if (hasActiveStreak) {
      push('/free-drink-tracker/reset-tracking')
      return
    }
    push('/free-drink-tracker/start-tracking')
  }

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.lastDrinkText}>
        {t('last-drink')}
      </ThemedText>

      <SobrietyTimer showIcon />

      <View style={styles.buttonsContainer}>
        <Pressable onPress={navigateToMyProgress} style={styles.myProgressButton}>
          <ThemedText style={styles.myProgressButtonText}>
            {t('my-progress')}
          </ThemedText>
        </Pressable>

        <Pressable onPress={navigateToStartTracking} style={styles.startTrackingButton}>
          <ThemedText style={styles.startTrackingButtonText}>
            {hasActiveStreak ? t('reset') : t('start')}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  )
}

export default LastDrinkBlock
