import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'

import {
  useGetCurrentStreak,
  useResetSobrietyStreak,
} from '@/api/queries/sobriety-tracker'
import {
  Button,
  ControlledDateInput,
  ControlledTextInput,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { freeDrinkTrackerStyles } from '@/styles/free-drink-tracker'

import { getErrorMessage } from '@/utils/error-handler'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

interface FormData {
  date: Date
  time: Date
  reason: string
  feelings: string
  supportNeeded: string
}

function ResetTrackingScreen() {
  const { t } = useTranslation('free-drink-tracker')
  const router = useRouter()

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      time: new Date(),
    },
  })

  const { data: currentStreak } = useGetCurrentStreak()
  const { mutateAsync: resetStreak, isPending: isResettingStreak } = useResetSobrietyStreak()

  const combineDateTime = (date: Date, time: Date): Date => {
    const combined = new Date(date)
    combined.setHours(time.getHours())
    combined.setMinutes(time.getMinutes())
    combined.setSeconds(time.getSeconds())
    return combined
  }

  const onSubmit = async (data: FormData) => {
    if (!currentStreak)
      return

    try {
      await resetStreak({
        resetAt: combineDateTime(data.date, data.time).toISOString(),
        reason: data.reason,
        feelings: data.feelings,
        supportNeeded: data.supportNeeded,
      })

      showSuccessToast(t('success'), t('streak-reset-successfully'))

      router.back()
    }
    catch (error) {
      showErrorToast(t('error'), getErrorMessage(error, t('failed-to-reset-streak')))
    }
  }

  if (isResettingStreak) {
    return (
      <ScreenContainer contentContainerStyle={freeDrinkTrackerStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer contentContainerStyle={freeDrinkTrackerStyles.container}>
      <ThemedText type="subtitle" style={freeDrinkTrackerStyles.title}>{t('every-new-beginning-holds-power')}</ThemedText>

      <View style={freeDrinkTrackerStyles.descriptionContainer}>
        <ThemedText style={freeDrinkTrackerStyles.description}>
          {t('every-new-beginning-holds-power-description')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={freeDrinkTrackerStyles.description}>
          {t('lets-keep-moving-forward')}
        </ThemedText>
      </View>

      <View style={[freeDrinkTrackerStyles.whenWasYourLastDrinkContainer, { alignItems: undefined }]}>
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

        <ControlledTextInput
          name="reason"
          control={control}
          label={t('what-was-your-main-reason-for-drinking')}
          style={freeDrinkTrackerStyles.timeInput}
          placeholder={t('type-here')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        />

        <ControlledTextInput
          name="feelings"
          control={control}
          label={t('how-did-you-feel-after-drinking')}
          style={freeDrinkTrackerStyles.timeInput}
          placeholder={t('type-here')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        />

        <ControlledTextInput
          name="supportNeeded"
          control={control}
          label={t('what-kind-of-support-would-be-most-helpful-when-you-feel-this-way-again')}
          style={freeDrinkTrackerStyles.timeInput}
          placeholder={t('type-here')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        />
      </View>

      <Button
        title={t('let-s-reset')}
        onPress={handleSubmit(onSubmit)}
        disabled={isResettingStreak}
        loading={isResettingStreak}
      />

    </ScreenContainer>
  )
}

export default ResetTrackingScreen
