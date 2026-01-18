import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CocktailIcon from '@/assets/icons/cocktail'

import { Button, ThemedText } from '@/components'

import { styles } from '../_drink-with-awareness.styles'

interface DrinkCounterProps {
  actualDrinksCount: number
  maxDrinksCount: number
  onLogDrink: () => void
}

export function DrinkCounter({
  actualDrinksCount,
  maxDrinksCount,
  onLogDrink,
}: DrinkCounterProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <View style={styles.counter}>
      <ThemedText style={styles.counterText}>
        {t('drinks')}
      </ThemedText>

      <View style={styles.counterValueContainer}>
        <View style={styles.counterIcon}>
          <CocktailIcon />
        </View>

        <ThemedText style={[
          styles.counterValue,
          actualDrinksCount > maxDrinksCount && styles.extraCounterValue,
        ]}
        >
          {actualDrinksCount}
          /
          {maxDrinksCount}
        </ThemedText>
      </View>

      <Button
        variant="secondary"
        title={t('log-drink')}
        style={styles.counterButton}
        onPress={onLogDrink}
      />
    </View>
  )
}
