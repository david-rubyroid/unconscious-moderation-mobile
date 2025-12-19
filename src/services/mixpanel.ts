import { Mixpanel } from 'mixpanel-react-native'

import { Platform } from 'react-native'

let isConfigured = false
let mixpanelInstance: Mixpanel | null = null

/**
 * Gets the Mixpanel project token from environment variables
 * @returns The Mixpanel token, or null if not configured
 */
function getMixpanelToken(): string | null {
  return process.env.EXPO_PUBLIC_MIXPANEL_TOKEN ?? null
}

/**
 * Checks if Mixpanel is initialized and configured
 * @returns true if Mixpanel is initialized, false otherwise
 */
export function isMixpanelInitialized(): boolean {
  return isConfigured && mixpanelInstance !== null
}

/**
 * Initializes Mixpanel SDK with the project token
 * Should be called once at app startup
 * Uses JavaScript mode (useNative: false) for Expo compatibility
 */
export async function initializeMixpanel(): Promise<void> {
  if (isConfigured && mixpanelInstance) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Mixpanel] Already initialized')
    }
    return
  }

  const token = getMixpanelToken()

  if (!token) {
    console.warn(
      '[Mixpanel] Token is not configured. '
      + 'Set EXPO_PUBLIC_MIXPANEL_TOKEN environment variable.',
    )
    return
  }

  try {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Mixpanel] Initializing with token:', `${token.substring(0, 8)}...`)
    }

    // Use JavaScript mode for Expo compatibility
    // trackAutomaticEvents: false - disable legacy mobile autotrack
    // useNative: false - use JavaScript mode (required for Expo)
    mixpanelInstance = new Mixpanel(token, false, false)
    await mixpanelInstance.init()

    isConfigured = true

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Mixpanel] Successfully initialized')
    }
  }
  catch (error) {
    console.error('[Mixpanel] Failed to initialize:', error)
    throw error
  }
}

/**
 * Tracks a screen view event
 * @param screenName - The name of the screen being viewed
 */
export function trackScreenView(screenName: string): void {
  if (!isConfigured || !mixpanelInstance) {
    if (__DEV__) {
      console.warn('[Mixpanel] Cannot track screen view - Mixpanel not initialized')
    }
    return
  }

  const properties = {
    screen: screenName,
    platform: Platform.OS,
  }

  // Don't send events in development mode
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[Mixpanel] [DEV] Would track screen view:', properties)
    return
  }

  try {
    mixpanelInstance.track('Screen Viewed', properties)
  }
  catch (error) {
    console.error('[Mixpanel] Failed to track screen view:', error)
  }
}

/**
 * Identifies a user with Mixpanel
 * Should be called after user authentication
 * @param userId - The user ID from the backend (usually user.id)
 */
export function identifyUser(userId: string | number): void {
  if (!isConfigured || !mixpanelInstance) {
    if (__DEV__) {
      console.warn('[Mixpanel] Cannot identify user - Mixpanel not initialized')
    }
    return
  }

  const userIdString = typeof userId === 'number' ? userId.toString() : userId

  // Don't send events in development mode
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[Mixpanel] [DEV] Would identify user:', userIdString)
    return
  }

  try {
    mixpanelInstance.identify(userIdString)
  }
  catch (error) {
    console.error('[Mixpanel] Failed to identify user:', error)
  }
}

/**
 * Resets the Mixpanel user identity
 * Should be called when user logs out
 */
export function resetMixpanel(): void {
  if (!isConfigured || !mixpanelInstance) {
    if (__DEV__) {
      console.warn('[Mixpanel] Cannot reset - Mixpanel not initialized')
    }
    return
  }

  // Don't send events in development mode
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[Mixpanel] [DEV] Would reset user identity')
    return
  }

  try {
    mixpanelInstance.reset()
  }
  catch (error) {
    console.error('[Mixpanel] Failed to reset:', error)
    // Don't throw - reset should not fail the app
  }
}
