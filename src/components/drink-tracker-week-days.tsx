import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'

const DAY_NAMES_SHORT = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

function getDaysOfWeek(monday: Date, today: Date): Date[] {
  const days: Date[] = []
  const todayKey = formatDateKey(today)

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)

    const dayKey = formatDateKey(day)

    // Показываем только дни до сегодня включительно
    if (dayKey <= todayKey) {
      days.push(day)
    }
  }

  return days
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

function isToday(date: Date, today: Date): boolean {
  return formatDateKey(date) === formatDateKey(today)
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: -scale(15),
  },
  container: {
    flexDirection: 'row',
    gap: scale(13),
    paddingHorizontal: scale(15),
  },
  dayButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(10),
    paddingHorizontal: scale(11.5),
    paddingVertical: verticalScale(14.5),
    borderRadius: moderateScale(9),
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.7),
    minWidth: scale(100),
  },
  dayButtonToday: {
    backgroundColor: Colors.light.primary,
  },
  dayText: {
    color: Colors.light.primary4,
  },
  dayTextToday: {
    color: Colors.light.white,
  },
  dayTextWithSession: {
    color: Colors.light.error2,
  },
})

function DrinkTrackerWeekDays() {
  const today = new Date()
  const monday = getMondayOfWeek(today)
  const weekDays = getDaysOfWeek(monday, today)

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scrollContainer}
      >
        {weekDays.map((day) => {
          const dateKey = formatDateKey(day)
          const hasSession = false
          const isCurrentDay = isToday(day, today)
          const dayIndex = day.getDay() === 0 ? 6 : day.getDay() - 1 // Monday = 0
          const dayName = DAY_NAMES_SHORT[dayIndex]

          return (
            <Pressable
              key={dateKey}
              style={[
                styles.dayButton,
                isCurrentDay && styles.dayButtonToday,
              ]}
              onPress={() => {}}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.dayText,
                  isCurrentDay && styles.dayTextToday,
                  !isCurrentDay && hasSession && styles.dayTextWithSession,
                ]}
              >
                {dayName}
              </ThemedText>
              {isCurrentDay
                ? (
                    <MaterialIcons name="favorite-border" size={scale(19)} color={Colors.light.white} />
                  )
                : hasSession
                  ? (
                      <MaterialIcons name="local-bar" size={scale(19)} color={Colors.light.error2} />
                    )
                  : (
                      <MaterialIcons name="favorite-border" size={scale(19)} color={Colors.light.primary4} />
                    )}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default DrinkTrackerWeekDays
