import { Mixpanel } from 'mixpanel-react-native'

import { Platform } from 'react-native'

import { logDebug, logError, logInfo, logWarn } from '@/utils/logger'

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
 * Checks if analytics should be enabled
 * Analytics are disabled in:
 * - Development mode (__DEV__)
 * - Preview builds (EXPO_PUBLIC_BUILD_ENV === 'preview')
 * @returns true if analytics should be sent, false otherwise
 */
function shouldSendAnalytics(): boolean {
  // Don't send in development mode
  if (__DEV__) {
    return false
  }

  // Don't send in preview builds
  const buildEnv = process.env.EXPO_PUBLIC_BUILD_ENV
  if (buildEnv === 'preview') {
    return false
  }

  // Send in production builds or if build env is not set (for backward compatibility)
  return buildEnv === 'production' || buildEnv === undefined
}

/**
 * Initializes Mixpanel SDK with the project token
 * Should be called once at app startup
 * Uses JavaScript mode (useNative: false) for Expo compatibility
 */
export async function initializeMixpanel(): Promise<void> {
  if (isConfigured && mixpanelInstance) {
    logDebug('[Mixpanel] Already initialized')
    return
  }

  const token = getMixpanelToken()

  if (!token) {
    logWarn(
      '[Mixpanel] Token is not configured. Set EXPO_PUBLIC_MIXPANEL_TOKEN environment variable.',
    )
    return
  }

  try {
    logDebug('[Mixpanel] Initializing with token', { tokenPrefix: `${token.substring(0, 8)}...` })

    // Use JavaScript mode for Expo compatibility
    // trackAutomaticEvents: false - disable legacy mobile autotrack
    // useNative: false - use JavaScript mode (required for Expo)
    mixpanelInstance = new Mixpanel(token, false, false)
    await mixpanelInstance.init()

    isConfigured = true

    logInfo('[Mixpanel] Successfully initialized')
  }
  catch (error) {
    logError('[Mixpanel] Failed to initialize', error)
    throw error
  }
}

/**
 * Tracks a screen view event
 * @param screenName - The name of the screen being viewed
 */
export function trackScreenView(screenName: string): void {
  if (!isConfigured || !mixpanelInstance) {
    logWarn('[Mixpanel] Cannot track screen view - Mixpanel not initialized')
    return
  }

  const properties = {
    screen: screenName,
    platform: Platform.OS,
  }

  // Check if analytics should be sent
  if (!shouldSendAnalytics()) {
    logDebug('[Mixpanel] [DEV/PREVIEW] Would track screen view', properties)
    return
  }

  try {
    mixpanelInstance.track('Screen Viewed', properties)
  }
  catch (error) {
    logError('[Mixpanel] Failed to track screen view', error, properties)
  }
}

/**
 * Identifies a user with Mixpanel
 * Should be called after user authentication
 * @param userId - The user ID from the backend (usually user.id)
 */
export function identifyUser(userId: string | number): void {
  if (!isConfigured || !mixpanelInstance) {
    logWarn('[Mixpanel] Cannot identify user - Mixpanel not initialized')
    return
  }

  const userIdString = typeof userId === 'number' ? userId.toString() : userId

  // Check if analytics should be sent
  if (!shouldSendAnalytics()) {
    logDebug('[Mixpanel] [DEV/PREVIEW] Would identify user', { userId: userIdString })
    return
  }

  try {
    mixpanelInstance.identify(userIdString)
  }
  catch (error) {
    logError('[Mixpanel] Failed to identify user', error, { userId: userIdString })
  }
}

/**
 * Resets the Mixpanel user identity
 * Should be called when user logs out
 */
export function resetMixpanel(): void {
  if (!isConfigured || !mixpanelInstance) {
    logWarn('[Mixpanel] Cannot reset - Mixpanel not initialized')
    return
  }

  // Check if analytics should be sent
  if (!shouldSendAnalytics()) {
    logDebug('[Mixpanel] [DEV/PREVIEW] Would reset user identity')
    return
  }

  try {
    mixpanelInstance.reset()
  }
  catch (error) {
    logError('[Mixpanel] Failed to reset', error)
    // Don't throw - reset should not fail the app
  }
}
