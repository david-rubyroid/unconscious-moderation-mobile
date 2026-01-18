import { useMemo } from 'react'

import { useDrinkSessionsCalendar } from '@/hooks/drink-sessions-calendar/use-drink-sessions-calendar'

interface MonthlyMetrics {
  totalDrinks: number
  maxDrinks: number
  totalWater: number
  totalSpent: number
}

/**
 * Hook to calculate monthly aggregated metrics from drink sessions
 * @param month - Month index (0-11, where 0 = January). If not provided, uses current month
 * @param year - Year. If not provided, uses current year
 * @returns Aggregated metrics for the month
 */
export function useMonthlyMetrics(month?: number, year?: number): MonthlyMetrics {
  const daysData = useDrinkSessionsCalendar(month, year)

  const metrics = useMemo<MonthlyMetrics>(() => {
    // Filter only completed sessions (status === 'completed')
    const completedSessions = daysData.filter(
      session => session.status === 'completed',
    )

    const aggregated = completedSessions.reduce(
      (acc, session) => {
        return {
          totalDrinks: acc.totalDrinks + (session.totalDrinks || 0),
          maxDrinks: acc.maxDrinks + (session.maxDrinkCount || 0),
          totalWater: acc.totalWater + (session.totalWaterCups || 0),
          totalSpent: acc.totalSpent + (Number(session.actualSpent) || 0),
        }
      },
      {
        totalDrinks: 0,
        maxDrinks: 0,
        totalWater: 0,
        totalSpent: 0,
      },
    )

    return aggregated
  }, [daysData])

  return metrics
}
