import { useCallback } from 'react'

import {
  isTikTokInitialized,
  trackTikTokAppLaunch,
  trackTikTokEvent,
  trackTikTokPurchase,
  trackTikTokSearch,
  trackTikTokViewContent,
} from '@/services/tiktok'

/**
 * Hook for tracking events with TikTok SDK
 * Provides convenient methods for tracking common events
 */
export function useTikTok() {
  const isInitialized = isTikTokInitialized()

  /**
   * Tracks a custom event
   */
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackTikTokEvent(eventName, properties)
  }, [])

  /**
   * Tracks a search event
   */
  const trackSearch = useCallback((query: string, options?: Record<string, any>) => {
    trackTikTokSearch(query, options)
  }, [])

  /**
   * Tracks a purchase event
   */
  const trackPurchase = useCallback((
    value: number,
    currency: string,
    contents: Array<{ content_id: string, content_name: string, quantity: number }>,
    options?: Record<string, any>,
  ) => {
    trackTikTokPurchase(value, currency, contents, options)
  }, [])

  /**
   * Tracks a view content event
   */
  const trackViewContent = useCallback((
    contentType: string,
    contentId: string,
    properties?: Record<string, any>,
  ) => {
    trackTikTokViewContent(contentType, contentId, properties)
  }, [])

  /**
   * Tracks an app launch event
   */
  const trackAppLaunch = useCallback(() => {
    trackTikTokAppLaunch()
  }, [])

  return {
    isInitialized,
    trackEvent,
    trackSearch,
    trackPurchase,
    trackViewContent,
    trackAppLaunch,
  }
}
