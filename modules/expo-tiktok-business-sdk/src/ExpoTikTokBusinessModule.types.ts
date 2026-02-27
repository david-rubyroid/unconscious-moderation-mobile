/**
 * TypeScript types for TikTok Business SDK module
 */

export interface TikTokSDKConfig {
  /**
   * TikTok App ID from TikTok Ads Manager
   */
  tiktokAppId: string
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

export interface TikTokPurchaseItem {
  content_id: string
  content_name: string
  quantity: number
}

export interface ExpoTikTokBusinessModule {
  /**
   * Initialize TikTok Business SDK
   * @param config - Configuration options
   */
  initialize: (config: TikTokSDKConfig) => Promise<void>

  /**
   * Track a custom event
   * @param eventName - Name of the event
   * @param properties - Optional event properties
   */
  trackEvent: (eventName: string, properties?: Record<string, any>) => void

  /**
   * Track a purchase event
   * @param value - Purchase value
   * @param currency - Currency code (e.g., 'USD')
   * @param contents - Array of purchased items
   * @param properties - Optional additional properties
   */
  trackPurchase: (
    value: number,
    currency: string,
    contents: TikTokPurchaseItem[],
    properties?: Record<string, any>,
  ) => void

  /**
   * Track a search event
   * @param query - Search query
   * @param properties - Optional search properties
   */
  trackSearch: (query: string, properties?: Record<string, any>) => void
}
