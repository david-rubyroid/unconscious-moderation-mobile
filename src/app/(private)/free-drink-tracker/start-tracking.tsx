import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'

import { useGetCurrentStreak, useStartSobrietyStreak } from '@/api/queries/sobriety-tracker'

import CocktailsIcon from '@/assets/icons/cocktail'

import {
  Button,
  ControlledDateInput,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors } from '@/constants/theme'

import { freeDrinkTrackerStyles } from '@/styles/free-drink-tracker'

import { getErrorMessage } from '@/utils/error-handler'
import { verticalScale } from '@/utils/responsive'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

interface FormData {
  date: Date
  time: Date
}

const iconContainerStyle = {
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  height: 100,
  width: 100,
  backgroundColor: '#BFE3C0',
  borderRadius: '50%' as const,
  marginBottom: verticalScale(32),
}

const youReInStyle = {
  textAlign: 'center' as const,
  color: Colors.light.primary4,
  marginBottom: verticalScale(8),
}

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
  const { mutateAsync: startStreak, isPending: isStartingStreak } = useStartSobrietyStreak()

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
      await startStreak({
        startedAt: lastDrinkDateTime.toISOString(),
      })

      showSuccessToast(t('success'), t('streak-started-successfully'))

      // Navigate back or to a success screen
      router.back()
    }
    catch (error) {
      showErrorToast(t('error'), getErrorMessage(error, t('failed-to-start-streak')))
    }
  }

  if (isLoadingStreak) {
    return (
      <ScreenContainer contentContainerStyle={freeDrinkTrackerStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer contentContainerStyle={freeDrinkTrackerStyles.container}>
      <View style={iconContainerStyle}>
        <CocktailsIcon width={50} height={67} color={Colors.light.primary} />
      </View>

      <ThemedText type="subtitle" style={freeDrinkTrackerStyles.title}>{t('alcohol-free-tracker')}</ThemedText>

      <ThemedText type="defaultSemiBold" style={youReInStyle}>
        {t('you-re-in')}
      </ThemedText>

      <ThemedText style={freeDrinkTrackerStyles.description}>
        {t('this-is-your-moment')}
      </ThemedText>

      {hasActiveStreak && (
        <View style={freeDrinkTrackerStyles.activeStreakContainer}>
          <ThemedText type="defaultSemiBold" style={freeDrinkTrackerStyles.activeStreakText}>
            {t('active-streak-exists')}
          </ThemedText>
          <ThemedText style={freeDrinkTrackerStyles.activeStreakText}>
            {t('active-streak-description', { days: currentStreak?.durationDays || 0 })}
          </ThemedText>
        </View>
      )}

      <View style={freeDrinkTrackerStyles.whenWasYourLastDrinkContainer}>
        <ThemedText type="defaultSemiBold" style={freeDrinkTrackerStyles.whenWasYourLastDrink}>
          {t('when-was-your-last-drink')}
        </ThemedText>
      </View>

      <View style={freeDrinkTrackerStyles.formContainer}>
        <ControlledDateInput
          name="date"
          control={control}
          label={t('date')}
          mode="date"
          style={freeDrinkTrackerStyles.timeInput}
        />

        <ControlledDateInput
          name="time"
          control={control}
          label={t('time')}
          mode="time"
          style={freeDrinkTrackerStyles.timeInput}
        />
      </View>

      <Button
        style={freeDrinkTrackerStyles.button}
        title={hasActiveStreak ? t('continue-tracking') : t('start-tracking')}
        onPress={hasActiveStreak ? () => router.back() : handleSubmit(onSubmit)}
        disabled={isStartingStreak}
      />

      <ThemedText type="defaultSemiBold" style={freeDrinkTrackerStyles.footerText}>
        {t('already-whole')}
      </ThemedText>

      <ThemedText style={freeDrinkTrackerStyles.footerText}>
        {t('lets-just-move-a-few-wires-around')}
      </ThemedText>
    </ScreenContainer>
  )
}

export default StartTrackingScreen
