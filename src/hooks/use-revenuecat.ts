import type { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases'

import { useCallback, useState } from 'react'

import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases'

import Toast from 'react-native-toast-message'

import { useGetSubscription } from '@/api/queries/subscriptions'

import { getCustomerInfo } from '@/services/revenuecat'

export function useRevenueCat() {
  const [isLoading, setIsLoading] = useState(false)

  // Get subscription status from backend
  const { data: subscription, refetch: refetchSubscription } = useGetSubscription()

  /**
   * Gets a user-friendly error message based on the error
   */
  const getErrorMessage = useCallback((error: any): string => {
    const errorMessage = error.message || ''
    const underlyingErrorMessage = error.underlyingErrorMessage || ''
    const errorCode = error.code
    const fullErrorText = `${errorMessage} ${underlyingErrorMessage}`.toLowerCase()

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
      console.error('Failed to get offerings:', error)
      Toast.show({
        type: 'error',
        text1: 'Failed to load subscriptions',
        text2: 'Please try again later',
      })
      return null
    }
  }, [])

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
    catch (error: any) {
      // Handle user cancellation
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        // User cancelled, don't show error
        return null
      }

      // Handle other errors
      console.error('Purchase failed:', error)
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
    catch (error: any) {
      console.error('Failed to restore purchases:', error)
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
      console.error('Failed to check subscription status:', error)
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
      console.error('Failed to sync with backend:', error)
    }
  }, [refetchSubscription])

  return {
    isLoading,
    subscription,
    getOfferings,
    purchasePackage,
    restorePurchases,
    checkSubscriptionStatus,
    syncWithBackend,
    refetchSubscription,
  }
}
