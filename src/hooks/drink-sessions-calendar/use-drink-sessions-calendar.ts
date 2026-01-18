import type { DrinkSessionWithStatsResponse } from '@/api/queries/drink-session/dto'
import type { CalendarDayData } from '@/components/calendar/types'

import { useMemo } from 'react'

import { useGetDrinkSessionsCalendar } from '@/api/queries/drink-session'

import { extractUTCDate } from '@/utils/calendar-date'

/**
 * Calendar day data that includes session with stats
 * Combines CalendarDayData (date) with full session information
 */
export type DrinkSessionCalendarDayData = CalendarDayData & DrinkSessionWithStatsResponse

/**
 * Hook to prepare drink sessions data for calendar
 * @param month - Month index (0-11, where 0 = January)
 * @param year - Year
 * @returns {DrinkSessionCalendarDayData[]} daysData array with session data
 */
export function useDrinkSessionsCalendar(month?: number, year?: number): DrinkSessionCalendarDayData[] {
  // Use current month/year if not provided
  const now = new Date()
  const currentMonth = month ?? now.getMonth()
  const currentYear = year ?? now.getFullYear()

  const { data: sessions = [] } = useGetDrinkSessionsCalendar(currentMonth, currentYear)

  const daysData = useMemo<DrinkSessionCalendarDayData[]>(() => {
    // Transform sessions to CalendarDayData format
    // Note: Only one session per day is allowed
    return sessions
      .filter(session => session.plannedStartTime)
      .map(session => ({
        ...session,
        // Use extractUTCDate to prevent timezone issues with session dates
        date: extractUTCDate(session.plannedStartTime) ?? new Date(session.plannedStartTime),
      }))
  }, [sessions])

  return daysData
}
