import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useGetCurrentStreak } from '@/api/queries/sobriety-tracker'

import FireIcon from '@/assets/icons/fire'

import { ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

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

  const { data: currentStreak } = useGetCurrentStreak()
  const days = currentStreak?.durationDays ?? 0

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
