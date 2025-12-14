import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useGetCurrentStreak, useResetSobrietyStreak } from '@/api/queries/sobriety-tracker'
import { Button, ControlledDateInput, ControlledTextInput, ScreenContainer, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

interface FormData {
  date: Date
  time: Date
  reason: string
  feelings: string
  supportNeeded: string
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(32),
  },
  descriptionContainer: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(30),
    borderRadius: scale(10),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    marginBottom: verticalScale(20),
  },
  description: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  whenWasYourLastDrinkContainer: {
    width: '100%',
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

      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('streak-reset-successfully'),
      })

      // Navigate back or to a success screen
      router.back()
    }
    catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error instanceof Error ? error.message : t('failed-to-reset-streak'),
      })
    }
  }

  if (isResettingStreak) {
    return (
      <ScreenContainer contentContainerStyle={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>{t('every-new-beginning-holds-power')}</ThemedText>

      <View style={styles.descriptionContainer}>
        <ThemedText style={styles.description}>
          {t('every-new-beginning-holds-power-description')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.description}>
          {t('lets-keep-moving-forward')}
        </ThemedText>
      </View>

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

        <ControlledTextInput
          name="reason"
          control={control}
          label={t('what-was-your-main-reason-for-drinking')}
          style={styles.timeInput}
          placeholder={t('type-here')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        />

        <ControlledTextInput
          name="feelings"
          control={control}
          label={t('how-did-you-feel-after-drinking')}
          style={styles.timeInput}
          placeholder={t('type-here')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        />

        <ControlledTextInput
          name="supportNeeded"
          control={control}
          label={t('what-kind-of-support-would-be-most-helpful-when-you-feel-this-way-again')}
          style={styles.timeInput}
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
