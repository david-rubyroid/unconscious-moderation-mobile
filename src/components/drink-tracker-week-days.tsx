import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useGetCurrentWeekDrinkSessions } from '@/api/queries/drink-session'

import { Colors, withOpacity } from '@/constants/theme'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

const DAY_NAMES_SHORT = [
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
  'Su',
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
    gap: scale(3),
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(9),
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.7),
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
  const { data: sessions = [] } = useGetCurrentWeekDrinkSessions()

  // Create a map of date keys to sessions for quick lookup
  const sessionsByDate = new Map<string, boolean>()
  sessions.forEach((session) => {
    const sessionDate = new Date(session.plannedStartTime)
    const sessionDateKey = formatDateKey(sessionDate)
    sessionsByDate.set(sessionDateKey, true)
  })

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
          const hasSession = sessionsByDate.has(dateKey)
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
