import type { CalendarDayData } from '@/components/calendar/types'

import { StyleSheet, View } from 'react-native'

import CocktailIcon from '@/assets/icons/cocktail'
import DropIcon from '@/assets/icons/drop'
import HeartOutlineIcon from '@/assets/icons/heart-outline'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'

import ThemedText from '../themed-text'

interface CalendarDayContentProps {
  day: Date
  dayData?: CalendarDayData
  isFutureDay: boolean
  isBeforeAccount?: boolean
}

const styles = StyleSheet.create({
  completedDayContent: {
    alignItems: 'flex-start',
  },
  completedDayContentDrinksCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
  },
  completedDayContentDrinksCountText: {
    color: Colors.light.error2,
  },
  completedDayContentWaterCupsText: {
    color: Colors.light.primary4,
  },
})

export function CalendarDayContent({
  day: _day,
  dayData,
  isFutureDay,
  isBeforeAccount = false,
}: CalendarDayContentProps) {
  // Don't show anything for days before account creation
  if (isBeforeAccount) {
    return null
  }

  if (!dayData) {
    // Don't show anything for future days
    if (isFutureDay) {
      return null
    }
    // Show heart icon for past days without sessions (abstained days)
    return <HeartOutlineIcon width={scale(23)} height={scale(19)} color={Colors.light.primary4} />
  }

  if (dayData.status === 'completed') {
    return (
      <View style={styles.completedDayContent}>
        <View style={styles.completedDayContentDrinksCount}>
          <DropIcon width={scale(9)} height={scale(12)} />

          <ThemedText style={styles.completedDayContentWaterCupsText}>
            {dayData.totalWaterCups}
          </ThemedText>
        </View>

        <View style={styles.completedDayContentDrinksCount}>
          <CocktailIcon width={scale(10)} height={scale(14)} />

          <ThemedText style={styles.completedDayContentDrinksCountText}>
            {dayData.totalDrinks}
            /
            {dayData.maxDrinkCount}
          </ThemedText>
        </View>
      </View>
    )
  }

  if (['planned', 'active'].includes(dayData.status || '')) {
    return <CocktailIcon width={scale(15)} height={scale(22)} />
  }

  return null
}
