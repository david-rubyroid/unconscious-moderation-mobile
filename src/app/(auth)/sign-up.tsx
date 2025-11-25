import { zodResolver } from '@hookform/resolvers/zod'

import { Link } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import { useRegistration } from '@/api/queries/auth'

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

import { useAuth } from '@/context/auth/use'

import { saveAuthTokens } from '@/utils/auth'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(18),
    backgroundColor: Colors.light.mainBackground,
  },
  titleContainer: {
    gap: scale(8),
    marginBottom: verticalScale(30),
  },
  subtitle: {
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  alreadyHaveAccountContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
  },
  alreadyHaveAccount: {
    color: withOpacity(Colors.light.black, 0.45),
    fontWeight: '700',
  },
  logIn: {
    textDecorationLine: 'underline',
  },
  divider: {
    marginVertical: verticalScale(25),
  },
  dividerLine: {
    backgroundColor: withOpacity(Colors.light.black, 0.45),
  },
  dividerText: {
    color: withOpacity(Colors.light.black, 0.30),
  },
  form: {
    gap: verticalScale(25),
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

function RegisterScreen() {
  const { t } = useTranslation('register')
  const { top, bottom } = useSafeAreaInsets()

  const { setHasToken } = useAuth()
  const { mutateAsync: register, isPending } = useRegistration()

  const registerFormSchema = useMemo(() =>
    z.object({
      firstName: z.string().min(1, { error: t('this-field-is-required') }),
      lastName: z.string().min(1, { error: t('this-field-is-required') }),
      email: z.email({ error: t('email-is-invalid') }),
      password: z.string().min(8, { error: t('password-must-be-at-least-8-characters') }),
      confirmPassword: z.string().min(8, { error: t('password-must-be-at-least-8-characters') }),
    }).refine(
      data => data.password === data.confirmPassword,
      { error: t('passwords-do-not-match'), path: ['confirmPassword'] },
    ), [t])

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
      onSuccess: ({ accessToken, refreshToken }) => {
        saveAuthTokens(accessToken, refreshToken)
        if (accessToken && refreshToken) {
          setHasToken(true)
        }
      },
      onError: (error) => {
        setError('email', { message: error.message })
      },
    })
  }

  return (
    <ThemedGradient style={[styles.container, { paddingTop: top + verticalScale(41), paddingBottom: bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle" style={styles.subtitle}>{t('title')}</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>{t('sign-up')}</ThemedText>

          <ThemedText>
            <Trans
              i18nKey="register:already-have-account"
              components={[
                <ThemedText key="0" style={styles.alreadyHaveAccount} />,
                <Link key="1" href="/(auth)/sign-in" replace style={styles.logIn} />,
              ]}
            />
          </ThemedText>
        </View>

        <SocialAuth />

        <Divider
          text={t('or')}
          viewStyle={styles.divider}
          textStyle={styles.dividerText}
          lineStyle={styles.dividerLine}
        />

        <View style={styles.form}>
          <ControlledTextInput
            style={styles.input}
            control={control}
            name="firstName"
            placeholder={t('firstName')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
          />

          <ControlledTextInput
            style={styles.input}
            control={control}
            name="lastName"
            placeholder={t('lastName')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
          />

          <ControlledTextInput
            style={styles.input}
            control={control}
            name="email"
            placeholder={t('email')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
          />

          <ControlledTextInput
            style={styles.input}
            control={control}
            name="password"
            placeholder={t('password')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
            isPassword
          />

          <ControlledTextInput
            style={styles.input}
            control={control}
            name="confirmPassword"
            placeholder={t('confirmPassword')}
            placeholderTextColor={withOpacity(Colors.light.black, 0.25)}
            isPassword
          />

          <Button
            disabled={!isValid || isPending}
            loading={isPending}
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

export default RegisterScreen
