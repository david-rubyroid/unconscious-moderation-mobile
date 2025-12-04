import { zodResolver } from '@hookform/resolvers/zod'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import { useForgotPassword, useVerifyCode } from '@/api/queries/auth'

import { Button, ControlledTextInput, TermsText, ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import useCountdown from '@/hooks/use-countdown'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    backgroundColor: Colors.light.mainBackground,
  },
  titleContainer: {
    gap: 8,
    marginBottom: 30,
  },
  subtitle: {
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  description: {
    color: withOpacity(Colors.light.black, 0.45),
    fontWeight: '700',
  },
  form: {
    gap: 25,
  },
  input: {
    color: withOpacity(Colors.light.black, 0.85),
    borderColor: withOpacity(Colors.light.black, 0.15),
    backgroundColor: Colors.light.white,
  },
  termsContainer: {
    textAlign: 'center',
    marginTop: 'auto',
  },
  resendContainer: {
    alignItems: 'center',
    gap: 8,
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    color: Colors.light.primary4,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  resendTimer: {
    color: withOpacity(Colors.light.black, 0.45),
    fontWeight: '700',
  },
})

function VerifyPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const { t } = useTranslation('forgot-password')
  const { top, bottom } = useSafeAreaInsets()

  const {
    count: timer,
    reset: resetTimer,
    isFinished: canResend,
  } = useCountdown(60)

  const { mutateAsync: verifyCode, isPending } = useVerifyCode()
  const { mutateAsync: resendCode, isPending: isResending } = useForgotPassword()

  const verifyCodeFormSchema = useMemo(
    () =>
      z.object({
        code: z
          .string()
          .min(6, { error: t('code-is-required') }),
      }),
    [t],
  )

  const {
    setError,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof verifyCodeFormSchema>>({
    resolver: zodResolver(verifyCodeFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof verifyCodeFormSchema>) => {
    if (!email) {
      setError('code', { message: t('verify-email-is-required') })

      return
    }
    const { code } = data

    await verifyCode(
      { email, code },
      {
        onSuccess: () => {
          router.push({
            pathname: '/(auth)/reset-password',
            params: { email, code },
          })
        },
        onError: (error) => {
          setError('code', { message: error.message })
        },
      },
    )
  }

  const handleResendCode = async () => {
    if (!email || !canResend)
      return

    await resendCode(
      { email },
      {
        onSuccess: () => {
          resetTimer()
        },
        onError: (error) => {
          setError('code', { message: error.message })
        },
      },
    )
  }

  return (
    <ThemedGradient style={[styles.container, { paddingTop: top + 10, paddingBottom: bottom + verticalScale(10) }]}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle" style={styles.subtitle}>{t('title')}</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>{t('verify-code')}</ThemedText>

          <ThemedText style={styles.description}>{t('verify-description')}</ThemedText>
        </View>

        <View style={styles.form}>
          <ControlledTextInput
            style={styles.input}
            control={control}
            name="code"
            placeholder={t('code')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
            keyboardType="number-pad"
          />

          <Button
            fullWidth
            loading={isPending}
            disabled={!isValid || isPending}
            title={t('continue')}
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
          />

          <View style={styles.resendContainer}>
            {canResend
              ? (
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleResendCode}
                    disabled={isResending}
                  >
                    <ThemedText style={styles.resendText}>
                      {isResending ? t('resending') : t('resend-code')}
                    </ThemedText>
                  </TouchableOpacity>
                )
              : (
                  <ThemedText style={styles.resendTimer}>
                    {t('resend-timer', { seconds: timer })}
                  </ThemedText>
                )}
          </View>
        </View>
      </ScrollView>

      <TermsText style={styles.termsContainer} />
    </ThemedGradient>
  )
}

export default VerifyPasswordScreen
