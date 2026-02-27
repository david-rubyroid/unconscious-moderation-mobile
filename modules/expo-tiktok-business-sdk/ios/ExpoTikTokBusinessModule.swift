import ExpoModulesCore
import TikTokBusinessSDK

public class ExpoTikTokBusinessModule: Module {
  private var isInitialized = false
  
  public func definition() -> ModuleDefinition {
    Name("ExpoTikTokBusinessModule")
    
    // Async function for initialization
    AsyncFunction("initialize") { (config: [String: Any]) -> Void in
      guard let tiktokAppId = config["tiktokAppId"] as? String else {
        throw Exception(name: "InitializationError", description: "TikTok App ID is required")
      }
      
      let debugMode = config["debugMode"] as? Bool ?? false
      
      // Get app bundle ID
      let appId = Bundle.main.bundleIdentifier ?? "com.llc.mydry30"
      
      // Create TikTok configuration (requires both Bundle ID and TikTok App ID)
      let tiktokConfig = TikTokConfig(appId: appId, tiktokAppId: tiktokAppId)
      
      // Initialize TikTok Business SDK
      if let tiktokConfig = tiktokConfig {
        TikTokBusiness.initializeSdk(tiktokConfig)
        self.isInitialized = true
        
        if debugMode {
          print("[TikTok Business SDK] Initialized successfully")
          print("[TikTok Business SDK] Bundle ID: \(appId)")
          print("[TikTok Business SDK] TikTok App ID: \(tiktokAppId)")
        }
      } else {
        throw Exception(name: "InitializationError", description: "Failed to create TikTok configuration")
      }
    }
    
    // Track custom event
    Function("trackEvent") { (eventName: String, properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] Warning: SDK not initialized. Call initialize() first.")
        return
      }
      
      // Using deprecated trackEvent for simplicity - it works with strings
      if let properties = properties {
        TikTokBusiness.trackEvent(eventName, withProperties: properties)
      } else {
        TikTokBusiness.trackEvent(eventName)
      }
    }
    
    // Track purchase event
    Function("trackPurchase") { (value: Double, currency: String, contents: [[String: Any]], properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] Warning: SDK not initialized. Call initialize() first.")
        return
      }
      
      var purchaseProperties = properties ?? [:]
      purchaseProperties["value"] = value
      purchaseProperties["currency"] = currency
      purchaseProperties["contents"] = contents
      
      // Using deprecated trackEvent for simplicity
      TikTokBusiness.trackEvent("Purchase", withProperties: purchaseProperties)
    }
    
    // Track search event
    Function("trackSearch") { (query: String, properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] Warning: SDK not initialized. Call initialize() first.")
        return
      }
      
      var searchProperties = properties ?? [:]
      searchProperties["search_string"] = query
      
      // Using deprecated trackEvent for simplicity
      TikTokBusiness.trackEvent("Search", withProperties: searchProperties)
    }
  }
}
