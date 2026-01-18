import type { CalendarDayData } from '@/components/calendar/types'

/**
 * Normalize date to midnight (00:00:00) for day comparison
 */
export function normalizeDateToDay(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

/**
 * Check if a day is in the future (compared to today)
 */
export function isFutureDay(day: Date): boolean {
  const today = normalizeDateToDay(new Date())
  const dayDate = normalizeDateToDay(day)
  return dayDate > today
}

/**
 * Compare two dates without time (only day, month, year)
 */
export function areDatesEqual(date1: Date, date2: Date): boolean {
  const d1 = normalizeDateToDay(date1)
  const d2 = normalizeDateToDay(date2)
  return d1.getTime() === d2.getTime()
}

/**
 * Extract UTC date (year/month/day) and create local date at midnight
 * This prevents timezone issues when comparing dates from the server
 * @param date - Date to extract UTC date from (can be Date, string, or undefined)
 * @returns Date object with UTC year/month/day at local midnight, or undefined if input is invalid
 */
export function extractUTCDate(date: Date | string | undefined): Date | undefined {
  if (!date)
    return undefined

  const d = typeof date === 'string' ? new Date(date) : date

  // Extract UTC year/month/day and create UTC date at midnight
  const utcYear = d.getUTCFullYear()
  const utcMonth = d.getUTCMonth()
  const utcDay = d.getUTCDate()

  return new Date(Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0, 0))
}

/**
 * Find day data for a specific date in the days data array
 */
export function findDayData(day: Date, daysData: CalendarDayData[]): CalendarDayData | undefined {
  return daysData.find((d) => {
    // Use extractUTCDate for dates from API to handle timezone correctly
    const dDate = extractUTCDate(d.date) ?? new Date(d.date)
    // Compare date components instead of timestamps to avoid timezone issues
    // dDate is in UTC, day is in local time, so compare UTC components with local components
    return dDate.getUTCFullYear() === day.getFullYear()
      && dDate.getUTCMonth() === day.getMonth()
      && dDate.getUTCDate() === day.getDate()
  })
}

/**
 * Check if a date is before user's account creation date
 * @param date - Date to check
 * @param userCreatedAt - User's account creation date
 * @returns true if date is before account creation (the creation day itself is accessible)
 */
export function isBeforeAccountCreation(date: Date, userCreatedAt?: Date): boolean {
  if (!userCreatedAt)
    return false

  // Extract UTC date from createdAt to avoid timezone issues
  // This handles both string dates from API and Date objects
  // extractUTCDate already returns a date at midnight, no need to normalize again
  const createdAtDate = extractUTCDate(userCreatedAt)
  if (!createdAtDate)
    return false

  // Normalize the comparison date to midnight for accurate comparison
  const dateOnly = normalizeDateToDay(date)

  // Use strict < so that the creation day itself (when dates are equal) is NOT blocked
  // Only dates strictly before the creation day are blocked
  // createdAtDate is already normalized to midnight, so compare directly
  return dateOnly.getTime() < createdAtDate.getTime()
}

/**
 * Convert a date to UTC noon for consistent date-only storage
 * This prevents timezone boundary issues when storing dates without time
 * @param date - Date object to convert
 * @returns ISO string with time set to 12:00:00 UTC
 */
export function dateToUTCNoon(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return new Date(Date.UTC(year, month, day, 12, 0, 0, 0)).toISOString()
}
