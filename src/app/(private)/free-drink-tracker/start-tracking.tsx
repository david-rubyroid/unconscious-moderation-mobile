import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useGetCurrentStreak, useStartSobrietyStreak } from '@/api/queries/sobriety-tracker'
import CocktailsIcon from '@/assets/icons/cocktail'
import { Button, ControlledDateInput, ScreenContainer, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'

interface FormData {
  date: Date
  time: Date
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    backgroundColor: '#BFE3C0',
    borderRadius: '50%',
    marginBottom: verticalScale(32),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(32),
  },
  youReIn: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(8),
  },
  description: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(32),
  },
  whenWasYourLastDrinkContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
  },
  whenWasYourLastDrink: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(8),
  },
  formContainer: {
    width: '100%',
    gap: verticalScale(16),
    marginBottom: verticalScale(32),
  },
  timeInput: {
    width: '100%',
    height: 40,
    borderWidth: 0,
    borderColor: Colors.light.primary4,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  button: {
    marginBottom: verticalScale(32),
  },
  footerText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  activeStreakContainer: {
    backgroundColor: withOpacity(Colors.light.primary, 0.1),
    padding: verticalScale(16),
    borderRadius: 8,
    marginBottom: verticalScale(16),
    width: '100%',
  },
  activeStreakText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

function StartTrackingScreen() {
  const { t } = useTranslation('free-drink-tracker')
  const router = useRouter()

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      time: new Date(),
    },
  })

  // Check for existing active streak
  const { data: currentStreak, isLoading: isLoadingStreak } = useGetCurrentStreak()
  const startStreak = useStartSobrietyStreak()

  const hasActiveStreak = currentStreak?.streak?.is_active

  const combineDateTime = (date: Date, time: Date): Date => {
    const combined = new Date(date)
    combined.setHours(time.getHours())
    combined.setMinutes(time.getMinutes())
    combined.setSeconds(time.getSeconds())
    return combined
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Combine date and time into one timestamp
      const lastDrinkDateTime = combineDateTime(data.date, data.time)

      // Start the streak with the last drink date/time
      await startStreak.mutateAsync({
        startedAt: lastDrinkDateTime.toISOString(),
      })

      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('streak-started-successfully'),
      })

      // Navigate back or to a success screen
      router.back()
    }
    catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error instanceof Error ? error.message : t('failed-to-start-streak'),
      })
    }
  }

  if (isLoadingStreak) {
    return (
      <ScreenContainer contentContainerStyle={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <CocktailsIcon width={50} height={67} color={Colors.light.primary} />
      </View>

      <ThemedText type="subtitle" style={styles.title}>{t('alcohol-free-tracker')}</ThemedText>

      <ThemedText type="defaultSemiBold" style={styles.youReIn}>
        {t('you-re-in')}
      </ThemedText>

      <ThemedText style={styles.description}>
        {t('this-is-your-moment')}
      </ThemedText>

      {hasActiveStreak && (
        <View style={styles.activeStreakContainer}>
          <ThemedText type="defaultSemiBold" style={styles.activeStreakText}>
            {t('active-streak-exists')}
          </ThemedText>
          <ThemedText style={styles.activeStreakText}>
            {t('active-streak-description', { days: currentStreak?.durationDays || 0 })}
          </ThemedText>
        </View>
      )}

      <View style={styles.whenWasYourLastDrinkContainer}>
        <ThemedText type="defaultSemiBold" style={styles.whenWasYourLastDrink}>
          {t('when-was-your-last-drink')}
        </ThemedText>
      </View>

      <View style={styles.formContainer}>
        <ControlledDateInput
          name="date"
          control={control}
          label={t('date')}
          mode="date"
          style={styles.timeInput}
        />

        <ControlledDateInput
          name="time"
          control={control}
          label={t('time')}
          mode="time"
          style={styles.timeInput}
        />
      </View>

      <Button
        style={styles.button}
        title={hasActiveStreak ? t('continue-tracking') : t('start-tracking')}
        onPress={hasActiveStreak ? () => router.back() : handleSubmit(onSubmit)}
        disabled={startStreak.isPending}
      />

      <ThemedText type="defaultSemiBold" style={styles.footerText}>
        {t('already-whole')}
      </ThemedText>

      <ThemedText style={styles.footerText}>
        {t('lets-just-move-a-few-wires-around')}
      </ThemedText>
    </ScreenContainer>
  )
}

export default StartTrackingScreen
