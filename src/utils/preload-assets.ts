/* eslint-disable ts/no-require-imports -- Metro requires static require() for asset bundling */
import { Asset } from 'expo-asset'

import { logDebug, logError } from '@/utils/logger'

/**
 * All image assets from assets/images to be preloaded at app startup.
 * Uses explicit require() - Metro does not support dynamic paths.
 */
const IMAGE_ASSETS = [
  // Modal (critical - used in gradient modals)
  require('@/assets/images/modal-bg.jpg'),
  // Root images
  require('@/assets/images/box-breathing-bg.jpg'),
  require('@/assets/images/daily-activity-medal.png'),
  require('@/assets/images/drink-with-awareness.jpg'),
  require('@/assets/images/end-of-trial.jpg'),
  require('@/assets/images/mantra.jpg'),
  require('@/assets/images/master-class.png'),
  require('@/assets/images/manage-urges.jpg'),
  require('@/assets/images/plan-and-prepare.jpg'),
  require('@/assets/images/pre-drink-hydration.jpg'),
  require('@/assets/images/pro-tip.jpg'),
  require('@/assets/images/quick-writing.jpg'),
  require('@/assets/images/reflect-and-reinforce.jpg'),
  require('@/assets/images/reflect-reinforce.jpg'),
  require('@/assets/images/the-team-at-um.png'),
  require('@/assets/images/welcome-to-your-journey.jpg'),
  // First-time popup
  require('@/assets/images/first-time-popup/first-time-popup-1.png'),
  require('@/assets/images/first-time-popup/first-time-popup-2.png'),
  require('@/assets/images/first-time-popup/first-time-popup-3.png'),
  require('@/assets/images/first-time-popup/first-time-popup-4.png'),
  // Manage urge
  require('@/assets/images/manage-urge/box-breathing.jpg'),
  require('@/assets/images/manage-urge/quick-writing.jpg'),
  require('@/assets/images/manage-urge/self-hypnosis.jpg'),
  require('@/assets/images/manage-urge/urge.jpg'),
  // Reading
  require('@/assets/images/reading/day-1.jpg'),
  require('@/assets/images/reading/day-2.jpg'),
  require('@/assets/images/reading/day-3.jpg'),
  require('@/assets/images/reading/day-4.jpg'),
  require('@/assets/images/reading/day-5.jpg'),
  require('@/assets/images/reading/day-6.jpg'),
  require('@/assets/images/reading/day-7.jpg'),
  require('@/assets/images/reading/day-8.jpg'),
  require('@/assets/images/reading/day-9.jpg'),
  require('@/assets/images/reading/day-10.jpg'),
  require('@/assets/images/reading/day-11.jpg'),
  require('@/assets/images/reading/day-12.jpg'),
  require('@/assets/images/reading/day-13.jpg'),
  require('@/assets/images/reading/day-14.jpg'),
  require('@/assets/images/reading/day-15.jpg'),
  require('@/assets/images/reading/day-16.jpg'),
  // Today adventure
  require('@/assets/images/today-adventure/hypnotherapy.jpg'),
  require('@/assets/images/today-adventure/journaling.jpg'),
  require('@/assets/images/today-adventure/movement.jpg'),
  require('@/assets/images/today-adventure/reading.jpg'),
  // Toolkit
  require('@/assets/images/toolkit/box-breathing.jpg'),
  require('@/assets/images/toolkit/drink-tracker.jpg'),
  require('@/assets/images/toolkit/urge-surfing-meditation.jpg'),
  // Trophies
  require('@/assets/images/trophies/3-days.png'),
  require('@/assets/images/trophies/7-days.png'),
  require('@/assets/images/trophies/14-days.png'),
  require('@/assets/images/trophies/21-days.png'),
  require('@/assets/images/trophies/24-hours.png'),
  require('@/assets/images/trophies/30-days.png'),
  require('@/assets/images/trophies/60-days.png'),
  require('@/assets/images/trophies/90-days.png'),
  // Blinkist
  require('@/assets/images/blinkist/blinkist-logo.png'),
  require('@/assets/images/blinkist/blinkist-1.png'),
  require('@/assets/images/blinkist/blinkist-2.png'),
  require('@/assets/images/blinkist/blinkist-3.png'),
  require('@/assets/images/blinkist/blinkist-4.png'),
  require('@/assets/images/blinkist/blinkist-5.png'),
  require('@/assets/images/blinkist/blinkist-6.png'),
  require('@/assets/images/blinkist/blinkist-7.png'),
  require('@/assets/images/blinkist/blinkist-8.png'),
  require('@/assets/images/blinkist/blinkist-9.png'),
  require('@/assets/images/blinkist/blinkist-10.png'),
  require('@/assets/images/blinkist/blinkist-11.png'),
  require('@/assets/images/blinkist/blinkist-12.png'),
  require('@/assets/images/blinkist/blinkist-13.png'),
  require('@/assets/images/blinkist/blinkist-14.png'),
  require('@/assets/images/blinkist/blinkist-15.png'),
  require('@/assets/images/blinkist/blinkist-16.png'),
  require('@/assets/images/blinkist/blinkist-17.png'),
  require('@/assets/images/blinkist/blinkist-18.png'),
  require('@/assets/images/blinkist/blinkist-19.png'),
  require('@/assets/images/blinkist/blinkist-20.png'),
  require('@/assets/images/blinkist/blinkist-21.png'),
  require('@/assets/images/blinkist/blinkist-22.png'),
  require('@/assets/images/blinkist/blinkist-23.png'),
  require('@/assets/images/blinkist/blinkist-24.png'),
  require('@/assets/images/blinkist/blinkist-25.png'),
  require('@/assets/images/blinkist/blinkist-26.png'),
  require('@/assets/images/blinkist/blinkist-27.png'),
  require('@/assets/images/blinkist/blinkist-28.png'),
  require('@/assets/images/blinkist/blinkist-29.png'),
  require('@/assets/images/blinkist/blinkist-30.png'),
]

/**
 * Preloads all image assets into the device cache at app startup.
 * Images will display instantly when used (modals, ImageBackground, etc.),
 * especially important with poor network connectivity.
 */
export async function preloadImages(): Promise<void> {
  const start = Date.now()
  logDebug('[Preload] Starting image preload', { count: IMAGE_ASSETS.length })

  try {
    await Asset.loadAsync(IMAGE_ASSETS)
    const duration = `${Date.now() - start}ms`
    logDebug('[Preload] Images preloaded successfully', { count: IMAGE_ASSETS.length, durationMs: duration })
  }
  catch (error) {
    logError('Failed to preload images', error, { count: IMAGE_ASSETS.length })
  }
}
