import type { Control } from 'react-hook-form'

import type { BloodPressureFormValues } from '../blood-pressure-form.schema'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ControlledTextInput, ThemedText } from '@/components'

import { actionDayStyles } from '../styles'

interface BloodPressureFormProps {
  control: Control<BloodPressureFormValues>
}

export function BloodPressureForm({ control }: BloodPressureFormProps) {
  const { t } = useTranslation('action-days')

  return (
    <View style={actionDayStyles.formContainer}>
      <ThemedText style={actionDayStyles.bloodPressureTableTitle}>
        {t('enter-your-blood-pressure')}
      </ThemedText>

      <View style={actionDayStyles.pressureInputsContainer}>
        <ControlledTextInput
          name="systolicPressure"
          control={control}
          placeholder={t('enter-your-systolic-pressure')}
          keyboardType="numeric"
          style={actionDayStyles.pressureInput}
        />

        <ControlledTextInput
          name="diastolicPressure"
          control={control}
          placeholder={t('enter-your-diastolic-pressure')}
          keyboardType="numeric"
          style={actionDayStyles.pressureInput}
        />
      </View>
    </View>
  )
}
