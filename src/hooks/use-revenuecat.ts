import type { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases'

import { useCallback, useState } from 'react'

import { Platform } from 'react-native'

import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases'

import Toast from 'react-native-toast-message'

import { useGetSubscription } from '@/api/queries/subscriptions'

import { getCustomerInfo } from '@/services/revenuecat'

import { logError } from '@/utils/logger'

/**
 * RevenueCat error interface
 * Based on the structure of errors thrown by react-native-purchases
 */
interface PurchasesError {
  message?: string
  underlyingErrorMessage?: string
  code?: string
}

/**
 * Type guard to check if error is a PurchasesError
 */
function isPurchasesError(error: unknown): error is PurchasesError {
  return (
    typeof error === 'object'
    && error !== null
    && ('message' in error || 'code' in error || 'underlyingErrorMessage' in error)
  )
}

export function useRevenueCat() {
  const [isLoading, setIsLoading] = useState(false)

  // Get subscription status from backend
  const { data: subscription, refetch: refetchSubscription } = useGetSubscription()

  /**
   * Gets a user-friendly error message based on the error
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    if (!isPurchasesError(error)) {
      if (error instanceof Error) {
        return error.message || 'Please try again later'
      }

      return 'Please try again later'
    }

    const errorMessage = error.message || ''
    const underlyingErrorMessage = error.underlyingErrorMessage || ''
    const errorCode = error.code
    const fullErrorText = `${errorMessage} ${underlyingErrorMessage}`.toLowerCase()

    // Handle App Store Connect configuration issues (expired agreements, products not available)
    if (
      fullErrorText.includes('none of the products registered')
      || fullErrorText.includes('could not be fetched from app store connect')
      || fullErrorText.includes('there is an issue with your configuration')
      || fullErrorText.includes('why-are-offerings-empty')
    ) {
      return 'Products are not available from App Store Connect. Please check that your Paid Apps agreement is up to date in App Store Connect and products are properly configured.'
    }

    // Handle Android app not published error
    if (
      fullErrorText.includes('app version has been published')
      || fullErrorText.includes('developer_error')
      || fullErrorText.includes('no applicable sub response code')
      || fullErrorText.includes('one or more of the arguments provided are invalid')
    ) {
      return 'App version not published in Google Play. Please ensure the app is uploaded to Google Play Console (at least as internal testing) and products are configured in RevenueCat.'
    }

    // Handle specific error codes
    if (errorCode === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
      return 'Purchases are not allowed on this device'
    }

    if (errorCode === PURCHASES_ERROR_CODE.PURCHASE_INVALID_ERROR) {
      return 'Invalid purchase. Please try again.'
    }

    if (errorCode === PURCHASES_ERROR_CODE.NETWORK_ERROR) {
      return 'Network error. Please check your connection and try again.'
    }

    // Generic error message
    return errorMessage || 'Please try again later'
  }, [])

  /**
   * Fetches available offerings (packages) from RevenueCat
   */
  const getOfferings = useCallback(async (): Promise<PurchasesOfferings | null> => {
    try {
      const offerings = await Purchases.getOfferings()
      return offerings
    }
    catch (error) {
      logError('Failed to get offerings', error)
      const errorMessage = getErrorMessage(error)
      Toast.show({
        type: 'error',
        text1: 'Failed to load subscriptions',
        text2: errorMessage,
      })
      return null
    }
  }, [getErrorMessage])

  /**
   * Purchases a package from RevenueCat
   * After successful purchase, syncs with backend
   */
  const purchasePackage = useCallback(async (packageToPurchase: PurchasesPackage): Promise<CustomerInfo | null> => {
    setIsLoading(true)

    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase)

      // Sync with backend by refetching subscription status
      // Backend will receive webhook from RevenueCat, but we can check immediately
      await refetchSubscription()

      Toast.show({
        type: 'success',
        text1: 'Thank you for your purchase!',
        text2: 'Your subscription has been activated',
      })

      return customerInfo
    }
    catch (error: unknown) {
      // Handle user cancellation
      if (isPurchasesError(error) && error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        // User cancelled, don't show error
        return null
      }

      // Handle other errors
      logError('Purchase failed', error)
      const errorMessage = getErrorMessage(error)

      Toast.show({
        type: 'error',
        text1: 'Purchase failed',
        text2: errorMessage,
      })

      return null
    }
    finally {
      setIsLoading(false)
    }
  }, [refetchSubscription, getErrorMessage])

  /**
   * Restores previous purchases
   */
  const restorePurchases = useCallback(async (): Promise<CustomerInfo | null> => {
    setIsLoading(true)

    try {
      const customerInfo = await Purchases.restorePurchases()

      // Sync with backend
      await refetchSubscription()

      Toast.show({
        type: 'success',
        text1: 'Purchases restored',
        text2: 'Your subscriptions have been restored',
      })

      return customerInfo
    }
    catch (error: unknown) {
      logError('Failed to restore purchases', error)
      const errorMessage = getErrorMessage(error)

      Toast.show({
        type: 'error',
        text1: 'Restore failed',
        text2: errorMessage,
      })

      return null
    }
    finally {
      setIsLoading(false)
    }
  }, [refetchSubscription, getErrorMessage])

  /**
   * Checks subscription status from RevenueCat
   */
  const checkSubscriptionStatus = useCallback(async (): Promise<CustomerInfo | null> => {
    try {
      const customerInfo = await getCustomerInfo()
      return customerInfo
    }
    catch (error) {
      logError('Failed to check subscription status', error)
      return null
    }
  }, [])

  /**
   * Manually syncs subscription status with backend
   */
  const syncWithBackend = useCallback(async (): Promise<void> => {
    try {
      await refetchSubscription()
    }
    catch (error) {
      logError('Failed to sync with backend', error)
    }
  }, [refetchSubscription])

  /**
   * Presents the native iOS offer code redemption sheet
   * Only available on iOS real devices (not on simulator)
   * Note: Offer codes for new subscriptions must be redeemed BEFORE purchasing
   */
  const presentOfferCodeRedemption = useCallback(async (): Promise<void> => {
    if (Platform.OS !== 'ios') {
      Toast.show({
        type: 'info',
        text1: 'Offer codes',
        text2: 'Offer code redemption is only available on iOS',
      })
      return
    }

    try {
      await Purchases.presentCodeRedemptionSheet()

      // After redemption, show success message
      // The offer will be automatically applied when user purchases subscription
      Toast.show({
        type: 'success',
        text1: 'Offer code redeemed',
        text2: 'The offer will be applied when you purchase your subscription',
      })
    }
    catch (error: unknown) {
      logError('Failed to present offer code redemption', error)

      // Check if it's a simulator error (presentCodeRedemptionSheet doesn't work on simulator)
      const errorMessage = isPurchasesError(error) ? error.message?.toLowerCase() || '' : ''

      if (errorMessage.includes('simulator') || errorMessage.includes('not available')) {
        Toast.show({
          type: 'info',
          text1: 'Offer code redemption',
          text2: 'Available only on real iOS devices. Please test on a physical device.',
        })
      }
      else {
        Toast.show({
          type: 'error',
          text1: 'Failed to redeem offer code',
          text2: 'Please try again later',
        })
      }
    }
  }, [])

  return {
    isLoading,
    subscription,
    getOfferings,
    purchasePackage,
    restorePurchases,
    checkSubscriptionStatus,
    syncWithBackend,
    presentOfferCodeRedemption,
    refetchSubscription,
  }
}
