import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import DropIcon from '@/assets/icons/drop'

import { Button, ThemedText } from '@/components'

import { styles } from '../_drink-with-awareness.styles'

interface WaterCounterProps {
  totalWaterCups: number
  onLogWater: () => void
  isLoggingWater: boolean
}

export function WaterCounter({ totalWaterCups, onLogWater, isLoggingWater }: WaterCounterProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <View style={styles.counter}>
      <ThemedText style={styles.counterText}>
        {t('waters')}
      </ThemedText>

      <View style={styles.counterValueContainer}>
        <View style={styles.counterIcon}>
          <DropIcon width={22} height={29} />
        </View>

        <ThemedText style={styles.counterValue}>
          {totalWaterCups}
        </ThemedText>
      </View>

      <Button
        style={styles.counterButton}
        variant="secondary"
        title={t('log-water')}
        onPress={onLogWater}
        disabled={isLoggingWater}
      />
    </View>
  )
}
