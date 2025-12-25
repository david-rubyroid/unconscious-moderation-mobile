import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLogin } from '@/api/queries/auth'

import {
  Button,
  ControlledTextInput,
  Divider,
  SocialAuth,
  TermsText,
  ThemedGradient,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { useAuthSuccess } from '@/hooks/use-auth-success'

import { authFormStyles } from '@/styles/auth-forms'

import { getErrorMessage } from '@/utils/error-handler'
import { verticalScale } from '@/utils/responsive'

import { createLoginSchema } from '@/validations/auth-schemas'

function LoginScreen() {
  const { email } = useLocalSearchParams()

  const { t } = useTranslation('login')
  const { top, bottom } = useSafeAreaInsets()

  const { handleAuthSuccess } = useAuthSuccess()
  const { mutateAsync: login, isPending } = useLogin()

  const loginFormSchema = useMemo(() => createLoginSchema(t), [t])

  const {
    setError,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: email as string ?? '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    await login(data, {
      onSuccess: async ({ accessToken, refreshToken }) => {
        await handleAuthSuccess(accessToken, refreshToken)
      },
      onError: (error) => {
        setError('email', { message: ' ' })
        setError('password', { message: getErrorMessage(error) })
      },
    })
  }

  return (
    <ThemedGradient style={[authFormStyles.container, { paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={authFormStyles.titleContainer}>
          <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('title')}</ThemedText>
          <ThemedText type="subtitle" style={authFormStyles.subtitle}>{t('log-in')}</ThemedText>

          <ThemedText>
            <Trans
              i18nKey="login:no-account"
              components={[
                <ThemedText key="0" style={authFormStyles.alreadyHaveAccount} />,
                <Link key="1" href="/(auth)/sign-up" replace style={authFormStyles.logIn} />,
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

          <Link href="/(auth)/forgot-password" style={authFormStyles.forgotPassword}>{t('forgot-password')}</Link>

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

export default LoginScreen
