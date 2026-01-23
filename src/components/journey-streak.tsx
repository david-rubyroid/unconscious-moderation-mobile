import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useGetDaysWithActivities } from '@/api/queries/daily-activities'

import FireIcon from '@/assets/icons/fire'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    gap: scale(13),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: scale(14),
    paddingVertical: scale(9),
    backgroundColor: withOpacity(Colors.light.white, 0.7),
    borderRadius: scale(10),
  },
  iconContainer: {
    backgroundColor: '#BFE3C0',
    borderRadius: scale(7),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(8),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(5),
  },
  journeyStreakText: {
    fontWeight: 500,
  },
})

function JourneyStreak() {
  const { t } = useTranslation('free-drink-tracker')

  const { data: daysWithActivities } = useGetDaysWithActivities()
  const days = daysWithActivities?.journeyStreak ?? 0

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FireIcon />
      </View>

      <View style={styles.textContainer}>
        <ThemedText style={styles.journeyStreakText} type="defaultSemiBold">{t('journey-streak')}</ThemedText>
        <ThemedText type="defaultSemiBold">{t('journey-streak-description', { days })}</ThemedText>
      </View>
    </View>
  )
}

export default JourneyStreak
