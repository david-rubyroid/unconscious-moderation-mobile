import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CocktailIcon from '@/assets/icons/cocktail'

import { Button, ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

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

  const s = styles.counter

  return (
    <View style={s.root}>
      <ThemedText style={s.text}>
        {t('drinks')}
      </ThemedText>

      <View style={s.valueContainer}>
        <View style={s.icon}>
          <CocktailIcon />
        </View>

        <ThemedText style={[
          s.value,
          actualDrinksCount > maxDrinksCount && s.extraValue,
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
        style={s.button}
        onPress={onLogDrink}
      />
    </View>
  )
}
