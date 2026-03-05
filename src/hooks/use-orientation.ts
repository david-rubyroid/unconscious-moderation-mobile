import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect, useState } from 'react'

export type OrientationType = 'portrait' | 'landscape'

/**
 * Hook to track screen orientation changes
 * Returns 'portrait' or 'landscape'
 */
export function useOrientation(): OrientationType {
  const [orientation, setOrientation] = useState<OrientationType>('portrait')

  useEffect(() => {
    const updateOrientation = async () => {
      try {
        const orientationInfo = await ScreenOrientation.getOrientationAsync()
        const isLandscape
          = orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_LEFT
            || orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_RIGHT

        setOrientation(isLandscape ? 'landscape' : 'portrait')
      }
      catch (error) {
        console.error('Failed to get orientation', error)
      }
    }

    updateOrientation()

    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const isLandscape
        = event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT
          || event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT

      setOrientation(isLandscape ? 'landscape' : 'portrait')
    })

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription)
    }
  }, [])

  return orientation
}
