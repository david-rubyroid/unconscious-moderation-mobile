import type { CalendarDayData, CalendarProps } from './types'

import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import { findDayData, isBeforeAccountCreation } from '@/utils/calendar-date'

import ThemedText from '../themed-text'

import { styles } from './calendar.styles'

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
]

/**
 * Get number of days in a month
 */
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}
/**
 * Get day of week for the first day of month (0 = Sunday, 6 = Saturday)
 */
function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay()
}
/**
 * Format date to string key (YYYY-MM-DD)
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const EMPTY_DAYS_DATA: CalendarDayData[] = []

function Calendar({
  daysData = EMPTY_DAYS_DATA,
  withNavigationButtons = false,
  renderDayContent,
  onDayPress,
  initialMonth,
  initialYear,
  minDate,
  maxDate,
  onMonthChange,
}: CalendarProps) {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? now.getMonth())
  const [currentYear, setCurrentYear] = useState(initialYear ?? now.getFullYear())

  // Sync with external initialMonth/initialYear changes
  useEffect(() => {
    if (initialMonth !== undefined && initialYear !== undefined) {
      setCurrentMonth(prev => prev !== initialMonth ? initialMonth : prev)
      setCurrentYear(prev => prev !== initialYear ? initialYear : prev)
    }
  }, [initialMonth, initialYear])

  /**
   * Generate calendar grid with dynamic number of rows (5 or 6)
   */
  const generateCalendarDays = (): { days: (Date | null)[], rowCount: number } => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear)

    const days: (Date | null)[] = []

    // Empty days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day))
    }

    // Calculate required number of rows (5 or 6)
    const totalCells = firstDayOfWeek + daysInMonth
    const rowCount = Math.ceil(totalCells / 7)
    const totalGridCells = rowCount * 7

    // Fill remaining cells with null
    while (days.length < totalGridCells) {
      days.push(null)
    }

    return { days, rowCount }
  }

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    let newMonth: number
    let newYear: number

    if (currentMonth === 11) {
      newMonth = 0
      newYear = currentYear + 1
    }
    else {
      newMonth = currentMonth + 1
      newYear = currentYear
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    onMonthChange?.(newMonth, newYear)
  }

  /**
   * Navigate to previous month
   */
  const handlePreviousMonth = () => {
    let newMonth: number
    let newYear: number

    if (currentMonth === 0) {
      newMonth = 11
      newYear = currentYear - 1
    }
    else {
      newMonth = currentMonth - 1
      newYear = currentYear
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    onMonthChange?.(newMonth, newYear)
  }

  /**
   * Check if previous month navigation is allowed
   */
  const canNavigateToPrevMonth = (): boolean => {
    if (!minDate)
      return true

    const minMonth = minDate.getMonth()
    const minYear = minDate.getFullYear()

    // Calculate previous month
    let prevMonth = currentMonth - 1
    let prevYear = currentYear

    if (prevMonth < 0) {
      prevMonth = 11
      prevYear = currentYear - 1
    }

    // Check if previous month is not before minimum date
    return prevYear > minYear || (prevYear === minYear && prevMonth >= minMonth)
  }

  /**
   * Handle day press
   */
  const handleDayPress = (day: Date) => {
    if (isBeforeAccountCreation(day, minDate)) {
      return
    }

    if (maxDate && day > maxDate) {
      return
    }

    const dayData = findDayData(day, daysData)
    onDayPress?.(day, dayData)
  }

  const { days: calendarDays, rowCount } = generateCalendarDays()
  const monthName = MONTH_NAMES[currentMonth]
  const gridHeight = rowCount * 39 // 39px per row

  return (
    <View style={styles.container}>
      {/* Header with month name and navigation */}
      <View style={styles.header}>
        {withNavigationButtons && (
          <Pressable
            onPress={handlePreviousMonth}
            style={styles.moreButton}
            disabled={!canNavigateToPrevMonth()}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.moreButtonText, !canNavigateToPrevMonth()
              && styles.moreButtonTextDisabled]}
            >
              &lt; Prev
            </ThemedText>
          </Pressable>
        )}

        <ThemedText type="defaultSemiBold" style={styles.monthName}>
          {monthName}
        </ThemedText>

        {withNavigationButtons && (
          <Pressable onPress={handleNextMonth} style={styles.moreButton}>
            <ThemedText type="defaultSemiBold" style={styles.moreButtonText}>
              Next &gt;
            </ThemedText>
          </Pressable>
        )}
      </View>

      <View>
        {/* Day names row */}
        <View style={styles.dayNamesRow}>
          {DAY_NAMES.map(dayName => (
            <ThemedText key={dayName} style={styles.dayName}>
              {dayName}
            </ThemedText>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={[styles.grid, { height: gridHeight }]}>
          {calendarDays.map((day, index) => {
            const row = Math.floor(index / 7)
            const col = index % 7
            const isFirstRow = row === 0
            const isLastRow = row === rowCount - 1
            const isFirstCol = col === 0
            const isLastCol = col === 6

            // Determine corner styles
            const cornerStyles = []
            if (isFirstRow && isFirstCol) {
              cornerStyles.push(styles.cornerTopLeft)
            }
            if (isFirstRow && isLastCol) {
              cornerStyles.push(styles.cornerTopRight)
            }
            if (isLastRow && isFirstCol) {
              cornerStyles.push(styles.cornerBottomLeft)
            }
            if (isLastRow && isLastCol) {
              cornerStyles.push(styles.cornerBottomRight)
            }

            // All cells have right and bottom borders
            // First row and first column also have top and left borders
            const cellStyle = {
              borderTopWidth: isFirstRow ? 1 : 0,
              borderLeftWidth: isFirstCol ? 1 : 0,
              borderRightWidth: 1,
              borderBottomWidth: 1,
            }

            if (day === null) {
              return (
                <View
                  key={`empty-${currentYear}-${currentMonth}-${row}-${col}`}
                  style={[styles.emptyDay, cellStyle, ...cornerStyles]}
                />
              )
            }

            const dayData = findDayData(day, daysData)
            // Use isBeforeAccountCreation for minDate to handle UTC dates correctly
            const isBeforeMinDate = minDate ? isBeforeAccountCreation(day, minDate) : false
            const isDisabled = isBeforeMinDate || (maxDate && day > maxDate)

            return (
              <Pressable
                key={formatDateKey(day)}
                onPress={() => handleDayPress(day)}
                disabled={isDisabled}
                style={[
                  styles.dayCell,
                  cellStyle,
                  isDisabled && styles.dayCellDisabled,
                  ...cornerStyles,
                ]}
              >
                <ThemedText type="default" style={styles.dayNumber}>
                  {day.getDate()}
                </ThemedText>

                {renderDayContent && (
                  <View style={styles.dayContent}>
                    {renderDayContent(day, dayData)}
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default Calendar
