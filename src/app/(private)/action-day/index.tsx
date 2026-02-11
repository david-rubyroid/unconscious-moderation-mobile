import type { Resolver } from 'react-hook-form'
import type { BloodPressureFormValues } from './blood-pressure-form.schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

import { ImageBackground, View } from 'react-native'

import { useGetActionDayHealthMetrics } from '@/api/queries/daily-activities'

import { Button, Header, ScreenContainer, ThemedText } from '@/components'

import {
  ACTION_DAY_IMAGES,
  BLOOD_PRESSURE_REQUIRED_DAYS,
} from '@/constants/daily-activities'

import {
  createBloodPressureFormSchema,
} from './blood-pressure-form.schema'
import {
  ActionDayFirstTimePopup,
  BloodPressureForm,
  BloodPressureResultModal,
  BloodPressureTable,
  Day2BloodPressureDisplay,
  HowToDoItSection,
} from './components'
import { actionDayStyles } from './styles'
import { useActionDayCompletion } from './use-action-day-completion'
import { getDay2BloodPressureCategoryKey } from './utils'

type ActionDayKey = keyof typeof ACTION_DAY_IMAGES

export default function ActionDayScreen() {
  const { t } = useTranslation('action-days')
  const { day } = useLocalSearchParams<{ day: string }>()
  const dayNumber = Number(day) as ActionDayKey
  const isBloodPressureRequiredDay = BLOOD_PRESSURE_REQUIRED_DAYS.includes(
    dayNumber as unknown as (typeof BLOOD_PRESSURE_REQUIRED_DAYS)[number],
  )

  const { data: day2BloodPressureMetrics } = useGetActionDayHealthMetrics(2)
  const { data: actionDayHealthMetrics } = useGetActionDayHealthMetrics(dayNumber, {
    enabled: dayNumber !== undefined,
  })

  const bloodPressureFormSchema = useMemo(
    () => createBloodPressureFormSchema(t),
    [t],
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<BloodPressureFormValues>({
    resolver: zodResolver(bloodPressureFormSchema) as Resolver<BloodPressureFormValues>,
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const {
    bloodPressureResultModal,
    handleCloseBloodPressureResultModal,
    handleCompleteActivityWithBloodPressure,
    handleCompleteActivityWithoutBloodPressure,
    isPending,
  } = useActionDayCompletion(dayNumber)

  const imageSource = ACTION_DAY_IMAGES[dayNumber]
  const titleKey = `day-${day}.title`
  const howToDoIt = t(`day-${day}.how-to-do-it`, { returnObjects: true }) as {
    title: string
    description: string[]
  }

  const day2BloodPressureCategoryKey = getDay2BloodPressureCategoryKey(
    t,
    day2BloodPressureMetrics?.systolic,
    day2BloodPressureMetrics?.diastolic,
  )

  useEffect(() => {
    if (actionDayHealthMetrics) {
      setValue('systolicPressure', actionDayHealthMetrics.systolic)
      setValue('diastolicPressure', actionDayHealthMetrics.diastolic)
    }
  }, [actionDayHealthMetrics, setValue])

  return (
    <ScreenContainer
      contentContainerStyle={actionDayStyles.contentContainer}
      gradientColors={['#BDE5E2', '#DCF1EE', '#E4F4ED', '#B9E2E6']}
    >
      <Header title={t('title')} />

      <ThemedText type="preSubtitle" style={actionDayStyles.title}>
        {t(titleKey)}
      </ThemedText>

      <ImageBackground source={imageSource} style={actionDayStyles.imageBackground}>
        <View style={actionDayStyles.overlay} />
      </ImageBackground>

      <ThemedText style={actionDayStyles.description} type="defaultSemiBold">
        <Trans
          i18nKey={`action-days:day-${day}.description`}
          components={[
            <ThemedText
              key="0"
              type="defaultSemiBold"
              style={actionDayStyles.descriptionBold}
            />,
          ]}
        />
      </ThemedText>

      <HowToDoItSection howToDoIt={howToDoIt} />

      {isBloodPressureRequiredDay && (
        <>
          {dayNumber === 30 && (
            <Day2BloodPressureDisplay
              metrics={day2BloodPressureMetrics}
              categoryKey={day2BloodPressureCategoryKey}
            />
          )}

          <BloodPressureForm control={control} />

          <BloodPressureTable />
        </>
      )}

      <Button
        title={t('done-button')}
        onPress={
          isBloodPressureRequiredDay
            ? handleSubmit(handleCompleteActivityWithBloodPressure)
            : handleCompleteActivityWithoutBloodPressure
        }
        style={actionDayStyles.button}
        disabled={isBloodPressureRequiredDay ? !isValid : false}
        loading={isBloodPressureRequiredDay ? isPending : false}
      />

      {bloodPressureResultModal && (
        <BloodPressureResultModal
          visible
          resultType={bloodPressureResultModal}
          onClose={handleCloseBloodPressureResultModal}
        />
      )}

      <ActionDayFirstTimePopup />
    </ScreenContainer>
  )
}
