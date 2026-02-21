import type { TrophyType } from '@/api/queries/sobriety-tracker/dto'

import { Image } from 'expo-image'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { useGetCurrentSobrietyStreak, useGetTrophies } from '@/api/queries/sobriety-tracker'

import LockedTrophyIcon from '@/assets/icons/locked-trophy'
import threeDays from '@/assets/images/trophies/3-days.webp'
import sevenDays from '@/assets/images/trophies/7-days.webp'

import fourteenDays from '@/assets/images/trophies/14-days.webp'
import twentyOneDays from '@/assets/images/trophies/21-days.webp'
import twentyFourHours from '@/assets/images/trophies/24-hours.webp'
import thirtyDays from '@/assets/images/trophies/30-days.webp'
import sixtyDays from '@/assets/images/trophies/60-days.webp'
import ninetyDays from '@/assets/images/trophies/90-days.webp'

import { Header, ScreenContainer, ThemedText } from '@/components'

import { Colors } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

interface TrophyConfig {
  type: TrophyType
  hours: number
  image: any
  label: string
}

const TROPHY_CONFIG: TrophyConfig[] = [
  { type: '24h', hours: 24, image: twentyFourHours, label: '24 Hours' },
  { type: '3d', hours: 72, image: threeDays, label: '3 Days' },
  { type: '7d', hours: 168, image: sevenDays, label: '7 Days' },
  { type: '14d', hours: 336, image: fourteenDays, label: '14 Days' },
  { type: '21d', hours: 504, image: twentyOneDays, label: '21 Days' },
  { type: '30d', hours: 720, image: thirtyDays, label: '30 Days' },
  { type: '60d', hours: 1440, image: sixtyDays, label: '60 Days' },
  { type: '90d', hours: 2160, image: ninetyDays, label: '90 Days' },
]

const TROPHY_SIZE = 69
const PATH_WIDTH = 12

// SVG path from design
const TROPHY_PATH = 'M276.889 6H71.714C35.422 6 6.004 35.419 6.004 71.707c0 21.774 10.592 41.075 26.901 53.032a65.617 65.617 0 0 0 13.477 7.618c7.792 3.261 16.35 5.06 25.328 5.06h136.511a66.098 66.098 0 0 1 2.962-.064c36.291 0 65.706 29.419 65.706 65.707s-29.418 65.707-65.706 65.707H71.71C35.42 268.767 6 298.185 6 334.477c0 20.585 9.467 38.96 24.284 51.007a65.686 65.686 0 0 0 14.487 8.942c8.22 3.699 17.337 5.758 26.94 5.758h139.175c36.288 0 65.707 29.418 65.707 65.71 0 36.291-29.415 65.707-65.707 65.707H6.003'

// Path length for strokeDasharray - increased to reach the end of path
// Original calibration was done with 1450, so percentages are scaled accordingly
const PATH_LENGTH = 2000

// Colors from design
const PATH_BACKGROUND_COLOR = '#E2EEE8'
const PATH_FILL_COLOR = '#2E7D60'

// Original SVG viewBox dimensions
const SVG_WIDTH = 283
const SVG_HEIGHT = 538

// Trophy positions along the path (x, y coordinates based on the design)
const TROPHY_POSITIONS = [
  { x: 277, y: 6 }, // 24h - top right
  { x: 50, y: 6 }, // 3d - left
  { x: 150, y: 130 }, // 7d - right
  { x: 250, y: 250 }, // 14d - left
  { x: 80, y: 270 }, // 21d - right
  { x: 150, y: 400 }, // 30d - bottom left
  { x: 230, y: 520 }, // 60d - bottom middle
  { x: 10, y: 530 }, // 90d - bottom right (approximate)
]

// Fixed fill percentages for each trophy achievement
// Adjusted for visual spacing - 14d and 21d are very close on the path (y:250 vs y:270)
const TROPHY_FILL_PERCENTAGES = [
  8, // 24h - fill to 8%
  18, // 3d - fill to 18% (10% gap)
  32, // 7d - fill to 32% (14% gap)
  40, // 14d - fill to 44% (reduced to avoid reaching 21d)
  55, // 21d - fill to 60% (16% gap from 14d)
  68, // 30d - fill to 73% (13% gap)
  78, // 60d - fill to 87% (14% gap)
  100, // 90d - fill to 100% (13% gap, complete)
]

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(20),
    minHeight: scale(SVG_HEIGHT) + verticalScale(80),
  },
  pathContainer: {
    position: 'relative',
    width: scale(SVG_WIDTH),
    height: scale(SVG_HEIGHT),
    alignSelf: 'center',
  },
  trophyContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: TROPHY_SIZE,
    height: TROPHY_SIZE,
    backgroundColor: '#BFE3C0',
    borderRadius: TROPHY_SIZE / 2,
  },
  locked: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderColor: Colors.light.gray2,
  },
  trophyImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  trophyLabel: {
    position: 'absolute',
    bottom: -25,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary4,
    textAlign: 'center',
  },
})

interface TrophyWithStatus extends TrophyConfig {
  isEarned: boolean
  isCurrentlyReached: boolean
  progressToNext: number
  position: { x: number, y: number }
}

function TrophiesScreen() {
  const { t } = useTranslation('trophies')

  // Get data from API
  const { data: trophies } = useGetTrophies()
  const { data: currentStreak } = useGetCurrentSobrietyStreak()

  // Calculate trophy statuses and positions
  const trophiesWithStatus = useMemo<TrophyWithStatus[]>(() => {
    const currentHours = currentStreak?.durationHours ?? 0
    const earnedTrophyTypes = trophies?.map(t => t.trophy_type) ?? []

    // Calculate scale factor to fit SVG path on screen
    const screenWidth = scale(283) // Use design width
    const scaleFactorX = screenWidth / SVG_WIDTH
    const scaleFactorY = scaleFactorX // Keep aspect ratio

    return TROPHY_CONFIG.map((trophy, index) => {
      // Check if trophy is earned (permanently unlocked)
      const isEarned = earnedTrophyTypes.includes(trophy.type)

      // Calculate if trophy is currently reached in active streak
      const isCurrentlyReached = currentHours >= trophy.hours

      // Calculate progress to next trophy (0-100%)
      const prevHours = index > 0 ? TROPHY_CONFIG[index - 1].hours : 0
      const progressToNext = index < TROPHY_CONFIG.length - 1
        ? Math.min(100, Math.max(0, ((currentHours - prevHours) / (trophy.hours - prevHours)) * 100))
        : isCurrentlyReached ? 100 : 0

      // Get position from predefined coordinates and scale
      const pos = TROPHY_POSITIONS[index]
      const x = pos.x * scaleFactorX - TROPHY_SIZE / 2
      const y = pos.y * scaleFactorY - TROPHY_SIZE / 2

      return {
        ...trophy,
        isEarned,
        isCurrentlyReached,
        progressToNext,
        position: { x, y },
      }
    })
  }, [currentStreak, trophies])

  // Calculate path progress
  const pathProgress = useMemo(() => {
    // Check if there's an active streak
    if (!currentStreak?.streak?.is_active) {
      return {
        percentage: 0,
        currentSegment: 0,
      }
    }

    const currentHours = currentStreak?.durationHours ?? 0

    // If duration is 0 or negative, no progress
    if (currentHours <= 0) {
      return {
        percentage: 0,
        currentSegment: 0,
      }
    }

    // Check if user has reached or exceeded the last trophy
    const lastTrophyHours = TROPHY_CONFIG[TROPHY_CONFIG.length - 1].hours
    if (currentHours >= lastTrophyHours) {
      return {
        percentage: 100,
        currentSegment: TROPHY_CONFIG.length - 1,
      }
    }

    // Find the last trophy reached
    let lastReachedTrophyIndex = -1
    for (let i = 0; i < TROPHY_CONFIG.length; i++) {
      if (currentHours >= TROPHY_CONFIG[i].hours) {
        lastReachedTrophyIndex = i
      }
      else {
        break
      }
    }

    // If no trophy reached yet, show small progress towards first trophy
    if (lastReachedTrophyIndex === -1) {
      const firstTrophyHours = TROPHY_CONFIG[0].hours
      const progressRatio = currentHours / firstTrophyHours
      // Fill halfway to first trophy's percentage
      return {
        percentage: progressRatio * (TROPHY_FILL_PERCENTAGES[0] / 2),
        currentSegment: 0,
      }
    }

    // Return fixed percentage for the last reached trophy
    return {
      percentage: TROPHY_FILL_PERCENTAGES[lastReachedTrophyIndex],
      currentSegment: lastReachedTrophyIndex,
    }
  }, [currentStreak])

  return (
    <ScreenContainer>
      <Header title={t('your-trophies')} />

      <View style={styles.scrollContent}>
        <View style={styles.pathContainer}>
          {/* Draw paths */}
          <Svg
            width={scale(SVG_WIDTH)}
            height={scale(SVG_HEIGHT)}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            style={{ position: 'absolute' }}
          >
            {/* Background path (gray) */}
            <Path
              d={TROPHY_PATH}
              stroke={PATH_BACKGROUND_COLOR}
              strokeWidth={PATH_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeMiterlimit={10}
            />

            {/* Progress path (green) - fills based on progress */}
            {pathProgress.percentage > 0 && (
              <Path
                d={TROPHY_PATH}
                stroke={PATH_FILL_COLOR}
                strokeWidth={PATH_WIDTH}
                fill="none"
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeDasharray={PATH_LENGTH}
                strokeDashoffset={
                  pathProgress.percentage >= 100
                    ? 0 // Force complete fill for 100%
                    : PATH_LENGTH - (PATH_LENGTH * pathProgress.percentage) / 100
                }
              />
            )}
          </Svg>

          {/* Draw trophies */}
          {trophiesWithStatus.map(trophy => (
            <View
              key={trophy.type}
              style={[
                styles.trophyContainer,
                trophy.isEarned ? {} : styles.locked,
                { left: trophy.position.x, top: trophy.position.y },
              ]}
            >
              {trophy.isEarned
                ? (
                    <Image source={trophy.image} style={styles.trophyImage} />
                  )
                : (
                    <LockedTrophyIcon width={26} height={35} />
                  )}
              {trophy.isEarned && (
                <ThemedText style={styles.trophyLabel}>
                  {t(trophy.type)}
                </ThemedText>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  )
}

export default TrophiesScreen
