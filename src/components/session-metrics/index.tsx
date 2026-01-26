import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DropIcon from '@/assets/icons/drop'
import MoneyIcon from '@/assets/icons/money'
import TimeSinceIcon from '@/assets/icons/time-since'
import WineIcon from '@/assets/icons/wine'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from '../themed-text'

interface SessionMetricsProps {
  actualDrinksCount: number
  maxDrinksCount: number
  totalWaterCups: number
  actualSpent: number
  sessionEndTime?: string
  showEndTime?: boolean
}

const styles = StyleSheet.create({
  metricsContainer: {
    width: '100%',
    gap: verticalScale(8),
  },
  metricBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(6),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(12),
    gap: scale(12),
  },
  metricIconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: '50%',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: withOpacity(Colors.light.black, 0.5),
    fontWeight: '400',
  },
  metricValue: {
    color: Colors.light.black,
    fontWeight: '400',
  },
})

function SessionMetrics({
  actualDrinksCount,
  maxDrinksCount,
  totalWaterCups,
  actualSpent,
  sessionEndTime,
  showEndTime = false,
}: SessionMetricsProps) {
  const { t } = useTranslation('reflect-reinforce')

  return (
    <View style={styles.metricsContainer}>
      {/* Drinks Block */}
      <View style={styles.metricBlock}>
        <View style={styles.metricIconContainer}>
          <WineIcon width={scale(14)} height={scale(24)} />
        </View>
        <View style={styles.metricContent}>
          <ThemedText type="default" style={styles.metricLabel}>
            {t('drinks')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.metricValue}>
            {`${actualDrinksCount}/${maxDrinksCount}*`}
          </ThemedText>
        </View>
      </View>

      {/* Water Block */}
      <View style={styles.metricBlock}>
        <View style={styles.metricIconContainer}>
          <DropIcon color={Colors.light.primary} width={scale(19)} height={scale(25)} />
        </View>
        <View style={styles.metricContent}>
          <ThemedText type="default" style={styles.metricLabel}>
            {t('water')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.metricValue}>
            {`${totalWaterCups}*`}
          </ThemedText>
        </View>
      </View>

      {/* Cost Block */}
      <View style={styles.metricBlock}>
        <View style={styles.metricIconContainer}>
          <MoneyIcon width={scale(45)} height={scale(45)} />
        </View>
        <View style={styles.metricContent}>
          <ThemedText type="default" style={styles.metricLabel}>
            {t('const')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.metricValue}>
            {`$${actualSpent.toFixed(2)}*`}
          </ThemedText>
        </View>
      </View>

      {/* Session End Time Block */}
      {showEndTime && sessionEndTime && (
        <View style={styles.metricBlock}>
          <View style={styles.metricIconContainer}>
            <TimeSinceIcon width={scale(26)} height={scale(26)} />
          </View>
          <View style={styles.metricContent}>
            <ThemedText type="default" style={styles.metricLabel}>
              {t('session-end-time')}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metricValue}>
              {sessionEndTime}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  )
}

export default SessionMetrics
