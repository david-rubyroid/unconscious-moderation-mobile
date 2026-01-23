import type { SobrietyTimerProps } from './types'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useGetCurrentSobrietyStreak } from '@/api/queries/sobriety-tracker'
import CocktailsIcon from '@/assets/icons/cocktail'

import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'
import { CircularProgress } from './circular-progress'
import { calculateTimeBreakdown, getDisplayUnits } from './time-calculator'

const SIZE_CONFIG = {
  default: {
    circleSize: 36,
    strokeWidth: 3,
    valueSize: 12,
    labelSize: 6,
  },
  large: {
    circleSize: 56,
    strokeWidth: 3,
    valueSize: 18,
    labelSize: 8,
  },
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexShrink: 1,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  circularContainer: {
    flexDirection: 'row',
    gap: scale(20),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 37,
    backgroundColor: '#BFE3C0',
    borderRadius: 7,
  },
  loadingContainer: {
    paddingVertical: verticalScale(20),
  },
})

function SobrietyTimer({
  size = 'default',
  showIcon = false,
  onError,
  style,
}: SobrietyTimerProps) {
  const { t } = useTranslation('free-drink-tracker')

  // Get current streak from API
  const { data: currentStreak, error } = useGetCurrentSobrietyStreak()

  // State for current time (updates every second)
  const [currentTime, setCurrentTime] = useState(() => new Date())

  // Auto-update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error as Error)
    }
  }, [error, onError])

  // Calculate time breakdown
  const breakdown = useMemo(() => {
    // If no active streak, return zeros
    if (!currentStreak?.streak?.started_at) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    try {
      return calculateTimeBreakdown(new Date(currentStreak.streak.started_at))
    }
    catch (err) {
      if (onError) {
        onError(err as Error)
      }
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }
    // currentTime is intentionally included to recalculate every second
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStreak, currentTime, onError])

  // Get display units
  const displayUnits = useMemo(() => {
    return getDisplayUnits(breakdown)
  }, [breakdown])

  const config = SIZE_CONFIG[size]

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.circularContainer}
      >
        {showIcon && (
          <View style={styles.iconContainer}>
            <CocktailsIcon width={20} height={26} color={Colors.light.primary} />
          </View>
        )}
        {displayUnits.map(unit => (
          <CircularProgress
            key={unit.unit}
            value={unit.value}
            maxValue={unit.maxValue}
            progress={unit.progress}
            label={t(`time-units.${unit.label}`, { defaultValue: unit.label })}
            size={config.circleSize}
            strokeWidth={config.strokeWidth}
            valueSize={config.valueSize}
            labelSize={config.labelSize}
            color={Colors.light.primary}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default SobrietyTimer
