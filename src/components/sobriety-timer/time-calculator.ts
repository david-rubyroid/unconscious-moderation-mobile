import type { DisplayUnit, TimeBreakdown } from './types'

/**
 * Calculate time breakdown from a start date to now
 */
export function calculateTimeBreakdown(startDate: Date): TimeBreakdown {
  const now = new Date()
  const diff = now.getTime() - startDate.getTime()

  // Calculate total values
  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  // Calculate years and months
  let years = 0
  let months = 0

  let tempDate = new Date(startDate)

  // Count years
  while (tempDate.getFullYear() < now.getFullYear()
    || (tempDate.getFullYear() === now.getFullYear()
      && tempDate.getMonth() < now.getMonth())
    || (tempDate.getFullYear() === now.getFullYear()
      && tempDate.getMonth() === now.getMonth()
      && tempDate.getDate() <= now.getDate())) {
    tempDate.setFullYear(tempDate.getFullYear() + 1)
    if (tempDate <= now) {
      years++
    }
    else {
      tempDate.setFullYear(tempDate.getFullYear() - 1)
      break
    }
  }

  // Count months
  tempDate = new Date(startDate)
  tempDate.setFullYear(tempDate.getFullYear() + years)

  while (tempDate.getMonth() < now.getMonth()
    || (tempDate.getMonth() === now.getMonth() && tempDate.getDate() <= now.getDate())) {
    tempDate.setMonth(tempDate.getMonth() + 1)
    if (tempDate <= now) {
      months++
    }
    else {
      tempDate.setMonth(tempDate.getMonth() - 1)
      break
    }
  }

  // Calculate remaining time units
  const remainingDays = totalDays - (years * 365 + months * 30)
  const hours = totalHours % 24
  const minutes = totalMinutes % 60
  const seconds = totalSeconds % 60

  return {
    years,
    months,
    days: remainingDays,
    hours,
    minutes,
    seconds,
  }
}

/**
 * Get display units based on time breakdown
 * Always shows minimum 4 units: days, hours, minutes, seconds
 */
export function getDisplayUnits(breakdown: TimeBreakdown): DisplayUnit[] {
  const units: DisplayUnit[] = []

  const { years, months, days, hours, minutes, seconds } = breakdown

  // Add years if present
  if (years > 0) {
    units.push({
      value: years,
      label: years === 1 ? 'year' : 'years',
      maxValue: 100, // No real max for years
      progress: 100, // Always full if exists
      unit: 'years',
    })
  }

  // Add months if present
  if (months > 0) {
    units.push({
      value: months,
      label: months === 1 ? 'month' : 'months',
      maxValue: 12,
      progress: years > 0 ? (months / 12) * 100 : 100,
      unit: 'months',
    })
  }

  // Always show days (minimum 4 circles: days, hours, minutes, seconds)
  units.push(
    {
      value: days,
      label: days === 1 ? 'day' : 'days',
      maxValue: 30,
      progress: (days / 30) * 100,
      unit: 'days',
    },
    {
      value: hours,
      label: hours === 1 ? 'hour' : 'hours',
      maxValue: 24,
      progress: (hours / 24) * 100,
      unit: 'hours',
    },
    {
      value: minutes,
      label: minutes === 1 ? 'minute' : 'minutes',
      maxValue: 60,
      progress: (minutes / 60) * 100,
      unit: 'minutes',
    },
    {
      value: seconds,
      label: seconds === 1 ? 'second' : 'seconds',
      maxValue: 60,
      progress: (seconds / 60) * 100,
      unit: 'seconds',
    },
  )

  return units
}

/**
 * Format unit value with leading zero if needed
 * If value is 0, show single "0" instead of "00"
 */
export function formatUnitValue(value: number): string {
  if (value === 0) {
    return '0'
  }
  return value.toString().padStart(2, '0')
}
