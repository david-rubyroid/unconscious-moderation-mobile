import type { UserAge, UserGender, UserReferralSource } from '@/api/types/models'

import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useUpdateUser } from '@/api/queries/user'

import {
  Button,
  RadioGroup,
  ThemedGradient,
  ThemedText,
} from '@/components'

import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from '@/constants/personalization'
import { Colors } from '@/constants/theme'

import {
  moderateScale,
  scale,
  scaleWithMax,
  verticalScale,
} from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(25),
    fontWeight: 400,
  },
  titleBold: {
    color: Colors.light.primary4,
    fontWeight: 700,
  },
  questions: {
    gap: verticalScale(20),
  },
  question: {
    padding: scale(16),
    borderRadius: moderateScale(16),
    backgroundColor: Colors.light.white,
  },
  questionsTitle: {
    color: Colors.light.primary,
    fontWeight: 700,
    fontSize: 16,
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(22),
  },
  button: {
    width: scaleWithMax(233, 1.3),
  },
})

function QuestionsScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('questions')
  const { top, bottom } = useSafeAreaInsets()

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser()

  const [gender, setGender] = useState<UserGender>(GENDER_OPTIONS[0].value as UserGender)
  const [age, setAge] = useState<UserAge>(AGE_OPTIONS[0].value as UserAge)
  const [referralSource, setReferralSource] = useState<UserReferralSource>(REFERRAL_SOURCE_OPTIONS[0].value as UserReferralSource)

  const genderOptions = useMemo(() => GENDER_OPTIONS.map(option => ({
    ...option,
    label: t(option.label),
  })), [t])
  const ageOptions = useMemo(() => AGE_OPTIONS.map(option => ({
    ...option,
    label: t(option.label),
  })), [t])
  const hearAboutOptions = useMemo(() => REFERRAL_SOURCE_OPTIONS.map(option => ({
    ...option,
    label: t(option.label),
  })), [t])

  const handleContinue = () => {
    updateUser({
      gender,
      age,
      referralSource,
    }, {
      onSuccess: () => {
        replace('/(private)/gifts')
      },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(41), paddingBottom: bottom + verticalScale(22) }, styles.container]}>
      <ThemedText style={styles.title} type="defaultSemiBold">
        <Trans
          i18nKey="questions:few-questions-to-personalize-your-journey"
          components={[
            <ThemedText key="0" style={styles.titleBold} type="defaultSemiBold" />,
            <ThemedText key="1" style={styles.titleBold} type="defaultSemiBold" />,
          ]}
        />
      </ThemedText>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.questions}>
          <View style={styles.question}>
            <ThemedText style={styles.questionsTitle} type="defaultSemiBold">{t('what-is-your-gender')}</ThemedText>
            <RadioGroup options={genderOptions} value={gender} onValueChange={value => setGender(value as UserGender)} />
          </View>

          <View style={styles.question}>
            <ThemedText style={styles.questionsTitle} type="defaultSemiBold">{t('what-is-your-age')}</ThemedText>
            <RadioGroup options={ageOptions} value={age} onValueChange={value => setAge(value as UserAge)} />
          </View>

          <View style={styles.question}>
            <ThemedText style={styles.questionsTitle} type="defaultSemiBold">{t('how-did-you-hear-about-unconscious-moderation')}</ThemedText>
            <RadioGroup options={hearAboutOptions} value={referralSource} onValueChange={value => setReferralSource(value as UserReferralSource)} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          loading={isUpdatingUser}
          disabled={isUpdatingUser}
          style={styles.button}
          title={t('continue')}
          onPress={handleContinue}
        />
      </View>
    </ThemedGradient>
  )
}

export default QuestionsScreen
