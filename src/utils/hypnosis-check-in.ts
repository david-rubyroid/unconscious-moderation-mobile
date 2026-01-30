import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

export type HypnosisCheckInType = '1Hour' | 'awareness' | 'grounding'

export function getHypnosisCheckInForHour(hoursSinceFirstDrink: number): {
  type: HypnosisCheckInType
  link: string
} | null {
  if (hoursSinceFirstDrink === 1) {
    return { type: '1Hour', link: HYPNOSIS_LINKS['1HourCheckIn'] }
  }

  if (hoursSinceFirstDrink === 2) {
    return { type: 'awareness', link: HYPNOSIS_LINKS.awarenessCheckIn }
  }

  if (hoursSinceFirstDrink === 3) {
    return { type: 'grounding', link: HYPNOSIS_LINKS.groundingCheckIn }
  }

  // Hour 4+: alternate Awareness (even) / Grounding (odd)
  if (hoursSinceFirstDrink % 2 === 0) {
    return { type: 'awareness', link: HYPNOSIS_LINKS.awarenessCheckIn }
  }

  return { type: 'grounding', link: HYPNOSIS_LINKS.groundingCheckIn }
}
