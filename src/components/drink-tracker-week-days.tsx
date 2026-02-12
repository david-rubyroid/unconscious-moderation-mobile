import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useGetCurrentWeekDrinkSessions } from '@/api/queries/drink-session'

import CocktailIcon from '@/assets/icons/cocktail'
import HeartIcon from '@/assets/icons/heart-outline'

import { Colors, withOpacity } from '@/constants/theme'

import { moderateScale, scale } from '@/utils/responsive'

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

function getDaysOfWeek(monday: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    days.push(day)
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
    gap: scale(6),
    paddingHorizontal: scale(15),
  },
  dayButton: {
    width: 50,
    height: 33,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(3),
    borderRadius: moderateScale(9),
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.7),
  },
  dayButtonToday: {
    backgroundColor: withOpacity(Colors.light.primary, 0.7),
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
  const weekDays = getDaysOfWeek(monday)
  const { data: sessions = [] } = useGetCurrentWeekDrinkSessions()

  // Create a map of date keys to sessions for quick lookup
  const sessionsByDate = new Map<string, boolean>()
  sessions.forEach((session) => {
    const sessionDate = new Date(session.plannedStartTime)
    const sessionDateKey = formatDateKey(sessionDate)
    sessionsByDate.set(sessionDateKey, true)
  })

  const getDayIcon = (
    isCurrentDay: boolean,
    hasSession: boolean,
  ): React.ReactNode => {
    if (isCurrentDay) {
      return (
        <HeartIcon
          width={scale(13)}
          height={scale(11)}
          color={Colors.light.white}
        />
      )
    }
    if (hasSession) {
      return (
        <CocktailIcon
          width={scale(10)}
          height={scale(13)}
          color={Colors.light.error2}
        />
      )
    }
    return (
      <HeartIcon
        width={scale(13)}
        height={scale(11)}
        color={Colors.light.primary4}
      />
    )
  }

  return (
    <View>
      <ScrollView
        horizontal
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
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
                style={[
                  styles.dayText,
                  isCurrentDay && styles.dayTextToday,
                  !isCurrentDay && hasSession && styles.dayTextWithSession,
                ]}
              >
                {dayName}
              </ThemedText>

              {getDayIcon(isCurrentDay, hasSession)}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default DrinkTrackerWeekDays
