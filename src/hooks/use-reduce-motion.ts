import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

/**
 * Hook to detect if reduce motion is enabled in system accessibility settings.
 * When reduce motion is enabled, animations should be disabled or simplified.
 *
 * @returns boolean - true if reduce motion is enabled, false otherwise
 */
export function useReduceMotion(): boolean {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false)

  useEffect(() => {
    const checkReduceMotion = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled()
        setReduceMotionEnabled(isEnabled ?? false)
      }
      catch (error) {
        console.warn('Failed to check reduce motion setting:', error)
        setReduceMotionEnabled(false)
      }
    }

    checkReduceMotion()

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setReduceMotionEnabled(isEnabled)
      },
    )

    return () => {
      subscription?.remove()
    }
  }, [])

  return reduceMotionEnabled
}
