import ExpoTikTokBusiness from 'expo-tiktok-business-sdk'
import { Platform } from 'react-native'

import {
  logDebug,
  logError,
  logInfo,
  logWarn,
} from '@/utils/logger'

let isConfigured = false

/**
 * Check if platform is supported
 * Currently only iOS is supported, Android is TODO
 */
function isPlatformSupported(): boolean {
  return Platform.OS === 'ios'
}

/**
 * Gets the appropriate TikTok App ID based on the platform
 * @returns The TikTok App ID for the current platform, or null if not configured
 */
function getTikTokAppId(): string | null {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_TIKTOK_APP_ID_IOS ?? null
  }

  if (Platform.OS === 'android') {
    // TODO: Android implementation
    logWarn('[TikTok] Android support is not yet implemented')
    return null
  }

  // TikTok SDK is only for iOS/Android
  return null
}

/**
 * Checks if analytics should be enabled
 * Analytics are disabled in:
 * - Development mode (__DEV__)
 * - Preview builds (EXPO_PUBLIC_BUILD_ENV === 'preview')
 * @returns true if analytics should be sent, false otherwise
 */
function shouldSendAnalytics(): boolean {
  if (__DEV__) {
    return false
  }

  const buildEnv = process.env.EXPO_PUBLIC_BUILD_ENV
  if (buildEnv === 'preview') {
    return false
  }

  return buildEnv === 'production' || buildEnv === undefined
}

/**
 * Configuration options for TikTok SDK
 */
interface TikTokSDKConfig {
  /**
   * Enable debug mode for development
   * Default: false
   */
  debugMode?: boolean
  /**
   * Automatically track app lifecycle events (Launch)
   * Default: true
   */
  autoTrackAppLifecycle?: boolean
}

/**
 * Initializes TikTok SDK with the app ID
 * Should be called once at app startup
 *
 * Note: TikTok SDK and RevenueCat can coexist without conflicts.
 * TikTok SDK tracks conversion events for ad optimization,
 * while RevenueCat handles subscription management and iOS SKAdNetwork attribution.
 *
 * Platform support:
 * - iOS: ✅ Fully supported
 * - Android: ❌ Not yet implemented (TODO)
 *
 * @param config - Optional configuration object
 */
export async function initializeTikTok(
  config: TikTokSDKConfig = {},
): Promise<void> {
  if (isConfigured) {
    logDebug('[TikTok] Already initialized')
    return
  }

  // Check platform support
  if (!isPlatformSupported()) {
    logWarn(
      `[TikTok] Platform ${Platform.OS} is not supported yet. Currently only iOS is supported.`,
      { platform: Platform.OS },
    )
    return
  }

  const tiktokAppId = getTikTokAppId()

  if (!tiktokAppId) {
    logWarn(
      `[TikTok] App ID is not configured for ${Platform.OS}. Set EXPO_PUBLIC_TIKTOK_APP_ID_${Platform.OS.toUpperCase()} environment variable.`,
      { platform: Platform.OS },
    )
    return
  }

  if (Platform.OS === 'web') {
    logDebug('[TikTok] SDK not available on web platform')
    return
  }

  try {
    const { debugMode = __DEV__, autoTrackAppLifecycle = true } = config

    logDebug('[TikTok] Initializing SDK', {
      platform: Platform.OS,
      appIdPrefix: `${tiktokAppId.substring(0, 8)}...`,
      debugMode,
      autoTrackAppLifecycle,
    })

    // Initialize custom TikTok Business SDK module
    await ExpoTikTokBusiness.initialize({
      tiktokAppId,
      debugMode,
      autoTrackAppLifecycle,
    })

    isConfigured = true
    logInfo('[TikTok] Successfully initialized')
  }
  catch (error) {
    logError('[TikTok] Failed to initialize', error, { platform: Platform.OS })
    // Don't throw - TikTok initialization failure should not crash the app
  }
}

/**
 * Checks if TikTok SDK is initialized
 * @returns true if TikTok is initialized, false otherwise
 */
export function isTikTokInitialized(): boolean {
  return isConfigured
}

/**
 * Tracks a custom event in TikTok
 * @param eventName - The name of the event to track
 * @param properties - Optional properties to attach to the event
 */
export function trackTikTokEvent(
  eventName: string,
  properties?: Record<string, any>,
): void {
  if (!isPlatformSupported()) {
    logDebug(`[TikTok] Platform ${Platform.OS} not supported, skipping event tracking`)
    return
  }

  if (!isConfigured) {
    logWarn('[TikTok] Cannot track event - TikTok not initialized')
    return
  }

  if (!shouldSendAnalytics()) {
    logDebug('[TikTok] [DEV/PREVIEW] Would track event', { eventName, properties })
    return
  }

  try {
    ExpoTikTokBusiness.trackEvent(eventName, properties)
    logDebug('[TikTok] Event tracked', { eventName, properties })
  }
  catch (error) {
    logError('[TikTok] Failed to track event', error, { eventName, properties })
  }
}

/**
 * Tracks a search event in TikTok
 * @param query - The search query
 * @param options - Optional search options
 */
export function trackTikTokSearch(
  query: string,
  options?: Record<string, any>,
): void {
  if (!isPlatformSupported()) {
    logDebug(`[TikTok] Platform ${Platform.OS} not supported, skipping search tracking`)
    return
  }

  if (!isConfigured) {
    logWarn('[TikTok] Cannot track search - TikTok not initialized')
    return
  }

  // Check if analytics should be sent
  if (!shouldSendAnalytics()) {
    logDebug('[TikTok] [DEV/PREVIEW] Would track search', { query, options })
    return
  }

  try {
    ExpoTikTokBusiness.trackSearch(query, options)
    logDebug('[TikTok] Search tracked', { query, options })
  }
  catch (error) {
    logError('[TikTok] Failed to track search', error, { query, options })
  }
}

/**
 * Tracks a purchase event in TikTok
 * @param value - The purchase value
 * @param currency - The currency code (e.g., 'USD')
 * @param contents - Array of purchased items
 * @param options - Optional purchase options
 */
export function trackTikTokPurchase(
  value: number,
  currency: string,
  contents: Array<{ content_id: string, content_name: string, quantity: number }>,
  options?: Record<string, any>,
): void {
  if (!isPlatformSupported()) {
    logDebug(`[TikTok] Platform ${Platform.OS} not supported, skipping purchase tracking`)
    return
  }

  if (!isConfigured) {
    logWarn('[TikTok] Cannot track purchase - TikTok not initialized')
    return
  }

  // Check if analytics should be sent
  if (!shouldSendAnalytics()) {
    logDebug(
      '[TikTok] [DEV/PREVIEW] Would track purchase',
      { value, currency, contents, options },
    )
    return
  }

  try {
    ExpoTikTokBusiness.trackPurchase(value, currency, contents, options)
    logDebug('[TikTok] Purchase tracked', { value, currency, contents, options })
  }
  catch (error) {
    logError('[TikTok] Failed to track purchase', error, { value, currency, contents, options })
  }
}

/**
 * Tracks a view content event in TikTok
 * @param contentType - The type of content being viewed
 * @param contentId - The ID of the content
 * @param properties - Optional additional properties
 */
export function trackTikTokViewContent(
  contentType: string,
  contentId: string,
  properties?: Record<string, any>,
): void {
  trackTikTokEvent('VIEW_CONTENT', {
    content_type: contentType,
    content_id: contentId,
    ...properties,
  })
}

/**
 * Tracks an app launch event in TikTok
 * This is automatically tracked by the SDK, but can be called manually if needed
 */
export function trackTikTokAppLaunch(): void {
  trackTikTokEvent('LAUNCH')
}
