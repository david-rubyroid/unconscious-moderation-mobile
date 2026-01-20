import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Link } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useRegistration } from '@/api/queries/auth'

import {
  Button,
  ControlledTextInput,
  Divider,
  ScreenContainer,
  SocialAuth,
  TermsText,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { useAuthSuccess } from '@/hooks/use-auth-success'

import { authFormStyles } from '@/styles/auth-forms'

import { getErrorMessage } from '@/utils/error-handler'

import { createRegistrationSchema } from '@/validations/auth-schemas'

function RegisterScreen() {
  const { t } = useTranslation('register')

  const { handleAuthSuccess } = useAuthSuccess()
  const { mutateAsync: register, isPending } = useRegistration()

  const registerFormSchema = useMemo(() => createRegistrationSchema(t), [t])

  const {
    setError,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    await register(data, {
      onSuccess: async ({ accessToken, refreshToken }) => {
        await handleAuthSuccess(accessToken, refreshToken)
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
        <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('sign-up')}</ThemedText>

        <ThemedText>
          <Trans
            i18nKey="register:already-have-account"
            components={[
              <ThemedText key="0" style={authFormStyles.alreadyHaveAccount} />,
              <Link key="1" href="/(auth)/sign-in" replace style={authFormStyles.logIn} />,
            ]}
          />
        </ThemedText>
      </View>

      <SocialAuth />

      <Divider
        text={t('or')}
        viewStyle={authFormStyles.divider}
        textStyle={authFormStyles.dividerText}
        lineStyle={authFormStyles.dividerLine}
      />

      <View style={authFormStyles.form}>
        <ControlledTextInput
          style={authFormStyles.input}
          control={control}
          name="firstName"
          placeholder={t('firstName')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
        />

        <ControlledTextInput
          style={authFormStyles.input}
          control={control}
          name="lastName"
          placeholder={t('lastName')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
        />

        <ControlledTextInput
          style={authFormStyles.input}
          control={control}
          name="email"
          placeholder={t('email')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
        />

        <ControlledTextInput
          style={authFormStyles.input}
          control={control}
          name="password"
          placeholder={t('password')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
          isPassword
        />

        <ControlledTextInput
          style={authFormStyles.input}
          control={control}
          name="confirmPassword"
          placeholder={t('confirmPassword')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
          isPassword
        />

        <Button
          fullWidth
          disabled={!isValid || isPending}
          loading={isPending}
          title={t('continue')}
          variant="secondary"
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <TermsText style={authFormStyles.termsContainer} />
    </ScreenContainer>
  )
}

export default RegisterScreen
