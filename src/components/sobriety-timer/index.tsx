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
  streakStartDate,
  maxUnits,
  circleColor = Colors.light.primary,
  circleBackgroundColor,
  autoUpdate = true,
  customSize,
  disableScroll = false,
}: SobrietyTimerProps) {
  const { t } = useTranslation('free-drink-tracker')

  // Get current streak from API only if streakStartDate is not provided
  const { data: currentStreak, error } = useGetCurrentSobrietyStreak({
    enabled: !streakStartDate,
  })

  // State for current time (updates every second)
  const [currentTime, setCurrentTime] = useState(() => new Date())

  // Auto-update every second only if autoUpdate is true
  useEffect(() => {
    if (!autoUpdate) {
      return
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [autoUpdate])

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error as Error)
    }
  }, [error, onError])

  // Calculate time breakdown
  const breakdown = useMemo(() => {
    // Use provided streakStartDate or get from API
    const startDate = streakStartDate || currentStreak?.streak?.started_at

    // If no active streak, return zeros
    if (!startDate) {
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
      return calculateTimeBreakdown(new Date(startDate))
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
  }, [currentStreak, currentTime, onError, streakStartDate])

  // Get display units
  const displayUnits = useMemo(() => {
    const allUnits = getDisplayUnits(breakdown)
    return maxUnits ? allUnits.slice(-maxUnits) : allUnits
  }, [breakdown, maxUnits])

  const config = customSize || SIZE_CONFIG[size]

  const renderContent = () => {
    const circles = (
      <>
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
            color={circleColor}
            backgroundColor={circleBackgroundColor}
          />
        ))}
      </>
    )

    if (disableScroll) {
      return (
        <View style={styles.circularContainer}>
          {circles}
        </View>
      )
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.circularContainer}
      >
        {circles}
      </ScrollView>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {renderContent()}
    </View>
  )
}

export default SobrietyTimer
