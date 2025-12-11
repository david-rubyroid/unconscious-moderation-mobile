import type { DrinkType } from '@/api/queries/drink-session/dto'

import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet } from 'react-native'

import BeerIcon from '@/assets/icons/beer'
import CocktailIcon from '@/assets/icons/cocktails'
import HardSeltzerReadyToDrink from '@/assets/icons/hard-seltzer-ready-to-drink'
import SpiritsIcon from '@/assets/icons/spirits'
import WineIcon from '@/assets/icons/wine'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

interface DrinkSelectorProps {
  selectedDrink: DrinkType
  onSelectDrink: (_drinkId: DrinkType) => void
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    marginHorizontal: -scale(15),
  },
  drinksContainer: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(15),
  },
  drink: {
    alignItems: 'center',
    gap: scale(11),
    paddingHorizontal: scale(23),
    paddingVertical: verticalScale(15),
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
  drinkSelected: {
    backgroundColor: Colors.light.primary,
  },
  drinkText: {
    textAlign: 'center',
    color: withOpacity(Colors.light.black, 0.5),
  },
  drinkTextSelected: {
    color: Colors.light.white,
  },
})

const drinkIcons = {
  'wine': WineIcon,
  'beer': BeerIcon,
  'spirits': SpiritsIcon,
  'cocktails': CocktailIcon,
  'hard-seltzer-ready-to-drink': HardSeltzerReadyToDrink,
}

const drinks = [
  {
    id: 'wine' as DrinkType,
    name: 'wine',
  },
  {
    id: 'beer' as DrinkType,
    name: 'beer',
  },
  {
    id: 'spirits' as DrinkType,
    name: 'spirits',
  },
  {
    id: 'cocktails' as DrinkType,
    name: 'cocktails',
  },
  {
    id: 'hard-seltzer-ready-to-drink' as DrinkType,
    name: 'hard-seltzer-ready-to-drink',
  },
]

function DrinkSelector({ selectedDrink, onSelectDrink }: DrinkSelectorProps) {
  const { t } = useTranslation('log-drink')

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.drinksContainer}
    >
      {drinks.map((drink) => {
        const IconComponent = drinkIcons[drink.id as keyof typeof drinkIcons]
        const isSelected = selectedDrink === drink.id

        return (
          <Pressable
            key={drink.id}
            style={[styles.drink, isSelected && styles.drinkSelected]}
            onPress={() => onSelectDrink(drink.id)}
          >
            <ThemedText style={[styles.drinkText, isSelected && styles.drinkTextSelected]}>
              {t(drink.name)}
            </ThemedText>

            {IconComponent && (
              <IconComponent color={isSelected ? Colors.light.white : Colors.light.primary} />
            )}
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export default DrinkSelector
