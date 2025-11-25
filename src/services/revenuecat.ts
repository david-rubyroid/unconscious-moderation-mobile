import type { CustomerInfo } from 'react-native-purchases'

import { Platform } from 'react-native'
import Purchases, { LOG_LEVEL } from 'react-native-purchases'

let isConfigured = false

/**
 * Gets the appropriate RevenueCat API key based on the platform
 * @returns The API key for the current platform, or null if not configured
 */
function getRevenueCatApiKey(): string | null {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? null
  }

  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? null
  }

  // Fallback for web or other platforms
  return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || null
}

/**
 * Initializes RevenueCat SDK with the public API key
 * Should be called once at app startup
 * Automatically selects the correct API key based on the platform (iOS/Android)
 */
export async function initializeRevenueCat(): Promise<void> {
  if (isConfigured) {
    return
  }

  const apiKey = getRevenueCatApiKey()

  if (!apiKey) {
    console.warn(
      `RevenueCat API key is not configured for ${Platform.OS}. `
      + `Set EXPO_PUBLIC_REVENUECAT_API_KEY_${Platform.OS.toUpperCase()} or EXPO_PUBLIC_REVENUECAT_API_KEY environment variable.`,
    )
    return
  }

  try {
    // Set log level for debugging (only in development)
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG)
    }

    // Configure RevenueCat
    await Purchases.configure({ apiKey })

    isConfigured = true
  }
  catch (error) {
    console.error('Failed to initialize RevenueCat:', error)
    throw error
  }
}

/**
 * Sets the app user ID for RevenueCat
 * Should be called after user authentication
 * @param userId - The user ID from the backend (usually user.id)
 */
export async function setRevenueCatUserId(userId: number): Promise<CustomerInfo | null> {
  if (!isConfigured) {
    await initializeRevenueCat()
  }

  try {
    const appUserId = userId.toString()
    const { customerInfo } = await Purchases.logIn(appUserId)
    return customerInfo
  }
  catch (error) {
    console.error('Failed to set RevenueCat user ID:', error)
    throw error
  }
}

/**
 * Logs out the current RevenueCat user
 * Should be called when user logs out
 */
export async function logoutRevenueCat(): Promise<void> {
  if (!isConfigured) {
    return
  }

  try {
    await Purchases.logOut()
  }
  catch (error) {
    console.error('Failed to logout RevenueCat user:', error)
    // Don't throw - logout should not fail the app
  }
}

/**
 * Gets the current customer info from RevenueCat
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isConfigured) {
    return null
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo
  }
  catch (error) {
    console.error('Failed to get customer info:', error)
    return null
  }
}
