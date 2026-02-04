import { Platform } from 'react-native'
import { LogLevel, OneSignal } from 'react-native-onesignal'

import { logDebug, logError, logWarn } from '@/utils/logger'

let isInitialized = false

/**
 * Gets the OneSignal App ID from environment variables
 */
function getOneSignalAppId(): string | null {
  return process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? null
}

/**
 * Initializes the OneSignal SDK.
 * Should be called once at app startup.
 * Does not request permission immediately; use requestPermission() when appropriate (e.g. after onboarding).
 */
export function initializeOneSignal(): void {
  if (isInitialized) {
    logDebug('[OneSignal] Already initialized')
    return
  }

  const appId = getOneSignalAppId()
  logDebug('[OneSignal] Initializing with app ID', { appId })

  if (!appId) {
    logWarn(
      '[OneSignal] App ID is not configured. Set EXPO_PUBLIC_ONESIGNAL_APP_ID in your environment.',
    )
    return
  }

  try {
    if (__DEV__) {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose)
    }

    OneSignal.initialize(appId)
    isInitialized = true
    logDebug('[OneSignal] Initialized successfully')
  }
  catch (error) {
    logError('[OneSignal] Failed to initialize', error)
    throw error
  }
}

/**
 * Whether OneSignal has been initialized
 */
export function isOneSignalInitialized(): boolean {
  return isInitialized
}

/**
 * Sets the external user ID in OneSignal (backend uses user_${userId}).
 * Optionally adds the user's email to the OneSignal user for email channel.
 * Call after user logs in.
 */
export function loginOneSignal(
  userId: string | number,
  email?: string | null,
): void {
  if (!isInitialized) {
    logWarn('[OneSignal] Cannot login - OneSignal not initialized')
    return
  }

  const externalId = `user_${userId}`
  try {
    OneSignal.login(externalId)
    logDebug('[OneSignal] Logged in with external id', { externalId })

    if (email?.trim()) {
      OneSignal.User.addEmail(email.trim())
      logDebug('[OneSignal] Added email to user', { email: email.trim() })
    }
  }
  catch (error) {
    logError('[OneSignal] Failed to login', error, { externalId })
  }
}

/**
 * Clears the OneSignal user identity. Call when user logs out.
 */
export function logoutOneSignal(): void {
  if (!isInitialized) {
    return
  }

  try {
    OneSignal.logout()
    logDebug('[OneSignal] Logged out')
  }
  catch (error) {
    logError('[OneSignal] Failed to logout', error)
  }
}

/**
 * Requests push notification permission from the user.
 * Call when appropriate (e.g. after onboarding or from settings), not immediately on app open.
 * @param fallbackToSettings - If true, prompts to open app settings when permission was previously denied
 * @returns Whether permission was granted
 */
export async function requestOneSignalPermission(
  fallbackToSettings: boolean = false,
): Promise<boolean> {
  if (!isInitialized) {
    logWarn('[OneSignal] Cannot request permission - OneSignal not initialized')
    return false
  }

  try {
    const granted = await OneSignal.Notifications.requestPermission(fallbackToSettings)
    logDebug('[OneSignal] Permission request result', { granted })
    return granted
  }
  catch (error) {
    logError('[OneSignal] Failed to request permission', error)
    return false
  }
}

/**
 * Gets the current push subscription token (native FCM/APNs token).
 * Resolves to null if not subscribed or not yet available.
 */
export async function getOneSignalPushToken(): Promise<string | null> {
  if (!isInitialized) {
    return null
  }

  try {
    const token = await OneSignal.User.pushSubscription.getTokenAsync()
    return token ?? null
  }
  catch (error) {
    logError('[OneSignal] Failed to get push token', error)
    return null
  }
}

/**
 * Gets the current platform for push (ios | android).
 * Returns null on unsupported platforms (e.g. web).
 */
export function getPushPlatform(): 'ios' | 'android' | null {
  if (Platform.OS === 'ios')
    return 'ios'
  if (Platform.OS === 'android')
    return 'android'
  return null
}
