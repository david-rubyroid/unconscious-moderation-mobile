import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import DropIcon from '@/assets/icons/drop'

import { Button, ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

interface WaterCounterProps {
  totalWaterCups: number
  handleLogWater: (_cups: number) => void
  isLoggingWater: boolean
}

export function WaterCounter({
  totalWaterCups,
  handleLogWater,
}: WaterCounterProps) {
  const { t } = useTranslation('drink-with-awareness')

  const s = styles.counter

  return (
    <View style={s.root}>
      <ThemedText style={s.text}>
        {t('waters')}
      </ThemedText>

      <View style={s.valueContainer}>
        <View style={s.icon}>
          <DropIcon width={22} height={29} />
        </View>

        <ThemedText style={s.value}>
          {totalWaterCups}
        </ThemedText>
      </View>

      <View style={s.waterButtonsContainer}>
        <Button
          style={s.waterButton}
          variant="secondary"
          title="-"
          onPress={() => handleLogWater(-1)}
          disabled={totalWaterCups === 0}
        />

        <Button
          style={s.waterButton}
          variant="secondary"
          title="+"
          onPress={() => handleLogWater(1)}
        />
      </View>
    </View>
  )
}
