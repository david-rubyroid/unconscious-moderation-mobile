import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useGetDaysWithActivities } from '@/api/queries/daily-activities'

import DailyActivityCheckIcon from '@/assets/icons/daily-activity-check'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

interface DailyActivitiesDaysProps {
  dailyActivitiesDay: number
  onDayPress: (_day: number) => void
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: -scale(15),
  },
  container: {
    flexDirection: 'row',
    gap: scale(22),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(20),
  },
  dayContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    borderRadius: scale(10),
    backgroundColor: withOpacity(Colors.light.white, 0.7),
  },
  dailyActivityCheckIcon: {
    position: 'absolute',
    zIndex: 1,
    top: -4,
    right: -4,
  },
  dayText: {
    color: Colors.light.black,
  },
  completedDayContainer: {
    backgroundColor: Colors.light.primary,
  },
  completedDayText: {
    color: Colors.light.white,
  },
})

function DailyActivitiesDays({ onDayPress, dailyActivitiesDay }: DailyActivitiesDaysProps) {
  const { data: daysWithActivities } = useGetDaysWithActivities()

  const days = daysWithActivities?.days.filter(day => day.isUnlocked) ?? []

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scrollContainer}
      >
        {days.map(day => (
          <Pressable
            key={day.dayNumber}
            style={[styles.dayContainer, dailyActivitiesDay === day.dayNumber && styles.completedDayContainer]}
            onPress={() => onDayPress(day.dayNumber)}
          >
            {day.allActivitiesCompleted && (
              <DailyActivityCheckIcon style={styles.dailyActivityCheckIcon} />
            )}

            <ThemedText
              type="defaultSemiBold"
              style={[styles.dayText, dailyActivitiesDay === day.dayNumber && styles.completedDayText]}
            >
              {day.dayNumber}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export default DailyActivitiesDays
