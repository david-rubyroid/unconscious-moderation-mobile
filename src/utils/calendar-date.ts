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
 * Convert local date components to UTC date at midnight
 * Takes the local year/month/day and creates a UTC date with those same values
 * @param date - Date with local date components
 * @returns Date object with local date components as UTC at midnight
 */
export function localDateToUTC(date: Date): Date {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}

/**
 * Find day data for a specific date in the days data array
 */
export function findDayData(day: Date, daysData: CalendarDayData[]): CalendarDayData | undefined {
  // Convert the local calendar day to UTC for consistent comparison
  // This takes local date components (year, month, day) and creates UTC date with same values
  const dayUTC = localDateToUTC(day)

  return daysData.find((d) => {
    // Use extractUTCDate for dates from API to handle timezone correctly
    const dDate = extractUTCDate(d.date) ?? new Date(d.date)
    // Compare UTC components with UTC components for consistency
    return dDate.getUTCFullYear() === dayUTC.getUTCFullYear()
      && dDate.getUTCMonth() === dayUTC.getUTCMonth()
      && dDate.getUTCDate() === dayUTC.getUTCDate()
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

  const createdAtDate = extractUTCDate(userCreatedAt)
  if (!createdAtDate)
    return false

  // Convert local calendar date to UTC for consistent comparison
  const dateToCheck = localDateToUTC(date)

  return dateToCheck.getTime() < createdAtDate.getTime()
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
