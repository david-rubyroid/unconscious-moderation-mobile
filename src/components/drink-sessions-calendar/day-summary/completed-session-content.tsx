import type { CalendarDayData } from '@/components/calendar/types'

import { Trans } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import CocktailIcon from '@/assets/icons/cocktail'
import DropIcon from '@/assets/icons/drop'

import { ThemedText } from '@/components'

import { Colors, getResponsiveLineHeight } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

interface CompletedSessionContentProps {
  dayName: string
  dayData: CalendarDayData
  isExceeded: boolean
}

const styles = StyleSheet.create({
  dayName: {
    marginBottom: verticalScale(16),
    color: Colors.light.primary4,
  },
  dayNameExceeded: {
    color: Colors.light.error2,
  },
  dayNameFollowed: {
    color: Colors.light.error2,
  },
  statsContainer: {
    alignItems: 'center',
    gap: verticalScale(5),
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(11),
  },
  waterStatText: {
    fontSize: 48,
    lineHeight: getResponsiveLineHeight(48, 1.2),
    color: Colors.light.primary4,
  },
  drinksStatText: {
    fontSize: 48,
    lineHeight: getResponsiveLineHeight(48, 1.2),
    color: Colors.light.primary4,
  },
  drinksStatTextExceeded: {
    color: Colors.light.error2,
  },
  messageText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  messageBold: {
    color: Colors.light.primary4,
  },
})

export function CompletedSessionContent({ dayName, dayData, isExceeded }: CompletedSessionContentProps) {
  const dayNameStyle = isExceeded
    ? styles.dayNameExceeded
    : styles.dayNameFollowed

  const isFollowed = !isExceeded

  return (
    <>
      <ThemedText type="subtitle" style={[styles.dayName, dayNameStyle]}>
        {dayName}
      </ThemedText>

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <DropIcon width={scale(35)} height={scale(48)} />

          <ThemedText style={styles.waterStatText}>
            {dayData?.totalWaterCups || 0}
          </ThemedText>
        </View>

        <View style={styles.statRow}>
          <CocktailIcon width={scale(38)} height={scale(49)} />

          <ThemedText style={[
            styles.drinksStatText,
            isExceeded ? styles.drinksStatTextExceeded : undefined,
          ]}
          >
            {dayData?.totalDrinks || 0}
            /
            {dayData?.maxDrinkCount || 0}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.messageText}>
        {isExceeded && (
          <Trans
            i18nKey="drink-tracker:day-summary.exceeded-limit"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={styles.messageBold} />,
            ]}
          />
        )}
        {isFollowed && (
          <Trans
            i18nKey="drink-tracker:day-summary.followed-plan"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={styles.messageBold} />,
            ]}
          />
        )}
      </ThemedText>
    </>
  )
}
