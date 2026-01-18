import type { DrinkSessionWithStatsResponse } from '@/api/queries/drink-session/dto'

/**
 * Data for a specific calendar day
 * date - day date (can be Date object or ISO string)
 * Other fields can be any depending on usage context
 */
export interface CalendarDayData extends DrinkSessionWithStatsResponse {
  date: Date | string
}

/**
 * Calendar component props
 */
export interface CalendarProps {
  /** Whether to show navigation buttons */
  withNavigationButtons?: boolean

  /** Data for days (optional) */
  daysData?: CalendarDayData[]

  /** Function to render custom content in day cell */
  renderDayContent?: (_day: Date, _dayData?: CalendarDayData) => React.ReactNode

  /** Day click handler */
  onDayPress?: (_day: Date, _dayData?: CalendarDayData) => void

  /** Initial month (0-11, where 0 = January) */
  initialMonth?: number

  /** Initial year */
  initialYear?: number

  /** Minimum date for display (optional) */
  minDate?: Date

  /** Maximum date for display (optional) */
  maxDate?: Date

  /** Callback when month/year changes */
  onMonthChange?: (_month: number, _year: number) => void
}
