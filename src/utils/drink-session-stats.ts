import type { DrinkLogResponse } from '@/api/queries/drink-log/dto'
import type { DrinkSessionResponse } from '@/api/queries/drink-session/dto'
import type { WaterLogResponse } from '@/api/queries/water-log/dto'

interface DrinkSessionStats {
  sessionDrinks: DrinkLogResponse[] | undefined
  drinkSession: DrinkSessionResponse | undefined
  sessionWater: WaterLogResponse[] | undefined
}

export function getDrinkSessionStats({ sessionDrinks, drinkSession, sessionWater }: DrinkSessionStats) {
  const actualDrinksCount = sessionDrinks?.length || 0
  const maxDrinksCount = drinkSession?.maxDrinkCount || 0
  const actualSpending = Number(drinkSession?.actualSpent) || 0
  const budget = Number(drinkSession?.budget) || 0
  const totalWaterCups = sessionWater?.reduce((sum, water) => sum + water.cups, 0) || 0

  const getTimeSinceFirstDrink = () => {
    if (!sessionDrinks || sessionDrinks.length === 0) {
      return '0 hour'
    }

    const firstDrink = sessionDrinks[0]
    const firstDrinkTime = new Date(firstDrink.createdAt)
    const now = new Date()
    const diffMs = now.getTime() - firstDrinkTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours === 0) {
      return `${diffMinutes} min`
    }

    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  }

  return {
    actualDrinksCount,
    maxDrinksCount,
    actualSpending,
    budget,
    totalWaterCups,
    timeSinceFirstDrink: getTimeSinceFirstDrink(),
  }
}
