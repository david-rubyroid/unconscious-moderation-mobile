import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import MoneyIcon from '@/assets/icons/money'
import TimeSinceIcon from '@/assets/icons/time-since'

import { ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

interface SessionInfoCardsProps {
  actualSpending: number
  budget: number
  timeSinceFirstDrink: string
  currencySymbol: string
}

export function SessionInfoCards({
  actualSpending,
  budget,
  timeSinceFirstDrink,
  currencySymbol,
}: SessionInfoCardsProps) {
  const { t } = useTranslation('drink-with-awareness')

  const s = styles.sessionInfo

  return (
    <View style={s.container}>
      <View style={s.item}>
        <MoneyIcon />

        <View style={s.itemContent}>
          <ThemedText style={s.itemTitle}>
            {t('budget')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={s.itemDescription}>
            {currencySymbol}
            {actualSpending}
            /
            {currencySymbol}
            {budget}
          </ThemedText>
        </View>
      </View>

      <View style={s.item}>
        <TimeSinceIcon />

        <View style={s.itemContent}>
          <ThemedText style={s.itemTitle}>
            {t('time-since-first-drink')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={s.itemDescription}>
            {timeSinceFirstDrink}
          </ThemedText>
        </View>
      </View>
    </View>
  )
}
