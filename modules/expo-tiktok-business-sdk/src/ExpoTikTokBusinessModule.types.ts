/**
 * TypeScript types for TikTok Business SDK module
 * Must match ExpoTikTokBusinessModule.swift initialize(config) keys.
 */

export interface TikTokSDKConfig {
  /**
   * Short App ID from TikTok Events Manager (e.g., "6471595788").
   * Passed to native TikTokConfig as appId.
   */
  appId: string
  /**
   * TikTok App ID long format from TikTok Ads Manager (e.g., "759780986137565944").
   */
  tiktokAppId: string
  /**
   * TikTok App Secret from TikTok Ads Manager.
   * Used as credential for TikTokConfig (accessToken) and for debug logging.
   */
  appSecret: string
  /**
   * Enable debug mode for development.
   * Default: false
   */
  debugMode?: boolean
  /**
   * Automatically track app lifecycle events (Launch).
   * Default: true. Native module may use this for future behavior.
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
   * @param _config - Configuration options
   */
  initialize: (_config: TikTokSDKConfig) => Promise<void>

  /**
   * Track a custom event
   * @param _eventName - Name of the event
   * @param _properties - Optional event properties
   */
  trackEvent: (_eventName: string, _properties?: Record<string, any>) => void

  /**
   * Track a purchase event
   * @param _value - Purchase value
   * @param _currency - Currency code (e.g., 'USD')
   * @param _contents - Array of purchased items
   * @param _properties - Optional additional properties
   */
  trackPurchase: (
    _value: number,
    _currency: string,
    _contents: TikTokPurchaseItem[],
    _properties?: Record<string, any>,
  ) => void

  /**
   * Track a search event
   * @param _query - Search query
   * @param _properties - Optional search properties
   */
  trackSearch: (_query: string, _properties?: Record<string, any>) => void

  /**
   * Flush pending events to TikTok servers immediately.
   * Call after important events to ensure delivery.
   */
  flush: () => void
}
