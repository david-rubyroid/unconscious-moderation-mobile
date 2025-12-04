import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import { useResetPassword } from '@/api/queries/auth'

import {
  Button,
  ControlledTextInput,
  TermsText,
  ThemedGradient,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
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
  alreadyHaveAccount: {
    color: withOpacity(Colors.light.black, 0.45),
    fontWeight: '700',
  },
  logIn: {
    textDecorationLine: 'underline',
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
})

function ResetPasswordScreen() {
  const { email, code } = useLocalSearchParams<{ email: string, code: string }>()
  const { t } = useTranslation('forgot-password')
  const { top, bottom } = useSafeAreaInsets()

  const { mutateAsync: resetPassword, isPending } = useResetPassword()

  const resetPasswordFormSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, { error: t('password-must-be-at-least-8-characters') }),
          confirmPassword: z.string().min(8, { error: t('password-must-be-at-least-8-characters') }),
        })
        .refine(
          data => data.password === data.confirmPassword,
          { error: t('passwords-do-not-match'), path: ['confirmPassword'] },
        ),
    [t],
  )

  const {
    setError,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof resetPasswordFormSchema>) => {
    if (!email || !code) {
      setError('password', { message: t('email-or-code-is-required') })
      return
    }

    const { password } = data

    await resetPassword(
      { email, code, newPassword: password },
      {
        onSuccess: () => {
          router.replace('/(auth)/sign-in')
        },
        onError: (error) => {
          setError('password', { message: error.message })
        },
      },
    )
  }

  return (
    <ThemedGradient style={[styles.container, { paddingTop: top + 10, paddingBottom: bottom + verticalScale(10) }]}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle" style={styles.subtitle}>{t('title')}</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>{t('reset-password')}</ThemedText>

          <ThemedText>
            <Trans
              i18nKey="forgot-password:back-to-login"
              components={[
                <ThemedText key="0" style={styles.alreadyHaveAccount} />,
                <Link key="1" href="/(auth)/sign-in" replace style={styles.logIn} />,
              ]}
            />
          </ThemedText>
        </View>

        <View style={styles.form}>
          <ControlledTextInput
            style={styles.input}
            control={control}
            name="password"
            placeholder={t('new-password')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
            isPassword
          />

          <ControlledTextInput
            style={styles.input}
            control={control}
            name="confirmPassword"
            placeholder={t('confirm-password')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
            isPassword
          />

          <Button
            fullWidth
            loading={isPending}
            disabled={!isValid || isPending}
            title={t('continue')}
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>

      <TermsText style={styles.termsContainer} />
    </ThemedGradient>
  )
}

export default ResetPasswordScreen
