import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { z } from 'zod'

import { useForgotPassword } from '@/api/queries/auth'

import {
  Button,
  ControlledTextInput,
  ScreenContainer,
  TermsText,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { authFormStyles } from '@/styles/auth-forms'

import { getErrorMessage } from '@/utils/error-handler'

function ForgotPasswordScreen() {
  const { t } = useTranslation('forgot-password')

  const { mutateAsync: forgotPassword, isPending } = useForgotPassword()

  const forgotPasswordFormSchema = useMemo(
    () =>
      z.object({
        email: z.email({ error: t('email-is-invalid') }),
      }),
    [t],
  )

  const {
    setError,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof forgotPasswordFormSchema>) => {
    await forgotPassword(data, {
      onSuccess: () => {
        router.push({
          pathname: '/(auth)/verify-reset-password-code',
          params: { email: data.email },
        })
      },
      onError: (error) => {
        setError('email', { message: getErrorMessage(error) })
      },
    })
  }

  return (
    <ScreenContainer>
      <View style={authFormStyles.titleContainer}>
        <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('title')}</ThemedText>
        <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('forgot-password')}</ThemedText>

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
          name="email"
          placeholder={t('email')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
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

      <TermsText style={authFormStyles.termsContainer} />
    </ScreenContainer>
  )
}

export default ForgotPasswordScreen
