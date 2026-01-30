import { useEffect, useRef } from 'react'

interface UsePlannedLimitTrackerParams {
  actualDrinksCount: number
  maxDrinksCount: number
  onLimitExceeded: () => void
}

export function usePlannedLimitTracker({
  actualDrinksCount,
  maxDrinksCount,
  onLimitExceeded,
}: UsePlannedLimitTrackerParams) {
  const previousDrinksCountRef = useRef<number>(0)
  const onLimitExceededRef = useRef(onLimitExceeded)
  onLimitExceededRef.current = onLimitExceeded

  useEffect(() => {
    const previousCount = previousDrinksCountRef.current
    const hasExceededLimit = actualDrinksCount > maxDrinksCount
    const hasIncreased = actualDrinksCount > previousCount

    // Show warning if limit is exceeded AND drinks
    // count has increased (not on initial load)
    if (hasExceededLimit && hasIncreased && previousCount > 0) {
      onLimitExceededRef.current()
    }

    // Update previous count
    previousDrinksCountRef.current = actualDrinksCount
  }, [actualDrinksCount, maxDrinksCount])
}
