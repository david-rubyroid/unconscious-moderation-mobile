import type { ImageSourcePropType } from 'react-native'
import type { Step } from '../progress-steps'

import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import MedalIcon from '@/assets/icons/medal'

import { Colors, withOpacity } from '@/constants/theme'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'

import Accordion from '../accordion'
import ThemedText from '../themed-text'
import ActivityCardsList from './activity-cards-list'

const styles = StyleSheet.create({
  medalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(18),
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(25),
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    backgroundColor: withOpacity(Colors.light.white, 0.8),
  },
  medalContentHeaderText: {
    flexShrink: 1,
    gap: verticalScale(3),
  },
  medalContentHeaderTextTitle: {
    color: Colors.light.primary4,
  },
  medalContentHeaderTextMessage: {
    color: Colors.light.primary4,
  },
  medalContentHeaderTextMessageBold: {
    color: Colors.light.primary4,
    fontWeight: 600,
  },
  yourDay: {
    paddingHorizontal: scale(25),
    paddingVertical: verticalScale(16),
    backgroundColor: withOpacity(Colors.light.white, 0.8),
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: withOpacity(Colors.light.black, 0.5),
    marginBottom: verticalScale(20),
  },
  yourDayTitle: {
    color: Colors.light.primary,
  },
})

interface ActivityCard {
  id: string
  image: ImageSourcePropType
  label: string
  onPress: () => void
}

interface DayCompletionMedalProps {
  dailyActivitiesDay: number
  steps: Step[]
  locked: boolean
  activities: ActivityCard[]
}

function DayCompletionMedal({
  dailyActivitiesDay,
  steps,
  locked,
  activities,
}: DayCompletionMedalProps) {
  const { t } = useTranslation('home')
  const { t: tDailyCompleteMessages } = useTranslation('daily-complete-messages')

  return (
    <>
      <View style={styles.medalContainer}>
        <View style={styles.medalContentHeaderText}>
          <ThemedText type="defaultSemiBold" style={styles.medalContentHeaderTextTitle}>
            {tDailyCompleteMessages(`day-${dailyActivitiesDay}.title`)}
          </ThemedText>

          <ThemedText type="default" style={styles.medalContentHeaderTextMessage}>
            <Trans
              i18nKey={`daily-complete-messages:day-${dailyActivitiesDay}.message`}
              components={[
                <ThemedText key="0" type="default" style={styles.medalContentHeaderTextMessageBold} />,
              ]}
            />
          </ThemedText>
        </View>

        <MedalIcon />
      </View>

      <Accordion
        headerStyle={styles.yourDay}
        header={(
          <ThemedText type="defaultSemiBold" style={styles.yourDayTitle}>
            {t('your-day')}
          </ThemedText>
        )}
      >
        <ActivityCardsList steps={steps} locked={locked} activities={activities} />
      </Accordion>
    </>
  )
}

export default DayCompletionMedal
