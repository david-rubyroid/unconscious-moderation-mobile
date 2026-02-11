import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ThemedText } from '@/components'

import { actionDayStyles } from '../styles'

interface Day2BloodPressureDisplayProps {
  categoryKey: string
  metrics?: { systolic?: number, diastolic?: number } | null
}

export function Day2BloodPressureDisplay({
  metrics,
  categoryKey,
}: Day2BloodPressureDisplayProps) {
  const { t } = useTranslation('action-days')

  return (
    <View style={actionDayStyles.day2BloodPressureContainer}>
      <ThemedText style={actionDayStyles.bloodPressureTableTitle}>
        {t('day-2-blood-pressure')}
      </ThemedText>

      <ThemedText style={actionDayStyles.day2BloodPressureValue}>
        {metrics?.systolic}
        {' / '}
        {metrics?.diastolic}
        {' '}
        -
        {categoryKey}
      </ThemedText>
    </View>
  )
}
