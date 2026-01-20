import { logDebug } from './logger'
import { secureStore, SecureStoreKey } from './secureStore'

// Show modal on day 2 as per client request
const MINIMUM_DAYS = 2
const COOLDOWN_DAYS = 30

/**
 * Checks if feedback modal should be shown based on:
 * - User has been using app for at least MINIMUM_DAYS days (day 2)
 * - Modal hasn't been shown in last COOLDOWN_DAYS days (or never shown)
 * - User hasn't already rated positively
 */
export async function shouldShowFeedbackModal(
  durationDays: number | null | undefined,
): Promise<boolean> {
  // Check minimum days requirement - show on day 2 and later
  if (!durationDays || durationDays < MINIMUM_DAYS) {
    return false
  }

  // Check if user already rated positively (never show again)
  const hasRated = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_USER_RATED)
  if (hasRated === 'true') {
    return false
  }

  // Check if modal was shown before
  const lastShownDate = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_LAST_SHOWN_DATE)
  if (!lastShownDate) {
    // Never shown before, can show
    return true
  }

  // Check cooldown period (30 days)
  const lastShown = new Date(lastShownDate)
  const now = new Date()
  const daysSinceLastShown
    = Math.floor((now.getTime() - lastShown.getTime()) / (1000 * 60 * 60 * 24))

  return daysSinceLastShown >= COOLDOWN_DAYS
}

/**
 * Marks that feedback modal has been shown
 * Saves current timestamp for cooldown tracking
 */
export async function markFeedbackModalShown(): Promise<void> {
  const now = new Date().toISOString()
  await secureStore.set(SecureStoreKey.FEEDBACK_MODAL_LAST_SHOWN_DATE, now)
  await secureStore.set(SecureStoreKey.FEEDBACK_MODAL_HAS_BEEN_SHOWN, 'true')
}

/**
 * Marks that user rated positively
 * This ensures we never show the modal again for this user
 */
export async function markFeedbackModalRated(): Promise<void> {
  await secureStore.set(SecureStoreKey.FEEDBACK_MODAL_USER_RATED, 'true')
}

export async function resetFeedbackModal(): Promise<void> {
  try {
    logDebug('[Feedback Modal] Starting reset...')

    const beforeLastShownDate = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_LAST_SHOWN_DATE)
    const beforeHasBeenShown = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_HAS_BEEN_SHOWN)
    const beforeUserRated = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_USER_RATED)

    logDebug('[Feedback Modal] Before reset', {
      lastShownDate: beforeLastShownDate,
      hasBeenShown: beforeHasBeenShown,
      userRated: beforeUserRated,
    })

    await Promise.all([
      secureStore.remove(SecureStoreKey.FEEDBACK_MODAL_LAST_SHOWN_DATE),
      secureStore.remove(SecureStoreKey.FEEDBACK_MODAL_HAS_BEEN_SHOWN),
      secureStore.remove(SecureStoreKey.FEEDBACK_MODAL_USER_RATED),
    ])

    const afterLastShownDate = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_LAST_SHOWN_DATE)
    const afterHasBeenShown = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_HAS_BEEN_SHOWN)
    const afterUserRated = await secureStore.get(SecureStoreKey.FEEDBACK_MODAL_USER_RATED)

    const allCleared = !afterLastShownDate && !afterHasBeenShown && !afterUserRated

    logDebug('[Feedback Modal] After reset', {
      lastShownDate: afterLastShownDate,
      hasBeenShown: afterHasBeenShown,
      userRated: afterUserRated,
      allCleared,
    })

    if (!allCleared) {
      logDebug('[Feedback Modal] Warning: Some data was not cleared', {
        lastShownDate: afterLastShownDate,
        hasBeenShown: afterHasBeenShown,
        userRated: afterUserRated,
      })
    }
  }
  catch (error) {
    logDebug('[Feedback Modal] Reset error', { error })
    throw error
  }
}
