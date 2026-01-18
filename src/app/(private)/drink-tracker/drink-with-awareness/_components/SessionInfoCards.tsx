import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import MoneyIcon from '@/assets/icons/money'
import TimeSinceIcon from '@/assets/icons/time-since'

import { ThemedText } from '@/components'

import { styles } from '../_drink-with-awareness.styles'

interface SessionInfoCardsProps {
  actualSpending: number
  budget: number
  timeSinceFirstDrink: string
}

export function SessionInfoCards({
  actualSpending,
  budget,
  timeSinceFirstDrink,
}: SessionInfoCardsProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoItem}>
        <MoneyIcon />

        <View style={styles.infoItemContent}>
          <ThemedText type="small" style={styles.infoItemTitle}>
            {t('budget')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.infoItemDescription}>
            $
            {actualSpending}
            /$
            {budget}
          </ThemedText>
        </View>
      </View>

      <View style={styles.infoItem}>
        <TimeSinceIcon />

        <View style={styles.infoItemContent}>
          <ThemedText type="small" style={styles.infoItemTitle}>
            {t('time-since-first-drink')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.infoItemDescription}>
            {timeSinceFirstDrink}
          </ThemedText>
        </View>
      </View>
    </View>
  )
}
