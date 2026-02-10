/* eslint-disable ts/no-require-imports -- Metro requires static require() for asset bundling */
import { Asset } from 'expo-asset'

import { logDebug, logError } from '@/utils/logger'

/**
 * Critical assets: first paint, home screen, first-time popups, common modals.
 * Loaded at startup so UI feels instant.
 */
const CRITICAL_IMAGE_ASSETS = [
  require('@/assets/images/modal-bg.webp'),
  require('@/assets/images/box-breathing-bg.webp'),
  require('@/assets/images/daily-activity-medal.webp'),
  require('@/assets/images/first-time-popup/first-time-popup-1.webp'),
  require('@/assets/images/first-time-popup/first-time-popup-2.webp'),
  require('@/assets/images/first-time-popup/first-time-popup-3.webp'),
  require('@/assets/images/first-time-popup/first-time-popup-4.webp'),
  require('@/assets/images/today-adventure/hypnotherapy.webp'),
  require('@/assets/images/today-adventure/journaling.webp'),
  require('@/assets/images/today-adventure/movement.webp'),
  require('@/assets/images/today-adventure/reading.webp'),
  require('@/assets/images/toolkit/box-breathing.webp'),
  require('@/assets/images/toolkit/drink-tracker.webp'),
  require('@/assets/images/toolkit/urge-surfing-meditation.webp'),
  require('@/assets/images/the-team-at-um.webp'),
  require('@/assets/images/welcome-to-your-journey.webp'),
]

/**
 * Deferred assets: screens user may open later (reading, drink-tracker, trophies, Blinkist).
 * Loaded in background after critical so startup stays fast.
 */
const DEFERRED_IMAGE_ASSETS = [
  require('@/assets/images/drink-with-awareness.webp'),
  require('@/assets/images/end-of-trial.webp'),
  require('@/assets/images/mantra.webp'),
  require('@/assets/images/master-class.webp'),
  require('@/assets/images/manage-urges.webp'),
  require('@/assets/images/plan-and-prepare.webp'),
  require('@/assets/images/pre-drink-hydration.webp'),
  require('@/assets/images/pro-tip.webp'),
  require('@/assets/images/quick-writing.webp'),
  require('@/assets/images/reflect-and-reinforce.webp'),
  require('@/assets/images/reflect-reinforce.webp'),
  require('@/assets/images/manage-urge/box-breathing.webp'),
  require('@/assets/images/manage-urge/quick-writing.webp'),
  require('@/assets/images/manage-urge/self-hypnosis.webp'),
  require('@/assets/images/manage-urge/urge.webp'),
  require('@/assets/images/reading/day-1.webp'),
  require('@/assets/images/reading/day-2.webp'),
  require('@/assets/images/reading/day-3.webp'),
  require('@/assets/images/reading/day-4.webp'),
  require('@/assets/images/reading/day-5.webp'),
  require('@/assets/images/reading/day-6.webp'),
  require('@/assets/images/reading/day-7.webp'),
  require('@/assets/images/reading/day-8.webp'),
  require('@/assets/images/reading/day-9.webp'),
  require('@/assets/images/reading/day-10.webp'),
  require('@/assets/images/reading/day-11.webp'),
  require('@/assets/images/reading/day-12.webp'),
  require('@/assets/images/reading/day-13.webp'),
  require('@/assets/images/reading/day-14.webp'),
  require('@/assets/images/reading/day-15.webp'),
  require('@/assets/images/reading/day-16.webp'),
  require('@/assets/images/trophies/3-days.webp'),
  require('@/assets/images/trophies/7-days.webp'),
  require('@/assets/images/trophies/14-days.webp'),
  require('@/assets/images/trophies/21-days.webp'),
  require('@/assets/images/trophies/24-hours.webp'),
  require('@/assets/images/trophies/30-days.webp'),
  require('@/assets/images/trophies/60-days.webp'),
  require('@/assets/images/trophies/90-days.webp'),
  require('@/assets/images/blinkist/blinkist-logo.webp'),
  require('@/assets/images/blinkist/blinkist-1.webp'),
  require('@/assets/images/blinkist/blinkist-2.webp'),
  require('@/assets/images/blinkist/blinkist-3.webp'),
  require('@/assets/images/blinkist/blinkist-4.webp'),
  require('@/assets/images/blinkist/blinkist-5.webp'),
  require('@/assets/images/blinkist/blinkist-6.webp'),
  require('@/assets/images/blinkist/blinkist-7.webp'),
  require('@/assets/images/blinkist/blinkist-8.webp'),
  require('@/assets/images/blinkist/blinkist-9.webp'),
  require('@/assets/images/blinkist/blinkist-10.webp'),
  require('@/assets/images/blinkist/blinkist-11.webp'),
  require('@/assets/images/blinkist/blinkist-12.webp'),
  require('@/assets/images/blinkist/blinkist-13.webp'),
  require('@/assets/images/blinkist/blinkist-14.webp'),
  require('@/assets/images/blinkist/blinkist-15.webp'),
  require('@/assets/images/blinkist/blinkist-16.webp'),
  require('@/assets/images/blinkist/blinkist-17.webp'),
  require('@/assets/images/blinkist/blinkist-18.webp'),
  require('@/assets/images/blinkist/blinkist-19.webp'),
  require('@/assets/images/blinkist/blinkist-20.webp'),
  require('@/assets/images/blinkist/blinkist-21.webp'),
  require('@/assets/images/blinkist/blinkist-22.webp'),
  require('@/assets/images/blinkist/blinkist-23.webp'),
  require('@/assets/images/blinkist/blinkist-24.webp'),
  require('@/assets/images/blinkist/blinkist-25.webp'),
  require('@/assets/images/blinkist/blinkist-26.webp'),
  require('@/assets/images/blinkist/blinkist-27.webp'),
  require('@/assets/images/blinkist/blinkist-28.webp'),
  require('@/assets/images/blinkist/blinkist-29.webp'),
  require('@/assets/images/blinkist/blinkist-30.webp'),
]

/**
 * Preloads critical images at startup, then defers the rest to background.
 * Critical set (home, modals, onboarding) loads first so UI feels instant;
 * reading, trophies, Blinkist, drink-tracker assets load after without blocking.
 */
export async function preloadImages(): Promise<void> {
  const start = Date.now()

  try {
    await Asset.loadAsync(CRITICAL_IMAGE_ASSETS)
    const criticalMs = Date.now() - start
    logDebug('[Preload] Critical images loaded', { count: CRITICAL_IMAGE_ASSETS.length, durationMs: criticalMs })

    // Deferred: load in background, don't block
    const deferredCount = DEFERRED_IMAGE_ASSETS.length
    Asset.loadAsync(DEFERRED_IMAGE_ASSETS)
      .then(() => {
        logDebug('[Preload] Deferred images loaded', { count: deferredCount })
      })
      .catch((error) => {
        logError('Failed to preload deferred images', error, { count: deferredCount })
      })
  }
  catch (error) {
    logError('Failed to preload critical images', error, { count: CRITICAL_IMAGE_ASSETS.length })
  }
}
