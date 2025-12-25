import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useResetPassword } from '@/api/queries/auth'

import {
  Button,
  ControlledTextInput,
  TermsText,
  ThemedGradient,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { authFormStyles } from '@/styles/auth-forms'

import { getErrorMessage } from '@/utils/error-handler'
import { verticalScale } from '@/utils/responsive'

import { createResetPasswordSchema } from '@/validations/auth-schemas'

function ResetPasswordScreen() {
  const { email, code } = useLocalSearchParams<{ email: string, code: string }>()
  const { t } = useTranslation('forgot-password')
  const { top, bottom } = useSafeAreaInsets()

  const { mutateAsync: resetPassword, isPending } = useResetPassword()

  const resetPasswordFormSchema = useMemo(() => createResetPasswordSchema(t), [t])

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
          setError('password', { message: getErrorMessage(error) })
        },
      },
    )
  }

  return (
    <ThemedGradient style={[authFormStyles.container, { paddingTop: top + 10, paddingBottom: bottom + verticalScale(10) }]}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={authFormStyles.titleContainer}>
          <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('title')}</ThemedText>
          <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('reset-password')}</ThemedText>

          <ThemedText>
            <Trans
              i18nKey="forgot-password:back-to-login"
              components={[
                <ThemedText key="0" style={authFormStyles.alreadyHaveAccount} />,
                <Link key="1" href="/(auth)/sign-in" replace style={authFormStyles.logIn} />,
              ]}
            />
          </ThemedText>
        </View>

        <View style={authFormStyles.form}>
          <ControlledTextInput
            style={authFormStyles.input}
            control={control}
            name="password"
            placeholder={t('new-password')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
            isPassword
          />

          <ControlledTextInput
            style={authFormStyles.input}
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

      <TermsText style={authFormStyles.termsContainer} />
    </ThemedGradient>
  )
}

export default ResetPasswordScreen
