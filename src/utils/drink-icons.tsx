import type { DrinkType } from '@/api/queries/drink-session/dto'

import BeerIcon from '@/assets/icons/beer'
import CocktailsIcon from '@/assets/icons/cocktails'
import HardSeltzerReadyToDrink from '@/assets/icons/hard-seltzer-ready-to-drink'
import SpiritsIcon from '@/assets/icons/spirits'
import WineIcon from '@/assets/icons/wine'

export function getDrinkIcon(drinkType: DrinkType) {
  switch (drinkType) {
    case 'wine':
      return <WineIcon />
    case 'beer':
      return <BeerIcon />
    case 'spirits':
      return <SpiritsIcon />
    case 'cocktails':
      return <CocktailsIcon />
    case 'hard-seltzer-ready-to-drink':
      return <HardSeltzerReadyToDrink />
    default:
      return <WineIcon />
  }
}
