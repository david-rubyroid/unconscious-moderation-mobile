import { useRouter } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import ViewShot from 'react-native-view-shot'

import {
  useGetCurrentSobrietyStreak,
  useGetSobrietyStats,
} from '@/api/queries/sobriety-tracker'

import CocktailsIcon from '@/assets/icons/cocktail'

import ShareIcon from '@/assets/icons/share'

import {
  AlcoholFreeFor,
  Button,
  Header,
  ScreenContainer,
  SobrietyTimer,
  ThemedText,
} from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

// Helper function to format date as (Month/Day)
function formatMonthDay(dateString: string): string {
  const date = new Date(dateString)
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(date)
  const month = parts.find(p => p.type === 'month')?.value
  const day = parts.find(p => p.type === 'day')?.value
  return `(${month}/${day})`
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(36),
  },
  trackerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: withOpacity(Colors.light.white, 0.6),
    paddingHorizontal: scale(25),
    paddingVertical: verticalScale(27),
    borderRadius: scale(10),
    marginBottom: verticalScale(40),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 76,
    width: 76,
    backgroundColor: '#BFE3C0',
    borderRadius: 38,
    marginBottom: verticalScale(22),
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  trackerTitle: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
  currentStreakText: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(14),
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(14),
    marginTop: verticalScale(15),
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    borderRadius: scale(36),
    backgroundColor: '#BFE3C0',
  },
  shareButton: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    borderRadius: scale(36),
    backgroundColor: Colors.light.primary4,
  },
  shareButtonText: {
    fontWeight: '500',
    color: Colors.light.white,
  },
  resetButtonText: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
  statsContainer: {
    width: '100%',
  },
  statBlock: {
    width: '100%',
    backgroundColor: withOpacity(Colors.light.white, 0.6),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
  },
  statBlockFirst: {
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(Colors.light.black, 0.5),
  },
  statBlockLast: {
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statTitle: {
    color: Colors.light.primary4,
    fontWeight: '600',
  },
  statValue: {
    color: Colors.light.primary4,
    fontWeight: '600',
  },
  statSubtitle: {
    color: Colors.light.primary4,
  },
  continueButton: {
    marginTop: verticalScale(36),
  },
  hiddenViewShotContainer: {
    position: 'absolute',
    opacity: 0,
  },
})
function MyProgressScreen() {
  const { t } = useTranslation('my-progress')
  const { push } = useRouter()
  // Get current streak and stats data
  const { data: currentStreak } = useGetCurrentSobrietyStreak()
  const { data: stats } = useGetSobrietyStats()

  const viewShotRef = useRef<ViewShot>(null)
  const [isSharing, setIsSharing] = useState(false)

  // Calculate display values
  const lastPauseDate = currentStreak?.streak?.started_at
    ? formatMonthDay(currentStreak.streak.started_at)
    : null

  const longestStreakDays = stats?.longestStreak?.durationDays ?? 0
  const longestStreakValue = longestStreakDays > 0
    ? `(${longestStreakDays} ${longestStreakDays === 1 ? t('day') : t('days')})`
    : null

  const handleStartTracking = () => {
    if (currentStreak?.streak?.is_active) {
      push('/free-drink-tracker/reset-tracking')
      return
    }

    push('/free-drink-tracker/start-tracking')
  }
  const handleShare = async () => {
    if (!viewShotRef.current) {
      return
    }

    try {
      setIsSharing(true)

      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert(t('error'), 'Sharing is not available on this device')
        return
      }

      const uri = await viewShotRef.current.capture?.()
      if (!uri) {
        throw new Error('Failed to capture view')
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: t('share'),
      })
    }
    catch (error) {
      console.error('Error sharing:', error)
      Alert.alert(t('error'), 'Failed to share. Please try again.')
    }
    finally {
      setIsSharing(false)
    }
  }

  return (
    <>
      <ScreenContainer contentContainerStyle={styles.container}>
        <Header title={t('my-progress')} />

        <View style={styles.trackerContainer}>
          <View style={styles.iconContainer}>
            <CocktailsIcon width={37} height={51} color={Colors.light.primary} />
          </View>

          <ThemedText
            type="preSubtitle"
            style={styles.trackerTitle}
          >
            {t('drink-free-tracker')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.currentStreakText}>
            {t('current-streak')}
          </ThemedText>

          <SobrietyTimer size="large" />

          <View style={styles.buttonsContainer}>
            <Pressable
              disabled={isSharing}
              onPress={handleShare}
              style={styles.shareButton}
            >
              <ShareIcon />

              <ThemedText style={styles.shareButtonText}>
                {t('share-my-progress')}
              </ThemedText>
            </Pressable>

            <Pressable
              disabled={isSharing}
              onPress={handleStartTracking}
              style={styles.resetButton}
            >
              <ThemedText style={styles.resetButtonText}>
                {currentStreak?.streak?.is_active ? t('reset') : t('start')}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statBlock, styles.statBlockFirst]}>
            <View style={styles.statHeader}>
              <ThemedText type="defaultSemiBold" style={styles.statTitle}>
                {t('last-pause-began-on')}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {lastPauseDate || t('not-started-yet')}
              </ThemedText>
            </View>

            <ThemedText style={styles.statSubtitle}>
              {t('every-new-beginning-holds-power')}
            </ThemedText>
          </View>

          <View style={[styles.statBlock, styles.statBlockLast]}>
            <View style={styles.statHeader}>
              <ThemedText type="defaultSemiBold" style={styles.statTitle}>
                {t('longest-streak')}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {longestStreakValue || t('no-data')}
              </ThemedText>
            </View>

            <ThemedText style={styles.statSubtitle}>
              {t('ready-to-go-even-further')}
            </ThemedText>
          </View>
        </View>

        <Button
          style={styles.continueButton}
          title={t('my-trophies')}
          onPress={() => push('/trophies')}
        />
      </ScreenContainer>

      <View style={styles.hiddenViewShotContainer} collapsable={false}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <AlcoholFreeFor />
        </ViewShot>
      </View>
    </>
  )
}

export default MyProgressScreen
